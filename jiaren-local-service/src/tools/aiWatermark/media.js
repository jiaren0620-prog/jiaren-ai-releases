'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../../config');

const RESOURCE_DB_FILE = 'resource_library.json';
const REMOTE_FETCH_TIMEOUT_MS = 30_000;
const REMOTE_MAX_BYTES = 512 * 1024 * 1024;

const MIME_BY_EXT = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.avif': 'image/avif',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.jxl': 'image/jxl',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.m4v': 'video/mp4',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.opus': 'audio/opus',
  '.mka': 'audio/x-matroska',
  '.m4a': 'audio/mp4',
  '.flac': 'audio/flac',
  '.aac': 'audio/aac',
};

const EXT_BY_MIME = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/bmp': '.bmp',
  'image/avif': '.avif',
  'image/heic': '.heic',
  'image/heif': '.heif',
  'image/jxl': '.jxl',
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
  'video/webm': '.webm',
  'video/x-matroska': '.mkv',
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/ogg': '.ogg',
  'audio/opus': '.opus',
  'audio/x-matroska': '.mka',
  'audio/mp4': '.m4a',
  'audio/flac': '.flac',
  'audio/aac': '.aac',
};

function randomSuffix() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function assertInside(root, target) {
  const base = path.resolve(root);
  const resolved = path.resolve(target);
  if (resolved !== base && !resolved.startsWith(base + path.sep)) return '';
  return resolved;
}

function decodeTail(value) {
  try {
    return decodeURIComponent(String(value || '').replace(/^[/\\]+/, ''));
  } catch {
    return String(value || '').replace(/^[/\\]+/, '');
  }
}

function toLocalPathnameIfSameApp(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host === '127.0.0.1' || host === 'localhost' || host === '::1') {
      return decodeURIComponent(u.pathname || '');
    }
  } catch {
    // Relative URL, keep normal path.
  }
  return url;
}

function mimeFromPath(filePath, fallback = 'application/octet-stream') {
  return MIME_BY_EXT[path.extname(String(filePath || '')).toLowerCase()] || fallback;
}

function extFromMime(mime, fallback = '.bin') {
  return EXT_BY_MIME[String(mime || '').toLowerCase()] || fallback;
}

function kindFromExt(ext) {
  const normalized = String(ext || '').toLowerCase().replace(/^\./, '');
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'avif', 'heic', 'heif', 'jxl'].includes(normalized)) return 'image';
  if (['mp4', 'webm', 'mov', 'm4v', 'mkv', 'avi'].includes(normalized)) return 'video';
  if (['mp3', 'wav', 'ogg', 'oga', 'opus', 'm4a', 'flac', 'aac', 'mka'].includes(normalized)) return 'audio';
  return '';
}

function kindFromPath(filePath) {
  return kindFromExt(path.extname(String(filePath || '')));
}

function getResourceLibraryRoot() {
  try {
    let settings = {};
    if (fs.existsSync(config.SETTINGS_FILE)) {
      settings = JSON.parse(fs.readFileSync(config.SETTINGS_FILE, 'utf-8'));
    }
    return String(settings.resourceLibraryPath || config.DEFAULT_RESOURCE_LIBRARY_DIR || '').trim();
  } catch {
    return '';
  }
}

function readResourceDb(root) {
  try {
    const file = path.join(root, RESOURCE_DB_FILE);
    if (!fs.existsSync(file)) return null;
    const db = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return Array.isArray(db?.items) ? db : null;
  } catch {
    return null;
  }
}

function filePathFromFileUrl(value) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'file:') return '';
    let p = decodeURIComponent(parsed.pathname || '');
    if (process.platform === 'win32' && /^\/[A-Za-z]:\//.test(p)) p = p.slice(1);
    return p;
  } catch {
    return '';
  }
}

function resolveDirectLocalPath(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (text.startsWith('file://')) return filePathFromFileUrl(text);
  if (path.isAbsolute(text)) return text;
  return '';
}

