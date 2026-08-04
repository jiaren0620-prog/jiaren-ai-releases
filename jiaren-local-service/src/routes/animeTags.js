/**
 * Anime tag online gallery proxy.
 *
 * The front-end Anime Tag Master node lazy-loads reference previews from
 * Danbooru / Gelbooru. Direct browser requests are unreliable because both
 * sites can apply CORS, hotlink, or auth rules, so this route keeps the node
 * same-origin while mirroring the lightweight behavior from comfyui-anima-t8.
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const router = express.Router();

const USER_AGENT = 'JiarenAI AnimeTagMaster/3.0';
const GELBOORU_BASE = 'https://gelbooru.com';
const DANBOORU_BASE = 'https://danbooru.donmai.us';
const IMAGE_HOSTS = new Set(['cdn.donmai.us', 'danbooru.donmai.us', 'gelbooru.com']);
const CATEGORY_LABELS = {
  artist: '画师 / Artist',
  copyright: '作品 IP / Copyright',
  character: '角色 IP / Character',
  general: '通用标签 / General',
  meta: '风格 · Meta',
};
const DANBOORU_CATEGORY_TO_CODE = { general: 0, artist: 1, copyright: 3, character: 4, meta: 5 };
const DANBOORU_CODE_TO_CATEGORY = { 0: 'general', 1: 'artist', 3: 'copyright', 4: 'character', 5: 'meta' };
const GELBOORU_CATEGORY_TO_CODE = { general: 0, artist: 1, copyright: 3, character: 4 };
const GELBOORU_CODE_TO_CATEGORY = { 0: 'general', 1: 'artist', 3: 'copyright', 4: 'character' };
const GELBOORU_TEXT_TO_CATEGORY = {
  tag: 'general',
  general: 'general',
  metadata: 'general',
  meta: 'general',
  artist: 'artist',
  copyright: 'copyright',
  character: 'character',
};
const GELBOORU_AUTOCOMPLETE_FALLBACK_TERMS = {
  general: [
    '1girl', 'solo', 'long_hair', 'blue_eyes', 'blush', 'smile', 'absurdres', 'highres',
    'breasts', 'short_hair', 'looking_at_viewer', 'bangs', 'skirt', 'dress', 'school_uniform',
  ],
  artist: [
    'tony', 'tony_taka', 'kantoku', 'as109', 'ask', 'ask_(askzy)', 'redjuice', 'wlop',
    'hiten', 'hiten_(hitenkei)', 'ciloranko', 'mignon', 'rurudo', 'neco', 'lack',
    'saitom', 'toridamono', 'yoneyama_mai', 'fuzichoco', 'piromizu', 'momoko_(momopoco)',
    'tiv', 'raemz', 'yd_(orange_maru)',
  ],
  copyright: [
    'pokemon', 'genshin_impact', 'fate', 'azur_lane', 'touhou', 'blue_archive', 'kantai_collection',
    'naruto', 'hololive', 'vocaloid', 'original', 'the_idolmaster', 'love_live!', 'granblue_fantasy',
    'girls_frontline', 'fire_emblem', 'uma_musume', 'honkai', 'arknights', 'sword_art_online',
  ],
  character: [
    'hatsune_miku', 'hatsune', 'saber', 'rem', 'frieren', 'asuna', 'z23', '2b_(nier:automata)',
    'raiden_shogun', 'hakurei_reimu', 'kirisame_marisa', 'megumin', 'lumine_(genshin_impact)',
    'astolfo_(fate)', 'hk416', 'morrigan_aensland', 'kasumi_(doa)', 'houshou_marine',
  ],
};
const GELBOORU_BROWSE_EXTRA_TERMS = ['0', 'a', 'b', 'c', 'd', 'e', 'g', 'h', 'k', 'm', 'n', 'r', 's', 't', 'y'];
const TAG_TOTAL_CACHE = new Map();
const TAG_TOTAL_CACHE_MS = 10 * 60 * 1000;
const TEXT_FETCH_CACHE = new Map();
const GELBOORU_TAG_SEARCH_CACHE = new Map();
const GELBOORU_PREVIEW_CACHE = new Map();
const CACHE_MAX_ENTRIES = 512;
const FETCH_TEXT_CACHE_MS = 5 * 60 * 1000;
const GELBOORU_TAG_CACHE_MS = 8 * 60 * 1000;
const GELBOORU_PREVIEW_CACHE_MS = 15 * 60 * 1000;
const FETCH_RETRY_DELAYS_MS = [650, 1800];
const FETCH_TIMEOUT_MS = 12000;

function clampInt(value, min, max, fallback) {
  const n = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function withSafeTag(query, safe) {
  const text = String(query || '').trim() || '1girl';
  if (!safe) return text;
  return /\brating:/i.test(text) ? text : `${text} rating:general`;
}

function normalizePreviewQuery(value) {
  const first = String(value || '')
    .trim()
    .replace(/^@+/, '')
    .replace(/^artist:/i, '')
    .replace(/(^|\s)\([^)]*\)/g, ' ')
    .split(/[,\n，、]/)
    .map((item) => item.trim())
    .find(Boolean) || '';
  return first
    .replace(/:[0-9.]+$/g, '')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '') || '1girl';
}

function normalizeBooruTagQuery(value) {
  const first = String(value || '')
    .trim()
    .replace(/^@+/, '')
    .replace(/^artist:/i, '')
    .split(/[,\n，、]/)
    .map((item) => item.trim())
    .find(Boolean) || '';
  return first
    .replace(/:[0-9.]+$/g, '')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function normalizeProvider(value) {
  const provider = String(value || 'danbooru').trim().toLowerCase();
  if (provider === 'gelbooru' || provider === 'galbooru' || provider === 'gel') return 'gelbooru';
  if (provider === 'danbooru' || provider === 'dan') return 'danbooru';
  return provider;
}

function normalizeOnlineCategory(value) {
  const category = String(value || 'general-meta').trim().toLowerCase();
  if (['artist', 'copyright', 'character', 'general', 'meta', 'general-meta'].includes(category)) return category;
  return 'general-meta';
}

function resolveOnlineCategory(provider, category) {
  const normalizedProvider = normalizeProvider(provider);
  const normalizedCategory = normalizeOnlineCategory(category);
  if (normalizedCategory === 'general-meta') return normalizedProvider === 'danbooru' ? 'meta' : 'general';
  if (normalizedProvider === 'gelbooru' && normalizedCategory === 'meta') return 'general';
  return normalizedCategory;
}

function categoryName(category) {
  return CATEGORY_LABELS[category] || CATEGORY_LABELS.general;
}

function resolveGelbooruTagCategory(tag, fallbackCategory = 'general') {
  const fallback = resolveOnlineCategory('gelbooru', fallbackCategory);
  const candidates = [tag?.category, tag?.type, tag?.categoryName];
  for (const value of candidates) {
    const text = String(value ?? '').trim().toLowerCase();
    if (!text) continue;
    if (GELBOORU_TEXT_TO_CATEGORY[text]) return GELBOORU_TEXT_TO_CATEGORY[text];
    if (text === 'deprecated') return 'deprecated';
    const code = Number.parseInt(text, 10);
    if (GELBOORU_CODE_TO_CATEGORY[code]) return GELBOORU_CODE_TO_CATEGORY[code];
  }
  return fallback;
}

function buildGelbooruAutocompleteTerms(category, { query, letter } = {}) {
  const q = String(query || '').trim();
  if (q) return [q];
  const normalizedLetter = String(letter || '').trim().toLowerCase();
  if (normalizedLetter && normalizedLetter !== 'all') return [normalizedLetter === '#' ? '0' : normalizedLetter];
  const resolvedCategory = resolveOnlineCategory('gelbooru', category);
  const terms = [
    ...(GELBOORU_AUTOCOMPLETE_FALLBACK_TERMS[resolvedCategory] || GELBOORU_AUTOCOMPLETE_FALLBACK_TERMS.general),
    ...GELBOORU_BROWSE_EXTRA_TERMS,
  ];
  return Array.from(new Set(terms));
}

function normalizePage(value, fallback = 1) {
  return clampInt(value, 1, 100000, fallback);
}

function normalizePageSize(value, fallback = 60, max = 100) {
  return clampInt(value, 1, max, fallback);
}

function normalizeTagName(value, fallback = 'anime_tag') {
  return String(value || '').trim().replace(/\s+/g, '_') || fallback;
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function normalizePostCount(value) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function slug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'anime-tag';
}

function normalizeRemoteUrl(value, baseUrl = '') {
  const text = String(value || '').trim();
  if (!text) return '';
  if (text.startsWith('//')) return `https:${text}`;
  if (/^https?:\/\//i.test(text)) return text;
  if (baseUrl) {
    try {
      return new URL(text, baseUrl).toString();
    } catch {
      // Fall through to original value.
    }
  }
  return text;
}

function proxiedImageUrl(rawUrl) {
  const url = normalizeRemoteUrl(rawUrl);
  if (!url) return '';
  return `/api/anime-tags/image?u=${encodeURIComponent(url)}`;
}

function rawUrlFromPreviewItem(item) {
  if (!item || typeof item !== 'object') return '';
  const raw = item.rawThumbnailUrl || item.rawImageUrl || item.thumbnailUrl || item.imageUrl || '';
  const text = String(raw || '').trim();
  if (!text) return '';
  if (text.startsWith('/api/anime-tags/image?')) {
    try {
      return new URL(`${DANBOORU_BASE}${text}`).searchParams.get('u') || '';
    } catch {
      return '';
    }
  }
  return text;
}

function splitTags(value) {
  return String(value || '')
    .replace(/_/g, '_')
    .split(/[,\s，、]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 80);
}

function sourceFromId(provider, id) {
  if (!id) return provider === 'danbooru' ? DANBOORU_BASE : GELBOORU_BASE;
  if (provider === 'danbooru') return `${DANBOORU_BASE}/posts/${encodeURIComponent(id)}`;
  return `${GELBOORU_BASE}/index.php?page=post&s=view&id=${encodeURIComponent(id)}`;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pruneCache(cache) {
  while (cache.size > CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
}

function getCached(cache, key) {
  const record = cache.get(key);
  if (!record) return undefined;
  if (record.expiresAt <= Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return record.value;
}

function setCached(cache, key, value, ttlMs) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  pruneCache(cache);
  return value;
}

async function cached(cache, key, ttlMs, loader) {
  const existing = getCached(cache, key);
  if (existing !== undefined) return existing;
  const value = await loader();
  return setCached(cache, key, value, ttlMs);
}

function clearGelbooruOnlineCaches() {
  TEXT_FETCH_CACHE.clear();
  GELBOORU_TAG_SEARCH_CACHE.clear();
}

function sortTagItemsByPostCount(items) {
  return [...items].sort((a, b) => (
    (b.postCount || 0) - (a.postCount || 0)
    || String(a.name || '').localeCompare(String(b.name || ''))
  ));
}

async function runInBatches(items, batchSize, worker) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const settled = await Promise.allSettled(batch.map((item) => worker(item)));
    settled.forEach((result) => {
      if (result.status === 'fulfilled') results.push(result.value);
    });
  }
  return results;
}

function shouldRetryFetch(status) {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

async function fetchText(url, accept = '*/*') {
  const cacheKey = `${accept}\n${url}`;
  const cachedText = getCached(TEXT_FETCH_CACHE, cacheKey);
  if (cachedText !== undefined) return cachedText;
  let lastError;
  for (let attempt = 0; attempt <= FETCH_RETRY_DELAYS_MS.length; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: accept,
        },
        redirect: 'follow',
      });
      const text = await response.text();
      if (response.ok) return setCached(TEXT_FETCH_CACHE, cacheKey, text, FETCH_TEXT_CACHE_MS);
      const err = new Error(`HTTP ${response.status}`);
      err.status = response.status;
      err.body = text;
      const retryAfter = Number.parseFloat(response.headers.get('retry-after') || '');
      err.retryAfterMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : undefined;
      lastError = err;
      if (!shouldRetryFetch(response.status) || attempt >= FETCH_RETRY_DELAYS_MS.length) throw err;
      await wait(err.retryAfterMs || FETCH_RETRY_DELAYS_MS[attempt]);
    } catch (error) {
      lastError = error;
      if (error?.status && !shouldRetryFetch(error.status)) throw error;
      if (attempt >= FETCH_RETRY_DELAYS_MS.length) throw error;
      await wait(FETCH_RETRY_DELAYS_MS[attempt]);
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError || new Error('Fetch failed');
}

