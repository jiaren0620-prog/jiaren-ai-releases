/**
 * 文件上传/下载路由
 * 用于:用户从本地上传参考图,后续传给图像生成接口
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { spawn } = require('child_process');
const sharp = require('../utils/optionalSharp');
const config = require('../config');
const { tryDecodeDuckPayload } = require('../utils/duckPayload');

const router = express.Router();
const THUMBNAIL_IMAGE_RE = /\.(png|jpe?g|webp|gif|bmp|avif|tiff?)(?:$|\?)/i;
const MAX_THUMBNAIL_JOBS = Math.max(1, Math.min(4, Number.parseInt(process.env.JIAREN_THUMBNAIL_CONCURRENCY || '2', 10) || 2));
const thumbnailInflight = new Map();
const thumbnailQueue = [];
let activeThumbnailJobs = 0;
const LOCAL_IMPORT_EXTENSIONS = new Map([
  ['.png', { kind: 'image', mime: 'image/png' }],
  ['.jpg', { kind: 'image', mime: 'image/jpeg' }],
  ['.jpeg', { kind: 'image', mime: 'image/jpeg' }],
  ['.webp', { kind: 'image', mime: 'image/webp' }],
  ['.gif', { kind: 'image', mime: 'image/gif' }],
  ['.bmp', { kind: 'image', mime: 'image/bmp' }],
  ['.avif', { kind: 'image', mime: 'image/avif' }],
  ['.tif', { kind: 'image', mime: 'image/tiff' }],
  ['.tiff', { kind: 'image', mime: 'image/tiff' }],
  ['.mp4', { kind: 'video', mime: 'video/mp4' }],
  ['.mov', { kind: 'video', mime: 'video/quicktime' }],
  ['.webm', { kind: 'video', mime: 'video/webm' }],
  ['.mkv', { kind: 'video', mime: 'video/x-matroska' }],
  ['.avi', { kind: 'video', mime: 'video/x-msvideo' }],
  ['.m4v', { kind: 'video', mime: 'video/x-m4v' }],
]);

// 配置 multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.INPUT_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const name = `up_${Date.now()}_${Math.random().toString(36).slice(2, 6)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
});

function sendUploadError(res, err) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      code: err.code || 'upload_error',
      error: err.message || '文件上传失败',
    });
  }
  console.error('文件上传错误:', err);
  return res.status(500).json({
    success: false,
    code: 'upload_failed',
    error: err?.message || '文件上传失败',
  });
}

const uploadSingleFile = upload.single('file');

// POST /api/files/upload — 上传文件
router.post('/upload', (req, res) => {
  uploadSingleFile(req, res, (err) => {
    if (err) return sendUploadError(res, err);
    if (!req.file) {
      return res.status(400).json({ success: false, code: 'missing_file', error: '未收到文件' });
    }
    return res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: `/files/input/${req.file.filename}`,
        localPath: req.file.path,
        sourcePath: req.file.path,
        size: req.file.size,
        mime: req.file.mimetype,
        kind: req.file.mimetype?.startsWith('video/') ? 'video' : req.file.mimetype?.startsWith('audio/') ? 'audio' : 'image',
      },
    });
  });
});

function localImportMeta(sourcePath) {
  const ext = path.extname(sourcePath).toLowerCase();
  return LOCAL_IMPORT_EXTENSIONS.get(ext) || null;
}

function resolveExistingLocalFile(sourcePath) {
  const raw = String(sourcePath || '').trim();
  if (!raw || !path.isAbsolute(raw)) {
    throw new Error('本地素材路径必须是绝对路径');
  }
  const resolved = path.resolve(raw);
  const stat = fs.statSync(resolved);
  if (!stat.isFile()) {
    throw new Error('本地素材路径不是文件');
  }
  return { resolved, stat };
}

function importLocalFile(sourcePath) {
  const { resolved, stat } = resolveExistingLocalFile(sourcePath);
  const meta = localImportMeta(resolved);
  if (!meta) {
    throw new Error('仅支持导入图像或视频文件');
  }
  const ext = path.extname(resolved).toLowerCase() || '.bin';
  const filename = `up_${Date.now()}_${Math.random().toString(36).slice(2, 6)}${ext}`;
  fs.mkdirSync(config.INPUT_DIR, { recursive: true });
  const target = path.join(config.INPUT_DIR, filename);
  fs.copyFileSync(resolved, target);
  return {
    filename,
    originalName: path.basename(resolved),
    url: `/files/input/${filename}`,
    path: target,
    sourcePath: resolved,
    size: stat.size,
    mime: meta.mime,
    kind: meta.kind,
  };
}

// POST /api/files/import-local — Electron 系统选择器拿到绝对路径后，复制到 input 并保留原始路径
router.post('/import-local', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const data = importLocalFile(req.body?.sourcePath || req.body?.path);
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(400).json({ success: false, error: e?.message || String(e) });
  }
});

// GET /api/files/list — 列出 output 目录
router.get('/list', (_req, res) => {
  try {
    const files = fs.readdirSync(config.OUTPUT_DIR)
      .filter((f) => /\.(png|jpe?g|webp|gif|mp4|webm|mp3|wav)$/i.test(f))
      .map((f) => {
        const stat = fs.statSync(path.join(config.OUTPUT_DIR, f));
        return {
          filename: f,
          url: `/files/output/${f}`,
          size: stat.size,
          mtime: stat.mtimeMs,
        };
      })
      .sort((a, b) => b.mtime - a.mtime);
    res.json({ success: true, data: files });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/files/upload-base64 — 从 base64 dataURL 保存 PNG/JPG 到 OUTPUT_DIR
// 供手绘画板 / 抽帧等前端产生的图像使用
router.post('/upload-base64', express.json({ limit: '20mb' }), (req, res) => {
  try {
    const { dataUrl, prefix } = req.body || {};
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ success: false, error: '缺少 dataUrl' });
    }
    const m = /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i.exec(dataUrl);
    if (!m) {
      return res.status(400).json({ success: false, error: 'dataUrl 格式不支持' });
    }
    const ext = m[1].toLowerCase() === 'jpg' ? 'jpeg' : m[1].toLowerCase();
    const buf = Buffer.from(m[2], 'base64');
    const tag = (prefix || 'draw').replace(/[^a-z0-9-]/gi, '').slice(0, 16) || 'draw';
    const filename = `${tag}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext === 'jpeg' ? 'png' : ext}`;
    const fp = path.join(config.OUTPUT_DIR, filename);
    fs.writeFileSync(fp, buf);
    res.json({
      success: true,
      data: {
        filename,
        url: `/files/output/${filename}`,
        size: buf.length,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

function resolveLocalFileUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return null;
  const clean = url.split('?')[0].split('#')[0];
  const mounts = [
    { prefix: '/files/input/', dir: config.INPUT_DIR },
    { prefix: '/files/output/', dir: config.OUTPUT_DIR },
  ];
  const mount = mounts.find((item) => clean.startsWith(item.prefix));
  if (!mount) return null;
  const rel = decodeURIComponent(clean.slice(mount.prefix.length));
  const base = path.resolve(mount.dir);
  const resolved = path.resolve(base, rel);
  if (resolved !== base && !resolved.startsWith(base + path.sep)) return null;
  return resolved;
}

function sanitizeOutputPart(value, fallback = 'batch') {
  const clean = String(value || '')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .replace(/^\.+/, '')
    .replace(/[._-]+$/, '')
    .slice(0, 120);
  return clean || fallback;
}

function ensureUniqueFile(targetDir, filename, overwrite) {
  const parsed = path.parse(String(filename || 'batch-item.bin'));
  const base = sanitizeOutputPart(parsed.name, 'batch-item');
  const ext = sanitizeOutputPart(parsed.ext.replace(/^\./, ''), 'bin');
  let candidate = `${base}.${ext}`;
  if (overwrite || !fs.existsSync(path.join(targetDir, candidate))) return candidate;
  for (let i = 2; i < 10000; i += 1) {
    candidate = `${base}_${i}.${ext}`;
    if (!fs.existsSync(path.join(targetDir, candidate))) return candidate;
  }
  return `${base}_${Date.now()}.${ext}`;
}

function resolveOutputSubdir(subdir) {
  const safeSubdir = sanitizeOutputPart(subdir || 'batch', 'batch');
  const outputRoot = path.resolve(config.OUTPUT_DIR);
  const targetDir = path.resolve(outputRoot, safeSubdir);
  if (targetDir !== outputRoot && !targetDir.startsWith(outputRoot + path.sep)) {
    return null;
  }
  return { safeSubdir, targetDir };
}

function spawnOpenFolder(targetDir, options = {}) {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    const command = platform === 'win32' ? 'explorer.exe' : platform === 'darwin' ? 'open' : 'xdg-open';
    const selectPath = String(options.selectPath || '').trim();
    const args = selectPath && platform === 'win32'
      ? [`/select,${selectPath}`]
      : selectPath && platform === 'darwin'
        ? ['-R', selectPath]
        : [targetDir];
    let child;
    let settled = false;
    const done = (error) => {
      if (settled) return;
      settled = true;
      if (error) reject(error);
      else resolve();
    };
    try {
      child = spawn(command, args, {
        detached: true,
        stdio: 'ignore',
        shell: false,
        windowsHide: false,
      });
    } catch (error) {
      done(error);
      return;
    }
    child.once('error', done);
    setTimeout(() => done(), 120);
    child.unref();
  });
}

function clampThumbnailSize(value) {
  const raw = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(raw)) return config.THUMBNAIL_SIZE || 320;
  return Math.max(96, Math.min(1024, raw));
}

function thumbnailCacheFile(sourcePath, stat, size) {
  const key = crypto
    .createHash('sha1')
    .update(`${sourcePath}|${stat.size}|${Math.round(stat.mtimeMs)}|${size}`)
    .digest('hex')
    .slice(0, 28);
  return path.join(config.THUMBNAILS_DIR, `preview_${size}_${key}.webp`);
}

function pumpThumbnailQueue() {
  while (activeThumbnailJobs < MAX_THUMBNAIL_JOBS && thumbnailQueue.length > 0) {
    const job = thumbnailQueue.shift();
    activeThumbnailJobs += 1;
    Promise.resolve()
      .then(job.task)
      .then(job.resolve, job.reject)
      .finally(() => {
        activeThumbnailJobs -= 1;
        pumpThumbnailQueue();
      });
  }
}

function queueThumbnailJob(task) {
  return new Promise((resolve, reject) => {
    thumbnailQueue.push({ task, resolve, reject });
    pumpThumbnailQueue();
  });
}

async function ensureThumbnailFile(sourcePath, target, size) {
  if (fs.existsSync(target)) return target;
  const inflight = thumbnailInflight.get(target);
  if (inflight) return inflight;
  const promise = queueThumbnailJob(async () => {
    if (fs.existsSync(target)) return target;
    await sharp(sourcePath, { animated: false, limitInputPixels: false })
      .rotate()
      .resize({
        width: size,
        height: size,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: config.THUMBNAIL_QUALITY || 78, effort: 4 })
      .toFile(target);
    return target;
  }).finally(() => {
    thumbnailInflight.delete(target);
  });
  thumbnailInflight.set(target, promise);
  return promise;
}

// GET /api/files/thumbnail?url=/files/input/x.png&size=360
// 用于画布内预览：只为本地 input/output 图片生成轻量 webp 缩略图。
router.get('/thumbnail', async (req, res) => {
  try {
    const url = String(req.query?.url || '').trim();
    if (!url || !THUMBNAIL_IMAGE_RE.test(url.split('?')[0].split('#')[0])) {
      return res.status(400).json({ success: false, error: '不支持的图片预览地址' });
    }
    const sourcePath = resolveLocalFileUrl(url);
    if (!sourcePath) {
      return res.status(400).json({ success: false, error: '只支持本地 input/output 图片缩略图' });
    }
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({ success: false, error: '源图片不存在' });
    }
    const stat = fs.statSync(sourcePath);
    const size = clampThumbnailSize(req.query?.size);
    const target = thumbnailCacheFile(sourcePath, stat, size);
    if (!fs.existsSync(config.THUMBNAILS_DIR)) {
      fs.mkdirSync(config.THUMBNAILS_DIR, { recursive: true });
    }
    await ensureThumbnailFile(sourcePath, target, size);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.type('image/webp');
    return res.sendFile(target);
  } catch (e) {
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

function safeDuckExt(ext) {
  const clean = String(ext || 'bin')
    .trim()
    .toLowerCase()
    .replace(/^\./, '')
    .replace(/[^a-z0-9._+-]/g, '')
    .slice(0, 40);
  return clean || 'bin';
}

// POST /api/files/duck-decode — 尝试按 SS_tools 无密码鸭鸭图批量解码本地素材
// 非鸭鸭图 / 密码鸭鸭图 / 非图片输出都只返回 decoded:false，前端会静默回退到普通上传输出。
router.post('/duck-decode', express.json({ limit: '256kb' }), async (req, res) => {
  try {
    const urls = Array.isArray(req.body?.urls) ? req.body.urls.filter((u) => typeof u === 'string') : [];
    if (urls.length === 0) {
      return res.status(400).json({ success: false, error: '缺少 urls' });
    }
    const limited = urls.slice(0, 30);
    const items = [];
    for (let i = 0; i < limited.length; i += 1) {
      const sourceUrl = limited[i];
      try {
        const fp = resolveLocalFileUrl(sourceUrl);
        if (!fp || !fs.existsSync(fp)) {
          items.push({ sourceUrl, decoded: false, reason: 'local_file_not_found' });
          continue;
        }
        const decoded = await tryDecodeDuckPayload(fs.readFileSync(fp));
        if (!decoded?.decoded || !decoded.buffer) {
          items.push({
            sourceUrl,
            decoded: false,
            isDuck: !!decoded?.isDuck,
            passwordProtected: !!decoded?.passwordProtected,
            reason: decoded?.passwordProtected ? 'password_protected' : 'not_duck',
          });
          continue;
        }
        if (!['image', 'video', 'audio'].includes(decoded.kind)) {
          items.push({ sourceUrl, decoded: false, isDuck: true, reason: 'unsupported_kind' });
          continue;
        }
        if (!fs.existsSync(config.OUTPUT_DIR)) fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
        const ext = safeDuckExt(decoded.ext);
        const filename = `duck_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const target = path.join(config.OUTPUT_DIR, filename);
        fs.writeFileSync(target, decoded.buffer);
        items.push({
          sourceUrl,
          decoded: true,
          filename,
          url: `/files/output/${filename}`,
          size: decoded.buffer.length,
          kind: decoded.kind,
          mime: decoded.mime,
          originalExt: decoded.originalExt,
          ext,
          lsbBits: decoded.lsbBits,
        });
      } catch (e) {
        items.push({ sourceUrl, decoded: false, reason: e?.message || 'decode_failed' });
      }
    }
    res.json({
      success: true,
      data: {
        items,
        decodedCount: items.filter((item) => item.decoded).length,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

// POST /api/files/copy-to-output — 把本地 input/output 文件复制到 output 子目录并按指定文件名命名
router.post('/copy-to-output', express.json({ limit: '2mb' }), async (req, res) => {
  try {
    const { url, filename, subdir, overwrite } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: '缺少 url' });
    }
    const src = resolveLocalFileUrl(url);
    if (!src || !fs.existsSync(src)) {
      return res.status(404).json({ success: false, error: '只支持已落地的本地 input/output 文件' });
    }

    const safeSubdir = sanitizeOutputPart(subdir || 'batch', 'batch');
    const targetDir = path.join(config.OUTPUT_DIR, safeSubdir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const safeName = ensureUniqueFile(targetDir, filename || path.basename(src), Boolean(overwrite));
    const target = path.join(targetDir, safeName);
    if (path.resolve(src) !== path.resolve(target) || Boolean(overwrite)) {
      fs.copyFileSync(src, target);
    }
    const stat = fs.statSync(target);
    return res.json({
      success: true,
      data: {
        filename: safeName,
        url: `/files/output/${safeSubdir}/${encodeURIComponent(safeName)}`,
        path: target,
        size: stat.size,
        exist: false,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

// POST /api/files/open-output-folder — 打开 output 子目录，方便批处理完成后直接查看结果
router.post('/open-output-folder', express.json({ limit: '64kb' }), async (req, res) => {
  try {
    const resolved = resolveOutputSubdir(req.body?.subdir || 'batch');
    if (!resolved) {
      return res.status(400).json({ success: false, error: '输出目录不合法' });
    }
    const { safeSubdir, targetDir } = resolved;
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const dryRun = Boolean(req.body?.dryRun) || process.env.JIAREN_LOCAL_OPEN_FOLDER_DRY_RUN === '1';
    if (!dryRun) await spawnOpenFolder(targetDir);
    return res.json({
      success: true,
      data: {
        subdir: safeSubdir,
        path: targetDir,
        url: `/files/output/${encodeURIComponent(safeSubdir)}`,
        opened: !dryRun,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

function resolveOpenLocalTarget(targetPath, selectFile = false) {
  const raw = String(targetPath || '').trim();
  if (!raw || !path.isAbsolute(raw)) {
    throw new Error('本地目录路径必须是绝对路径');
  }
  const resolved = path.resolve(raw);
  const stat = fs.statSync(resolved);
  const isFile = stat.isFile();
  return {
    path: isFile ? path.dirname(resolved) : resolved,
    targetPath: resolved,
    selectFile: Boolean(selectFile && isFile),
  };
}

// POST /api/files/open-local-path — 打开最近一次真实保存目录（用于原素材目录 sidecar）
router.post('/open-local-path', express.json({ limit: '64kb' }), async (req, res) => {
  try {
    const target = resolveOpenLocalTarget(req.body?.path || req.body?.targetPath, req.body?.selectFile === true);
    const dryRun = Boolean(req.body?.dryRun) || process.env.JIAREN_LOCAL_OPEN_FOLDER_DRY_RUN === '1';
    if (!dryRun) await spawnOpenFolder(target.path, target.selectFile ? { selectPath: target.targetPath } : {});
    return res.json({
      success: true,
      data: {
        path: target.path,
        targetPath: target.targetPath,
        selectFile: target.selectFile,
        opened: !dryRun,
      },
    });
  } catch (e) {
    return res.status(400).json({ success: false, error: e?.message || String(e) });
  }
});

// v1.2.10.2: 全局生成素材自动保存到本地路径
// POST /api/files/save-to-disk
//   body: { url: string, filename?: string, kind?: 'image'|'video'|'audio' }
//   url 支持:
//     - /files/output/xxx       → 从 OUTPUT_DIR 复制
//     - /files/input/xxx        → 从 INPUT_DIR 复制
//     - http(s)://...           → fetch 拉取后写入
//   读取当前 settings.fileSavePath, 不存在则 mkdir -p。
//   冲突防护: 同名文件已存在 → 跳过并返回 exist:true(不覆盖)。
router.post('/save-to-disk', express.json({ limit: '2mb' }), async (req, res) => {
  try {
    const { url, filename } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: '缺少 url' });
    }
    // 读取 settings
    let savePath = config.DEFAULT_LOCAL_SAVE_DIR;
    try {
      if (fs.existsSync(config.SETTINGS_FILE)) {
        const s = JSON.parse(fs.readFileSync(config.SETTINGS_FILE, 'utf-8'));
        if (typeof s?.fileSavePath === 'string' && s.fileSavePath.trim()) {
          savePath = s.fileSavePath.trim();
        }
      }
    } catch { /* ignore */ }
    if (!savePath) {
      return res.status(400).json({ success: false, error: '未配置 fileSavePath' });
    }
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }

    // 推断目标文件名
    const inferName = () => {
      if (filename && typeof filename === 'string') return filename.replace(/[\\\/:*?"<>|]/g, '_');
      try {
        const u = url.startsWith('http') ? new URL(url) : new URL(url, 'http://x');
        const base = path.basename(u.pathname || '') || `out_${Date.now()}`;
        return base.replace(/[\\\/:*?"<>|]/g, '_');
      } catch {
        return `out_${Date.now()}`;
      }
    };
    const target = path.join(savePath, inferName());

    // 已存在不覆盖 (防重复保存/面板多实例并发)
    if (fs.existsSync(target)) {
      return res.json({ success: true, data: { path: target, exist: true } });
    }

    // 本地 /files/output/* 或 /files/input/* → 直接 copyFile
    const localCopy = (srcAbs) => {
      if (!fs.existsSync(srcAbs)) {
        return res.status(404).json({ success: false, error: `源文件不存在: ${srcAbs}` });
      }
      fs.copyFileSync(srcAbs, target);
      return res.json({ success: true, data: { path: target, exist: false, source: 'copy' } });
    };
    if (url.startsWith('/files/output/')) {
      const rel = decodeURIComponent(url.replace('/files/output/', ''));
      return localCopy(path.join(config.OUTPUT_DIR, rel));
    }
    if (url.startsWith('/files/input/')) {
      const rel = decodeURIComponent(url.replace('/files/input/', ''));
      return localCopy(path.join(config.INPUT_DIR, rel));
    }

    // 远端 http(s) → fetch 拉取
    if (/^https?:\/\//i.test(url)) {
      try {
        const resp = await fetch(url);
        if (!resp.ok) {
          return res.status(502).json({ success: false, error: `拉取远端资源失败: HTTP ${resp.status}` });
        }
        const ab = await resp.arrayBuffer();
        fs.writeFileSync(target, Buffer.from(ab));
        return res.json({ success: true, data: { path: target, exist: false, source: 'fetch' } });
      } catch (e) {
        return res.status(502).json({ success: false, error: '拉取远端资源出错: ' + (e?.message || e) });
      }
    }

    return res.status(400).json({ success: false, error: '不支持的 url 协议' });
  } catch (e) {
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

module.exports = router;
module.exports.importLocalFile = importLocalFile;
module.exports.resolveOpenLocalTarget = resolveOpenLocalTarget;
module.exports.resolveOpenLocalDirectory = (targetPath) => resolveOpenLocalTarget(targetPath).path;
