'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const config = require('../../config');
const {
  ensureRuntimeArchiveExtracted,
  getRuntimeArchiveInfo,
  getRuntimeCachePath,
} = require('../../utils/runtimeArchive');
const {
  createAiWatermarkOutputPath,
  kindFromPath,
  outputUrlFromPath,
} = require('./media');

const STATUS_TIMEOUT_MS = 45_000;
const PROCESS_TIMEOUT_MS = 15 * 60_000;
const INVISIBLE_TIMEOUT_MS = 2 * 60 * 60_000;
const PROCESS_HEARTBEAT_MS = 30_000;
const ABORT_KILL_GRACE_MS = 2_000;
const RESOLUTION_CACHE_TTL_MS = 5 * 60_000;
const NEGATIVE_RESOLUTION_CACHE_TTL_MS = 10_000;
const CAPABILITY_CACHE_TTL_MS = 60_000;
const TORCH_RUNTIME_CACHE_TTL_MS = 60_000;
const FALLBACK_MARKS = ['gemini', 'doubao', 'jimeng', 'samsung'];
const PYTHON_MODULE = 'remove_ai_watermarks.cli';
const CONTROLNET_MIGRATION_VERSION = '0.8.9';
const MODERN_INVISIBLE_VERSION = '0.10.0';

let commandResolutionCache = null;
let capabilityCache = null;
let torchRuntimeCache = null;

function shortRunId() {
  return Math.random().toString(36).slice(2, 8);
}

function redactCommandArgs(args = []) {
  const out = [];
  for (let i = 0; i < args.length; i += 1) {
    const value = String(args[i]);
    out.push(value);
    if (value === '--hf-token' && i + 1 < args.length) {
      out.push('***');
      i += 1;
    }
  }
  return out;
}

function aiWatermarkLog(runId, message) {
  const tag = runId ? `[ai-watermark ${runId}]` : '[ai-watermark]';
  console.log(`${tag} ${message}`);
}

function aiWatermarkAbortError() {
  const error = new Error('已停止去 AI 水印任务');
  error.name = 'AbortError';
  error.code = 'AI_WATERMARK_ABORTED';
  return error;
}

function throwIfAborted(signal) {
  if (signal?.aborted) throw aiWatermarkAbortError();
}

function createStreamLogger(runId, label, streamName) {
  let pending = '';
  const prefix = runId
    ? `[ai-watermark ${runId}][${label}][${streamName}]`
    : `[ai-watermark][${label}][${streamName}]`;

  const emitLine = (line) => {
    const text = String(line || '').trimEnd();
    if (!text.trim()) return;
    console.log(`${prefix} ${text}`);
  };

  const emit = (chunk) => {
    const text = String(chunk || '').replace(/\r/g, '\n');
    const lines = `${pending}${text}`.split('\n');
    pending = lines.pop() || '';
    for (const line of lines) emitLine(line);
  };

  emit.flush = () => {
    if (pending) {
      emitLine(pending);
      pending = '';
    }
  };

  return emit;
}

function bool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  return !!value;
}