async function fetchJson(url) {
  const text = await fetchText(url, 'application/json,*/*');
  return JSON.parse(text || 'null');
}

async function fetchBinaryWithRetry(url, headers = {}) {
  let lastError;
  for (let attempt = 0; attempt <= FETCH_RETRY_DELAYS_MS.length; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers,
        redirect: 'follow',
      });
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const buffer = Buffer.from(await response.arrayBuffer());
      if (response.ok) return { contentType, buffer };
      const err = new Error(`HTTP ${response.status}`);
      err.status = response.status;
      lastError = err;
      if (!shouldRetryFetch(response.status) || attempt >= FETCH_RETRY_DELAYS_MS.length) throw err;
      await wait(FETCH_RETRY_DELAYS_MS[attempt]);
    } catch (error) {
      lastError = error;
      if (error?.status && !shouldRetryFetch(error.status)) throw error;
      if (attempt >= FETCH_RETRY_DELAYS_MS.length) throw error;
      await wait(FETCH_RETRY_DELAYS_MS[attempt]);
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError || new Error('Image fetch failed');
}

function extractGelbooruRecords(data, key = 'post') {
  if (Array.isArray(data)) return data.filter((item) => item && typeof item === 'object');
  if (!data || typeof data !== 'object') return [];
  const direct = data[key];
  if (Array.isArray(direct)) return direct.filter((item) => item && typeof item === 'object');
  if (direct && typeof direct === 'object') return [direct];
  const plural = data[`${key}s`];
  if (Array.isArray(plural)) return plural.filter((item) => item && typeof item === 'object');
  if (plural && typeof plural === 'object') {
    const nested = plural[key];
    if (Array.isArray(nested)) return nested.filter((item) => item && typeof item === 'object');
    if (nested && typeof nested === 'object') return [nested];
  }
  if (key === 'post' && (data.file_url || data.preview_url || data.sample_url)) return [data];
  return [];
}

