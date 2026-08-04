'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const config = require('../../config');
const {
  kindFromPath,
  mimeFromPath,
} = require('../aiWatermark/media');

const DEFAULT_GIGAPIXEL_EXE = process.platform === 'win32'
  ? 'C:\\Program Files\\Topaz Labs LLC\\Topaz Gigapixel AI\\gigapixel.exe'
  : 'gigapixel';
const DEFAULT_TOPAZ_VIDEO_DIR = process.platform === 'win32'
  ? 'C:\\Program Files\\Topaz Labs LLC\\Topaz Video AI'
  : '';
const GIGAPIXEL_TIMEOUT_MS = 2 * 60 * 60 * 1000;
const TOPAZ_VIDEO_TIMEOUT_MS = 3 * 60 * 60 * 1000;

const GIGAPIXEL_MODEL_MAPPING = {
  'Art & CG': 'art',
  Lines: 'lines',
  'Very Compressed': 'vc',
  'High Fidelity': 'fidelity',
  'Low Resolution': 'lowres',
  Standard: 'std',
  'Text & Shapes': 'text',
  Redefine: 'redefine',
  Recover: 'recovery',
  art: 'art',
  lines: 'lines',
  vc: 'vc',
  fidelity: 'fidelity',
  lowres: 'lowres',
  std: 'std',
  text: 'text',
  redefine: 'redefine',
  recovery: 'recovery',
};
const GIGAPIXEL_MV2_MODELS = new Set(['std', 'fidelity', 'lowres', 'recovery']);
const TOPAZ_UPSCALE_MODELS = [
  'aaa-9',
  'ahq-12',
  'alq-13',
  'alqs-2',
  'amq-13',
  'amqs-2',
  'ghq-5',
  'iris-2',
  'iris-3',
  'nyx-3',
  'prob-4',
  'thf-4',
  'thd-3',
  'thm-2',
  'rhea-1',
  'rxl-1',
];
const TOPAZ_INTERPOLATION_MODELS = ['apo-8', 'apf-1', 'chr-2', 'chf-3'];
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff', '.bmp']);

function shortRunId() {
  return crypto.randomBytes(4).toString('hex');
}

function finiteNumber(value, fallback, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function integer(value, fallback, min, max) {
  return Math.trunc(finiteNumber(value, fallback, min, max));
}

function bool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  const s = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(s)) return true;
  if (['false', '0', 'no', 'off'].includes(s)) return false;
  return fallback;
}

function choice(value, allowed, fallback) {
  const v = String(value || '').trim();
  return allowed.includes(v) ? v : fallback;
}

function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(3)));
}

function quoteArg(arg) {
  const s = String(arg);
  if (!s) return '""';
  return /[\s"']/g.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s;
}

function commandPreview(command, args) {
  return [command, ...(args || [])].map(quoteArg).join(' ');
}

function outputUrlFromOutputPath(filePath) {
  const base = path.resolve(config.OUTPUT_DIR);
  const resolved = path.resolve(filePath);
  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    throw new Error('Topaz 输出文件不在 output 目录内');
  }
  const rel = path.relative(base, resolved)
    .split(path.sep)
    .map((part) => encodeURIComponent(part))
    .join('/');
  return `/files/output/${rel}`;
}

