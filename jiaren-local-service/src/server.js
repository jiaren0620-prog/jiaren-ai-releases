const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('./config');

const app = express();
const LOCAL_ORIGIN_RE = /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/;
const LOCAL_AUTH_TOKEN = String(process.env.JIAREN_LOCAL_AUTH_TOKEN || '').trim();
const LOCAL_AUTH_COOKIE = 'jiaren_local_token';

function readCookie(request, name) {
  const header = String(request.headers.cookie || '');
  const item = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : '';
}

function tokenMatches(left, right) {
  if (!left || !right) return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function requireLocalAuth(request, response, next) {
  if (!config.IS_PACKAGED || !LOCAL_AUTH_TOKEN) return next();
  const queryToken = typeof request.query?.jiaren_token === 'string' ? request.query.jiaren_token : '';
  const cookieToken = readCookie(request, LOCAL_AUTH_COOKIE);
  if (tokenMatches(queryToken, LOCAL_AUTH_TOKEN)) {
    response.setHeader('Set-Cookie', `${LOCAL_AUTH_COOKIE}=${encodeURIComponent(LOCAL_AUTH_TOKEN)}; HttpOnly; SameSite=Strict; Path=/`);
    return next();
  }
  if (tokenMatches(cookieToken, LOCAL_AUTH_TOKEN)) return next();
  return response.status(401).json({ ok: false, message: 'Jiaren 本地服务未授权。' });
}

app.use(cors({ origin(origin, cb) { cb(null, !origin || LOCAL_ORIGIN_RE.test(origin)); } }));
app.use(express.json({ limit: '120mb' }));
app.use(express.urlencoded({ extended: true, limit: '120mb' }));
app.use(requireLocalAuth);

for (const dir of [config.DATA_DIR, config.INPUT_DIR, config.OUTPUT_DIR, config.THUMBNAILS_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

app.use('/files/output', express.static(config.OUTPUT_DIR));
app.use('/files/input', express.static(config.INPUT_DIR));
app.use('/files/thumbnails', express.static(config.THUMBNAILS_DIR));
app.use('/output', express.static(config.OUTPUT_DIR));
app.use('/input', express.static(config.INPUT_DIR));

app.get('/api/status', (_req, res) => res.json({
  ok: true,
  service: 'jiaren-local-service',
  version: config.APP_VERSION,
  port: config.PORT,
  time: new Date().toISOString(),
}));

app.use('/api/files', require('./routes/files'));
app.use('/api/image', require('./routes/imageOps'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/ai-watermark', require('./routes/aiWatermark'));
app.use('/api/anime-tags', require('./routes/animeTags'));
app.use('/api/parsehub', require('./routes/parseHub'));
app.use('/api/topaz', require('./routes/topaz'));
app.use('/api/batch-tags', require('./routes/batchTags'));
app.use('/api/web-assets', require('./routes/webAssets'));
app.use('/api/codex-cli', require('./routes/codexCli'));

if (config.IS_PACKAGED && config.FRONTEND_DIST && fs.existsSync(config.FRONTEND_DIST)) {
  app.use(express.static(config.FRONTEND_DIST));
  app.get(/^\/(?!api\/|files\/|input\/|output\/).*/, (_req, res) => {
    res.sendFile(path.join(config.FRONTEND_DIST, 'index.html'));
  });
}

app.listen(config.PORT, config.HOST, () => {
  console.log(`JiarenAI local service ready at http://${config.HOST}:${config.PORT}`);
});

module.exports = app;