function loadGelbooruAuth() {
  const envKey = String(process.env.GELBOORU_API_KEY || '').trim();
  const envUid = String(process.env.GELBOORU_USER_ID || '').trim();
  if (envKey && envUid) return { apiKey: envKey, userId: envUid };
  try {
    const authPath = path.join(config.DATA_DIR, 'gelbooru_auth.json');
    if (fs.existsSync(authPath)) {
      const data = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
      const apiKey = String(data.api_key || '').trim();
      const userId = String(data.user_id || '').trim();
      if (apiKey && userId) return { apiKey, userId };
    }
  } catch {
    // Optional auth only.
  }
  return { apiKey: '', userId: '' };
}

function mapDanbooruPost(post, query) {
  const categoryId = resolveOnlineCategory('danbooru', 'general-meta');
  const rawUrl = normalizeRemoteUrl(post.large_file_url || post.file_url || post.preview_file_url);
  const rawThumb = normalizeRemoteUrl(post.preview_file_url || rawUrl);
  const tags = splitTags(post.tag_string || query || 'danbooru');
  const id = post.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    id: `danbooru-${id}`,
    provider: 'danbooru',
    name: tags.slice(0, 3).join(', ') || `danbooru-${id}`,
    chineseName: tags.slice(0, 3).join(', ') || String(id),
    categoryId,
    categoryName: categoryName(categoryId),
    tags,
    prompt: tags.join(', '),
    source: 'danbooru',
    imageUrl: proxiedImageUrl(rawUrl),
    thumbnailUrl: proxiedImageUrl(rawThumb || rawUrl),
    rawImageUrl: rawUrl,
    rawThumbnailUrl: rawThumb || rawUrl,
    sourceUrl: sourceFromId('danbooru', id),
    attributes: `Danbooru lazy preview · score ${post.score ?? '-'}`,
  };
}

function mapGelbooruPost(post, query) {
  const categoryId = resolveOnlineCategory('gelbooru', 'general-meta');
  const rawUrl = normalizeRemoteUrl(post.file_url || post.sample_url || post.preview_url);
  const rawThumb = normalizeRemoteUrl(post.preview_url || post.sample_url || rawUrl);
  const tags = splitTags(post.tags || query || 'gelbooru');
  const id = post.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    id: `gelbooru-${id}`,
    provider: 'gelbooru',
    name: tags.slice(0, 3).join(', ') || `gelbooru-${id}`,
    chineseName: tags.slice(0, 3).join(', ') || String(id),
    categoryId,
    categoryName: categoryName(categoryId),
    tags,
    prompt: tags.join(', '),
    source: 'gelbooru',
    imageUrl: proxiedImageUrl(rawUrl),
    thumbnailUrl: proxiedImageUrl(rawThumb || rawUrl),
    rawImageUrl: rawUrl,
    rawThumbnailUrl: rawThumb || rawUrl,
    sourceUrl: sourceFromId('gelbooru', id),
    attributes: `Gelbooru lazy preview · score ${post.score ?? '-'}`,
  };
}

function mapDanbooruTag(tag) {
  const rawCategory = String(tag.category ?? '').trim();
  const categoryId = DANBOORU_CODE_TO_CATEGORY[rawCategory] || resolveOnlineCategory('danbooru', rawCategory);
  const name = normalizeTagName(tag.name, 'danbooru_tag');
  const postCount = normalizePostCount(tag.post_count ?? tag.postCount ?? tag.count);
  return {
    id: `danbooru-tag-${categoryId}-${slug(name)}`,
    provider: 'danbooru',
    name,
    chineseName: name,
    categoryId,
    categoryName: categoryName(categoryId),
    tags: [name],
    prompt: name,
    source: 'danbooru',
    imageUrl: '',
    thumbnailUrl: '',
    sourceUrl: `${DANBOORU_BASE}/posts?tags=${encodeURIComponent(name)}`,
    attributes: typeof postCount === 'number' ? `${postCount} posts` : 'Danbooru tag',
    postCount,
  };
}

function mapGelbooruTag(tag, fallbackCategory = 'general') {
  const categoryId = resolveGelbooruTagCategory(tag, fallbackCategory);
  const name = normalizeTagName(tag.name || tag.value || tag.label, 'gelbooru_tag');
  const postCount = normalizePostCount(tag.count ?? tag.post_count ?? tag.postCount);
  return {
    id: `gelbooru-tag-${categoryId}-${slug(name)}`,
    provider: 'gelbooru',
    name,
    chineseName: name,
    categoryId,
    categoryName: categoryName(categoryId),
    tags: [name],
    prompt: name,
    source: 'gelbooru',
    imageUrl: '',
    thumbnailUrl: '',
    sourceUrl: `${GELBOORU_BASE}/index.php?page=post&s=list&tags=${encodeURIComponent(name)}`,
    attributes: typeof postCount === 'number' ? `${postCount} posts` : 'Gelbooru tag',
    postCount,
  };
}