function makeOutputDir(kind, runId = shortRunId()) {
  const dir = path.join(config.OUTPUT_DIR, kind, runId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function makeOutputPath(kind, ext, runId = shortRunId()) {
  const dir = path.join(config.OUTPUT_DIR, kind);
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${kind}_${Date.now()}_${runId}${ext}`);
}

function findCommandSync(command) {
  try {
    const finder = process.platform === 'win32' ? 'where' : 'which';
    const result = spawnSync(finder, [command], { encoding: 'utf8', windowsHide: true });
    if (result.status !== 0) return '';
    const first = String(result.stdout || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);
    return first || '';
  } catch (_) {
    return '';
  }
}

function fileExists(value) {
  try {
    return Boolean(value && fs.existsSync(value) && fs.statSync(value).isFile());
  } catch (_) {
    return false;
  }
}

function dirExists(value) {
  try {
    return Boolean(value && fs.existsSync(value) && fs.statSync(value).isDirectory());
  } catch (_) {
    return false;
  }
}

function normalizeGigapixelModel(value) {
  const raw = String(value || '').trim();
  return GIGAPIXEL_MODEL_MAPPING[raw] || 'std';
}

function buildGigapixelArgs(options = {}) {
  const inputPath = String(options.inputPath || '').trim();
  const outputDir = String(options.outputDir || '').trim();
  if (!inputPath) throw new Error('缺少 Gigapixel 输入图像');
  if (!outputDir) throw new Error('缺少 Gigapixel 输出目录');

  const model = normalizeGigapixelModel(options.model || options.gigapixelModel);
  const scale = finiteNumber(options.scale, 2, 1, 16);
  const denoise = finiteNumber(options.denoise, 1, 0, 100);
  const sharpen = finiteNumber(options.sharpen, 1, 0, 100);
  const compression = finiteNumber(options.compression, 67, 0, 100);
  const fineDetail = finiteNumber(options.fineDetail ?? options.fr, 50, 0, 100);
  const preDownscaling = finiteNumber(options.preDownscaling, 75, 50, 100);
  const enableSettings = bool(options.enableSettings, true);

  const args = ['--scale', formatNumber(scale), '-i', inputPath, '-o', outputDir];
  if (enableSettings) {
    if (denoise > 0) args.push('--dn', formatNumber(denoise));
    if (sharpen > 0) args.push('--sh', formatNumber(sharpen));
    if (compression > 0) args.push('--cm', formatNumber(compression));
    if (fineDetail > 0) args.push('--fr', formatNumber(fineDetail));
    if (model === 'recovery' && preDownscaling >= 50) {
      args.push('--pds', formatNumber(preDownscaling));
    }
  }
  args.push('--model', model);
  if (GIGAPIXEL_MV2_MODELS.has(model)) args.push('--mv', '2');

  return {
    args,
    settings: {
      scale,
      model,
      mv: GIGAPIXEL_MV2_MODELS.has(model) ? 2 : null,
      denoise: enableSettings && denoise > 0 ? denoise : null,
      sharpen: enableSettings && sharpen > 0 ? sharpen : null,
      compression: enableSettings && compression > 0 ? compression : null,
      fineDetail: enableSettings && fineDetail > 0 ? fineDetail : null,
      preDownscaling: enableSettings && model === 'recovery' && preDownscaling >= 50 ? preDownscaling : null,
    },
  };
}

function topazVideoFfmpegFrom(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  const normalized = path.resolve(text);
  const base = path.basename(normalized).toLowerCase();
  if (base === 'ffmpeg.exe' || base === 'ffmpeg') return normalized;
  return path.join(normalized, process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
}

function detectGigapixel(customPath = '') {
  const candidates = [
    { label: '节点自定义路径', path: String(customPath || '').trim() },
    { label: 'JIAREN_TOPAZ_GIGAPIXEL_EXE', path: String(process.env.JIAREN_TOPAZ_GIGAPIXEL_EXE || '').trim() },
    { label: '默认安装路径', path: DEFAULT_GIGAPIXEL_EXE },
  ].filter((item) => item.path);
  for (const item of candidates) {
    if (fileExists(item.path)) {
      return { installed: true, executablePath: path.resolve(item.path), source: item.label };
    }
  }
  const pathHit = findCommandSync('gigapixel');
  if (pathHit) return { installed: true, executablePath: pathHit, source: 'PATH:gigapixel' };
  return {
    installed: false,
    executablePath: '',
    source: '',
  };
}

function detectTopazVideo(customPath = '') {
  const customFfmpeg = topazVideoFfmpegFrom(customPath);
  const envFfmpeg = String(process.env.JIAREN_TOPAZ_VIDEO_FFMPEG || '').trim();
  const envDir = topazVideoFfmpegFrom(process.env.JIAREN_TOPAZ_VIDEO_DIR || '');
  const defaultFfmpeg = topazVideoFfmpegFrom(DEFAULT_TOPAZ_VIDEO_DIR);
  const candidates = [
    { label: '节点自定义路径', path: customFfmpeg },
    { label: 'JIAREN_TOPAZ_VIDEO_FFMPEG', path: envFfmpeg },
    { label: 'JIAREN_TOPAZ_VIDEO_DIR', path: envDir },
    { label: '默认安装路径', path: defaultFfmpeg },
  ].filter((item) => item.path);
  for (const item of candidates) {
    if (fileExists(item.path)) {
      return {
        installed: true,
        ffmpegPath: path.resolve(item.path),
        topazVideoDir: path.dirname(path.resolve(item.path)),
        source: item.label,
      };
    }
  }
  return { installed: false, ffmpegPath: '', topazVideoDir: '', source: '' };
}

function detectTopazStatus(options = {}) {
  const gigapixel = detectGigapixel(options.gigapixelPath || options.executablePath);
  const video = detectTopazVideo(options.topazVideoPath || options.ffmpegPath);
  const modelDataDir = String(process.env.TVAI_MODEL_DATA_DIR || '').trim();
  const modelDir = String(process.env.TVAI_MODEL_DIR || '').trim();
  const modelEnvReady = Boolean(
    modelDataDir &&
    modelDir &&
    dirExists(modelDataDir) &&
    dirExists(modelDir),
  );
  return {
    gigapixel: {
      ...gigapixel,
      defaultExecutablePath: DEFAULT_GIGAPIXEL_EXE,
      setupHints: [
        '需要本机安装并登录 Topaz Gigapixel AI / Gigapixel 8。',
        '默认查找 C:\\Program Files\\Topaz Labs LLC\\Topaz Gigapixel AI\\gigapixel.exe，也可在节点内填写 gigapixel.exe 路径。',
        '若使用 PATH 模式，请确认命令行直接运行 gigapixel 有响应。',
      ],
    },
    video: {
      ...video,
      defaultTopazVideoDir: DEFAULT_TOPAZ_VIDEO_DIR,
      modelEnvReady,
      modelDataDir,
      modelDir,
      setupHints: [
        '需要本机安装并登录 Topaz Video AI，且必须使用 Topaz Video AI 自带 ffmpeg.exe。',
        '在 Topaz Video AI 登录后按 Ctrl+Shift+T，或进入安装目录运行 .\\login，让 TVAI_MODEL_DATA_DIR / TVAI_MODEL_DIR 生效。',
        '如果出现 No such filter: tvai_up / tvai_fi，通常是 ffmpeg 路径不是 Topaz 自带版本，或模型目录环境变量未配置。',
      ],
    },
    models: {
      gigapixel: Object.keys(GIGAPIXEL_MODEL_MAPPING).filter((key) => !/^[a-z0-9-]+$/.test(key)),
      gigapixelCodes: Array.from(new Set(Object.values(GIGAPIXEL_MODEL_MAPPING))),
      videoUpscale: TOPAZ_UPSCALE_MODELS,
      videoInterpolation: TOPAZ_INTERPOLATION_MODELS,
    },
  };
}

function resolveGigapixelExecutable(options = {}) {
  const explicit = String(options.executablePath || options.gigapixelPath || '').trim();
  if (explicit) {
    if (!fileExists(explicit)) throw new Error(`Gigapixel AI 路径不存在：${explicit}`);
    return { command: path.resolve(explicit), source: 'custom' };
  }
  const detected = detectGigapixel();
  if (detected.installed && detected.executablePath) {
    return { command: detected.executablePath, source: detected.source };
  }
  if (bool(options.useSystemCommand, true)) {
    return { command: 'gigapixel', source: 'PATH:gigapixel' };
  }
  throw new Error(`未检测到 Gigapixel AI。请安装 Topaz Gigapixel AI，并在节点内填写 ${DEFAULT_GIGAPIXEL_EXE}`);
}

function resolveTopazFfmpeg(options = {}) {
  const explicit = String(options.topazVideoPath || options.ffmpegPath || '').trim();
  if (explicit) {
    const ffmpeg = topazVideoFfmpegFrom(explicit);
    if (!fileExists(ffmpeg)) throw new Error(`未找到 Topaz Video AI 自带 ffmpeg.exe：${ffmpeg}`);
    return { command: path.resolve(ffmpeg), source: 'custom', topazVideoDir: path.dirname(path.resolve(ffmpeg)) };
  }
  const detected = detectTopazVideo();
  if (detected.installed && detected.ffmpegPath) {
    return { command: detected.ffmpegPath, source: detected.source, topazVideoDir: detected.topazVideoDir };
  }
  throw new Error(`未检测到 Topaz Video AI 自带 ffmpeg.exe。请安装 Topaz Video AI，并在节点内填写安装目录：${DEFAULT_TOPAZ_VIDEO_DIR}`);
}

function createProcessError(label, resultOrError) {
  const raw = resultOrError instanceof Error
    ? resultOrError.message
    : `${resultOrError?.stderr || ''}\n${resultOrError?.stdout || ''}`.trim();
  const text = String(raw || '').trim();
  let hint = '';
  if (/No such filter:\s*['"]?tvai_/i.test(text)) {
    hint = '请确认节点使用的是 Topaz Video AI 安装目录里的 ffmpeg.exe，并已登录 Topaz Video AI / 配好 TVAI_MODEL_DATA_DIR 与 TVAI_MODEL_DIR。';
  } else if (/ENOENT|not found|cannot find|找不到/i.test(text)) {
    hint = '请检查本机 Topaz 安装路径，或在节点内填写 gigapixel.exe / Topaz Video AI 安装目录。';
  } else if (/login|license|unauthori[sz]ed|not authenticated/i.test(text)) {
    hint = '请先打开 Topaz 软件登录账号，再回到画布运行。Topaz Video AI 还可以在安装目录运行 .\\login。';
  } else if (/hevc_nvenc|nvenc|nvcuda|unknown encoder/i.test(text)) {
    hint = '当前显卡编码器不可用，可在节点里关闭 GPU 编码后重试。';
  }
  const message = hint ? `${label} 执行失败：${text}\n${hint}` : `${label} 执行失败：${text || '未知错误'}`;
  const error = new Error(message);
  error.hint = hint;
  return error;
}

function runProcess(command, args, options = {}) {
  const label = options.label || path.basename(command);
  const timeoutMs = options.timeoutMs || 600_000;
  const cwd = options.cwd || undefined;
  const env = options.env || process.env;
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timedOut = false;
    const child = spawn(command, args, {
      cwd,
      env,
      windowsHide: true,
      shell: false,
    });
    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill('SIGKILL');
      } catch (_) {
        // ignore
      }
    }, timeoutMs);
    child.stdout.on('data', (chunk) => { stdout += String(chunk); });
    child.stderr.on('data', (chunk) => { stderr += String(chunk); });
    child.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(createProcessError(label, error));
    });
    child.on('close', (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (timedOut) {
        reject(new Error(`${label} 执行超时，请缩短视频或降低参数后重试`));
        return;
      }
      resolve({ code, signal, stdout, stderr });
    });
  });
}

function walkOutputImages(dir, out = []) {
  if (!dirExists(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      walkOutputImages(full, out);
    } else if (IMAGE_EXTS.has(path.extname(name).toLowerCase())) {
      out.push({ path: full, mtimeMs: st.mtimeMs, size: st.size });
    }
  }
  return out;
}

async function runGigapixelImage(options = {}) {
  const sourcePath = String(options.sourcePath || '').trim();
  if (!sourcePath || !fs.existsSync(sourcePath)) throw new Error('缺少可读取的输入图像');
  if (kindFromPath(sourcePath) !== 'image') throw new Error('Topaz 图像高清化只接受图像输入');

  const runId = shortRunId();
  const outputDir = makeOutputDir('topaz-gigapixel', runId);
  const exe = resolveGigapixelExecutable(options);
  const plan = buildGigapixelArgs({
    ...options,
    inputPath: sourcePath,
    outputDir,
  });
  const preview = commandPreview(exe.command, plan.args);
  console.log(`[topaz:gigapixel ${runId}] ${preview}`);
  const result = await runProcess(exe.command, plan.args, {
    label: 'Topaz Gigapixel AI',
    cwd: exe.command === 'gigapixel' ? undefined : path.dirname(exe.command),
    timeoutMs: GIGAPIXEL_TIMEOUT_MS,
  });
  if (result.code !== 0) throw createProcessError('Topaz Gigapixel AI', result);
  const files = walkOutputImages(outputDir)
    .sort((a, b) => (b.mtimeMs - a.mtimeMs) || (b.size - a.size));
  if (files.length === 0) throw new Error('Gigapixel AI 没有生成输出文件，请检查许可证、模型和输出目录权限');
  const urls = files.map((item) => outputUrlFromOutputPath(item.path));
  return {
    kind: 'image',
    outputPath: files[0].path,
    outputUrl: urls[0],
    outputUrls: urls,
    fileName: path.basename(files[0].path),
    size: files[0].size,
    mime: mimeFromPath(files[0].path),
    settings: plan.settings,
    commandPreview: preview,
    logs: [{ step: 'gigapixel', ok: true, stdout: result.stdout, stderr: result.stderr }],
  };
}

function buildTopazVideoFilterChain(options = {}) {
  const enableUpscale = bool(options.enableUpscale, true);
  const enableInterpolation = bool(options.enableInterpolation, false);
  if (!enableUpscale && !enableInterpolation) {
    throw new Error('请至少开启「放大」或「补帧」其中一个处理动作');
  }
  const upscaleModel = choice(options.upscaleModel, TOPAZ_UPSCALE_MODELS, 'iris-3');
  const interpolationModel = choice(options.interpolationModel, TOPAZ_INTERPOLATION_MODELS, 'apo-8');
  const upscaleFactor = upscaleModel === 'thm-2'
    ? 1
    : finiteNumber(options.upscaleFactor, 2, 1, 4);
  const compression = finiteNumber(options.compression, 1, -1, 1);
  const blend = finiteNumber(options.blend, 0, 0, 1);
  const inputFps = integer(options.inputFps, 24, 1, 240);
  const interpolationMultiplier = finiteNumber(options.interpolationMultiplier, 2, 1, 8);
  const targetFps = Math.max(1, Math.round(inputFps * interpolationMultiplier));

  const filters = [];
  if (enableUpscale) {
    filters.push(
      `tvai_up=model=${upscaleModel}:scale=${formatNumber(upscaleFactor)}:estimate=8:compression=${formatNumber(compression)}:blend=${formatNumber(blend)}`,
    );
  }
  if (enableInterpolation) {
    filters.push(`tvai_fi=model=${interpolationModel}:fps=${targetFps}`);
  }

  return {
    filterChain: filters.join(','),
    filters,
    settings: {
      enableUpscale,
      upscaleModel,
      upscaleFactor,
      compression,
      blend,
      enableInterpolation,
      interpolationModel,
      inputFps,
      interpolationMultiplier,
      targetFps: enableInterpolation ? targetFps : null,
    },
  };
}

function buildTopazVideoArgs(options = {}) {
  const inputPath = String(options.inputPath || '').trim();
  const outputPath = String(options.outputPath || '').trim();
  if (!inputPath) throw new Error('缺少 Topaz Video 输入视频');
  if (!outputPath) throw new Error('缺少 Topaz Video 输出路径');
  const filter = buildTopazVideoFilterChain(options);
  const useGpu = bool(options.useGpu, true);
  const preserveAudio = bool(options.preserveAudio, true);

  const args = [
    '-y',
    '-hide_banner',
    '-nostdin',
    '-strict',
    '2',
    '-hwaccel',
    'auto',
    '-i',
    inputPath,
  ];
  if (preserveAudio) args.push('-map', '0:v:0', '-map', '0:a?');
  args.push('-vf', filter.filterChain);
  if (useGpu) {
    args.push(
      '-c:v',
      'hevc_nvenc',
      '-profile',
      'main',
      '-preset',
      'medium',
      '-global_quality',
      '19',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      'frag_keyframe+empty_moov',
    );
  } else {
    args.push('-c:v', 'mpeg4', '-q:v', '2');
  }
  if (preserveAudio) args.push('-c:a', 'copy');
  args.push(outputPath);

  return {
    args,
    filterChain: filter.filterChain,
    settings: {
      ...filter.settings,
      useGpu,
      preserveAudio,
      encoder: useGpu ? 'hevc_nvenc' : 'mpeg4',
    },
  };
}

function shouldFallbackToCpu(result) {
  const text = `${result?.stderr || ''}\n${result?.stdout || ''}`;
  return /hevc_nvenc|nvenc|nvcuda|unknown encoder/i.test(text);
}

async function runTopazVideo(options = {}) {
  const sourcePath = String(options.sourcePath || '').trim();
  if (!sourcePath || !fs.existsSync(sourcePath)) throw new Error('缺少可读取的输入视频');
  if (kindFromPath(sourcePath) !== 'video') throw new Error('Topaz 视频高清化只接受视频输入');

  const runId = shortRunId();
  const outputPath = makeOutputPath('topaz-video', '.mp4', runId);
  const ffmpeg = resolveTopazFfmpeg(options);
  const plan = buildTopazVideoArgs({
    ...options,
    inputPath: sourcePath,
    outputPath,
  });
  const logs = [];
  const preview = commandPreview(ffmpeg.command, plan.args);
  console.log(`[topaz:video ${runId}] ${preview}`);
  let result = await runProcess(ffmpeg.command, plan.args, {
    label: 'Topaz Video AI',
    cwd: ffmpeg.topazVideoDir || path.dirname(ffmpeg.command),
    timeoutMs: TOPAZ_VIDEO_TIMEOUT_MS,
  });
  logs.push({ step: 'topaz-video', ok: result.code === 0, stdout: result.stdout, stderr: result.stderr });

  let finalPlan = plan;
  let finalPreview = preview;
  if (result.code !== 0 && plan.settings.useGpu && shouldFallbackToCpu(result)) {
    const cpuPlan = buildTopazVideoArgs({
      ...options,
      inputPath: sourcePath,
      outputPath,
      useGpu: false,
    });
    finalPlan = cpuPlan;
    finalPreview = commandPreview(ffmpeg.command, cpuPlan.args);
    console.log(`[topaz:video ${runId}] GPU encoder failed, retry CPU: ${finalPreview}`);
    result = await runProcess(ffmpeg.command, cpuPlan.args, {
      label: 'Topaz Video AI',
      cwd: ffmpeg.topazVideoDir || path.dirname(ffmpeg.command),
      timeoutMs: TOPAZ_VIDEO_TIMEOUT_MS,
    });
    logs.push({ step: 'topaz-video-cpu-fallback', ok: result.code === 0, stdout: result.stdout, stderr: result.stderr });
  }

  if (result.code !== 0) throw createProcessError('Topaz Video AI', result);
  if (!fs.existsSync(outputPath)) throw new Error('Topaz Video AI 未生成输出视频');
  const st = fs.statSync(outputPath);
  return {
    kind: 'video',
    outputPath,
    outputUrl: outputUrlFromOutputPath(outputPath),
    outputUrls: [outputUrlFromOutputPath(outputPath)],
    fileName: path.basename(outputPath),
    size: st.size,
    mime: mimeFromPath(outputPath, 'video/mp4'),
    filterChain: finalPlan.filterChain,
    settings: finalPlan.settings,
    commandPreview: finalPreview,
    logs,
  };
}

module.exports = {
  DEFAULT_GIGAPIXEL_EXE,
  DEFAULT_TOPAZ_VIDEO_DIR,
  GIGAPIXEL_MODEL_MAPPING,
  GIGAPIXEL_MV2_MODELS,
  TOPAZ_INTERPOLATION_MODELS,
  TOPAZ_UPSCALE_MODELS,
  buildGigapixelArgs,
  buildTopazVideoArgs,
  buildTopazVideoFilterChain,
  detectTopazStatus,
  normalizeGigapixelModel,
  runGigapixelImage,
  runTopazVideo,
};