function finiteNumber(value, fallback, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function integer(value, fallback, min, max) {
  return Math.trunc(finiteNumber(value, fallback, min, max));
}

function choice(value, allowed, fallback) {
  const v = String(value || '').trim();
  return allowed.includes(v) ? v : fallback;
}

function normalizeExecutionDevice(value) {
  return choice(value, ['auto', 'cpu', 'mps', 'cuda', 'xpu'], 'auto');
}

function resolveAiWatermarkExecutionDevice(requestedDevice, torchRuntime = null) {
  const requested = normalizeExecutionDevice(requestedDevice);
  if (requested !== 'cuda') {
    return { device: requested, warning: '', fallback: null };
  }

  if (!torchRuntime || torchRuntime.ok === false) {
    return { device: requested, warning: '', fallback: null };
  }

  const compiledCuda = torchRuntime.compiledCuda !== undefined
    ? !!torchRuntime.compiledCuda
    : !!torchRuntime.torchCuda;
  const cudaAvailable = torchRuntime.cudaAvailable === true;
  if (compiledCuda && cudaAvailable) {
    return { device: requested, warning: '', fallback: null };
  }

  const reason = !compiledCuda ? 'torch-cuda-unavailable' : 'cuda-device-unavailable';
  const torchVersion = String(torchRuntime.torchVersion || torchRuntime.version || '').trim();
  const cudaVersion = String(torchRuntime.torchCuda || '').trim();
  const detail = !compiledCuda
    ? `当前去水印运行时的 PyTorch${torchVersion ? ` ${torchVersion}` : ''} 是 CPU 版，没有编译 CUDA。`
    : `当前去水印运行时的 PyTorch${torchVersion ? ` ${torchVersion}` : ''}${cudaVersion ? ` / CUDA ${cudaVersion}` : ''} 没检测到可用 CUDA 设备。`;

  return {
    device: 'cpu',
    warning: `已自动把设备从 CUDA 改为 CPU：${detail} 系统安装 CUDA 不等于本节点 runtime 支持 CUDA；如需 GPU，请把去水印 runtime 内的 PyTorch 换成 CUDA 版。CPU 会明显更慢。`,
    fallback: {
      requested,
      resolved: 'cpu',
      reason,
      torchVersion,
      torchCuda: torchRuntime.torchCuda || null,
      cudaAvailable,
      deviceCount: Number(torchRuntime.deviceCount) || 0,
      deviceName: String(torchRuntime.deviceName || ''),
    },
  };
}

function classifyAiWatermarkRuntimeError(text) {
  const raw = String(text || '');
  if (/Torch not compiled with CUDA enabled|Failed to move model to cuda/i.test(raw)) {
    return {
      code: 'AI_WATERMARK_TORCH_CUDA_UNAVAILABLE',
      message: '当前去水印运行时的 PyTorch 不支持 CUDA，无法使用设备 cuda。系统装有 CUDA 还不够，本节点内置 runtime 也必须安装 CUDA 版 PyTorch；请先改用 auto/cpu，或替换 runtime 的 PyTorch 后再选 cuda。',
    };
  }
  if (/No CUDA GPUs are available|CUDA driver version is insufficient|CUDA error/i.test(raw)) {
    return {
      code: 'AI_WATERMARK_CUDA_DEVICE_UNAVAILABLE',
      message: '当前去水印运行时没有检测到可用 CUDA 设备或驱动不可用。请先改用 auto/cpu，或确认本节点 runtime 的 PyTorch、显卡驱动和 CUDA 版本匹配。',
    };
  }
  return null;
}

function versionTuple(version) {
  const match = String(version || '').match(/(\d+)\.(\d+)(?:\.(\d+))?/);
  if (!match) return null;
  return [
    Number(match[1]) || 0,
    Number(match[2]) || 0,
    Number(match[3]) || 0,
  ];
}

function versionAtLeast(version, minimum) {
  const current = versionTuple(version);
  const target = versionTuple(minimum);
  if (!current || !target) return false;
  for (let i = 0; i < 3; i += 1) {
    if (current[i] > target[i]) return true;
    if (current[i] < target[i]) return false;
  }
  return true;
}

function supportsInvisible089(options = {}) {
  const version = String(options.upstreamVersion || options.runtimeVersion || '').trim();
  return !version || versionAtLeast(version, CONTROLNET_MIGRATION_VERSION);
}

function supportsModernInvisible(options = {}) {
  const version = String(options.upstreamVersion || options.runtimeVersion || '').trim();
  return !version || versionAtLeast(version, MODERN_INVISIBLE_VERSION);
}

function normalizeInvisiblePipeline(value, upstreamVersion = '') {
  const version = String(upstreamVersion || '').trim();
  const raw = String(value || '').trim();
  const modernDefaultControlnet = !version || versionAtLeast(version, MODERN_INVISIBLE_VERSION);
  if (modernDefaultControlnet) {
    if (raw === 'default' || raw === 'sdxl') return 'sdxl';
    if (raw === 'controlnet' || raw === 'ctrlregen' || !raw) return 'controlnet';
    return 'controlnet';
  }
  const migratedControlnet = !version || versionAtLeast(version, CONTROLNET_MIGRATION_VERSION);
  if (raw === 'controlnet') return migratedControlnet ? 'controlnet' : 'ctrlregen';
  if (raw === 'ctrlregen') return migratedControlnet ? 'controlnet' : 'ctrlregen';
  return 'default';
}

function normalizeRegion(region) {
  if (!region || typeof region !== 'object') return null;
  const x = Math.max(0, Math.trunc(Number(region.x) || 0));
  const y = Math.max(0, Math.trunc(Number(region.y) || 0));
  const w = Math.trunc(Number(region.w ?? region.width) || 0);
  const h = Math.trunc(Number(region.h ?? region.height) || 0);
  if (w <= 0 || h <= 0) return null;
  return `${x},${y},${w},${h}`;
}

function normalizeRegions(value) {
  if (Array.isArray(value)) return value.map(normalizeRegion).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[;；]/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

function appendPythonPath(env, pythonPath) {
  if (!pythonPath) return { ...env };
  const key = process.platform === 'win32' ? 'PYTHONPATH' : 'PYTHONPATH';
  const current = env[key] || '';
  return {
    ...env,
    [key]: current ? `${pythonPath}${path.delimiter}${current}` : pythonPath,
  };
}

function sourcePythonPath(sourceRoot) {
  const root = path.resolve(sourceRoot);
  const src = path.join(root, 'src');
  if (fs.existsSync(path.join(src, 'remove_ai_watermarks'))) return src;
  if (fs.existsSync(path.join(root, 'remove_ai_watermarks'))) return root;
  return '';
}

function pushCliCandidate(candidates, command, label, env = process.env) {
  if (!command || !fs.existsSync(command)) return;
  candidates.push({
    id: `runtime-cli-${label}`,
    command,
    baseArgs: [],
    label,
    kind: 'cli-bin',
    env: { ...env },
  });
}

function pushPythonModuleCandidate(candidates, pythonCommand, label, env = process.env, extra = {}) {
  if (!pythonCommand || !fs.existsSync(pythonCommand)) return;
  candidates.push({
    id: `runtime-python-${label}`,
    command: pythonCommand,
    baseArgs: ['-m', PYTHON_MODULE],
    label,
    kind: 'python-module',
    env: extra.pythonPath ? appendPythonPath(env, extra.pythonPath) : { ...env },
    pythonCommand,
    pythonPrefix: [],
    pythonPath: extra.pythonPath || '',
  });
}

function pushRuntimeRootCandidates(candidates, runtimeRoot, label, env = process.env) {
  if (!runtimeRoot) return;
  const root = path.resolve(runtimeRoot);
  if (!fs.existsSync(root)) return;

  const pythonPath = sourcePythonPath(root);
  for (const py of [
    path.join(root, 'python.exe'),
    path.join(root, 'python', 'python.exe'),
    path.join(root, '.venv', 'Scripts', 'python.exe'),
    path.join(root, 'Scripts', 'python.exe'),
    path.join(root, 'bin', 'python'),
  ]) {
    pushPythonModuleCandidate(candidates, py, `${label} python`, env, { pythonPath });
  }

  for (const cli of [
    path.join(root, 'remove-ai-watermarks.exe'),
    path.join(root, 'remove-ai-watermarks.cmd'),
    path.join(root, 'remove-ai-watermarks'),
    path.join(root, 'Scripts', 'remove-ai-watermarks.exe'),
    path.join(root, 'bin', 'remove-ai-watermarks'),
  ]) {
    pushCliCandidate(candidates, cli, `${label} CLI`, env);
  }
}

function commandCandidates() {
  const candidates = [];
  const env = process.env;
  const bin = String(env.JIAREN_REMOVE_AI_WATERMARKS_BIN || '').trim();
  if (bin) {
    candidates.push({
      id: 'env-bin',
      command: bin,
      baseArgs: [],
      label: 'JIAREN_REMOVE_AI_WATERMARKS_BIN',
      kind: 'cli-bin',
      env: { ...env },
    });
  }

  const runtimeRoot = String(env.JIAREN_REMOVE_AI_WATERMARKS_RUNTIME || '').trim();
  if (runtimeRoot) {
    pushRuntimeRootCandidates(candidates, runtimeRoot, 'JIAREN_REMOVE_AI_WATERMARKS_RUNTIME', env);
  }
  if (!config.IS_PACKAGED) {
    pushRuntimeRootCandidates(
      candidates,
      path.resolve(config.BASE_DIR, 'tools', 'remove-ai-watermarks-runtime'),
      'local remove-ai-watermarks runtime slot',
      env,
    );
  }
  const resourcesRoot = String(env.JIAREN_RESOURCES_PATH || '').trim();
  if (resourcesRoot) {
    pushRuntimeRootCandidates(
      candidates,
      path.join(resourcesRoot, 'tools', 'remove-ai-watermarks'),
      'packaged remove-ai-watermarks runtime',
      env,
    );
  }
  pushRuntimeRootCandidates(
    candidates,
    getRuntimeCachePath('remove-ai-watermarks'),
    'cached remove-ai-watermarks runtime',
    env,
  );

  const sourceRoots = [];
  const envSource = String(env.JIAREN_REMOVE_AI_WATERMARKS_SRC || '').trim();
  if (envSource) sourceRoots.push({ root: envSource, label: 'JIAREN_REMOVE_AI_WATERMARKS_SRC' });
  const devSource = path.resolve(config.BASE_DIR, '..', '_external', 'remove-ai-watermarks');
  if (!config.IS_PACKAGED && fs.existsSync(devSource)) {
    sourceRoots.push({ root: devSource, label: 'local external clone' });
  }
  for (const item of sourceRoots) {
    const pythonPath = sourcePythonPath(item.root);
    if (!pythonPath) continue;
    candidates.push({
      id: `source-python-${item.label}`,
      command: 'python',
      baseArgs: ['-m', PYTHON_MODULE],
      label: item.label,
      kind: 'python-module',
      env: appendPythonPath(env, pythonPath),
      pythonCommand: 'python',
      pythonPrefix: [],
      pythonPath,
    });
    candidates.push({
      id: `source-py-${item.label}`,
      command: 'py',
      baseArgs: ['-3', '-m', PYTHON_MODULE],
      label: `${item.label} (py -3)`,
      kind: 'python-module',
      env: appendPythonPath(env, pythonPath),
      pythonCommand: 'py',
      pythonPrefix: ['-3'],
      pythonPath,
    });
  }

  candidates.push({
    id: 'python-module',
    command: 'python',
    baseArgs: ['-m', PYTHON_MODULE],
    label: 'python -m remove_ai_watermarks.cli',
    kind: 'python-module',
    env: { ...env },
    pythonCommand: 'python',
    pythonPrefix: [],
  });
  candidates.push({
    id: 'py-module',
    command: 'py',
    baseArgs: ['-3', '-m', PYTHON_MODULE],
    label: 'py -3 -m remove_ai_watermarks.cli',
    kind: 'python-module',
    env: { ...env },
    pythonCommand: 'py',
    pythonPrefix: ['-3'],
  });

  if (process.platform === 'win32') {
    candidates.push({
      id: 'path-cli-exe',
      command: 'remove-ai-watermarks.exe',
      baseArgs: [],
      label: 'PATH remove-ai-watermarks.exe',
      kind: 'cli-bin',
      env: { ...env },
    });
    candidates.push({
      id: 'path-cli-cmd',
      command: 'remove-ai-watermarks.cmd',
      baseArgs: [],
      label: 'PATH remove-ai-watermarks.cmd',
      kind: 'cli-bin',
      env: { ...env },
    });
    candidates.push({
      id: 'path-cli-noext',
      command: 'remove-ai-watermarks',
      baseArgs: [],
      label: 'PATH remove-ai-watermarks',
      kind: 'cli-bin',
      env: { ...env },
    });
  } else {
    candidates.push({
      id: 'path-cli',
      command: 'remove-ai-watermarks',
      baseArgs: [],
      label: 'PATH remove-ai-watermarks',
      kind: 'cli-bin',
      env: { ...env },
    });
  }

  return candidates;
}

function runCommand(candidate, args, options = {}) {
  const timeoutMs = options.timeoutMs || PROCESS_TIMEOUT_MS;
  const mergedArgs = [...(candidate.baseArgs || []), ...args.map((arg) => String(arg))];
  const stdoutLogger = options.streamLogs
    ? createStreamLogger(options.runId || '', options.streamLabel || candidate.label, 'stdout')
    : null;
  const stderrLogger = options.streamLogs
    ? createStreamLogger(options.runId || '', options.streamLabel || candidate.label, 'stderr')
    : null;
  return new Promise((resolve) => {
    if (options.signal?.aborted) {
      resolve({
        ok: false,
        code: -1,
        signal: 'abort',
        stdout: '',
        stderr: aiWatermarkAbortError().message,
        command: candidate.label,
        args: mergedArgs,
      });
      return;
    }
    let child;
    try {
      child = spawn(candidate.command, mergedArgs, {
        env: candidate.env || process.env,
        cwd: options.cwd || config.BASE_DIR,
        windowsHide: true,
        shell: false,
      });
    } catch (error) {
      resolve({
        ok: false,
        code: -1,
        stdout: '',
        stderr: error?.message || String(error),
        command: candidate.label,
        args: mergedArgs,
      });
      return;
    }
    let stdout = '';
    let stderr = '';
    let settled = false;
    let abortResult = null;
    const startedAt = Date.now();
    const cleanup = () => {
      clearTimeout(timer);
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (abortForceTimer) clearTimeout(abortForceTimer);
      if (options.signal && onAbort) options.signal.removeEventListener('abort', onAbort);
      stdoutLogger?.flush();
      stderrLogger?.flush();
    };
    const finish = (payload) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(payload);
    };
    const killChild = (signal = 'SIGTERM') => {
      try {
        if (!child.killed) child.kill(signal);
      } catch {
        // ignore
      }
    };
    const timer = setTimeout(() => {
      killChild('SIGKILL');
      finish({
        ok: false,
        code: -1,
        signal: 'timeout',
        stdout,
        stderr: stderr || `命令超时 (${Math.round(timeoutMs / 1000)}s)`,
        command: candidate.label,
        args: mergedArgs,
      });
    }, timeoutMs);
    const heartbeatTimer = options.streamLogs
      ? setInterval(() => {
        aiWatermarkLog(
          options.runId || '',
          `step "${options.streamLabel || candidate.label}" still running elapsed=${Math.round((Date.now() - startedAt) / 1000)}s timeout=${Math.round(timeoutMs / 1000)}s`,
        );
      }, PROCESS_HEARTBEAT_MS)
      : null;
    let abortForceTimer = null;
    const onAbort = () => {
      if (settled) return;
      const message = aiWatermarkAbortError().message;
      abortResult = {
        ok: false,
        code: -1,
        signal: 'abort',
        stdout,
        stderr: message,
        command: candidate.label,
        args: mergedArgs,
      };
      aiWatermarkLog(options.runId || '', `abort requested for "${options.streamLabel || candidate.label}"`);
      killChild('SIGTERM');
      abortForceTimer = setTimeout(() => {
        killChild('SIGKILL');
        finish(abortResult);
      }, ABORT_KILL_GRACE_MS);
    };
    if (options.signal) options.signal.addEventListener('abort', onAbort, { once: true });

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      stdout += text;
      if (stdout.length > 40_000) stdout = stdout.slice(-40_000);
      stdoutLogger?.(text);
    });
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      stderr += text;
      if (stderr.length > 40_000) stderr = stderr.slice(-40_000);
      stderrLogger?.(text);
    });
    child.on('error', (error) => {
      if (settled) return;
      if (abortResult) {
        finish(abortResult);
        return;
      }
      finish({
        ok: false,
        code: -1,
        stdout,
        stderr: error?.message || String(error),
        command: candidate.label,
        args: mergedArgs,
      });
    });
    child.on('close', (code, signal) => {
      if (settled) return;
      if (abortResult) {
        finish({
          ...abortResult,
          code: typeof code === 'number' ? code : -1,
          stdout,
          stderr: abortResult.stderr,
        });
        return;
      }
      finish({
        ok: code === 0,
        code,
        signal,
        stdout,
        stderr,
        command: candidate.label,
        args: mergedArgs,
      });
    });
  });
}