async function searchDanbooru(query, { limit, safe }) {
  const params = new URLSearchParams({
    tags: withSafeTag(query, safe),
    limit: String(limit),
    page: '1',
    only: 'id,tag_string,tag_string_artist,tag_string_character,tag_string_copyright,tag_string_general,tag_string_meta,large_file_url,file_url,preview_file_url,source,rating,score',
  });
  const rows = await fetchJson(`${DANBOORU_BASE}/posts.json?${params.toString()}`);
  return Array.isArray(rows) ? rows.map((row) => mapDanbooruPost(row, query)) : [];
}

async function searchDanbooruPosts(query, { page, pageSize, safe }) {
  const params = new URLSearchParams({
    tags: withSafeTag(query, safe),
    limit: String(pageSize),
    page: String(page),
    only: 'id,tag_string,tag_string_artist,tag_string_character,tag_string_copyright,tag_string_general,tag_string_meta,large_file_url,file_url,preview_file_url,source,rating,score',
  });
  const rows = await fetchJson(`${DANBOORU_BASE}/posts.json?${params.toString()}`);
  return Array.isArray(rows) ? rows.map((row) => mapDanbooruPost(row, query)) : [];
}

async function countDanbooruPosts(query, { safe }) {
  try {
    const params = new URLSearchParams({ tags: withSafeTag(query, safe) });
    const data = await fetchJson(`${DANBOORU_BASE}/counts/posts.json?${params.toString()}`);
    return normalizePostCount(data?.counts?.posts ?? data?.posts);
  } catch {
    return undefined;
  }
}

async function searchDanbooruTags(category, { query, letter, page, pageSize }) {
  const resolvedCategory = resolveOnlineCategory('danbooru', category);
  const params = new URLSearchParams({
    'search[category]': String(DANBOORU_CATEGORY_TO_CODE[resolvedCategory] ?? 5),
    'search[order]': 'count',
    'search[hide_empty]': 'yes',
    'search[post_count_gteq]': '1',
    limit: String(pageSize),
    page: String(page),
  });
  const q = String(query || '').trim().replace(/\*/g, '');
  const normalizedLetter = String(letter || '').trim().toLowerCase();
  if (q) params.set('search[name_matches]', `*${q}*`);
  if (!q && normalizedLetter && normalizedLetter !== 'all') {
    params.set('search[name_matches]', normalizedLetter === '#' ? '[0-9]*' : `${normalizedLetter}*`);
  }
  const rows = await fetchJson(`${DANBOORU_BASE}/tags.json?${params.toString()}`);
  return sortTagItemsByPostCount(Array.isArray(rows) ? rows.map(mapDanbooruTag) : []);
}

async function searchGelbooruDapi(query, { limit, safe }) {
  const auth = loadGelbooruAuth();
  const params = new URLSearchParams({
    page: 'dapi',
    s: 'post',
    q: 'index',
    json: '1',
    limit: String(limit),
    pid: '0',
    tags: withSafeTag(query, safe),
  });
  if (auth.apiKey && auth.userId) {
    params.set('api_key', auth.apiKey);
    params.set('user_id', auth.userId);
  }
  const data = await fetchJson(`${GELBOORU_BASE}/index.php?${params.toString()}`);
  return extractGelbooruRecords(data, 'post').map((row) => mapGelbooruPost(row, query));
}

async function searchGelbooruDapiPosts(query, { page, pageSize, safe }) {
  const auth = loadGelbooruAuth();
  const params = new URLSearchParams({
    page: 'dapi',
    s: 'post',
    q: 'index',
    json: '1',
    limit: String(pageSize),
    pid: String(page - 1),
    tags: withSafeTag(query, safe),
  });
  if (auth.apiKey && auth.userId) {
    params.set('api_key', auth.apiKey);
    params.set('user_id', auth.userId);
  }
  const data = await fetchJson(`${GELBOORU_BASE}/index.php?${params.toString()}`);
  const total = normalizePostCount(data?.['@attributes']?.count ?? data?.attributes?.count ?? data?.count);
  const items = extractGelbooruRecords(data, 'post').map((row) => mapGelbooruPost(row, query));
  return { items, total };
}

async function searchGelbooruTags(category, { query, letter, page, pageSize }) {
  const resolvedCategory = resolveOnlineCategory('gelbooru', category);
  const auth = loadGelbooruAuth();
  const params = new URLSearchParams({
    page: 'dapi',
    s: 'tag',
    q: 'index',
    json: '1',
    limit: String(pageSize),
    pid: String(page - 1),
    order: 'desc',
    orderby: 'count',
    type: String(GELBOORU_CATEGORY_TO_CODE[resolvedCategory] ?? 0),
  });
  const q = String(query || '').trim().replace(/[%*]/g, '');
  const normalizedLetter = String(letter || '').trim().toLowerCase();
  if (q) params.set('name_pattern', `%${q}%`);
  if (!q && normalizedLetter && normalizedLetter !== 'all') {
    params.set('name_pattern', normalizedLetter === '#' ? '[0-9]%' : `${normalizedLetter}%`);
  }
  if (auth.apiKey && auth.userId) {
    params.set('api_key', auth.apiKey);
    params.set('user_id', auth.userId);
  }
  const data = await fetchJson(`${GELBOORU_BASE}/index.php?${params.toString()}`);
  return sortTagItemsByPostCount(
    extractGelbooruRecords(data, 'tag').map((row) => mapGelbooruTag(row, resolvedCategory)),
  );
}

function parseGelbooruHtmlTagRows(html, fallbackCategory) {
  const rows = [];
  const regex = /<tr><td><span class="tag-type-([^"]+)"><a href="([^"]*page=post[^"]*tags=([^"]+)[^"]*)"[^>]*>([\s\S]*?)<\/a><\/span>\s*<span class="tag-count">([^<]*)<\/span><\/td><td>([^<\s(,]+)/gi;
  for (const match of String(html || '').matchAll(regex)) {
    const encodedName = decodeHtml(match[3]);
    let name = encodedName;
    try {
      name = decodeURIComponent(encodedName);
    } catch {
      name = encodedName;
    }
    rows.push(mapGelbooruTag({
      name,
      category: match[6] || match[1],
      count: String(match[5] || '').replace(/,/g, ''),
    }, fallbackCategory));
  }
  return rows;
}