function resolveResourceLocalPath(cleanPath) {
  const root = getResourceLibraryRoot();
  if (!root) return '';
  const db = readResourceDb(root);
  const items = Array.isArray(db?.items) ? db.items : [];

  const fileMatch = /^\/api\/resources\/file\/([^/?#]+)/.exec(cleanPath);
  if (fileMatch) {
    const id = decodeTail(fileMatch[1]);
    const item = items.find((x) => x?.id === id);
    if (item?.fileRel) return assertInside(root, path.join(root, item.fileRel));
  }

  const setMatch = /^\/api\/resources\/set-file\/([^/?#]+)\/(\d+)/.exec(cleanPath);
  if (setMatch) {
    const id = decodeTail(setMatch[1]);
    const index = Number(setMatch[2]);
    const item = items.find((x) => x?.id === id);
    const child = item?.kind === 'set' && Array.isArray(item.materialSetItems)
      ? item.materialSetItems[index]
      : null;
    if (child?.fileRel) return assertInside(root, path.join(root, child.fileRel));
  }

  return '';
}

function resolveJiarenLocalPath(value) {
  const clean = toLocalPathnameIfSameApp(value).split(/[?#]/)[0];
  const rules = [
    ['/files/output/', config.OUTPUT_DIR],
    ['/output/', config.OUTPUT_DIR],
    ['/files/input/', config.INPUT_DIR],
    ['/input/', config.INPUT_DIR],
  ];
  for (const [prefix, root] of rules) {
    if (clean.startsWith(prefix)) {
      return assertInside(root, path.join(root, decodeTail(clean.slice(prefix.length))));
    }
  }
  if (clean.startsWith('/api/resources/')) return resolveResourceLocalPath(clean);
  return '';
}

function parseDataUrl(value) {
  const match = String(value || '').match(/^data:([^;,]+);base64,(.+)$/i);
  if (!match) return null;
  return {
    mime: match[1],
    base64: match[2],
  };
}

async function writeDataUrlToInput(value) {
  const parsed = parseDataUrl(value);
  if (!parsed) throw new Error('dataURL 格式无效');
  const ext = extFromMime(parsed.mime, '.bin');
  const filename = `aiwm_input_${randomSuffix()}${ext}`;
  const filePath = path.join(config.INPUT_DIR, filename);
  fs.mkdirSync(config.INPUT_DIR, { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(parsed.base64, 'base64'));
  return {
    path: filePath,
    kind: kindFromPath(filePath),
    mime: parsed.mime,
    source: 'data-url',
  };
}

async function downloadRemoteToInput(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REMOTE_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`远端素材下载失败: HTTP ${res.status}`);
    const length = Number(res.headers.get('content-length') || 0);
    if (length > REMOTE_MAX_BYTES) throw new Error('远端素材超过 512MB 限制');
    const mime = String(res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    const urlExt = path.extname(new URL(url).pathname || '');
    const ext = urlExt || extFromMime(mime, '.bin');
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > REMOTE_MAX_BYTES) throw new Error('远端素材超过 512MB 限制');
    const filename = `aiwm_remote_${randomSuffix()}${ext}`;
    const filePath = path.join(config.INPUT_DIR, filename);
    fs.mkdirSync(config.INPUT_DIR, { recursive: true });
    fs.writeFileSync(filePath, buf);
    return {
      path: filePath,
      kind: kindFromPath(filePath),
      mime: mime || mimeFromPath(filePath),
      source: 'remote-url',
    };
  } finally {
    clearTimeout(timer);
  }
}

async function resolveAiWatermarkMediaRef(value) {
  const text = String(value || '').trim();
  if (!text) throw new Error('缺少输入素材');

  if (/^data:[^;,]+;base64,/i.test(text)) return writeDataUrlToInput(text);
  if (/^https?:\/\//i.test(text)) return downloadRemoteToInput(text);

  const jiarenPath = resolveJiarenLocalPath(text);
  const localPath = jiarenPath || resolveDirectLocalPath(text);
  if (localPath && fs.existsSync(localPath)) {
    return {
      path: localPath,
      kind: kindFromPath(localPath),
      mime: mimeFromPath(localPath),
      source: jiarenPath ? 'jiaren-local' : 'local-path',
    };
  }

  throw new Error(`无法解析输入素材：${text.slice(0, 160)}`);
}

function createAiWatermarkOutputPath(sourcePath, label = 'clean', extOverride = '') {
  const sourceExt = path.extname(String(sourcePath || ''));
  const ext = extOverride || sourceExt || '.png';
  const safeLabel = String(label || 'clean').replace(/[^a-z0-9_-]/gi, '_').slice(0, 40) || 'clean';
  const filename = `aiwm_${safeLabel}_${randomSuffix()}${ext}`;
  fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
  return path.join(config.OUTPUT_DIR, filename);
}

function outputUrlFromPath(filePath) {
  const resolved = assertInside(config.OUTPUT_DIR, filePath);
  if (!resolved) throw new Error('输出文件不在 output 目录内');
  return `/files/output/${encodeURIComponent(path.basename(resolved))}`;
}

module.exports = {
  createAiWatermarkOutputPath,
  kindFromExt,
  kindFromPath,
  mimeFromPath,
  outputUrlFromPath,
  resolveAiWatermarkMediaRef,
};