function aiWatermarkEnvFingerprint() {
  const archive = getRuntimeArchiveInfo('remove-ai-watermarks');
  return [
    process.env.JIAREN_REMOVE_AI_WATERMARKS_BIN || '',
    process.env.JIAREN_REMOVE_AI_WATERMARKS_RUNTIME || '',
    process.env.JIAREN_REMOVE_AI_WATERMARKS_SRC || '',
    process.env.JIAREN_RESOURCES_PATH || '',
    archive.archivePath || '',
    archive.archiveSize || '',
    archive.archiveMtimeMs || '',
    archive.ready ? 'ready' : 'pending',
    process.env.PATH || '',
  ].join('\u0000');
}

function commandCandidatesFingerprint(candidates) {
  return JSON.stringify(candidates.map((candidate) => ({
    id: candidate.id,
    command: candidate.command,
    baseArgs: candidate.baseArgs || [],
    label: candidate.label,
    kind: candidate.kind,
    pythonCommand: candidate.pythonCommand || '',
    pythonPrefix: candidate.pythonPrefix || [],
    pythonPath: candidate.pythonPath || '',
  }))) + aiWatermarkEnvFingerprint();
}

function getCachedResolution(fingerprint) {
  if (!commandResolutionCache) return null;
  if (commandResolutionCache.fingerprint !== fingerprint) return null;
  if (Date.now() > commandResolutionCache.expiresAt) return null;
  return commandResolutionCache.value;
}