async function searchGelbooruHtmlTags(category, { query, letter, page, pageSize, terms } = {}) {
  const resolvedCategory = resolveOnlineCategory('gelbooru', category);
  const end = normalizePage(page, 1) * pageSize;
  const byName = new Map();
  const q = String(query || '').trim().replace(/[*%]/g, '');
  const normalizedLetter = String(letter || '').trim().toLowerCase();
  const fallbackTerms = Array.isArray(terms) && terms.length
    ? terms
    : buildGelbooruAutocompleteTerms(resolvedCategory, { query, letter });
  const useGlobalListing = !q && (!normalizedLetter || normalizedLetter === 'all') && resolvedCategory === 'general';
  const tagTerms = useGlobalListing ? [''] : fallbackTerms;
  const htmlJobs = [];
  tagTerms.forEach((term) => {
    const maxHtmlPages = useGlobalListing
      ? 8
      : (q || (normalizedLetter && normalizedLetter !== 'all')
        ? Math.min(6, Math.max(1, Math.ceil(end / 50) + 1))
        : 1);
    for (let htmlPage = 1; htmlPage <= maxHtmlPages; htmlPage += 1) {
      htmlJobs.push({ term, htmlPage });
    }
  });
  const htmlPages = await runInBatches(htmlJobs, 4, async ({ term, htmlPage }) => {
      const params = new URLSearchParams({
        page: 'tags',
        s: 'list',
        sort: 'desc',
        order_by: 'index_count',
      });
      const cleanTerm = String(term || '').trim().replace(/[*%]/g, '');
      if (cleanTerm) params.set('tags', `${cleanTerm}*`);
      params.set('pid', String((htmlPage - 1) * 50));
      const html = await fetchText(`${GELBOORU_BASE}/index.php?${params.toString()}`, 'text/html,*/*');
      return parseGelbooruHtmlTagRows(html, resolvedCategory)
        .filter((item) => item.categoryId === resolvedCategory);
  });
  htmlPages.flat().forEach((item) => {
    const previous = byName.get(item.name);
    if (!previous || (item.postCount || 0) > (previous.postCount || 0)) {
      byName.set(item.name, item);
    }
  });
  const items = sortTagItemsByPostCount(Array.from(byName.values()));
  const start = (normalizePage(page, 1) - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

async function searchGelbooruHtmlTypeTags(category, { page, pageSize }) {
  const resolvedCategory = resolveOnlineCategory('gelbooru', category);
  if (resolvedCategory !== 'artist') return [];
  const start = (normalizePage(page, 1) - 1) * pageSize;
  const skip = start % 50;
  const firstPid = start - skip;
  const needed = skip + pageSize;
  const rows = [];
  const maxRequests = Math.min(4, Math.ceil(needed / 50) + 1);
  for (let i = 0; i < maxRequests && rows.length < needed; i += 1) {
    const params = new URLSearchParams({
      page: 'tags',
      s: 'list',
      sort: 'asc',
      order_by: 'type',
      pid: String(firstPid + i * 50),
    });
    const html = await fetchText(`${GELBOORU_BASE}/index.php?${params.toString()}`, 'text/html,*/*');
    const pageRows = parseGelbooruHtmlTagRows(html, resolvedCategory)
      .filter((item) => item.categoryId === resolvedCategory);
    if (!pageRows.length) break;
    rows.push(...pageRows);
  }
  return sortTagItemsByPostCount(rows).slice(skip, skip + pageSize);
}

async function searchGelbooruAutocompleteTags(category, { query, letter, page, pageSize }) {
  const resolvedCategory = resolveOnlineCategory('gelbooru', category);
  const terms = buildGelbooruAutocompleteTerms(resolvedCategory, { query, letter });
  const byName = new Map();
  const targetCount = normalizePage(page, 1) * pageSize;
  const collectTerm = async (term) => {
    const params = new URLSearchParams({
      page: 'autocomplete2',
      type: 'tag_query',
      term,
      limit: String(Math.min(50, Math.max(10, pageSize))),
    });
    try {
      const data = await fetchJson(`${GELBOORU_BASE}/index.php?${params.toString()}`);
      const rows = Array.isArray(data) ? data : extractGelbooruRecords(data, 'tag');
      return rows
        .map((row) => mapGelbooruTag(row, resolvedCategory))
        .filter((item) => item.categoryId === resolvedCategory);
    } catch {
      const htmlItems = await searchGelbooruHtmlTags(resolvedCategory, {
        query: term,
        page: 1,
        pageSize: Math.min(50, Math.max(10, pageSize)),
        terms: [term],
      });
      return htmlItems.filter((item) => item.categoryId === resolvedCategory);
    }
  };
  for (let i = 0; i < terms.length && byName.size < targetCount; i += 4) {
    const batch = terms.slice(i, i + 4);
    const results = await Promise.allSettled(batch.map((term) => collectTerm(term)));
    results.forEach((result) => {
      if (result.status !== 'fulfilled') return;
      result.value.forEach((item) => {
        const previous = byName.get(item.name);
        if (!previous || (item.postCount || 0) > (previous.postCount || 0)) {
          byName.set(item.name, item);
        }
      });
    });
  }
  let items = sortTagItemsByPostCount(Array.from(byName.values()));
  const shouldSupplementWithHtml = Boolean(String(query || '').trim())
    || (Boolean(String(letter || '').trim()) && String(letter || '').trim().toLowerCase() !== 'all');
  if (items.length < targetCount && shouldSupplementWithHtml) {
    const htmlItems = await searchGelbooruHtmlTags(resolvedCategory, {
      query,
      letter,
      page: 1,
      pageSize: targetCount,
      terms,
    });
    htmlItems.forEach((item) => {
      const previous = byName.get(item.name);
      if (!previous || (item.postCount || 0) > (previous.postCount || 0)) {
        byName.set(item.name, item);
      }
    });
    items = sortTagItemsByPostCount(Array.from(byName.values()));
  }
  const start = (normalizePage(page, 1) - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  if (pageItems.length) return pageItems;
  return searchGelbooruHtmlTags(resolvedCategory, { query, letter, page, pageSize, terms });
}

async function cachedGelbooruTagSearch(source, category, options, loader) {
  const key = [
    source,
    resolveOnlineCategory('gelbooru', category),
    String(options?.query || ''),
    String(options?.letter || ''),
    normalizePage(options?.page, 1),
    normalizePageSize(options?.pageSize, 60, 100),
  ].join('|');
  return cached(GELBOORU_TAG_SEARCH_CACHE, key, GELBOORU_TAG_CACHE_MS, loader);
}

async function searchGelbooruHtml(query, { limit, safe }) {
  const params = new URLSearchParams({
    page: 'post',
    s: 'list',
    tags: withSafeTag(query, safe),
  });
  const html = await fetchText(`${GELBOORU_BASE}/index.php?${params.toString()}`, 'text/html,*/*');
  const imageMatches = [...html.matchAll(/(?:src|data-original|href)=["']([^"']+(?:thumbnail|samples|images)[^"']+?\.(?:jpg|jpeg|png|webp))(?:\?[^"']*)?["']/gi)]
    .map((m) => normalizeRemoteUrl(m[1], GELBOORU_BASE));
  const idMatches = [...html.matchAll(/index\.php\?page=post(?:&amp;|&)s=view(?:&amp;|&)id=(\d+)/g)]
    .map((m) => m[1]);
  const seen = new Set();
  const rows = [];
  for (let i = 0; i < imageMatches.length && rows.length < limit; i += 1) {
    const imageUrl = imageMatches[i];
    if (!imageUrl || seen.has(imageUrl)) continue;
    seen.add(imageUrl);
    rows.push(mapGelbooruPost({
      id: idMatches[i] || `html-${i}-${imageUrl}`,
      tags: query,
      preview_url: imageUrl,
      sample_url: imageUrl,
      file_url: imageUrl,
      score: 'html',
    }, query));
  }
  return rows;
}

async function searchGelbooruHtmlPosts(query, { page, pageSize, safe }) {
  const params = new URLSearchParams({
    page: 'post',
    s: 'list',
    tags: withSafeTag(query, safe),
    pid: String((page - 1) * pageSize),
  });
  const html = await fetchText(`${GELBOORU_BASE}/index.php?${params.toString()}`, 'text/html,*/*');
  const imageMatches = [...html.matchAll(/(?:src|data-original|href)=["']([^"']+(?:thumbnail|samples|images)[^"']+?\.(?:jpg|jpeg|png|webp))(?:\?[^"']*)?["']/gi)]
    .map((m) => normalizeRemoteUrl(m[1], GELBOORU_BASE));
  const idMatches = [...html.matchAll(/index\.php\?page=post(?:&amp;|&)s=view(?:&amp;|&)id=(\d+)/g)]
    .map((m) => m[1]);
  const rows = [];
  const seen = new Set();
  for (let i = 0; i < imageMatches.length && rows.length < pageSize; i += 1) {
    const imageUrl = imageMatches[i];
    if (!imageUrl || seen.has(imageUrl)) continue;
    seen.add(imageUrl);
    rows.push(mapGelbooruPost({
      id: idMatches[i] || `html-${page}-${i}-${imageUrl}`,
      tags: query,
      preview_url: imageUrl,
      sample_url: imageUrl,
      file_url: imageUrl,
      score: 'html',
    }, query));
  }
  const totalMatch = html.match(/(?:Posts|posts)[^0-9]{0,24}([0-9][0-9,]*)/);
  const total = totalMatch ? normalizePostCount(totalMatch[1].replace(/,/g, '')) : undefined;
  return { items: rows, total };
}

async function previewDanbooru(query, { safe }) {
  const rows = await searchDanbooru(normalizePreviewQuery(query), { limit: 1, safe });
  return rows[0] || null;
}

async function previewGelbooru(query, { safe }) {
  const normalizedQuery = normalizePreviewQuery(query);
  const cacheKey = `preview|${safe ? 'safe' : 'all'}|${normalizedQuery}`;
  return cached(GELBOORU_PREVIEW_CACHE, cacheKey, GELBOORU_PREVIEW_CACHE_MS, async () => {
    const auth = loadGelbooruAuth();
    if (!auth.apiKey || !auth.userId) {
      const htmlRows = await searchGelbooruHtml(normalizedQuery, { limit: 1, safe });
      return {
        item: htmlRows[0] || null,
        source: 'html',
        warning: 'Gelbooru 未配置 user_id/api_key，已使用公开 HTML 兜底。',
      };
    }
    try {
      const rows = await searchGelbooruDapi(normalizedQuery, { limit: 1, safe });
      if (rows[0]) return { item: rows[0], source: 'api', warning: '' };
    } catch (error) {
      const warning = error?.status === 401
        ? 'Gelbooru DAPI 需要 user_id/api_key，已切换公开 HTML 兜底。'
        : `Gelbooru DAPI 失败，已切换公开 HTML 兜底：${error?.message || error}`;
      const htmlRows = await searchGelbooruHtml(normalizedQuery, { limit: 1, safe });
      return { item: htmlRows[0] || null, source: 'html', warning };
    }
    const htmlRows = await searchGelbooruHtml(normalizedQuery, { limit: 1, safe });
    return { item: htmlRows[0] || null, source: 'html', warning: '' };
  });
}

router.get('/preview', async (req, res) => {
  const normalizedProvider = normalizeProvider(req.query.provider || 'danbooru');
  const query = normalizePreviewQuery(req.query.q || req.query.query || '');
  const safe = req.query.safe !== '0' && req.query.safe !== 'false';

  if (!['danbooru', 'gelbooru'].includes(normalizedProvider)) {
    return res.status(400).json({ success: false, error: '不支持的在线图库来源' });
  }

  try {
    let item = null;
    let source = 'api';
    let warning = '';
    let fallbackProvider = '';
    if (normalizedProvider === 'gelbooru') {
      const result = await previewGelbooru(query, { safe });
      item = result.item;
      source = result.source;
      warning = result.warning;
    } else {
      try {
        item = await previewDanbooru(query, { safe });
      } catch (error) {
        const result = await previewGelbooru(query, { safe });
        item = result.item;
        source = `gelbooru-${result.source}`;
        fallbackProvider = 'gelbooru';
        const reason = error?.message || String(error);
        warning = `Danbooru 预览失败，已切换 Gelbooru 实时预览：${reason}${result.warning ? `；${result.warning}` : ''}`;
      }
      if (!item) {
        const result = await previewGelbooru(query, { safe });
        item = result.item;
        source = `gelbooru-${result.source}`;
        fallbackProvider = 'gelbooru';
        warning = result.warning
          ? `Danbooru 暂无结果，已切换 Gelbooru 实时预览；${result.warning}`
          : 'Danbooru 暂无结果，已切换 Gelbooru 实时预览。';
      }
    }
    return res.json({
      success: true,
      data: {
        provider: normalizedProvider,
        fallbackProvider,
        query,
        source,
        warning,
        item,
        imageUrl: item?.imageUrl || '',
        thumbnailUrl: item?.thumbnailUrl || item?.imageUrl || '',
        sourceUrl: item?.sourceUrl || '',
      },
    });
  } catch (error) {
    return res.status(error?.status || 502).json({
      success: false,
      error: error?.message || '在线预览加载失败',
      code: normalizedProvider === 'danbooru' ? 'danbooru_preview_unavailable' : 'gelbooru_preview_unavailable',
    });
  }
});

router.get('/preview-image', async (req, res) => {
  const normalizedProvider = normalizeProvider(req.query.provider || 'danbooru');
  const query = normalizePreviewQuery(req.query.q || req.query.query || '');
  const safe = req.query.safe !== '0' && req.query.safe !== 'false';

  if (!['danbooru', 'gelbooru'].includes(normalizedProvider)) {
    return res.status(400).json({ success: false, error: '不支持的在线图库来源' });
  }

  try {
    let item = null;
    if (normalizedProvider === 'gelbooru') {
      const result = await previewGelbooru(query, { safe });
      item = result.item;
    } else {
      try {
        item = await previewDanbooru(query, { safe });
      } catch {
        const result = await previewGelbooru(query, { safe });
        item = result.item;
      }
      if (!item) {
        const result = await previewGelbooru(query, { safe });
        item = result.item;
      }
    }
    const rawImageUrl = rawUrlFromPreviewItem(item);
    if (!rawImageUrl) {
      return res.status(404).json({ success: false, error: '没有找到可预览图片' });
    }
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.redirect(302, proxiedImageUrl(rawImageUrl));
  } catch (error) {
    return res.status(error?.status || 502).json({
      success: false,
      error: error?.message || '在线预览图片加载失败',
    });
  }
});

router.get('/search', async (req, res) => {
  const normalizedProvider = normalizeProvider(req.query.provider || 'danbooru');
  const query = String(req.query.q || req.query.query || '').trim();
  const limit = clampInt(req.query.limit, 1, 100, 12);
  const page = normalizePage(req.query.page, 1);
  const safe = req.query.safe !== '0' && req.query.safe !== 'false';

  if (!['danbooru', 'gelbooru'].includes(normalizedProvider)) {
    return res.status(400).json({ success: false, error: '不支持的在线图库来源' });
  }
  if (!query) {
    return res.status(400).json({ success: false, error: '请输入搜索词' });
  }

  try {
    let items = [];
    let source = 'api';
    let warning = '';
    if (normalizedProvider === 'gelbooru') {
      try {
        if (page === 1) {
          items = await searchGelbooruDapi(query, { limit, safe });
        } else {
          const result = await searchGelbooruDapiPosts(query, { page, pageSize: limit, safe });
          items = result.items;
        }
      } catch (error) {
        warning = error?.status === 401
          ? 'Gelbooru DAPI 需要 user_id/api_key，已切换公开 HTML 兜底。'
          : `Gelbooru DAPI 失败，已切换公开 HTML 兜底：${error?.message || error}`;
      }
      if (!items.length) {
        source = 'html';
        if (page === 1) {
          items = await searchGelbooruHtml(query, { limit, safe });
        } else {
          const result = await searchGelbooruHtmlPosts(query, { page, pageSize: limit, safe });
          items = result.items;
        }
      }
    } else {
      items = page === 1
        ? await searchDanbooru(query, { limit, safe })
        : await searchDanbooruPosts(query, { page, pageSize: limit, safe });
    }
    return res.json({
      success: true,
      data: { provider: normalizedProvider, query, page, pageSize: limit, source, warning, items },
    });
  } catch (error) {
    const message = error?.message || '在线图库加载失败';
    return res.status(error?.status || 502).json({
      success: false,
      error: message,
      code: normalizedProvider === 'danbooru' ? 'danbooru_unavailable' : 'gelbooru_unavailable',
    });
  }
});

async function sendTagsResponse(params, res) {
  const normalizedProvider = normalizeProvider(params.provider || 'danbooru');
  const category = resolveOnlineCategory(normalizedProvider, params.category || 'general-meta');
  const query = String(params.q || params.query || '').trim();
  const letter = String(params.letter || '').trim().toLowerCase();
  const page = normalizePage(params.page, 1);
  const pageSize = normalizePageSize(params.pageSize || params.limit, 60, normalizedProvider === 'danbooru' ? 1000 : 100);
  const refresh = params.refresh === true || params.refresh === 'true';

  if (!['danbooru', 'gelbooru'].includes(normalizedProvider)) {
    return res.status(400).json({ success: false, error: '不支持的在线图库来源' });
  }

  try {
    if (refresh && normalizedProvider === 'gelbooru') {
      clearGelbooruOnlineCaches();
    }
    let items = [];
    let source = 'api';
    let warning = '';
    if (normalizedProvider === 'danbooru') {
      items = await searchDanbooruTags(category, { query, letter, page, pageSize });
    } else {
      const auth = loadGelbooruAuth();
      if (!auth.apiKey || !auth.userId) {
        warning = 'Gelbooru 未配置 user_id/api_key，已使用公开 autocomplete / HTML 兜底。';
        source = 'autocomplete';
        items = await cachedGelbooruTagSearch('autocomplete', category, { query, letter, page, pageSize }, () => (
          searchGelbooruAutocompleteTags(category, { query, letter, page, pageSize })
        ));
        if (!items.length) {
          source = 'html';
          items = await cachedGelbooruTagSearch('html', category, { query, letter, page, pageSize }, () => (
            searchGelbooruHtmlTags(category, { query, letter, page, pageSize })
          ));
        }
        if (!items.length && category === 'artist' && !query && !letter) {
          source = 'html-type';
          items = await cachedGelbooruTagSearch('html-type', category, { query, letter, page, pageSize }, () => (
            searchGelbooruHtmlTypeTags(category, { page, pageSize })
          ));
        }
      } else {
        try {
          items = await searchGelbooruTags(category, { query, letter, page, pageSize });
        } catch (error) {
          warning = error?.status === 401
            ? 'Gelbooru DAPI 需要 user_id/api_key，已切换 autocomplete 兜底。'
            : `Gelbooru tag DAPI 失败，已切换 autocomplete 兜底：${error?.message || error}`;
          source = 'autocomplete';
          items = await searchGelbooruAutocompleteTags(category, { query, letter, page, pageSize });
        }
      }
    }
    const hasMore = items.length >= pageSize;
    const totalKnown = !hasMore;
    const total = ((page - 1) * pageSize) + items.length + (hasMore ? pageSize : 0);
    const totalPages = Math.max(page, Math.ceil(total / pageSize));
    return res.json({
      success: true,
      data: {
        provider: normalizedProvider,
        category,
        categoryName: categoryName(category),
        query,
        letter,
        page,
        pageSize,
        total,
        totalPages,
        totalKnown,
        hasMore,
        source,
        warning,
        items,
      },
    });
  } catch (error) {
    return res.status(error?.status || 502).json({
      success: false,
      error: error?.message || '在线标签加载失败',
      code: normalizedProvider === 'danbooru' ? 'danbooru_tags_unavailable' : 'gelbooru_tags_unavailable',
    });
  }
}

router.get('/tags', async (req, res) => sendTagsResponse(req.query, res));

router.post('/tags/refresh', async (req, res) => {
  const body = req.body || {};
  return sendTagsResponse({
    ...req.query,
    provider: body.provider || req.query.provider,
    category: body.category || req.query.category,
    q: body.q || body.query || req.query.q,
    letter: body.letter || req.query.letter,
    page: body.page || req.query.page || '1',
    pageSize: body.pageSize || body.limit || req.query.pageSize,
    refresh: true,
  }, res);
});

router.get('/posts', async (req, res) => {
  const normalizedProvider = normalizeProvider(req.query.provider || 'danbooru');
  const tag = normalizeBooruTagQuery(req.query.tag || req.query.q || req.query.query || '');
  const page = normalizePage(req.query.page, 1);
  const pageSize = normalizePageSize(req.query.pageSize || req.query.limit, 24, 100);
  const safe = req.query.safe !== '0' && req.query.safe !== 'false';

  if (!['danbooru', 'gelbooru'].includes(normalizedProvider)) {
    return res.status(400).json({ success: false, error: '不支持的在线图库来源' });
  }
  if (!tag) {
    return res.status(400).json({ success: false, error: '请输入要查看的 tag' });
  }

  try {
    let items = [];
    let total;
    let source = 'api';
    let warning = '';
    if (normalizedProvider === 'danbooru') {
      [items, total] = await Promise.all([
        searchDanbooruPosts(tag, { page, pageSize, safe }),
        countDanbooruPosts(tag, { safe }),
      ]);
    } else {
      const auth = loadGelbooruAuth();
      if (!auth.apiKey || !auth.userId) {
        warning = 'Gelbooru 未配置 user_id/api_key，已使用公开 HTML 兜底。';
        source = 'html';
        const result = await searchGelbooruHtmlPosts(tag, { page, pageSize, safe });
        items = result.items;
        total = result.total;
      } else {
        try {
          const result = await searchGelbooruDapiPosts(tag, { page, pageSize, safe });
          items = result.items;
          total = result.total;
        } catch (error) {
          warning = error?.status === 401
            ? 'Gelbooru DAPI 需要 user_id/api_key，已切换公开 HTML 兜底。'
            : `Gelbooru DAPI 失败，已切换公开 HTML 兜底：${error?.message || error}`;
          source = 'html';
          const result = await searchGelbooruHtmlPosts(tag, { page, pageSize, safe });
          items = result.items;
          total = result.total;
        }
      }
    }
    const fallbackTotal = ((page - 1) * pageSize) + items.length + (items.length >= pageSize ? pageSize : 0);
    const responseTotal = typeof total === 'number' ? total : fallbackTotal;
    const totalKnown = typeof total === 'number' || items.length < pageSize;
    return res.json({
      success: true,
      data: {
        provider: normalizedProvider,
        tag,
        page,
        pageSize,
        total: responseTotal,
        totalPages: Math.max(page, Math.ceil(responseTotal / pageSize)),
        totalKnown,
        hasMore: items.length >= pageSize,
        source,
        warning,
        items,
      },
    });
  } catch (error) {
    return res.status(error?.status || 502).json({
      success: false,
      error: error?.message || '在线作品加载失败',
      code: normalizedProvider === 'danbooru' ? 'danbooru_posts_unavailable' : 'gelbooru_posts_unavailable',
    });
  }
});

router.get('/image', async (req, res) => {
  const raw = String(req.query.u || '').trim();
  if (!raw) return res.status(400).json({ success: false, error: '缺少图片 URL' });
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return res.status(400).json({ success: false, error: '图片 URL 无效' });
  }
  const hostname = (parsed.hostname || '').toLowerCase();
  const allowed = IMAGE_HOSTS.has(hostname) || hostname.endsWith('.gelbooru.com') || hostname.endsWith('.donmai.us');
  if (!allowed || !['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ success: false, error: `不允许代理该图片域名：${hostname}` });
  }
  try {
    const referer = hostname.includes('gelbooru') ? GELBOORU_BASE : DANBOORU_BASE;
    const result = await fetchBinaryWithRetry(parsed.toString(), {
      'User-Agent': USER_AGENT,
      Referer: `${referer}/`,
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    });
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(result.buffer);
  } catch (error) {
    return res.status(502).json({ success: false, error: error?.message || '图片代理失败' });
  }
});

module.exports = router;
module.exports._internals = {
  USER_AGENT,
  withSafeTag,
  normalizeProvider,
  normalizePreviewQuery,
  normalizeBooruTagQuery,
  resolveOnlineCategory,
  buildGelbooruAutocompleteTerms,
  extractGelbooruRecords,
  mapDanbooruPost,
  mapGelbooruPost,
  mapGelbooruTag,
  parseGelbooruHtmlTagRows,
  sortTagItemsByPostCount,
  searchGelbooruAutocompleteTags,
  searchGelbooruHtmlTags,
  previewDanbooru,
  previewGelbooru,
  searchGelbooruHtml,
};
