const path = require('path');
const fs = require('fs');
const servicePackage = require('../package.json');

const IS_PACKAGED = process.env.JIAREN_LOCAL_PACKAGED === '1';
const PROJECT_DIR = path.resolve(__dirname, '..', '..');
const USER_DATA = String(process.env.JIAREN_LOCAL_USER_DATA || '').trim() || PROJECT_DIR;
const DATA_ROOT = IS_PACKAGED ? USER_DATA : PROJECT_DIR;
const DATA_DIR = path.join(DATA_ROOT, 'data');

const config = {
  HOST: process.env.HOST || '127.0.0.1',
  PORT: Number(process.env.PORT) || 18766,
  APP_VERSION: process.env.JIAREN_APP_VERSION || servicePackage.version,
  NODE_ENV: process.env.NODE_ENV || (IS_PACKAGED ? 'production' : 'development'),
  IS_PACKAGED,
  BASE_DIR: DATA_ROOT,
  DATA_DIR,
  INPUT_DIR: path.join(DATA_ROOT, 'input'),
  OUTPUT_DIR: path.join(DATA_ROOT, 'output'),
  THUMBNAILS_DIR: path.join(DATA_ROOT, 'thumbnails'),
  SETTINGS_FILE: path.join(DATA_DIR, 'local-settings.json'),
  FRONTEND_DIST: process.env.JIAREN_LOCAL_FRONTEND_DIST || (IS_PACKAGED ? '' : path.join(PROJECT_DIR, 'dist')),
  THUMBNAIL_SIZE: 160,
  THUMBNAIL_QUALITY: 80,
  MAX_FILE_SIZE: 0,
  DEFAULT_LOCAL_SAVE_DIR: path.join(DATA_ROOT, 'output'),
  DEFAULT_RESOURCE_LIBRARY_DIR: path.join(DATA_ROOT, 'resource-library'),
};

if (IS_PACKAGED) {
  for (const dir of [config.DATA_DIR, config.INPUT_DIR, config.OUTPUT_DIR, config.THUMBNAILS_DIR, config.DEFAULT_RESOURCE_LIBRARY_DIR]) {
    try { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); } catch {}
  }
}

module.exports = config;