function setCachedResolution(fingerprint, value) {
  const ttl = value?.installed ? RESOLUTION_CACHE_TTL_MS : NEGATIVE_RESOLUTION_CACHE_TTL_MS;
  commandResolutionCache = {
    fingerprint,
    value,
    expiresAt: Date.now() + ttl,
  };
}

function parseJsonProbeOutput(text) {
  const lines = String(text || '').trim().split(/\r?\n/).reverse();
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) continue;
    try {
      return JSON.parse(trimmed);
    } catch {
      // keep looking
    }
  }
  return null;
}

async function probePythonModuleCandidate(candidate) {
  const code = `
import importlib.metadata, importlib.util, json, sys
data = {"ok": False, "version": "", "message": ""}
try:
    spec = importlib.util.find_spec("${PYTHON_MODULE}")
    if spec is None:
        data["message"] = "module not found"
        print(json.dumps(data, ensure_ascii=False))
        sys.exit(3)
    data["ok"] = True
    try:
        import remove_ai_watermarks
        data["version"] = getattr(remove_ai_watermarks, "__version__", "")
    except Exception:
        try:
            data["version"] = importlib.metadata.version("remove-ai-watermarks")
        except Exception:
            data["version"] = ""
    print(json.dumps(data, ensure_ascii=False))
except Exception as exc:
    data["message"] = str(exc)
    print(json.dumps(data, ensure_ascii=False))
    sys.exit(2)
`.trim();
  const result = await runPythonProbe({
    command: candidate.pythonCommand || candidate.command,
    argsPrefix: candidate.pythonPrefix || [],
    env: candidate.env || process.env,
    label: `${candidate.label} import probe`,
  }, code);
  if (!result.ok) return result;
  const data = parseJsonProbeOutput(result.stdout);
  if (!data?.ok) {
    return {
      ...result,
      ok: false,
      stderr: data?.message || result.stderr || 'module not available',
    };
  }
  return {
    ...result,
    version: String(data.version || ''),
    stdout: data.version ? `remove-ai-watermarks ${data.version}` : result.stdout,
  };
}

async function probeCommandCandidateList(candidates, fingerprint) {
  const cached = getCachedResolution(fingerprint);
  if (cached) return cached;

  const errors = [];
  for (const candidate of candidates) {
    const result = candidate.kind === 'python-module'
      ? await probePythonModuleCandidate(candidate)
      : await runCommand(candidate, ['--version'], { timeoutMs: STATUS_TIMEOUT_MS });
    if (result.ok) {
      const version = result.version || parseVersion(result.stdout || result.stderr);
      const resolved = {
        installed: true,
        candidate,
        version,
        resolver: candidate.label,
        versionOutput: (result.stdout || result.stderr || '').trim(),
      };
      setCachedResolution(fingerprint, resolved);
      return resolved;
    }
    errors.push(`${candidate.label}: ${result.stderr || result.stdout || 'not available'}`.slice(0, 240));
  }
  return { installed: false, errors };
}

async function resolveAiWatermarkCommand(options = {}) {
  let candidates = commandCandidates();
  let fingerprint = commandCandidatesFingerprint(candidates);
  let cached = getCachedResolution(fingerprint);
  if (cached) return cached;

  let probed = await probeCommandCandidateList(candidates, fingerprint);
  if (probed.installed) return probed;

  const errors = [...(probed.errors || [])];
  if (options.prepareEmbeddedRuntime) {
    const info = getRuntimeArchiveInfo('remove-ai-watermarks');
    if (info.archiveExists && !info.ready) {
      try {
        console.log('[ai-watermark] preparing embedded remove-ai-watermarks runtime archive...');
        ensureRuntimeArchiveExtracted('remove-ai-watermarks');
      } catch (error) {
        errors.unshift(`embedded runtime archive: ${error?.message || String(error)}`.slice(0, 240));
        console.warn('[ai-watermark] embedded runtime archive prepare failed, trying available runtimes:', error?.message || String(error));
      }
      candidates = commandCandidates();
      fingerprint = commandCandidatesFingerprint(candidates);
      cached = getCachedResolution(fingerprint);
      if (cached) return cached;
      probed = await probeCommandCandidateList(candidates, fingerprint);
      if (probed.installed) return probed;
      errors.push(...(probed.errors || []));
    }
  }
  const resolved = {
    installed: false,
    candidate: null,
    version: '',
    resolver: '',
    errors,
  };
  setCachedResolution(fingerprint, resolved);
  return resolved;
}

function parseVersion(text) {
  const match = String(text || '').match(/(\d+\.\d+(?:\.\d+)?(?:[-+][\w.]+)?)/);
  return match ? match[1] : '';
}

function pythonProbeCandidates(resolved) {
  const out = [];
  const env = process.env;
  const candidate = resolved?.candidate;
  if (candidate?.pythonCommand) {
    out.push({
      command: candidate.pythonCommand,
      argsPrefix: candidate.pythonPrefix || [],
      env: candidate.env || env,
      label: `${candidate.label} python probe`,
    });
  }
  out.push({ command: 'python', argsPrefix: [], env: { ...env }, label: 'python import probe' });
  out.push({ command: 'py', argsPrefix: ['-3'], env: { ...env }, label: 'py -3 import probe' });
  return out;
}

function runPythonProbe(probe, code) {
  const candidate = {
    command: probe.command,
    baseArgs: [...(probe.argsPrefix || []), '-c'],
    env: probe.env,
    label: probe.label,
  };
  return runCommand(candidate, [code], { timeoutMs: STATUS_TIMEOUT_MS });
}

function torchRuntimeFingerprint(resolved) {
  return [
    resolved?.candidate?.id || '',
    resolved?.candidate?.command || '',
    resolved?.candidate?.pythonCommand || '',
    JSON.stringify(resolved?.candidate?.pythonPrefix || []),
    resolved?.candidate?.pythonPath || '',
    resolved?.version || '',
    resolved?.resolver || '',
    aiWatermarkEnvFingerprint(),
  ].join('\u0000');
}

function getCachedTorchRuntime(fingerprint) {
  if (!torchRuntimeCache) return null;
  if (torchRuntimeCache.fingerprint !== fingerprint) return null;
  if (Date.now() > torchRuntimeCache.expiresAt) return null;
  return torchRuntimeCache.value;
}

function setCachedTorchRuntime(fingerprint, value) {
  torchRuntimeCache = {
    fingerprint,
    value,
    expiresAt: Date.now() + TORCH_RUNTIME_CACHE_TTL_MS,
  };
}

function resolvedRuntimePythonProbe(resolved) {
  const candidate = resolved?.candidate;
  if (!candidate?.pythonCommand) return null;
  return {
    command: candidate.pythonCommand,
    argsPrefix: candidate.pythonPrefix || [],
    env: candidate.env || process.env,
    label: `${candidate.label} torch probe`,
  };
}

