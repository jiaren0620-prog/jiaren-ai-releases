'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('../utils/optionalSharp');
const config = require('../config');
const { safeRemoteMediaFetch } = require('../utils/safeRemoteMediaFetch');

const router = express.Router();

const KINDS = new Set(['image', 'video', 'audio', 'panorama', 'set', 'pose', 'workflow']);
const ADD_RESOURCE_KINDS = new Set(['image', 'video', 'audio', 'panorama']);
const MATERIAL_SET_KINDS = new Set(['text', 'image', 'video', 'audio']);
const DB_FILE = 'resource_library.json';
const THUMB_DIR = '_thumbs';
const REMOTE_FETCH_TIMEOUT_MS = 30_000;
const REMOTE_MAX_BYTES = 512 * 1024 * 1024;

const DEFAULT_CATEGORY_NAMES = {
  image: ['未分类', '角色', '场景', '风格参考', '成品'],
  video: ['未分类', '镜头', '动作', '成片'],
  audio: ['未分类', '音乐', '人声', '音效'],
  panorama: ['未分类', '室内', '室外', '自然', '城市', '奇幻'],
  set: ['未分类', '图像集', '视频集', '音频集', '文本集'],
  pose: ['未分类', '常用姿势', '动作参考', '分镜姿势'],
  workflow: ['未分类', '常用工作流', '图像流程', '视频流程', '工具链'],
};

const MIME_BY_EXT = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
  avif: 'image/avif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  m4v: 'video/x-m4v',
  mkv: 'video/x-matroska',
  avi: 'video/x-msvideo',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
  flac: 'audio/flac',
  aac: 'audio/aac',
  json: 'application/json',
};

function now() {
  return Date.now();
}

