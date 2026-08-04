'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const config = require('../config');
const {
  ensureRuntimeArchiveExtracted,
  getRuntimeArchiveInfo,
  getRuntimeCachePath,
} = require('./runtimeArchive');

const COMPLIANCE_WARNING = [
  '仅解析或下载你本人拥有版权、已获授权，或平台明确允许保存的公开内容。',
  '请遵守目标平台服务条款、版权、肖像权、隐私权与当地法律；不要用于搬运、售卖、骚扰、规避付费/DRM 或抓取私密内容。',
  'Cookie 与代理可能暴露账号访问权限，请只在可信环境中使用，且不要分享给他人。',
].join('\n');

const SUPPORTED_PLATFORM_HINTS = [
  'Twitter / X',
  'Instagram',
  'YouTube',
  'Facebook',
  'Threads',
  'Bilibili',
  '抖音',
  'TikTok',
  '微博',
  '小红书',
  '贴吧',
  '微信公众号',
  '快手',
  '酷安',
  '皮皮虾',
  '最右',
  '小黑盒',
];

const VIDEO_EXTS = new Set(['mp4', 'webm', 'mov', 'm4v', 'mkv']);
const AUDIO_EXTS = new Set(['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac']);
const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif']);

function projectRoot() {
  if (process.env.JIAREN_RESOURCES_PATH && process.env.JIAREN_RESOURCES_PATH.trim()) {
    return path.resolve(process.env.JIAREN_RESOURCES_PATH);
  }
  return path.resolve(__dirname, '..', '..', '..');
}

function pathIfExists(...parts) {
  const candidate = path.join(...parts);
  return fs.existsSync(candidate) ? candidate : '';
}

function uniqueExistingPaths(paths) {
  const seen = new Set();
  const out = [];
  for (const p of paths) {
    if (!p || typeof p !== 'string') continue;
    const resolved = path.resolve(p);
    if (!fs.existsSync(resolved) || seen.has(resolved)) continue;
    seen.add(resolved);
    out.push(resolved);
  }
  return out;
}

function resolveBridgeScript(root = projectRoot()) {
  const envScript = process.env.JIAREN_PARSEHUB_BRIDGE && process.env.JIAREN_PARSEHUB_BRIDGE.trim();
  const candidates = [
    envScript,
    path.join(root, 'tools', 'parsehub-bridge', 'parsehub_bridge.py'),
    path.join(path.resolve(__dirname, '..', '..', '..'), 'tools', 'parsehub-bridge', 'parsehub_bridge.py'),
  ].filter(Boolean);
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) {
    throw new Error('ParseHub bridge 未找到，请确认 tools/parsehub-bridge/parsehub_bridge.py 已随应用打包');
  }
  return found;
}