async function probeTorchRuntime(resolved) {
  const fingerprint = torchRuntimeFingerprint(resolved);
  const cached = getCachedTorchRuntime(fingerprint);
  if (cached) return cached;

  const probe = resolvedRuntimePythonProbe(resolved);
  if (!probe) {
    const value = { ok: false, message: 'resolved runtime has no python probe' };
    setCachedTorchRuntime(fingerprint, value);
    return value;
  }

  const code = `
import json
data = {"ok": False, "message": "", "torchVersion": "", "torchCuda": None, "compiledCuda": False, "cudaAvailable": False, "deviceCount": 0, "deviceName": ""}
try:
    import torch
    data["ok"] = True
    data["torchVersion"] = getattr(torch, "__version__", "")
    data["torchCuda"] = getattr(torch.version, "cuda", None)
    data["compiledCuda"] = bool(data["torchCuda"])
    try:
        data["cudaAvailable"] = bool(torch.cuda.is_available())
        data["deviceCount"] = int(torch.cuda.device_count()) if data["cudaAvailable"] else 0
        if data["cudaAvailable"] and data["deviceCount"] > 0:
            data["deviceName"] = str(torch.cuda.get_device_name(0))
    except Exception as cuda_exc:
        data["message"] = str(cuda_exc)
    print(json.dumps(data, ensure_ascii=False))
except Exception as exc:
    data["message"] = str(exc)
    print(json.dumps(data, ensure_ascii=False))
`.trim();
  const result = await runPythonProbe(probe, code);
  let value = null;
  if (result.ok) {
    value = parseJsonProbeOutput(result.stdout);
  }
  if (!value) {
    value = {
      ok: false,
      message: result.stderr || result.stdout || 'torch probe failed',
    };
  }
  value.probe = probe.label;
  setCachedTorchRuntime(fingerprint, value);
  return value;
}

async function detectDynamicCapabilities(resolved) {
  const code = `
import importlib.util, json
data = {"markKeys": [], "optionalFeatures": {"invisible": False, "lama": False, "detect": False, "trustmark": False, "restore": False, "auto": False, "controlnet": False, "adaptivePolish": False, "esrgan": False, "model": False, "guidanceScale": False}, "version": ""}
try:
    import remove_ai_watermarks
    data["version"] = getattr(remove_ai_watermarks, "__version__", "")
except Exception:
    pass
try:
    from remove_ai_watermarks import watermark_registry
    data["markKeys"] = list(watermark_registry.mark_keys())
except Exception:
    pass
try:
    from remove_ai_watermarks.invisible_engine import is_available
    data["optionalFeatures"]["invisible"] = bool(is_available())
except Exception:
    data["optionalFeatures"]["invisible"] = False
try:
    from remove_ai_watermarks.region_eraser import lama_available
    data["optionalFeatures"]["lama"] = bool(lama_available())
except Exception:
    data["optionalFeatures"]["lama"] = False
data["optionalFeatures"]["detect"] = importlib.util.find_spec("imwatermark") is not None
data["optionalFeatures"]["trustmark"] = importlib.util.find_spec("trustmark") is not None
data["optionalFeatures"]["auto"] = importlib.util.find_spec("remove_ai_watermarks.auto_config") is not None
data["optionalFeatures"]["adaptivePolish"] = importlib.util.find_spec("remove_ai_watermarks.humanizer") is not None
try:
    from remove_ai_watermarks import upscaler
    is_available = getattr(upscaler, "is_available", None)
    data["optionalFeatures"]["esrgan"] = bool(is_available()) if callable(is_available) else False
except Exception:
    data["optionalFeatures"]["esrgan"] = False
try:
    from remove_ai_watermarks import face_restore
    data["optionalFeatures"]["restore"] = bool(face_restore.is_available())
except Exception:
    data["optionalFeatures"]["restore"] = False
print(json.dumps(data, ensure_ascii=False))
`.trim();
  for (const probe of pythonProbeCandidates(resolved)) {
    const result = await runPythonProbe(probe, code);
    if (!result.ok) continue;
    const parsed = parseJsonProbeOutput(result.stdout);
    if (parsed) return parsed;
  }
  return null;
}

function capabilitiesFingerprint(resolved) {
  return [
    resolved?.candidate?.id || '',
    resolved?.candidate?.command || '',
    resolved?.candidate?.pythonPath || '',
    resolved?.version || '',
    resolved?.resolver || '',
    aiWatermarkEnvFingerprint(),
  ].join('\u0000');
}

function getCachedCapabilities(fingerprint) {
  if (!capabilityCache) return null;
  if (capabilityCache.fingerprint !== fingerprint) return null;
  if (Date.now() > capabilityCache.expiresAt) return null;
  return capabilityCache.value;
}

function setCachedCapabilities(fingerprint, value) {
  capabilityCache = {
    fingerprint,
    value,
    expiresAt: Date.now() + CAPABILITY_CACHE_TTL_MS,
  };
}

async function detectCapabilities() {
  const resolved = await resolveAiWatermarkCommand();
  if (!resolved.installed) {
    const archive = getRuntimeArchiveInfo('remove-ai-watermarks');
    if (archive.archiveExists) {
      const capabilities = archive.manifest?.capabilities || {};
      const version = archive.manifest?.source?.version || archive.manifest?.version || '';
      return {
        installed: true,
        version,
        resolver: archive.ready ? 'cached remove-ai-watermarks runtime' : 'embedded remove-ai-watermarks runtime archive',
        runtimeArchivePending: !archive.ready,
        runtimeArchive: {
          archiveExists: true,
          ready: archive.ready,
          archiveFile: archive.archiveFile,
          archiveSize: archive.archiveSize,
        },
        markKeys: Array.isArray(capabilities.visibleMarks) && capabilities.visibleMarks.length > 0
          ? capabilities.visibleMarks
          : FALLBACK_MARKS,
        optionalFeatures: {
          invisible: !!capabilities.invisible,
          lama: !!capabilities.lama,
          detect: !!capabilities.detect,
          trustmark: !!capabilities.trustmark,
          restore: !!capabilities.restore,
          auto: !!capabilities.auto,
          controlnet: !!capabilities.controlnet,
          adaptivePolish: !!capabilities.adaptivePolish,
          esrgan: !!capabilities.esrgan,
          model: !!capabilities.model,
          guidanceScale: !!capabilities.guidanceScale,
        },
        setupHints: setupHints(),
        errors: archive.ready ? [] : ['内置运行时归档将在首次执行时解压到用户数据目录。'],
      };
    }
    return {
      installed: false,
      version: '',
      resolver: '',
      markKeys: FALLBACK_MARKS,
      optionalFeatures: {
        invisible: false,
        lama: false,
        detect: false,
        trustmark: false,
        restore: false,
        auto: false,
        controlnet: false,
        adaptivePolish: false,
        esrgan: false,
        model: false,
        guidanceScale: false,
      },
      setupHints: setupHints(),
      errors: resolved.errors || [],
    };
  }
  const fingerprint = capabilitiesFingerprint(resolved);
  const cached = getCachedCapabilities(fingerprint);
  if (cached) return cached;

  const dynamic = await detectDynamicCapabilities(resolved);
  const version = String(dynamic?.version || resolved.version || '').trim();
  const migratedControlnet = !version || versionAtLeast(version, CONTROLNET_MIGRATION_VERSION);
  const modernInvisible = !version || versionAtLeast(version, MODERN_INVISIBLE_VERSION);
  const data = {
    installed: true,
    version,
    resolver: resolved.resolver,
    markKeys: Array.isArray(dynamic?.markKeys) && dynamic.markKeys.length > 0
      ? dynamic.markKeys
      : FALLBACK_MARKS,
    optionalFeatures: {
      invisible: !!dynamic?.optionalFeatures?.invisible,
      lama: !!dynamic?.optionalFeatures?.lama,
      detect: !!dynamic?.optionalFeatures?.detect,
      trustmark: !!dynamic?.optionalFeatures?.trustmark,
      restore: !modernInvisible && !!dynamic?.optionalFeatures?.restore,
      auto: !modernInvisible && (!!dynamic?.optionalFeatures?.auto || migratedControlnet),
      controlnet: !!dynamic?.optionalFeatures?.controlnet || migratedControlnet,
      adaptivePolish: !!dynamic?.optionalFeatures?.adaptivePolish || migratedControlnet,
      esrgan: !!dynamic?.optionalFeatures?.esrgan,
      model: modernInvisible || !!dynamic?.optionalFeatures?.model,
      guidanceScale: modernInvisible || !!dynamic?.optionalFeatures?.guidanceScale,
    },
    setupHints: setupHints(),
    errors: [],
  };
  setCachedCapabilities(fingerprint, data);
  return data;
}

