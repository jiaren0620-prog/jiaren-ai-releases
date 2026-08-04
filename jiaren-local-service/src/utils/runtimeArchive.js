'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const config = require('../config');

const RUNTIME_ARCHIVES = {
  'remove-ai-watermarks': {
    archiveFile: 'remove-ai-watermarks-runtime.zip',
    targetDir: 'remove-ai-watermarks',
    checks: [
      ['python', 'python.exe'],
      ['python.exe'],
      ['Scripts', 'remove-ai-watermarks.exe'],
      ['remove-ai-watermarks.exe'],
    ],
  },
  'parsehub-pythonlibs': {
    archiveFile: 'parsehub-pythonlibs.zip',
    targetDir: 'parsehub-pythonlibs',
    checks: [['parsehub'], ['parsehub', '__init__.py']],
  },
};

function resourcesRoot() {
  const envRoot = String(process.env.JIAREN_RESOURCES_ROOT || '').trim();
  return envRoot ? path.resolve(envRoot) : path.resolve(__dirname, '..', '..', '..');
}

function archiveRoot() {
  const envRoot = String(process.env.JIAREN_RUNTIME_ARCHIVES_DIR || '').trim();
  return envRoot ? path.resolve(envRoot) : path.join(resourcesRoot(), 'tools', 'runtime-archives');
}

function runtimeCacheRoot() {
  const envRoot = String(process.env.JIAREN_RUNTIME_CACHE_DIR || '').trim();
  return envRoot ? path.resolve(envRoot) : path.join(config.BASE_DIR, 'runtime-cache');
}

function specFor(id) {
  const spec = RUNTIME_ARCHIVES[id];
  if (!spec) throw new Error(`Unknown runtime archive: ${id}`);
  return spec;
}

function archivePathFor(id) {
  return path.join(archiveRoot(), specFor(id).archiveFile);
}

function targetPathFor(id) {
  return path.join(runtimeCacheRoot(), specFor(id).targetDir);
}

function markerPathFor(id) {
  return path.join(targetPathFor(id), '.jiaren-runtime-ready.json');
}

function statFile(filePath) {
  try { return fs.statSync(filePath); } catch { return null; }
}

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return null; }
}

function hasRequiredFile(id, targetPath = targetPathFor(id)) {
  return specFor(id).checks.some((parts) => fs.existsSync(path.join(targetPath, ...parts)));
}

function markerMatches(id, archiveStat) {
  const marker = readJson(markerPathFor(id));
  if (!marker || marker.runtime !== id) return false;
  if (!archiveStat) return hasRequiredFile(id);
  return Number(marker.archiveSize || 0) === Number(archiveStat.size || 0)
    && Number(marker.archiveMtimeMs || 0) === Number(archiveStat.mtimeMs || 0);
}

function isRuntimeReady(id) {
  const archiveStat = statFile(archivePathFor(id));
  return fs.existsSync(targetPathFor(id)) && hasRequiredFile(id) && markerMatches(id, archiveStat);
}

function getRuntimeArchiveInfo(id) {
  const spec = specFor(id);
  const archivePath = archivePathFor(id);
  const targetPath = targetPathFor(id);
  const archiveStat = statFile(archivePath);
  return {
    id,
    archiveFile: spec.archiveFile,
    archivePath,
    targetPath,
    archiveExists: Boolean(archiveStat),
    archiveSize: archiveStat?.size || 0,
    archiveMtimeMs: archiveStat?.mtimeMs || 0,
    ready: isRuntimeReady(id),
  };
}

function isInside(parent, child) {
  const root = path.resolve(parent);
  const target = path.resolve(child);
  return target === root || target.startsWith(`${root}${path.sep}`);
}

function extractZip(archivePath, destination) {
  const tar = spawnSync('tar', ['-xf', archivePath, '-C', destination], {
    encoding: 'utf8', windowsHide: true,
  });
  if (!tar.error && tar.status === 0) return;
  const ps = spawnSync('powershell.exe', [
    '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command',
    'Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force',
    archivePath, destination,
  ], { encoding: 'utf8', windowsHide: true });
  if (!ps.error && ps.status === 0) return;
  throw new Error(`运行时组件解压失败：${ps.stderr || tar.stderr || '未知错误'}`);
}

function ensureRuntimeArchiveExtracted(id) {
  const spec = specFor(id);
  const info = getRuntimeArchiveInfo(id);
  if (info.ready) return { ...info, extracted: false, available: true };
  if (!info.archiveExists) return { ...info, extracted: false, available: false };

  const cacheRoot = runtimeCacheRoot();
  const targetPath = targetPathFor(id);
  const tempPath = path.join(cacheRoot, `.${spec.targetDir}.extracting-${process.pid}-${Date.now()}`);
  if (!isInside(cacheRoot, targetPath) || !isInside(cacheRoot, tempPath)) {
    throw new Error('运行时缓存目录异常，已中止解压。');
  }
  fs.mkdirSync(cacheRoot, { recursive: true });
  fs.rmSync(tempPath, { recursive: true, force: true });
  fs.mkdirSync(tempPath, { recursive: true });
  try {
    extractZip(info.archivePath, tempPath);
    if (!hasRequiredFile(id, tempPath)) throw new Error(`运行时组件不完整：${info.archiveFile}`);
    fs.rmSync(targetPath, { recursive: true, force: true });
    fs.renameSync(tempPath, targetPath);
    const archiveStat = statFile(info.archivePath);
    fs.writeFileSync(markerPathFor(id), JSON.stringify({
      runtime: id,
      archiveFile: path.basename(info.archivePath),
      archiveSize: archiveStat?.size || 0,
      archiveMtimeMs: archiveStat?.mtimeMs || 0,
      extractedAt: new Date().toISOString(),
    }, null, 2), 'utf8');
  } catch (error) {
    fs.rmSync(tempPath, { recursive: true, force: true });
    throw error;
  }
  return { ...getRuntimeArchiveInfo(id), extracted: true, available: true };
}

function getRuntimeCachePath(id) {
  return targetPathFor(id);
}

module.exports = {
  RUNTIME_ARCHIVES,
  ensureRuntimeArchiveExtracted,
  getRuntimeArchiveInfo,
  getRuntimeCachePath,
  hasRequiredFile,
  isRuntimeReady,
};