function resolvePythonCandidates(root = projectRoot()) {
  const envPython = process.env.JIAREN_PARSEHUB_PYTHON && process.env.JIAREN_PARSEHUB_PYTHON.trim();
  const cachedRemoveAi = getRuntimeCachePath('remove-ai-watermarks');
  const raw = [
    envPython ? { command: envPython, argsPrefix: [] } : null,
    { command: pathIfExists(cachedRemoveAi, 'python', 'python.exe'), argsPrefix: [] },
    { command: pathIfExists(cachedRemoveAi, 'python.exe'), argsPrefix: [] },
    { command: pathIfExists(root, 'tools', 'parsehub-runtime', 'python', 'python.exe'), argsPrefix: [] },
    { command: pathIfExists(root, 'tools', 'parsehub-runtime', 'python.exe'), argsPrefix: [] },
    { command: pathIfExists(root, 'tools', 'remove-ai-watermarks', 'python', 'python.exe'), argsPrefix: [] },
    { command: pathIfExists(root, 'tools', 'remove-ai-watermarks', 'python.exe'), argsPrefix: [] },
    { command: pathIfExists(root, 'tools', 'remove-ai-watermarks-runtime', 'python', 'python.exe'), argsPrefix: [] },
    { command: pathIfExists(root, 'tools', 'remove-ai-watermarks-runtime', 'python.exe'), argsPrefix: [] },
    { command: 'python', argsPrefix: [] },
    { command: 'py', argsPrefix: ['-3.12'] },
  ].filter((item) => item && item.command);
  const seen = new Set();
  return raw.filter((item) => {
    const key = `${item.command}\0${item.argsPrefix.join('\0')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function resolvePythonLibPaths(root = projectRoot()) {
  const envPaths = String(process.env.JIAREN_PARSEHUB_LIB_PATHS || '')
    .split(path.delimiter)
    .map((p) => p.trim())
    .filter(Boolean);
  return uniqueExistingPaths([
    ...envPaths,
    getRuntimeCachePath('parsehub-pythonlibs'),
    path.join(root, 'tools', 'parsehub-pythonlibs'),
    path.join(root, 'ParseHub', 'src'),
    path.join(path.resolve(__dirname, '..', '..', '..'), 'tools', 'parsehub-pythonlibs'),
    path.join(path.resolve(__dirname, '..', '..', '..'), 'ParseHub', 'src'),
  ]);
}

function prepareEmbeddedParseHubRuntime(action, root = projectRoot()) {
  if (String(action || '').toLowerCase() === 'status') return [];
  const prepared = [];
  const parseHubLibs = getRuntimeArchiveInfo('parsehub-pythonlibs');
  if (parseHubLibs.archiveExists && !parseHubLibs.ready) {
    prepared.push(ensureRuntimeArchiveExtracted('parsehub-pythonlibs'));
  }
  const removeAiPython = getRuntimeArchiveInfo('remove-ai-watermarks');
  const explicitPython = String(process.env.JIAREN_PARSEHUB_PYTHON || '').trim();
  const hasCachedPython = fs.existsSync(path.join(getRuntimeCachePath('remove-ai-watermarks'), 'python', 'python.exe')) ||
    fs.existsSync(path.join(getRuntimeCachePath('remove-ai-watermarks'), 'python.exe'));
  const hasExpandedPython = Boolean(
    pathIfExists(root, 'tools', 'parsehub-runtime', 'python', 'python.exe') ||
    pathIfExists(root, 'tools', 'parsehub-runtime', 'python.exe') ||
    pathIfExists(root, 'tools', 'remove-ai-watermarks', 'python', 'python.exe') ||
    pathIfExists(root, 'tools', 'remove-ai-watermarks', 'python.exe') ||
    pathIfExists(root, 'tools', 'remove-ai-watermarks-runtime', 'python', 'python.exe') ||
    pathIfExists(root, 'tools', 'remove-ai-watermarks-runtime', 'python.exe')
  );
  if (!explicitPython && removeAiPython.archiveExists && !hasCachedPython && !hasExpandedPython) {
    prepared.push(ensureRuntimeArchiveExtracted('remove-ai-watermarks'));
  }
  return prepared;
}

function clampText(value, max, label) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (text.length > max) {
    throw new Error(`${label} 过长，请删掉无关文本后重试`);
  }
  return text;
}

function normalizeResolveInput(value) {
  const text = clampText(value, 8000, '分享内容');
  if (!text) throw new Error('请粘贴短链、作品链接、或包含链接的分享文案');
  return text;
}

function normalizeOptionalSecret(value, max, label) {
  return clampText(value, max, label);
}

function classifyParseHubError(error) {
  const message = String(error?.message || error || '').trim() || 'ParseHub 解析失败';
  const lower = message.toLowerCase();
  if (/确认内容来源合法|compliance/i.test(message)) {
    return {
      code: 'compliance_required',
      status: 400,
      hint: '请先勾选合规确认。',
      nextAction: 'accept_compliance',
    };
  }
  if (/缺少|请粘贴|分享内容|过长/i.test(message)) {
    return {
      code: 'invalid_input',
      status: 400,
      hint: '请复制完整分享文案、短链或作品链接后重试。',
      nextAction: 'edit_input',
    };
  }
  if (/unknownplatform|unsupported|不支持/i.test(message)) {
    return {
      code: 'unsupported_platform',
      status: 400,
      hint: '当前平台暂未被 ParseHub 支持，或链接格式无法识别。',
      nextAction: 'copy_full_share_text',
    };
  }
  if (/timeout|超时|timed out/i.test(lower)) {
    return {
      code: 'parsehub_timeout',
      status: 504,
      hint: '请稍后重试；如果平台访问慢，检查代理和登录态。',
      nextAction: 'retry_or_check_proxy_cookie',
    };
  }
  if (/cookie|login|required|auth|unauthorized|forbidden|401|403|登录|授权/i.test(lower)) {
    return {
      code: 'login_required',
      status: 401,
      hint: '该内容可能需要登录态。请使用授权助手重新登录，或手动粘贴最新 Cookie。',
      nextAction: 'refresh_cookie',
    };
  }
  if (/rate|limit|too many|频繁|风控|captcha|verify|验证/i.test(lower)) {
    return {
      code: 'rate_limited',
      status: 429,
      hint: '平台可能触发限流或验证，请稍后重试，必要时更换网络或重新授权。',
      nextAction: 'wait_and_retry',
    };
  }
  if (/proxy|network|connection|tls|ssl|dns|timeout|代理|网络/i.test(lower)) {
    return {
      code: 'proxy_required',
      status: 502,
      hint: '请检查网络、代理地址和目标平台是否可访问。',
      nextAction: 'check_proxy',
    };
  }
  if (/private|permission|not allowed|无权限|私密/i.test(lower)) {
    return {
      code: 'private_content',
      status: 403,
      hint: '请确认当前账号确实有权访问该内容，且平台允许保存。',
      nextAction: 'check_content_permission',
    };
  }
  return {
    code: 'parsehub_failed',
    status: 500,
    hint: '请检查分享内容、平台支持状态、Cookie 和代理设置。',
    nextAction: 'check_input_runtime',
  };
}

function parseJsonOutput(stdout, stderr) {
  const text = String(stdout || '').trim();
  if (!text) {
    throw new Error(String(stderr || '').trim() || 'ParseHub bridge 没有返回内容');
  }
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const lastLine = lines[lines.length - 1] || text;
  try {
    return JSON.parse(lastLine);
  } catch (e) {
    throw new Error(`ParseHub bridge 返回了非 JSON 内容: ${lastLine.slice(0, 240)}`);
  }
}

function runBridgeWithCandidate(candidate, script, payload, options) {
  const timeoutMs = options?.timeoutMs || 90000;
  const root = options?.root || projectRoot();
  const libPaths = options?.libPaths || resolvePythonLibPaths(root);
  const args = [...(candidate.argsPrefix || []), script];
  const env = {
    ...process.env,
    PYTHONUTF8: '1',
    PYTHONIOENCODING: 'utf-8',
    JIAREN_PARSEHUB_LIB_PATHS: libPaths.join(path.delimiter),
    PYTHONPATH: [
      ...libPaths,
      process.env.PYTHONPATH || '',
    ].filter(Boolean).join(path.delimiter),
  };

  return new Promise((resolve, reject) => {
    let settled = false;
    let stdout = '';
    let stderr = '';
    const child = spawn(candidate.command, args, {
      cwd: root,
      env,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { child.kill('SIGKILL'); } catch (_) {}
      reject(new Error('ParseHub 解析超时，请稍后重试或检查代理/Cookie'));
    }, timeoutMs);
    child.stdout.on('data', (buf) => {
      stdout += buf.toString('utf8');
    });
    child.stderr.on('data', (buf) => {
      stderr += buf.toString('utf8');
    });
    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      err.stderr = stderr;
      reject(err);
    });
    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        const parsed = parseJsonOutput(stdout, stderr);
        if (code === 0 && parsed?.ok !== false) {
          resolve(parsed);
          return;
        }
        const msg = parsed?.error || String(stderr || '').trim() || `ParseHub bridge exit ${code}`;
        const err = new Error(msg);
        err.payload = parsed;
        err.stderr = stderr;
        err.exitCode = code;
        reject(err);
      } catch (err) {
        err.stderr = stderr;
        err.exitCode = code;
        reject(err);
      }
    });
    child.stdin.end(JSON.stringify(payload));
  });
}

async function runParseHubBridge(payload, options = {}) {
  const root = options.root || projectRoot();
  prepareEmbeddedParseHubRuntime(payload?.action, root);
  const script = resolveBridgeScript(root);
  const libPaths = resolvePythonLibPaths(root);
  const candidates = resolvePythonCandidates(root);
  const errors = [];
  for (const candidate of candidates) {
    try {
      return await runBridgeWithCandidate(candidate, script, payload, {
        ...options,
        root,
        libPaths,
      });
    } catch (err) {
      const message = err?.message || String(err);
      errors.push(`${candidate.command}: ${message}`);
      const retryable =
        err?.code === 'ENOENT' ||
        /No module named ['"]?parsehub/i.test(message) ||
        /No module named ['"]?parsehub/i.test(String(err?.stderr || '')) ||
        /Python was not found/i.test(message);
      if (!retryable) break;
    }
  }
  throw new Error(errors.length ? errors.join('\n') : 'ParseHub Python runtime 不可用');
}

function extFromUrl(value) {
  const clean = String(value || '').split(/[?#]/)[0];
  const match = /\.([a-z0-9]{2,8})$/i.exec(clean);
  return match ? match[1].toLowerCase() : '';
}

function inferMediaKind(item) {
  const kind = String(item?.kind || item?.type || '').toLowerCase();
  if (['image', 'video', 'audio', 'text', 'file'].includes(kind)) return kind;
  const ext = String(item?.ext || extFromUrl(item?.url || item?.path || '') || '').toLowerCase();
  if (VIDEO_EXTS.has(ext)) return 'video';
  if (AUDIO_EXTS.has(ext)) return 'audio';
  if (IMAGE_EXTS.has(ext)) return 'image';
  return 'file';
}

function toOutputUrl(filePath) {
  if (!filePath) return '';
  const resolved = path.resolve(String(filePath));
  const outDir = path.resolve(config.OUTPUT_DIR);
  if (resolved === outDir || !resolved.startsWith(outDir + path.sep)) return '';
  const rel = path.relative(outDir, resolved).split(path.sep).map(encodeURIComponent).join('/');
  return `/files/output/${rel}`;
}

function mediaLabel(kind, index, item) {
  const base = kind === 'image' ? '图像' : kind === 'video' ? '视频' : kind === 'audio' ? '音频' : '文件';
  const width = Number(item?.width || 0);
  const height = Number(item?.height || 0);
  const dim = width > 0 && height > 0 ? ` ${width}x${height}` : '';
  const ext = item?.ext ? ` .${item.ext}` : '';
  return `${base} ${index + 1}${dim}${ext}`;
}

function normalizeMediaItems(items, source) {
  const out = [];
  const seen = new Set();
  for (const item of Array.isArray(items) ? items : []) {
    const url = String(item?.url || '').trim();
    if (url && !seen.has(url)) {
      const kind = inferMediaKind(item);
      const normalized = {
        kind,
        url,
        ext: String(item?.ext || extFromUrl(url) || '').toLowerCase(),
        thumbUrl: String(item?.thumb_url || item?.thumbUrl || '').trim(),
        width: Number(item?.width || 0) || undefined,
        height: Number(item?.height || 0) || undefined,
        duration: Number(item?.duration || 0) || undefined,
        label: mediaLabel(kind, out.length, item),
        source,
      };
      out.push(normalized);
      seen.add(url);
    }
    const liveVideoUrl = String(item?.video_url || item?.videoUrl || '').trim();
    if (liveVideoUrl && !seen.has(liveVideoUrl)) {
      const normalized = {
        kind: 'video',
        url: liveVideoUrl,
        ext: String(item?.video_ext || extFromUrl(liveVideoUrl) || 'mp4').toLowerCase(),
        thumbUrl: String(item?.url || '').trim(),
        width: Number(item?.width || 0) || undefined,
        height: Number(item?.height || 0) || undefined,
        duration: Number(item?.duration || 0) || undefined,
        label: mediaLabel('video', out.length, { ...item, ext: item?.video_ext || 'mp4' }),
        source,
      };
      out.push(normalized);
      seen.add(liveVideoUrl);
    }
  }
  return out;
}

function normalizeDownloadedMedia(items) {
  const out = [];
  for (const item of Array.isArray(items) ? items : []) {
    const localUrl = toOutputUrl(item?.path);
    if (!localUrl) continue;
    const kind = inferMediaKind({ ...item, url: localUrl });
    out.push({
      kind,
      url: localUrl,
      localPath: String(item?.path || ''),
      ext: extFromUrl(localUrl),
      width: Number(item?.width || 0) || undefined,
      height: Number(item?.height || 0) || undefined,
      duration: Number(item?.duration || 0) || undefined,
      label: mediaLabel(kind, out.length, item),
      source: 'download',
    });
  }
  return out;
}

function buildSummaryText(result) {
  const lines = [];
  lines.push(`聚合解析结果：${result.title || result.contentPreview || '未命名内容'}`);
  if (result.platformName || result.platform) {
    lines.push(`平台：${result.platformName || result.platform}`);
  }
  if (result.type) lines.push(`类型：${result.type}`);
  if (result.sourceUrl) lines.push(`来源：${result.sourceUrl}`);
  if (result.content) lines.push(`正文：${result.content}`);
  if (result.media.length > 0) {
    lines.push('');
    if (result.mode === 'download') {
      lines.push('已保存到本地输出目录的媒体地址：');
    } else {
      lines.push('解析到的远端媒体地址：');
    }
    result.media.forEach((item, index) => {
      lines.push(`${index + 1}. [${item.kind}] ${item.url}`);
    });
    if (result.mode !== 'download') {
      lines.push('');
      lines.push('提示：平台 CDN 地址可能带防盗链、Cookie 或临时签名，浏览器直接打开出现 403 不一定代表解析错误；需要稳定预览和下游复用时，请使用保存到输出目录模式。');
    }
  }
  lines.push('');
  lines.push('合规提醒：仅用于本人拥有版权、已获授权或平台允许保存的内容。');
  return lines.join('\n');
}

function normalizeParseHubResult(payload) {
  const parsed = payload?.parsed || payload?.normalized || payload?.raw || {};
  const downloaded = payload?.download || null;
  const parseMedia = normalizeMediaItems(parsed.media, 'remote');
  const downloadedMedia = normalizeDownloadedMedia(downloaded?.media);
  const media = downloadedMedia.length > 0 ? downloadedMedia : parseMedia;
  const content = String(parsed.content || parsed.markdown_content || '').trim();
  const title = String(parsed.title || '').trim();
  const result = {
    ok: true,
    platform: String(parsed.platform || '').trim(),
    platformName: String(parsed.platformName || parsed.platform || '').trim(),
    type: String(parsed.type || '').trim(),
    title,
    content,
    contentPreview: content.length > 120 ? `${content.slice(0, 118)}...` : content,
    sourceUrl: String(parsed.raw_url || parsed.rawUrl || '').trim(),
    mode: downloaded ? 'download' : 'parse',
    media,
    parsehubVersion: String(payload?.parsehubVersion || '').trim(),
    pythonVersion: String(payload?.pythonVersion || '').trim(),
    downloadedDir: downloaded?.output_dir ? String(downloaded.output_dir) : '',
    complianceWarning: COMPLIANCE_WARNING,
    supportedPlatforms: SUPPORTED_PLATFORM_HINTS,
    raw: payload,
  };
  result.outputText = buildSummaryText(result);
  return result;
}

function getEmbeddedParseHubRuntimeStatus() {
  const root = projectRoot();
  const pythonRuntime = getRuntimeArchiveInfo('remove-ai-watermarks');
  const libs = getRuntimeArchiveInfo('parsehub-pythonlibs');
  const expandedLibsReady = Boolean(
    pathIfExists(root, 'tools', 'parsehub-pythonlibs', 'parsehub') ||
    pathIfExists(path.resolve(__dirname, '..', '..', '..'), 'tools', 'parsehub-pythonlibs', 'parsehub')
  );
  const expandedPythonReady = Boolean(
    pathIfExists(root, 'tools', 'parsehub-runtime', 'python', 'python.exe') ||
    pathIfExists(root, 'tools', 'parsehub-runtime', 'python.exe') ||
    pathIfExists(root, 'tools', 'remove-ai-watermarks', 'python', 'python.exe') ||
    pathIfExists(root, 'tools', 'remove-ai-watermarks', 'python.exe') ||
    pathIfExists(root, 'tools', 'remove-ai-watermarks-runtime', 'python', 'python.exe') ||
    pathIfExists(root, 'tools', 'remove-ai-watermarks-runtime', 'python.exe')
  );
  return {
    archiveAvailable: libs.archiveExists,
    pending: libs.archiveExists && ((!libs.ready && !expandedLibsReady) || (pythonRuntime.archiveExists && !pythonRuntime.ready && !expandedPythonReady)),
    expandedLibsReady,
    expandedPythonReady,
    pythonRuntime: {
      archiveExists: pythonRuntime.archiveExists,
      ready: pythonRuntime.ready,
      archiveFile: pythonRuntime.archiveFile,
      archiveSize: pythonRuntime.archiveSize,
    },
    pythonLibs: {
      archiveExists: libs.archiveExists,
      ready: libs.ready,
      archiveFile: libs.archiveFile,
      archiveSize: libs.archiveSize,
    },
  };
}

async function getParseHubStatus() {
  const embeddedRuntime = getEmbeddedParseHubRuntimeStatus();
  if (embeddedRuntime.archiveAvailable && embeddedRuntime.pending) {
    return {
      ok: true,
      available: true,
      embeddedRuntimePending: true,
      embeddedRuntime,
      error: '内置 ParseHub 运行时归档将在首次解析时准备。',
      platforms: [],
      supportedPlatforms: SUPPORTED_PLATFORM_HINTS,
    };
  }
  try {
    const payload = await runParseHubBridge({ action: 'status' }, { timeoutMs: 30000 });
    return {
      ok: true,
      available: true,
      embeddedRuntimePending: false,
      embeddedRuntime,
      parsehubVersion: String(payload?.parsehubVersion || ''),
      pythonVersion: String(payload?.pythonVersion || ''),
      platforms: Array.isArray(payload?.platforms) ? payload.platforms : [],
      supportedPlatforms: SUPPORTED_PLATFORM_HINTS,
    };
  } catch (err) {
    return {
      ok: false,
      available: false,
      embeddedRuntimePending: false,
      embeddedRuntime,
      error: err?.message || String(err),
      platforms: [],
      supportedPlatforms: SUPPORTED_PLATFORM_HINTS,
    };
  }
}

module.exports = {
  COMPLIANCE_WARNING,
  SUPPORTED_PLATFORM_HINTS,
  normalizeResolveInput,
  normalizeOptionalSecret,
  classifyParseHubError,
  normalizeParseHubResult,
  resolveBridgeScript,
  resolvePythonCandidates,
  resolvePythonLibPaths,
  runParseHubBridge,
  getParseHubStatus,
  getEmbeddedParseHubRuntimeStatus,
};