function setupHints() {
  return [
    '推荐: pipx install remove-ai-watermarks',
    '也可以: uv tool install remove-ai-watermarks',
    'Electron 离线包: 将准备好的 runtime 放入 tools/remove-ai-watermarks-runtime, 打包前执行 npm run prepack:runtimes 生成归档',
    '已有 runtime 根目录时设置 JIAREN_REMOVE_AI_WATERMARKS_RUNTIME',
    '已有本地源码时设置 JIAREN_REMOVE_AI_WATERMARKS_SRC 指向 clone 根目录',
    '已有可执行文件时设置 JIAREN_REMOVE_AI_WATERMARKS_BIN 指向 remove-ai-watermarks(.cmd)',
    '完整隐形水印建议安装 remove-ai-watermarks[gpu,detect,trustmark,lama]；ESRGAN 小图放大另需 esrgan extra',
  ];
}

function assertModeSupportsKind(mode, kind) {
  const normalized = normalizeMode(mode);
  if (kind === 'image') return;
  if (normalized === 'metadata-check' || normalized === 'metadata-remove') return;
  throw new Error('视频 / 音频当前仅支持元数据检查和元数据清理；画面水印处理请先转成图像帧。');
}

function normalizeMode(mode) {
  const raw = String(mode || 'smart').trim();
  if (raw === 'metadata') return 'metadata-remove';
  if (raw === 'metadata-check' || raw === 'metadata-remove') return raw;
  if (['smart', 'visible', 'erase', 'invisible', 'identify', 'all'].includes(raw)) return raw;
  return 'smart';
}

function visibleArgs(sourcePath, outputPath, options = {}) {
  const mark = String(options.mark || 'auto').trim().replace(/[^a-zA-Z0-9_-]/g, '') || 'auto';
  const inpaintMethod = choice(options.inpaintMethod, ['ns', 'telea', 'gaussian'], 'ns');
  const inpaintStrength = finiteNumber(options.inpaintStrength, 0.85, 0, 1);
  const args = ['visible', sourcePath, '-o', outputPath, '--mark', mark, '--inpaint-method', inpaintMethod, '--inpaint-strength', inpaintStrength];
  args.push(bool(options.inpaint, true) ? '--inpaint' : '--no-inpaint');
  args.push(bool(options.detect, true) ? '--detect' : '--no-detect');
  args.push(bool(options.stripMetadata, true) ? '--strip-metadata' : '--keep-metadata');
  return args;
}

function eraseArgs(sourcePath, outputPath, options = {}) {
  const regions = normalizeRegions(options.regions);
  if (regions.length === 0) throw new Error('框选擦除至少需要 1 个区域');
  const backend = choice(options.backend, ['cv2', 'lama'], 'cv2');
  const inpaintMethod = choice(options.eraseMethod || options.inpaintMethod, ['telea', 'ns'], 'telea');
  const dilate = integer(options.dilate, 3, 0, 80);
  const args = ['erase', sourcePath, '-o', outputPath, '--backend', backend, '--inpaint-method', inpaintMethod, '--dilate', dilate];
  for (const region of regions) args.push('--region', region);
  args.push(bool(options.stripMetadata, true) ? '--strip-metadata' : '--keep-metadata');
  return args;
}

function appendInvisibleOptionalArgs(args, options, pipeline, steps, modernInvisible, modern089) {
  if (options.strength !== undefined && options.strength !== null && options.strength !== '') {
    args.push('--strength', Math.max(1 / steps, finiteNumber(options.strength, 0.3, 0, 1)));
  }
  if (options.seed !== undefined && options.seed !== null && options.seed !== '') {
    args.push('--seed', integer(options.seed, 0, -2147483648, 2147483647));
  }
  if (options.hfToken) args.push('--hf-token', String(options.hfToken));

  if (modernInvisible) {
    if (options.minResolution !== undefined && options.minResolution !== null && options.minResolution !== '') {
      args.push('--min-resolution', integer(options.minResolution, 1024, 0, 8192));
    }
    const controlnetScale = finiteNumber(options.controlnetScale, 1, 0, 3);
    if (controlnetScale !== 1 || pipeline === 'controlnet') args.push('--controlnet-scale', controlnetScale);
    const unsharp = finiteNumber(options.unsharp, 0, 0, 3);
    if (unsharp > 0) args.push('--unsharp', unsharp);
    const upscaler = choice(options.upscaler, ['lanczos', 'esrgan'], 'lanczos');
    args.push('--upscaler', upscaler);
    const model = String(options.model || '').trim();
    if (model) args.push('--model', model);
    if (options.guidanceScale !== undefined && options.guidanceScale !== null && options.guidanceScale !== '') {
      args.push('--guidance-scale', finiteNumber(options.guidanceScale, 7.5, 0, 30));
    }
    if (options.adaptivePolish === false) args.push('--no-adaptive-polish');
  } else if (modern089) {
    const autoTune = options.auto === true || options.autoTune === true;
    if (options.minResolution !== undefined && options.minResolution !== null && options.minResolution !== '') {
      args.push('--min-resolution', integer(options.minResolution, 1024, 0, 8192));
    }
    const controlnetScale = finiteNumber(options.controlnetScale, 1, 0, 3);
    if (controlnetScale !== 1 || pipeline === 'controlnet') args.push('--controlnet-scale', controlnetScale);
    const unsharp = finiteNumber(options.unsharp, 0, 0, 3);
    if (unsharp > 0) args.push('--unsharp', unsharp);
    if (autoTune) args.push('--auto');
    if (options.adaptivePolish === true) args.push('--adaptive-polish');
    const restoreFacesWeight = finiteNumber(options.restoreFacesWeight, 0.5, 0, 1);
    if (options.restoreFaces === true) {
      args.push('--restore-faces');
      args.push('--restore-faces-weight', restoreFacesWeight);
    } else if (restoreFacesWeight !== 0.5) {
      args.push('--restore-faces-weight', restoreFacesWeight);
    }
  } else {
    if (options.protectText === true) args.push('--protect-text');
    if (options.protectFaces === true) args.push('--protect-faces');
  }
}