function genId(prefix) {
  return `${prefix}_${now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function safeText(value, fallback = '') {
  return String(value || fallback).trim().slice(0, 200);
}

function safeFilename(value, fallback = 'asset') {
  const cleaned = String(value || fallback)
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120);
  return cleaned || fallback;
}

function normalizeKind(kind) {
  const k = String(kind || '').toLowerCase();
  return KINDS.has(k) ? k : '';
}

function normalizeMaterialSetKind(kind) {
  const k = String(kind || '').toLowerCase();
  return MATERIAL_SET_KINDS.has(k) ? k : '';
}

function normalizeExt(ext) {
  return String(ext || '')
    .trim()
    .toLowerCase()
    .replace(/^\./, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 10);
}

function kindFromExt(ext) {
  const e = normalizeExt(ext);
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'avif'].includes(e)) return 'image';
  if (['mp4', 'webm', 'mov', 'm4v', 'mkv', 'avi'].includes(e)) return 'video';
  if (['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(e)) return 'audio';
  return '';
}

function normalizeSetItems(rawItems, fallbackKind) {
  const kind = normalizeMaterialSetKind(fallbackKind);
  if (!kind || !Array.isArray(rawItems)) return [];
  return rawItems
    .map((raw, index) => {
      const itemKind = normalizeMaterialSetKind(raw?.kind) || kind;
      if (itemKind !== kind) return null;
      const value = kind === 'text' ? safeText(raw?.text || raw?.url, '') : safeText(raw?.url || raw?.fileRel, '');
      const fileRel = kind === 'text' ? '' : safeText(raw?.fileRel, '');
      if (kind === 'text' && !value) return null;
      if (kind !== 'text' && !value && !fileRel) return null;
      return {
        id: safeText(raw?.id, `set_item_${index + 1}`).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 96) || `set_item_${index + 1}`,
        kind,
        ...(kind === 'text' ? { text: value } : { fileRel, url: value }),
        name: safeText(raw?.name, kind === 'text' ? value.slice(0, 24) : path.basename(fileRel || value)),
        size: Number(raw?.size) || 0,
        mime: safeText(raw?.mime, kind === 'text' ? 'text/plain' : mimeFromExt(path.extname(fileRel || value))),
      };
    })
    .filter(Boolean)
    .slice(0, 500);
}

function normalizePoseBackupForResource(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('缺少姿势大师配置');
  }
  const raw = JSON.parse(JSON.stringify(value));
  if (raw.schema !== 'jiaren-pose-master') {
    throw new Error('不是有效的姿势大师配置');
  }
  raw.schema = 'jiaren-pose-master';
  raw.version = Number(raw.version) || 1;
  raw.pointVersion = Number(raw.pointVersion) || 1;
  raw.name = safeText(raw.name, '');
  raw.prompt = typeof raw.prompt === 'string' ? raw.prompt.slice(0, 20_000) : '';
  raw.createdAt = Number(raw.createdAt) || now();
  return raw;
}

function workflowNodeLabel(node) {
  const data = node && typeof node.data === 'object' ? node.data : {};
  return safeText(data.label || data.title || data.name || data.displayName || node.type, node.type || 'node').slice(0, 18);
}

function normalizeWorkflowCoordinate(value, min, max, low, high) {
  const n = Number(value);
  if (!Number.isFinite(n)) return (low + high) / 2;
  if (max <= min) return (low + high) / 2;
  return low + ((n - min) / (max - min)) * (high - low);
}

function createWorkflowTopologyPreview(nodes, edges) {
  const previewNodes = Array.isArray(nodes) ? nodes.slice(0, 16) : [];
  if (previewNodes.length === 0) return { nodes: [], edges: [] };
  const nodeIds = new Set(previewNodes.map((node) => node.id));
  const xs = previewNodes.map((node) => Number(node?.position?.x) || 0);
  const ys = previewNodes.map((node) => Number(node?.position?.y) || 0);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    nodes: previewNodes.map((node) => ({
      id: safeText(node.id),
      type: safeText(node.type || 'node'),
      label: workflowNodeLabel(node),
      x: Math.round(normalizeWorkflowCoordinate(node?.position?.x, minX, maxX, 8, 92) * 10) / 10,
      y: Math.round(normalizeWorkflowCoordinate(node?.position?.y, minY, maxY, 12, 88) * 10) / 10,
    })),
    edges: (Array.isArray(edges) ? edges : [])
      .filter((edge) => nodeIds.has(edge?.source) && nodeIds.has(edge?.target))
      .slice(0, 24)
      .map((edge) => ({
        source: safeText(edge.source),
        target: safeText(edge.target),
      })),
  };
}

function normalizeWorkflowTopologyPreview(value) {
  const raw = value && typeof value === 'object' ? value : null;
  if (!raw || !Array.isArray(raw.nodes) || !Array.isArray(raw.edges)) return null;
  const nodes = raw.nodes
    .filter((node) => node && typeof node === 'object' && safeText(node.id))
    .slice(0, 16)
    .map((node) => ({
      id: safeText(node.id),
      type: safeText(node.type || 'node'),
      label: safeText(node.label || node.type || 'node').slice(0, 18),
      x: Math.min(100, Math.max(0, Number(node.x) || 50)),
      y: Math.min(100, Math.max(0, Number(node.y) || 50)),
    }));
  const ids = new Set(nodes.map((node) => node.id));
  const edges = raw.edges
    .filter((edge) => edge && typeof edge === 'object' && ids.has(edge.source) && ids.has(edge.target))
    .slice(0, 24)
    .map((edge) => ({ source: safeText(edge.source), target: safeText(edge.target) }));
  return { nodes, edges };
}

function normalizeWorkflowBackupForResource(value, title = '') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('缺少工作流配置');
  }
  const raw = JSON.parse(JSON.stringify(value));
  const manifest = raw.schema === 'jiaren-workflow-fragment' ? raw : raw.workflowFragment;
  if (!manifest || typeof manifest !== 'object' || manifest.schema !== 'jiaren-workflow-fragment') {
    throw new Error('不是有效的工作流配置');
  }
  const nodes = Array.isArray(manifest.nodes)
    ? manifest.nodes
        .filter((node) => node && typeof node === 'object' && typeof node.id === 'string' && node.id.trim())
        .slice(0, 500)
        .map((node) => ({
          ...node,
          selected: false,
          dragging: false,
          resizing: undefined,
          positionAbsolute: undefined,
          measured: undefined,
        }))
    : [];
  if (nodes.length === 0) {
    throw new Error('工作流至少需要 1 个节点');
  }
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = Array.isArray(manifest.edges)
    ? manifest.edges
        .filter((edge) => (
          edge &&
          typeof edge === 'object' &&
          typeof edge.id === 'string' &&
          nodeIds.has(edge.source) &&
          nodeIds.has(edge.target)
        ))
        .slice(0, 1000)
        .map((edge) => ({ ...edge, selected: false }))
    : [];
  const nodeTypes = [...new Set(nodes.map((node) => safeText(node.type || 'node')).filter(Boolean))].slice(0, 24);
  const topologyPreview = normalizeWorkflowTopologyPreview(manifest.topologyPreview) || createWorkflowTopologyPreview(nodes, edges);
  return {
    schema: 'jiaren-workflow-fragment',
    version: 1,
    title: safeText(title || manifest.title, '未命名工作流'),
    sourceCanvasId: safeText(manifest.sourceCanvasId, ''),
    nodes,
    edges,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodeTypes,
    topologyPreview,
    savedAt: safeText(manifest.savedAt, new Date().toISOString()),
  };
}

function extFromMime(mime) {
  const m = String(mime || '').toLowerCase().split(';')[0].trim();
  const pair = Object.entries(MIME_BY_EXT).find(([, v]) => v === m);
  if (!pair) return '';
  return pair[0] === 'jpeg' ? 'jpg' : pair[0];
}

function mimeFromExt(ext) {
  return MIME_BY_EXT[normalizeExt(ext)] || 'application/octet-stream';
}

function readSettings() {
  try {
    if (!fs.existsSync(config.SETTINGS_FILE)) return {};
    return JSON.parse(fs.readFileSync(config.SETTINGS_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function getLibraryRoot() {
  const settings = readSettings();
  const root = String(settings.resourceLibraryPath || config.DEFAULT_RESOURCE_LIBRARY_DIR || '').trim();
  if (!root) throw new Error('未配置 resourceLibraryPath');
  fs.mkdirSync(root, { recursive: true });
  for (const kind of KINDS) fs.mkdirSync(path.join(root, kind), { recursive: true });
  fs.mkdirSync(path.join(root, THUMB_DIR), { recursive: true });
  return root;
}

function defaultCategories() {
  const out = [];
  for (const kind of KINDS) {
    const names = DEFAULT_CATEGORY_NAMES[kind] || ['未分类'];
    names.forEach((name, idx) => {
      out.push({
        id: idx === 0 ? `${kind}_uncategorized` : `${kind}_${idx}_${name}`,
        kind,
        name,
        order: idx,
        system: idx === 0,
        createdAt: 0,
      });
    });
  }
  return out;
}

function isLegacyPanoramaCategoryName(name) {
  const n = safeText(name).toLowerCase().replace(/\s+/g, '');
  return n === '3d全景' || n === '全景' || n === 'vr全景' || n === '720全景';
}

function isLegacyPanoramaImageItem(item, legacyCategoryIds) {
  const categoryId = safeText(item?.categoryId);
  if (legacyCategoryIds.has(categoryId)) return true;
  const title = safeText(item?.title || item?.originalName).toLowerCase();
  if (/3d全景|全景贴图|720vr|panorama/.test(title)) return true;
  const tags = Array.isArray(item?.tags)
    ? item.tags.map((tag) => safeText(tag).toLowerCase().replace(/\s+/g, ''))
    : [];
  return tags.some((tag) => ['3d全景', '全景', 'panorama', 'vr', '720vr'].includes(tag));
}

function normalizeDb(raw) {
  const db = raw && typeof raw === 'object' ? raw : {};
  const defaults = defaultCategories();
  const categories = Array.isArray(db.categories) ? db.categories : [];
  const items = Array.isArray(db.items) ? db.items : [];
  const catMap = new Map();

  const normalizeCategory = (c, fallbackOrder = catMap.size) => {
    const kind = normalizeKind(c?.kind);
    const name = safeText(c?.name);
    if (!kind || !name) return null;
    const id = safeText(c?.id, genId('rescat')).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 96) || genId('rescat');
    return {
      id,
      kind,
      name,
      order: Number.isFinite(Number(c?.order)) ? Number(c.order) : fallbackOrder,
      system: !!c?.system || id.endsWith('_uncategorized'),
      createdAt: Number(c?.createdAt) || now(),
    };
  };

  for (const c of defaults) {
    const normalized = normalizeCategory(c);
    if (!normalized || catMap.has(normalized.id)) continue;
    catMap.set(normalized.id, normalized);
  }

  for (const c of categories) {
    const normalized = normalizeCategory(c);
    if (!normalized) continue;
    const existing = catMap.get(normalized.id);
    if (existing) {
      if (existing.kind !== normalized.kind) continue;
      catMap.set(normalized.id, {
        ...existing,
        name: normalized.name,
        order: Number.isFinite(Number(c?.order)) ? normalized.order : existing.order,
        system: existing.system || normalized.system,
        createdAt: normalized.createdAt || existing.createdAt,
      });
      continue;
    }
    catMap.set(normalized.id, normalized);
  }

  const normalizedCategories = Array.from(catMap.values())
    .sort((a, b) => a.kind.localeCompare(b.kind) || (a.order || 0) - (b.order || 0))
    .map((c, idx) => ({ ...c, order: Number.isFinite(Number(c.order)) ? c.order : idx }));
  const categoryKindById = new Map(normalizedCategories.map((c) => [c.id, c.kind]));
  const legacyPanoramaCategoryIds = new Set(
    normalizedCategories
      .filter((c) => c.kind === 'image' && isLegacyPanoramaCategoryName(c.name))
      .map((c) => c.id),
  );
  const normalizedItems = [];
  const seen = new Set();

  for (const item of items) {
    let kind = normalizeKind(item?.kind);
    if (kind === 'image' && isLegacyPanoramaImageItem(item, legacyPanoramaCategoryIds)) {
      kind = 'panorama';
    }
    const id = safeText(item?.id, genId('res')).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 96) || genId('res');
    if (!kind || seen.has(id)) continue;
    const fileRel = safeText(item?.fileRel);
    if (!fileRel) continue;
    const materialSetKind = kind === 'set' ? normalizeMaterialSetKind(item?.materialSetKind) : '';
    const materialSetItems = kind === 'set' ? normalizeSetItems(item?.materialSetItems, materialSetKind) : [];
    if (kind === 'set' && (!materialSetKind || materialSetItems.length === 0)) continue;
    const workflowNodeCount = kind === 'workflow' ? Math.max(0, Number(item?.workflowNodeCount) || Number(item?.nodeCount) || 0) : 0;
    const workflowEdgeCount = kind === 'workflow' ? Math.max(0, Number(item?.workflowEdgeCount) || Number(item?.edgeCount) || 0) : 0;
    const workflowNodeTypes = kind === 'workflow' && Array.isArray(item?.workflowNodeTypes)
      ? item.workflowNodeTypes.map((t) => safeText(t)).filter(Boolean).slice(0, 24)
      : [];
    const workflowPreview = kind === 'workflow' ? normalizeWorkflowTopologyPreview(item?.workflowPreview) : null;
    seen.add(id);
    const fallbackCat = `${kind}_uncategorized`;
    const requestedCategoryId = safeText(item?.categoryId);
    const categoryId = categoryKindById.get(requestedCategoryId) === kind ? requestedCategoryId : fallbackCat;
    normalizedItems.push({
      id,
      kind,
      categoryId,
      title: safeText(item?.title, item?.originalName || id),
      originalName: safeText(item?.originalName, ''),
      fileRel,
      thumbRel: safeText(item?.thumbRel, ''),
      mime: safeText(item?.mime, mimeFromExt(path.extname(fileRel))),
      size: Number(item?.size) || 0,
      width: Math.max(0, Math.round(Number(item?.width) || 0)),
      height: Math.max(0, Math.round(Number(item?.height) || 0)),
      sha256: safeText(item?.sha256, ''),
      tags: Array.isArray(item?.tags) ? item.tags.map((t) => safeText(t)).filter(Boolean).slice(0, 20) : [],
      favorite: !!item?.favorite,
      sourceUrl: safeText(item?.sourceUrl, ''),
      sourceNodeId: safeText(item?.sourceNodeId, ''),
      sourceCanvasId: safeText(item?.sourceCanvasId, ''),
      materialSetKind,
      materialSetItems,
      workflowNodeCount,
      workflowEdgeCount,
      workflowNodeTypes,
      workflowPreview,
      createdAt: Number(item?.createdAt) || now(),
      updatedAt: Number(item?.updatedAt) || Number(item?.createdAt) || now(),
      lastUsedAt: Number(item?.lastUsedAt) || 0,
    });
  }

  const usedCategoryIds = new Set(normalizedItems.map((item) => item.categoryId));
  const finalCategories = normalizedCategories.filter((cat) => (
    !(cat.kind === 'image' && legacyPanoramaCategoryIds.has(cat.id) && !usedCategoryIds.has(cat.id))
  ));

  return {
    schema: 'jiaren-resource-library',
    version: 1,
    updatedAt: safeText(db.updatedAt, new Date().toISOString()),
    categories: finalCategories,
    items: normalizedItems,
  };
}

function readDb() {
  const root = getLibraryRoot();
  const file = path.join(root, DB_FILE);
  let raw = null;
  try {
    if (fs.existsSync(file)) raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    raw = null;
  }
  const db = normalizeDb(raw);
  if (!fs.existsSync(file) || JSON.stringify(raw || {}) !== JSON.stringify(db)) {
    writeDb(root, db);
  }
  return { root, db };
}

function writeDb(root, db) {
  db.updatedAt = new Date().toISOString();
  const file = path.join(root, DB_FILE);
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tmp, file);
}

function assertInside(root, target) {
  const r = path.resolve(root);
  const t = path.resolve(target);
  if (t !== r && !t.startsWith(r + path.sep)) throw new Error('非法资源路径');
  return t;
}

function toLocalPathnameIfSameApp(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host === '127.0.0.1' || host === 'localhost' || host === '::1') {
      return decodeURIComponent(u.pathname || '');
    }
  } catch {
    // Relative URLs stay on the normal path below.
  }
  return url;
}

function decorateSetItem(parentId, raw, index) {
  const kind = normalizeMaterialSetKind(raw?.kind);
  if (kind === 'text') {
    return {
      id: raw.id || `set_item_${index + 1}`,
      kind,
      text: raw.text || '',
      name: raw.name || `文本 ${index + 1}`,
      size: raw.size || 0,
      mime: raw.mime || 'text/plain',
    };
  }
  return {
    id: raw.id || `set_item_${index + 1}`,
    kind,
    url: `/api/resources/set-file/${encodeURIComponent(parentId)}/${index}`,
    name: raw.name || `素材 ${index + 1}`,
    size: raw.size || 0,
    mime: raw.mime || '',
  };
}

function decorateItem(item) {
  if (item.kind === 'set') {
    return {
      ...item,
      fileUrl: `/api/resources/set/${encodeURIComponent(item.id)}`,
      thumbUrl: item.thumbRel ? `/api/resources/thumb/${encodeURIComponent(item.id)}` : '',
      materialSetItems: (item.materialSetItems || []).map((x, index) => decorateSetItem(item.id, x, index)),
    };
  }
  return {
    ...item,
    fileUrl: `/api/resources/file/${encodeURIComponent(item.id)}`,
    thumbUrl: item.thumbRel ? `/api/resources/thumb/${encodeURIComponent(item.id)}` : '',
  };
}

function decorateItems(items) {
  return items.map(decorateItem);
}

function findItem(db, id) {
  return db.items.find((x) => x.id === id);
}

function resolveLocalSource(url, root, db) {
  const clean = toLocalPathnameIfSameApp(String(url || '')).split(/[?#]/)[0];
  const decodeTail = (prefix) => decodeURIComponent(clean.slice(prefix.length)).replace(/^[/\\]+/, '');
  if (clean.startsWith('/files/output/')) {
    const rel = decodeTail('/files/output/');
    const fp = assertInside(config.OUTPUT_DIR, path.join(config.OUTPUT_DIR, rel));
    return { filePath: fp, originalName: path.basename(rel) };
  }
  if (clean.startsWith('/files/input/')) {
    const rel = decodeTail('/files/input/');
    const fp = assertInside(config.INPUT_DIR, path.join(config.INPUT_DIR, rel));
    return { filePath: fp, originalName: path.basename(rel) };
  }
  const m = /^\/api\/resources\/file\/([^/?#]+)/.exec(clean);
  if (m) {
    const item = findItem(db, decodeURIComponent(m[1]));
    if (!item) throw new Error('资源库源文件不存在');
    return {
      filePath: assertInside(root, path.join(root, item.fileRel)),
      originalName: item.originalName || path.basename(item.fileRel),
      mime: item.mime,
    };
  }
  const sm = /^\/api\/resources\/set-file\/([^/?#]+)\/(\d+)/.exec(clean);
  if (sm) {
    const item = findItem(db, decodeURIComponent(sm[1]));
    const index = Number(sm[2]);
    const child = item?.kind === 'set' && Array.isArray(item.materialSetItems) ? item.materialSetItems[index] : null;
    if (!child?.fileRel) throw new Error('素材集源文件不存在');
    return {
      filePath: assertInside(root, path.join(root, child.fileRel)),
      originalName: child.name || path.basename(child.fileRel),
      mime: child.mime,
    };
  }
  return null;
}

async function readSource(url, root, db) {
  const local = resolveLocalSource(url, root, db);
  if (local) {
    if (!fs.existsSync(local.filePath)) throw new Error('源文件不存在');
    return {
      buffer: fs.readFileSync(local.filePath),
      originalName: local.originalName,
      mime: local.mime || mimeFromExt(path.extname(local.originalName)),
    };
  }

  if (/^https?:\/\//i.test(url)) {
    const remote = await safeRemoteMediaFetch(url, {
      maxBytes: REMOTE_MAX_BYTES,
      timeoutMs: REMOTE_FETCH_TIMEOUT_MS,
      userAgent: 'JiarenAI-ResourceLibrary/1.0',
    });
    const u = new URL(remote.finalUrl || url);
    const originalName = decodeURIComponent(path.basename(u.pathname || 'remote_asset')) || 'remote_asset';
    return {
      buffer: remote.buffer,
      originalName,
      mime: remote.contentType || mimeFromExt(path.extname(originalName)),
    };
  }

  throw new Error('不支持的资源 URL');
}

async function makeImageThumb(buffer, root, id) {
  const rel = path.join(THUMB_DIR, `${id}.webp`);
  const target = path.join(root, rel);
  try {
    await sharp(buffer, { limitInputPixels: false })
      .rotate()
      .resize({ width: 420, height: 420, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(target);
    return rel.replace(/\\/g, '/');
  } catch {
    return '';
  }
}

async function readImageSize(buffer) {
  try {
    const meta = await sharp(buffer, { limitInputPixels: false }).rotate().metadata();
    return {
      width: Math.max(0, Math.round(Number(meta.width) || 0)),
      height: Math.max(0, Math.round(Number(meta.height) || 0)),
    };
  } catch {
    return { width: 0, height: 0 };
  }
}

function serveFile(req, res, filePath, mime) {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: '文件不存在' });
  }
  const stat = fs.statSync(filePath);
  const range = req.headers.range;
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', mime || 'application/octet-stream');
  if (!range) {
    res.setHeader('Content-Length', stat.size);
    return fs.createReadStream(filePath).pipe(res);
  }
  const m = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!m) {
    res.setHeader('Content-Length', stat.size);
    return fs.createReadStream(filePath).pipe(res);
  }
  const start = m[1] ? Number(m[1]) : 0;
  const end = m[2] ? Number(m[2]) : stat.size - 1;
  if (start >= stat.size || end >= stat.size || start > end) {
    res.status(416).setHeader('Content-Range', `bytes */${stat.size}`);
    return res.end();
  }
  res.status(206);
  res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
  res.setHeader('Content-Length', end - start + 1);
  return fs.createReadStream(filePath, { start, end }).pipe(res);
}

router.get('/categories', (_req, res) => {
  try {
    const { db } = readDb();
    const kind = normalizeKind(_req.query.kind);
    const list = db.categories
      .filter((c) => !kind || c.kind === kind)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, data: list });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.post('/categories', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const kind = normalizeKind(req.body?.kind);
    const name = safeText(req.body?.name);
    if (!kind || !name) return res.status(400).json({ success: false, error: '缺少分类类型或名称' });
    const { root, db } = readDb();
    const order = db.categories.filter((c) => c.kind === kind).length;
    const item = { id: genId('rescat'), kind, name, order, system: false, createdAt: now() };
    db.categories.push(item);
    writeDb(root, db);
    res.json({ success: true, data: item });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.put('/categories/:id', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const name = safeText(req.body?.name);
    if (!name) return res.status(400).json({ success: false, error: '缺少分类名称' });
    const { root, db } = readDb();
    const item = db.categories.find((c) => c.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, error: '分类不存在' });
    item.name = name;
    writeDb(root, db);
    res.json({ success: true, data: item });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.delete('/categories/:id', (req, res) => {
  try {
    const { root, db } = readDb();
    const item = db.categories.find((c) => c.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, error: '分类不存在' });
    if (item.system) return res.status(400).json({ success: false, error: '默认分类不能删除' });
    const fallback = `${item.kind}_uncategorized`;
    db.items.forEach((it) => {
      if (it.categoryId === item.id) it.categoryId = fallback;
    });
    db.categories = db.categories.filter((c) => c.id !== item.id);
    writeDb(root, db);
    res.json({ success: true, data: { movedTo: fallback } });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.get('/items', (req, res) => {
  try {
    const { db } = readDb();
    const kind = normalizeKind(req.query.kind);
    const categoryId = safeText(req.query.categoryId);
    const q = safeText(req.query.q).toLowerCase();
    const favorite = String(req.query.favorite || '') === '1';
    let list = db.items.slice();
    if (kind) list = list.filter((item) => item.kind === kind);
    if (categoryId && categoryId !== 'all') list = list.filter((item) => item.categoryId === categoryId);
    if (favorite) list = list.filter((item) => item.favorite);
    if (q) {
      list = list.filter((item) => {
        const hay = [item.title, item.originalName, item.tags.join(' '), item.mime].join(' ').toLowerCase();
        return hay.includes(q);
      });
    }
    list.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
    res.json({ success: true, data: decorateItems(list) });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.post('/items/add', express.json({ limit: '4mb' }), async (req, res) => {
  try {
    const url = safeText(req.body?.url, '');
    if (!url) return res.status(400).json({ success: false, error: '缺少 url' });
    const { root, db } = readDb();
    const src = await readSource(url, root, db);
    const ext = normalizeExt(path.extname(src.originalName)) || extFromMime(src.mime) || 'bin';
    const detectedKind = kindFromExt(ext) || kindFromExt(extFromMime(src.mime));
    const kind = normalizeKind(req.body?.kind) || detectedKind;
    if (!kind || !ADD_RESOURCE_KINDS.has(kind)) {
      return res.status(400).json({ success: false, error: '资源类型仅支持图像 / 视频 / 音频 / 全景' });
    }
    if (kind === 'panorama' && detectedKind !== 'image') {
      return res.status(400).json({ success: false, error: '全景资源只能保存图像文件' });
    }
    if (kind !== 'panorama' && detectedKind && detectedKind !== kind) {
      return res.status(400).json({ success: false, error: `素材类型不匹配：需要 ${kind}` });
    }
    const sha256 = crypto.createHash('sha256').update(src.buffer).digest('hex');
    const existing = db.items.find((item) => item.kind === kind && item.sha256 === sha256);
    const requestedCat = safeText(req.body?.categoryId);
    const categoryOk = db.categories.some((c) => c.id === requestedCat && c.kind === kind);
    if (existing) {
      if (categoryOk) existing.categoryId = requestedCat;
      existing.updatedAt = now();
      existing.lastUsedAt = now();
      writeDb(root, db);
      return res.json({ success: true, duplicate: true, data: decorateItem(existing) });
    }

    const id = genId('res');
    const safeOriginal = safeFilename(src.originalName, `${kind}.${ext}`);
    const fileRel = path.join(kind, `${id}.${ext}`).replace(/\\/g, '/');
    const target = assertInside(root, path.join(root, fileRel));
    fs.writeFileSync(target, src.buffer);
    const thumbRel = kind === 'image' || kind === 'panorama' ? await makeImageThumb(src.buffer, root, id) : '';
    const imageSize = kind === 'image' || kind === 'panorama' ? await readImageSize(src.buffer) : { width: 0, height: 0 };
    const fallbackCat = `${kind}_uncategorized`;
    const item = {
      id,
      kind,
      categoryId: categoryOk ? requestedCat : fallbackCat,
      title: safeText(req.body?.title, path.parse(safeOriginal).name),
      originalName: safeOriginal,
      fileRel,
      thumbRel,
      mime: safeText(src.mime, mimeFromExt(ext)),
      size: src.buffer.length,
      width: imageSize.width,
      height: imageSize.height,
      sha256,
      tags: Array.isArray(req.body?.tags) ? req.body.tags.map((t) => safeText(t)).filter(Boolean).slice(0, 20) : [],
      favorite: !!req.body?.favorite,
      sourceUrl: url,
      sourceNodeId: safeText(req.body?.sourceNodeId),
      sourceCanvasId: safeText(req.body?.sourceCanvasId),
      createdAt: now(),
      updatedAt: now(),
      lastUsedAt: 0,
    };
    db.items.push(item);
    writeDb(root, db);
    res.json({ success: true, duplicate: false, data: decorateItem(item) });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.post('/sets/add', express.json({ limit: '8mb' }), async (req, res) => {
  try {
    const materialSetKind = normalizeMaterialSetKind(req.body?.materialSetKind);
    const rawItems = Array.isArray(req.body?.materialSetItems) ? req.body.materialSetItems : [];
    if (!materialSetKind || rawItems.length === 0) {
      return res.status(400).json({ success: false, error: '缺少素材集类型或素材' });
    }

    const { root, db } = readDb();
    const staged = [];
    const hash = crypto.createHash('sha256');
    hash.update(`set:${materialSetKind}\n`);
    let totalSize = 0;

    for (const raw of rawItems.slice(0, 500)) {
      if (materialSetKind === 'text') {
        const text = String(raw?.text ?? raw?.url ?? '').trim();
        if (!text) continue;
        const buf = Buffer.from(text, 'utf-8');
        hash.update(buf);
        totalSize += buf.length;
        staged.push({
          kind: 'text',
          text,
          name: safeText(raw?.name, text.slice(0, 24)),
          size: buf.length,
          mime: 'text/plain',
        });
        continue;
      }

      const url = String(raw?.url || '').trim();
      if (!url) continue;
      const src = await readSource(url, root, db);
      const ext = normalizeExt(path.extname(src.originalName)) || extFromMime(src.mime) || 'bin';
      const detected = kindFromExt(ext) || kindFromExt(extFromMime(src.mime));
      if (detected !== materialSetKind) {
        return res.status(400).json({ success: false, error: `素材类型不匹配：需要 ${materialSetKind}` });
      }
      hash.update(src.buffer);
      totalSize += src.buffer.length;
      staged.push({
        kind: materialSetKind,
        buffer: src.buffer,
        originalName: src.originalName,
        name: safeText(raw?.name, path.parse(src.originalName).name),
        size: src.buffer.length,
        mime: safeText(src.mime, mimeFromExt(ext)),
        ext,
      });
    }

    if (staged.length === 0) return res.status(400).json({ success: false, error: '素材集为空' });

    const sha256 = hash.digest('hex');
    const requestedCat = safeText(req.body?.categoryId);
    const categoryOk = db.categories.some((c) => c.id === requestedCat && c.kind === 'set');
    const existing = db.items.find((item) => item.kind === 'set' && item.sha256 === sha256);
    if (existing) {
      if (categoryOk) existing.categoryId = requestedCat;
      existing.updatedAt = now();
      existing.lastUsedAt = now();
      writeDb(root, db);
      return res.json({ success: true, duplicate: true, data: decorateItem(existing) });
    }

    const id = genId('resset');
    const setDirRel = path.join('sets', id).replace(/\\/g, '/');
    const setDir = assertInside(root, path.join(root, setDirRel));
    fs.mkdirSync(setDir, { recursive: true });

    let thumbRel = '';
    const materialSetItems = [];
    for (let i = 0; i < staged.length; i += 1) {
      const item = staged[i];
      if (item.kind === 'text') {
        materialSetItems.push({
          id: `${id}_${i + 1}`,
          kind: 'text',
          text: item.text,
          name: item.name || `文本 ${i + 1}`,
          size: item.size,
          mime: 'text/plain',
        });
        continue;
      }

      const safeOriginal = safeFilename(item.originalName, `${materialSetKind}_${i + 1}.${item.ext}`);
      const finalName = path.extname(safeOriginal) ? safeOriginal : `${safeOriginal}.${item.ext}`;
      const rel = path.join(setDirRel, `${String(i + 1).padStart(3, '0')}_${finalName}`).replace(/\\/g, '/');
      const target = assertInside(root, path.join(root, rel));
      fs.writeFileSync(target, item.buffer);
      if (!thumbRel && materialSetKind === 'image') {
        thumbRel = await makeImageThumb(item.buffer, root, id);
      }
      materialSetItems.push({
        id: `${id}_${i + 1}`,
        kind: materialSetKind,
        fileRel: rel,
        name: item.name || path.parse(finalName).name,
        size: item.size,
        mime: item.mime,
      });
    }

    const safeTitle = safeText(req.body?.title, `${materialSetKind} 素材集`);
    const fileRel = path.join(setDirRel, 'material-set.json').replace(/\\/g, '/');
    const setManifest = {
      schema: 'jiaren-material-set',
      version: 1,
      title: safeTitle,
      materialSetKind,
      materialSetItems,
      exportedAt: new Date().toISOString(),
    };
    fs.writeFileSync(assertInside(root, path.join(root, fileRel)), JSON.stringify(setManifest, null, 2), 'utf-8');

    const item = {
      id,
      kind: 'set',
      categoryId: categoryOk ? requestedCat : 'set_uncategorized',
      title: safeTitle,
      originalName: `${safeFilename(safeTitle, 'material-set')}.json`,
      fileRel,
      thumbRel,
      mime: 'application/json',
      size: totalSize,
      sha256,
      tags: Array.isArray(req.body?.tags) ? req.body.tags.map((t) => safeText(t)).filter(Boolean).slice(0, 20) : [],
      favorite: !!req.body?.favorite,
      sourceUrl: '',
      sourceNodeId: safeText(req.body?.sourceNodeId),
      sourceCanvasId: safeText(req.body?.sourceCanvasId),
      materialSetKind,
      materialSetItems,
      createdAt: now(),
      updatedAt: now(),
      lastUsedAt: 0,
    };
    db.items.push(item);
    writeDb(root, db);
    res.json({ success: true, duplicate: false, data: decorateItem(item) });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.post('/poses/add', express.json({ limit: '3mb' }), async (req, res) => {
  try {
    const poseBackup = normalizePoseBackupForResource(req.body?.poseBackup);
    const { root, db } = readDb();
    const safeTitle = safeText(req.body?.title, poseBackup.name || '姿势大师配置');
    const manifest = {
      schema: 'jiaren-pose-master-resource',
      version: 1,
      title: safeTitle,
      poseBackup,
      exportedAt: new Date().toISOString(),
    };
    const buffer = Buffer.from(JSON.stringify(manifest, null, 2), 'utf-8');
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const requestedCat = safeText(req.body?.categoryId);
    const categoryOk = db.categories.some((c) => c.id === requestedCat && c.kind === 'pose');
    const existing = db.items.find((item) => item.kind === 'pose' && item.sha256 === sha256);
    if (existing) {
      if (categoryOk) existing.categoryId = requestedCat;
      existing.updatedAt = now();
      existing.lastUsedAt = now();
      writeDb(root, db);
      return res.json({ success: true, duplicate: true, data: decorateItem(existing) });
    }

    const id = genId('respose');
    const fileRel = path.join('pose', `${id}.pose.json`).replace(/\\/g, '/');
    const target = assertInside(root, path.join(root, fileRel));
    fs.writeFileSync(target, buffer);

    const item = {
      id,
      kind: 'pose',
      categoryId: categoryOk ? requestedCat : 'pose_uncategorized',
      title: safeTitle,
      originalName: `${safeFilename(safeTitle, 'pose-master')}.pose.json`,
      fileRel,
      thumbRel: '',
      mime: 'application/json',
      size: buffer.length,
      sha256,
      tags: Array.isArray(req.body?.tags) ? req.body.tags.map((t) => safeText(t)).filter(Boolean).slice(0, 20) : [],
      favorite: !!req.body?.favorite,
      sourceUrl: '',
      sourceNodeId: safeText(req.body?.sourceNodeId),
      sourceCanvasId: safeText(req.body?.sourceCanvasId),
      materialSetKind: '',
      materialSetItems: [],
      createdAt: now(),
      updatedAt: now(),
      lastUsedAt: 0,
    };
    db.items.push(item);
    writeDb(root, db);
    res.json({ success: true, duplicate: false, data: decorateItem(item) });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.post('/workflows/add', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const workflowFragment = normalizeWorkflowBackupForResource(req.body?.workflowFragment, req.body?.title);
    const { root, db } = readDb();
    const safeTitle = safeText(req.body?.title, workflowFragment.title || '工作流');
    const manifest = {
      ...workflowFragment,
      title: safeTitle,
      savedAt: new Date().toISOString(),
    };
    const buffer = Buffer.from(JSON.stringify(manifest, null, 2), 'utf-8');
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const requestedCat = safeText(req.body?.categoryId);
    const categoryOk = db.categories.some((c) => c.id === requestedCat && c.kind === 'workflow');
    const existing = db.items.find((item) => item.kind === 'workflow' && item.sha256 === sha256);
    if (existing) {
      if (categoryOk) existing.categoryId = requestedCat;
      existing.workflowNodeCount = manifest.nodeCount;
      existing.workflowEdgeCount = manifest.edgeCount;
      existing.workflowNodeTypes = manifest.nodeTypes;
      existing.workflowPreview = manifest.topologyPreview;
      existing.updatedAt = now();
      existing.lastUsedAt = now();
      writeDb(root, db);
      return res.json({ success: true, duplicate: true, data: decorateItem(existing) });
    }

    const id = genId('reswf');
    const fileRel = path.join('workflow', `${id}.workflow.json`).replace(/\\/g, '/');
    const target = assertInside(root, path.join(root, fileRel));
    fs.writeFileSync(target, buffer);

    const item = {
      id,
      kind: 'workflow',
      categoryId: categoryOk ? requestedCat : 'workflow_uncategorized',
      title: safeTitle,
      originalName: `${safeFilename(safeTitle, 'workflow')}.workflow.json`,
      fileRel,
      thumbRel: '',
      mime: 'application/json',
      size: buffer.length,
      sha256,
      tags: Array.isArray(req.body?.tags) ? req.body.tags.map((t) => safeText(t)).filter(Boolean).slice(0, 20) : [],
      favorite: !!req.body?.favorite,
      sourceUrl: '',
      sourceNodeId: safeText(req.body?.sourceNodeId),
      sourceCanvasId: safeText(req.body?.sourceCanvasId || manifest.sourceCanvasId),
      materialSetKind: '',
      materialSetItems: [],
      workflowNodeCount: manifest.nodeCount,
      workflowEdgeCount: manifest.edgeCount,
      workflowNodeTypes: manifest.nodeTypes,
      workflowPreview: manifest.topologyPreview,
      createdAt: now(),
      updatedAt: now(),
      lastUsedAt: 0,
    };
    db.items.push(item);
    writeDb(root, db);
    res.json({ success: true, duplicate: false, data: decorateItem(item) });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.put('/items/:id', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const { root, db } = readDb();
    const item = findItem(db, req.params.id);
    if (!item) return res.status(404).json({ success: false, error: '资源不存在' });
    if (typeof req.body?.title === 'string') item.title = safeText(req.body.title, item.title);
    if (typeof req.body?.favorite !== 'undefined') item.favorite = !!req.body.favorite;
    if (Array.isArray(req.body?.tags)) item.tags = req.body.tags.map((t) => safeText(t)).filter(Boolean).slice(0, 20);
    const categoryId = safeText(req.body?.categoryId);
    if (categoryId && db.categories.some((c) => c.id === categoryId && c.kind === item.kind)) item.categoryId = categoryId;
    item.updatedAt = now();
    if (req.body?.touch) item.lastUsedAt = now();
    writeDb(root, db);
    res.json({ success: true, data: decorateItem(item) });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.delete('/items/:id', (req, res) => {
  try {
    const { root, db } = readDb();
    const item = findItem(db, req.params.id);
    if (!item) return res.status(404).json({ success: false, error: '资源不存在' });
    for (const rel of [item.fileRel, item.thumbRel]) {
      if (!rel) continue;
      try {
        const fp = assertInside(root, path.join(root, rel));
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
      } catch { /* ignore file cleanup */ }
    }
    if (item.kind === 'set' && Array.isArray(item.materialSetItems)) {
      for (const child of item.materialSetItems) {
        if (!child?.fileRel) continue;
        try {
          const fp = assertInside(root, path.join(root, child.fileRel));
          if (fs.existsSync(fp)) fs.unlinkSync(fp);
        } catch { /* ignore set file cleanup */ }
      }
      try {
        const dir = assertInside(root, path.join(root, 'sets', item.id));
        if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
      } catch { /* ignore set dir cleanup */ }
    }
    db.items = db.items.filter((x) => x.id !== item.id);
    writeDb(root, db);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.get('/set/:id', (req, res) => {
  try {
    const { root, db } = readDb();
    const item = findItem(db, req.params.id);
    if (!item || item.kind !== 'set') return res.status(404).json({ success: false, error: '素材集不存在' });
    const fp = assertInside(root, path.join(root, item.fileRel));
    return serveFile(req, res, fp, 'application/json');
  } catch (e) {
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.get('/set-file/:id/:index', (req, res) => {
  try {
    const { root, db } = readDb();
    const item = findItem(db, req.params.id);
    if (!item || item.kind !== 'set') return res.status(404).json({ success: false, error: '素材集不存在' });
    const index = Number(req.params.index);
    const child = Array.isArray(item.materialSetItems) ? item.materialSetItems[index] : null;
    if (!child || !child.fileRel) return res.status(404).json({ success: false, error: '素材不存在' });
    const fp = assertInside(root, path.join(root, child.fileRel));
    return serveFile(req, res, fp, child.mime || mimeFromExt(path.extname(fp)));
  } catch (e) {
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.get('/file/:id', (req, res) => {
  try {
    const { root, db } = readDb();
    const item = findItem(db, req.params.id);
    if (!item) return res.status(404).json({ success: false, error: '资源不存在' });
    const fp = assertInside(root, path.join(root, item.fileRel));
    return serveFile(req, res, fp, item.mime || mimeFromExt(path.extname(fp)));
  } catch (e) {
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

router.get('/thumb/:id', (req, res) => {
  try {
    const { root, db } = readDb();
    const item = findItem(db, req.params.id);
    if (!item) return res.status(404).json({ success: false, error: '资源不存在' });
    const rel = item.thumbRel || item.fileRel;
    const fp = assertInside(root, path.join(root, rel));
    return serveFile(req, res, fp, item.thumbRel ? 'image/webp' : item.mime || mimeFromExt(path.extname(fp)));
  } catch (e) {
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
});

module.exports = router;
