const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('../utils/optionalSharp');
const config = require('../config');
const { isLoopbackAddress, isPrivateAddress, safeRemoteMediaFetch } = require('../utils/safeRemoteMediaFetch');

const router = express.Router();
const BRIDGE_TOKEN = crypto.randomBytes(24).toString('hex');
const MAX_ITEMS = 50;
const MAX_ITEM_BYTES = 30 * 1024 * 1024;
const MAX_BATCH_BYTES = 300 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 30_000;
const ALLOWED_FORMATS = new Map([
  ['png', { ext: '.png', mime: 'image/png' }],
  ['jpeg', { ext: '.jpg', mime: 'image/jpeg' }],
  ['webp', { ext: '.webp', mime: 'image/webp' }],
  ['gif', { ext: '.gif', mime: 'image/gif' }],
  ['avif', { ext: '.avif', mime: 'image/avif' }],
  ['heif', { ext: '.avif', mime: 'image/avif' }],
  ['bmp', { ext: '.bmp', mime: 'image/bmp' }],
]);

function requestIsLocal(req) {
  return isLoopbackAddress(req.socket?.remoteAddress || req.ip);
}

function requireBridgeToken(req, res, next) {
  if (!requestIsLocal(req)) {
    return res.status(403).json({ success: false, code: 'local_only', error: '网页素材导入只允许本机扩展访问。' });
  }
  const provided = String(req.get('x-jiaren-web-assets-token') || '');
  if (provided.length !== BRIDGE_TOKEN.length || !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(BRIDGE_TOKEN))) {
    return res.status(401).json({ success: false, code: 'invalid_bridge_token', error: '网页素材导入令牌无效，请重新连接 JiarenAI。' });
  }
  return next();
}

function decodeDataUrl(value) {
  const match = String(value || '').match(/^data:([^;,]+);base64,([a-z0-9+/=\r\n]+)$/i);
  if (!match) throw Object.assign(new Error('图片 data URL 格式无效。'), { code: 'invalid_data_url' });
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > MAX_ITEM_BYTES) throw Object.assign(new Error('图片超过单项 30MB 限制。'), { code: 'item_too_large' });
  return { buffer, contentType: match[1] };
}

function cleanFilename(value) {
  return path.basename(String(value || 'web-image')).replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'web-image';
}

async function validateImage(buffer) {
  const metadata = await sharp(buffer, { animated: true, limitInputPixels: 200_000_000 }).metadata();
  const format = ALLOWED_FORMATS.get(String(metadata.format || '').toLowerCase());
  if (!format) throw Object.assign(new Error('只支持 PNG、JPEG、WebP、GIF、AVIF 和 BMP 图片。'), { code: 'unsupported_image' });
  if (!metadata.width || !metadata.height) throw Object.assign(new Error('图片无法解码。'), { code: 'invalid_image' });
  return { ...format, width: metadata.width, height: metadata.height };
}

async function importOneAsset(item) {
  const raw = item && typeof item === 'object' ? item : {};
  const sourceUrl = String(raw.url || raw.imageUrl || '').trim();
  const loaded = raw.dataUrl ? decodeDataUrl(raw.dataUrl) : await safeRemoteMediaFetch(sourceUrl, {
    maxBytes: MAX_ITEM_BYTES,
    timeoutMs: FETCH_TIMEOUT_MS,
    accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif,image/bmp;q=0.9,*/*;q=0.1',
    userAgent: 'JiarenAI-WebAssets/1.0',
  });
  const image = await validateImage(loaded.buffer);
  const hash = crypto.createHash('sha256').update(loaded.buffer).digest('hex');
  const base = cleanFilename(raw.name || (() => {
    try { return path.basename(new URL(sourceUrl).pathname); } catch { return 'web-image'; }
  })());
  const stem = path.basename(base, path.extname(base)).slice(0, 56) || 'web-image';
  const nonce = crypto.randomBytes(3).toString('hex');
  const filename = `web_${Date.now()}_${hash.slice(0, 12)}_${nonce}_${stem}${image.ext}`;
  fs.mkdirSync(config.INPUT_DIR, { recursive: true });
  const target = path.join(config.INPUT_DIR, filename);
  if (!fs.existsSync(target)) fs.writeFileSync(target, loaded.buffer, { flag: 'wx' });
  return {
    filename,
    name: base,
    url: `/files/input/${filename}`,
    size: loaded.buffer.length,
    mime: image.mime,
    width: image.width,
    height: image.height,
    hash,
    sourceUrl: sourceUrl.slice(0, 4096),
    pageUrl: String(raw.pageUrl || '').slice(0, 2048),
  };
}

router.get('/status', (req, res) => {
  if (!requestIsLocal(req)) return res.status(403).json({ success: false, code: 'local_only' });
  return res.json({ success: true, data: { token: BRIDGE_TOKEN, maxItems: MAX_ITEMS, maxItemBytes: MAX_ITEM_BYTES, maxBatchBytes: MAX_BATCH_BYTES } });
});

router.post('/import', requireBridgeToken, async (req, res) => {
  const assets = Array.isArray(req.body?.assets) ? req.body.assets.slice(0, MAX_ITEMS) : [];
  if (!assets.length) return res.status(400).json({ success: false, code: 'empty_assets', error: '没有收到要导入的图片。' });
  if (Array.isArray(req.body?.assets) && req.body.assets.length > MAX_ITEMS) {
    return res.status(400).json({ success: false, code: 'too_many_assets', error: `单批最多导入 ${MAX_ITEMS} 张图片。` });
  }

  const items = [];
  const failures = [];
  const byHash = new Map();
  let totalBytes = 0;
  for (let index = 0; index < assets.length; index += 1) {
    try {
      const imported = await importOneAsset(assets[index]);
      totalBytes += imported.size;
      if (totalBytes > MAX_BATCH_BYTES) {
        try { fs.unlinkSync(path.join(config.INPUT_DIR, imported.filename)); } catch {}
        throw Object.assign(new Error('本批图片总大小超过 300MB 限制。'), { code: 'batch_too_large' });
      }
      const duplicate = byHash.get(imported.hash);
      if (duplicate) {
        try { fs.unlinkSync(path.join(config.INPUT_DIR, imported.filename)); } catch {}
        items.push({ ...duplicate, duplicate: true, sourceUrl: imported.sourceUrl, pageUrl: imported.pageUrl });
      } else {
        byHash.set(imported.hash, imported);
        items.push(imported);
      }
    } catch (error) {
      failures.push({ index, name: cleanFilename(assets[index]?.name), code: error?.code || 'import_failed', error: error?.message || String(error) });
    }
  }

  return res.status(items.length ? 200 : 400).json({
    success: items.length > 0,
    code: failures.length ? 'partial_success' : 'completed',
    error: items.length ? undefined : (failures[0]?.error || '网页素材导入失败。'),
    data: { items, failures, totalBytes },
  });
});

router._test = {
  isPrivateAddress,
  isLoopbackAddress,
  validateImage,
};

module.exports = router;