function invisibleArgs(sourcePath, outputPath, options = {}) {
  const modernInvisible = supportsModernInvisible(options);
  const modern089 = supportsInvisible089(options);
  const pipeline = normalizeInvisiblePipeline(options.pipeline, options.upstreamVersion || options.runtimeVersion || '');
  const autoTune = options.auto === true || options.autoTune === true;
  const device = choice(options.device, ['auto', 'cpu', 'mps', 'cuda', 'xpu'], 'auto');
  const steps = integer(options.steps, 50, 4, 200);
  const humanize = finiteNumber(options.humanize, 0, 0, 20);
  const rawMaxResolution = integer(options.maxResolution, 0, 0, 8192);
  const maxResolution = rawMaxResolution > 0 ? Math.max(256, rawMaxResolution) : 0;
  const args = ['invisible', sourcePath, '-o', outputPath, '--steps', steps, '--device', device, '--humanize', humanize, '--max-resolution', maxResolution];
  if (modernInvisible || !autoTune || pipeline !== 'default') {
    args.push('--pipeline', pipeline);
  }
  appendInvisibleOptionalArgs(args, options, pipeline, steps, modernInvisible, modern089);
  return args;
}

function allArgs(sourcePath, outputPath, options = {}) {
  const modernInvisible = supportsModernInvisible(options);
  const modern089 = supportsInvisible089(options);
  const pipeline = normalizeInvisiblePipeline(options.pipeline, options.upstreamVersion || options.runtimeVersion || '');
  const device = choice(options.device, ['auto', 'cpu', 'mps', 'cuda', 'xpu'], 'auto');
  const steps = integer(options.steps, 50, 4, 200);
  const humanize = finiteNumber(options.humanize, 0, 0, 20);
  const rawMaxResolution = integer(options.maxResolution, 0, 0, 8192);
  const maxResolution = rawMaxResolution > 0 ? Math.max(256, rawMaxResolution) : 0;
  const inpaintMethod = choice(options.inpaintMethod, ['ns', 'telea', 'gaussian'], 'ns');
  const args = [
    'all',
    sourcePath,
    '-o',
    outputPath,
    '--steps',
    steps,
    '--pipeline',
    pipeline,
    '--device',
    device,
    '--humanize',
    humanize,
    '--max-resolution',
    maxResolution,
    '--inpaint-method',
    inpaintMethod,
  ];
  args.push(bool(options.inpaint, true) ? '--inpaint' : '--no-inpaint');
  appendInvisibleOptionalArgs(args, options, pipeline, steps, modernInvisible, modern089);
  return args;
}

function metadataArgs(sourcePath, outputPath, mode, options = {}) {
  if (mode === 'metadata-check') return ['metadata', sourcePath, '--check'];
  const args = ['metadata', sourcePath, '--remove', '-o', outputPath];
  args.push(bool(options.keepStandardMetadata, true) ? '--keep-standard' : '--remove-all');
  return args;
}

function identifyArgs(sourcePath, options = {}) {
  const args = ['identify', sourcePath, '--json'];
  if (options.noVisible) args.push('--no-visible');
  return args;
}

function buildAiWatermarkPlan({ mode, sourcePath, outputPath, mediaKind = 'image', options = {} }) {
  const normalizedMode = normalizeMode(mode);
  assertModeSupportsKind(normalizedMode, mediaKind);
  const output = outputPath || createAiWatermarkOutputPath(sourcePath, normalizedMode);

  if (normalizedMode === 'smart') {
    const visibleOutput = createAiWatermarkOutputPath(sourcePath, 'smart_visible');
    const metadataInput = bool(options.runInvisible, false)
      ? createAiWatermarkOutputPath(sourcePath, 'smart_invisible')
      : visibleOutput;
    const steps = [
      {
        label: 'visible-auto',
        args: visibleArgs(sourcePath, visibleOutput, { ...options, mark: options.mark || 'auto' }),
        outputPath: visibleOutput,
        inputPath: sourcePath,
        allowNoOutput: true,
      },
    ];
    if (bool(options.runInvisible, false)) {
      steps.push({
        label: 'invisible',
        args: invisibleArgs(visibleOutput, metadataInput, options),
        outputPath: metadataInput,
        inputPath: visibleOutput,
        inputFallbackPath: sourcePath,
      });
    }
    steps.push({
      label: 'metadata-remove',
      args: metadataArgs(metadataInput, output, 'metadata-remove', options),
      outputPath: output,
      inputPath: metadataInput,
      inputFallbackPath: sourcePath,
    });
    return { mode: normalizedMode, outputPath: output, reportOnly: false, steps };
  }

  if (normalizedMode === 'visible') {
    return { mode: normalizedMode, outputPath: output, reportOnly: false, steps: [{ label: 'visible', args: visibleArgs(sourcePath, output, options), outputPath: output, inputPath: sourcePath }] };
  }
  if (normalizedMode === 'erase') {
    return { mode: normalizedMode, outputPath: output, reportOnly: false, steps: [{ label: 'erase', args: eraseArgs(sourcePath, output, options), outputPath: output, inputPath: sourcePath }] };
  }
  if (normalizedMode === 'invisible') {
    return { mode: normalizedMode, outputPath: output, reportOnly: false, steps: [{ label: 'invisible', args: invisibleArgs(sourcePath, output, options), outputPath: output, inputPath: sourcePath }] };
  }
  if (normalizedMode === 'all') {
    return { mode: normalizedMode, outputPath: output, reportOnly: false, steps: [{ label: 'all', args: allArgs(sourcePath, output, options), outputPath: output, inputPath: sourcePath }] };
  }
  if (normalizedMode === 'metadata-check') {
    return { mode: normalizedMode, outputPath: '', reportOnly: true, steps: [{ label: 'metadata-check', args: metadataArgs(sourcePath, '', 'metadata-check', options), inputPath: sourcePath }] };
  }
  if (normalizedMode === 'metadata-remove') {
    return { mode: normalizedMode, outputPath: output, reportOnly: false, steps: [{ label: 'metadata-remove', args: metadataArgs(sourcePath, output, 'metadata-remove', options), outputPath: output, inputPath: sourcePath }] };
  }
  if (normalizedMode === 'identify') {
    return { mode: normalizedMode, outputPath: '', reportOnly: true, steps: [{ label: 'identify', args: identifyArgs(sourcePath, options), inputPath: sourcePath }] };
  }

  throw new Error(`不支持的模式：${normalizedMode}`);
}

function modeUsesInvisibleDevice(mode, options = {}) {
  const normalizedMode = normalizeMode(mode);
  return normalizedMode === 'invisible' ||
    normalizedMode === 'all' ||
    (normalizedMode === 'smart' && bool(options.runInvisible, false));
}

async function resolveExecutionOptionsForRuntime(resolved, mode, options = {}) {
  const nextOptions = { ...options };
  if (!modeUsesInvisibleDevice(mode, nextOptions)) {
    return { options: nextOptions, warnings: [], deviceFallback: null, torchRuntime: null };
  }
  const requestedDevice = normalizeExecutionDevice(nextOptions.device);
  if (requestedDevice !== 'cuda') {
    nextOptions.device = requestedDevice;
    return { options: nextOptions, warnings: [], deviceFallback: null, torchRuntime: null };
  }
  const torchRuntime = await probeTorchRuntime(resolved);
  const resolution = resolveAiWatermarkExecutionDevice(requestedDevice, torchRuntime);
  nextOptions.device = resolution.device;
  return {
    options: nextOptions,
    warnings: resolution.warning ? [resolution.warning] : [],
    deviceFallback: resolution.fallback || null,
    torchRuntime,
  };
}

function stepTimeout(step) {
  return step.label === 'invisible' || step.label === 'all' ? INVISIBLE_TIMEOUT_MS : PROCESS_TIMEOUT_MS;
}

function ensureStepInput(step) {
  if (!step.inputPath || fs.existsSync(step.inputPath)) return;
  if (step.inputFallbackPath && fs.existsSync(step.inputFallbackPath)) {
    const from = step.inputFallbackPath;
    const to = step.inputPath;
    fs.copyFileSync(from, to);
    return;
  }
  throw new Error(`步骤 ${step.label} 的输入文件不存在`);
}

async function executePlan(candidate, plan, context = {}) {
  const logs = [];
  let report = null;
  const runId = context.runId || '';
  aiWatermarkLog(runId, `plan start mode=${plan.mode} steps=${plan.steps.length} runner="${candidate.label}"`);
  for (const [index, step] of plan.steps.entries()) {
    throwIfAborted(context.signal);
    const stepNo = `${index + 1}/${plan.steps.length}`;
    const logLabel = `${plan.mode}:${step.label}`;
    ensureStepInput(step);
    if (step.outputPath && fs.existsSync(step.outputPath)) {
      try { fs.unlinkSync(step.outputPath); } catch (_) {}
    }
    const startedAt = Date.now();
    aiWatermarkLog(
      runId,
      `step ${stepNo} "${step.label}" start command="${candidate.label}" args=${JSON.stringify(redactCommandArgs(step.args))}`,
    );
    const result = await runCommand(candidate, step.args, {
      timeoutMs: stepTimeout(step),
      streamLogs: true,
      streamLabel: logLabel,
      runId,
      signal: context.signal,
    });
    const elapsedMs = Date.now() - startedAt;
    logs.push({
      step: step.label,
      ok: result.ok,
      code: result.code,
      stdout: result.stdout.trim().slice(-6000),
      stderr: result.stderr.trim().slice(-6000),
    });
    aiWatermarkLog(runId, `step ${stepNo} "${step.label}" done ok=${result.ok} code=${result.code} elapsedMs=${elapsedMs}`);
    if (result.signal === 'abort' || context.signal?.aborted) throwIfAborted(context.signal);
    if (!result.ok) {
      aiWatermarkLog(runId, `step ${stepNo} "${step.label}" failed`);
      const classified = classifyAiWatermarkRuntimeError(`${result.stderr}\n${result.stdout}`);
      if (classified) {
        const error = new Error(classified.message);
        error.code = classified.code;
        error.classification = classified;
        throw error;
      }
      throw new Error(result.stderr.trim() || result.stdout.trim() || `${step.label} 执行失败`);
    }
    if (step.label === 'identify') {
      try {
        report = JSON.parse(result.stdout.trim());
      } catch {
        report = { text: result.stdout.trim() };
      }
    } else if (step.label === 'metadata-check') {
      report = { text: result.stdout.trim() || result.stderr.trim() };
    }
    if (step.outputPath && !fs.existsSync(step.outputPath)) {
      if (step.allowNoOutput && fs.existsSync(step.inputPath)) {
        aiWatermarkLog(runId, `step ${stepNo} "${step.label}" produced no file; copied input as fallback`);
        fs.copyFileSync(step.inputPath, step.outputPath);
      } else {
        throw new Error(`${step.label} 未生成输出文件`);
      }
    }
  }
  aiWatermarkLog(runId, `plan complete mode=${plan.mode}`);
  return { logs, report };
}

async function runAiWatermarkProcess({ sourcePath, mediaKind, mode, options = {}, signal }) {
  const normalizedMode = normalizeMode(mode);
  const runId = shortRunId();
  throwIfAborted(signal);
  aiWatermarkLog(runId, `request start mode=${normalizedMode} source="${path.basename(String(sourcePath || ''))}" mediaKind=${mediaKind || kindFromPath(sourcePath) || 'unknown'}`);
  const resolved = await resolveAiWatermarkCommand({ prepareEmbeddedRuntime: true });
  throwIfAborted(signal);
  if (!resolved.installed) {
    aiWatermarkLog(runId, `runtime missing errors=${JSON.stringify((resolved.errors || []).slice(0, 3))}`);
    throw new Error(`未安装 remove-ai-watermarks。${setupHints().slice(0, 2).join('；')}`);
  }
  aiWatermarkLog(runId, `runtime resolved resolver="${resolved.resolver}" version="${resolved.version || '?'}"`);
  const execution = await resolveExecutionOptionsForRuntime(resolved, normalizedMode, {
    ...options,
    upstreamVersion: resolved.version || '',
  });
  throwIfAborted(signal);
  if (execution.deviceFallback) {
    aiWatermarkLog(
      runId,
      `device fallback requested=${execution.deviceFallback.requested} resolved=${execution.deviceFallback.resolved} reason=${execution.deviceFallback.reason}`,
    );
  }
  const plan = buildAiWatermarkPlan({
    mode: normalizedMode,
    sourcePath,
    mediaKind: mediaKind || kindFromPath(sourcePath),
    options: execution.options,
  });
  const executed = await executePlan(resolved.candidate, plan, { runId, signal });
  throwIfAborted(signal);
  if (plan.reportOnly) {
    const text = executed.report?.text || JSON.stringify(executed.report || {}, null, 2);
    aiWatermarkLog(runId, `request complete outputKind=text`);
    return {
      mode: plan.mode,
      outputKind: 'text',
      outputText: text,
      report: executed.report,
      logs: executed.logs,
      warnings: execution.warnings,
      deviceFallback: execution.deviceFallback,
    };
  }
  aiWatermarkLog(runId, `request complete outputKind=${kindFromPath(plan.outputPath) || mediaKind || 'image'} output="${path.basename(plan.outputPath)}"`);
  return {
    mode: plan.mode,
    outputKind: kindFromPath(plan.outputPath) || mediaKind || 'image',
    outputPath: plan.outputPath,
    outputUrl: outputUrlFromPath(plan.outputPath),
    logs: executed.logs,
    warnings: execution.warnings,
    deviceFallback: execution.deviceFallback,
  };
}

module.exports = {
  FALLBACK_MARKS,
  assertModeSupportsKind,
  buildAiWatermarkPlan,
  classifyAiWatermarkRuntimeError,
  commandCandidates,
  detectCapabilities,
  normalizeMode,
  normalizeRegions,
  normalizeInvisiblePipeline,
  redactCommandArgs,
  resolveAiWatermarkExecutionDevice,
  resolveAiWatermarkCommand,
  runCommand,
  runAiWatermarkProcess,
  setupHints,
  allArgs,
  invisibleArgs,
  versionAtLeast,
  visibleArgs,
};
