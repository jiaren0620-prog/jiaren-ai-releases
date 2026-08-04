const fs = require('fs');
const path = require('path');
const config = require('../config');

function jsonObjectPrefix(raw) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  let started = false;
  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === '{') { depth += 1; started = true; }
    else if (char === '}') {
      depth -= 1;
      if (started && depth === 0) return raw.slice(0, index + 1);
    }
  }
  return raw;
}

function readPreferences() {
  const target = String(process.env.JIAREN_PREFERENCES_PATH || '').trim();
  if (!target || !fs.existsSync(target)) return {};
  const raw = fs.readFileSync(target, 'utf8');
  try { return JSON.parse(raw); } catch { return JSON.parse(jsonObjectPrefix(raw)); }
}

function clean(value) { return String(value || '').trim(); }

function resolveCurrentChatProvider(requestedModel = '') {
  const preferences = readPreferences();
  const runtime = preferences.runtimeSettings || {};
  const global = runtime.global || {};
  const models = Array.isArray(runtime.models) ? runtime.models : [];
  const enabled = models.filter((model) => model && model.enabled !== false && (model.category === 'chat' || model.requestMode === 'openai-chat'));
  const requested = clean(requestedModel);
  const selected = enabled.find((model) => [model.id, model.modelId, model.endpointModelId, model.alias].some((value) => clean(value) === requested)) || enabled[0] || {};
  const model = clean(selected.endpointModelId || selected.modelId || requested || selected.id);
  const baseUrl = clean(selected.baseUrl || global.baseUrl || global.fallbackBaseUrl).replace(/\/+$/, '');
  const apiKey = clean(selected.apiKey || global.apiKey || selected.fallbackApiKey || global.fallbackApiKey);
  if (!baseUrl || !apiKey || !model) {
    return { ok: false, code: 'missing_current_api', error: '请先在 JiarenAI API 设置中启用并配置一个对话/视觉模型。' };
  }
  return {
    ok: true,
    provider: {
      id: 'jiaren-current-api',
      label: 'JiarenAI 当前 API',
      baseUrl,
      apiKey,
      enabled: true,
      protocol: 'openai-compatible',
      chatModels: [model],
      defaults: { chatModel: model },
    },
  };
}

function mimeFromPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.bmp') return 'image/bmp';
  return 'image/png';
}

function localImagePath(value) {
  const text = clean(value);
  if (!text || text.startsWith('data:image/')) return '';
  if (path.isAbsolute(text) && fs.existsSync(text)) return text;
  let pathname = text;
  try {
    const parsed = new URL(text);
    if (!['127.0.0.1', 'localhost', '::1'].includes(parsed.hostname)) return '';
    pathname = decodeURIComponent(parsed.pathname);
  } catch {}
  const mappings = [
    ['/files/input/', config.INPUT_DIR], ['/input/', config.INPUT_DIR],
    ['/files/output/', config.OUTPUT_DIR], ['/output/', config.OUTPUT_DIR],
  ];
  for (const [prefix, root] of mappings) {
    if (!pathname.startsWith(prefix)) continue;
    const candidate = path.resolve(root, pathname.slice(prefix.length));
    const relative = path.relative(path.resolve(root), candidate);
    if (!relative.startsWith('..') && !path.isAbsolute(relative) && fs.existsSync(candidate)) return candidate;
  }
  return '';
}

function normalizeMessages(messages) {
  return messages.map((message) => {
    if (!Array.isArray(message.content)) return message;
    return {
      ...message,
      content: message.content.map((part) => {
        if (part?.type !== 'image_url') return part;
        const value = typeof part.image_url === 'string' ? part.image_url : part.image_url?.url;
        const localPath = localImagePath(value);
        if (!localPath) return part;
        const bytes = fs.readFileSync(localPath);
        if (bytes.length > 20 * 1024 * 1024) throw new Error('批量打标图片不能超过 20MB。');
        return { type: 'image_url', image_url: { url: `data:${mimeFromPath(localPath)};base64,${bytes.toString('base64')}` } };
      }),
    };
  });
}

function chatEndpoint(baseUrl) {
  const root = clean(baseUrl).replace(/\/+$/, '');
  return /\/v1$/i.test(root) ? `${root}/chat/completions` : `${root}/v1/chat/completions`;
}

function responseText(payload) {
  const content = payload?.choices?.[0]?.message?.content ?? payload?.choices?.[0]?.text ?? payload?.output_text ?? payload?.text;
  if (typeof content === 'string') return content.trim();
  if (Array.isArray(content)) return content.map((item) => item?.text || '').filter(Boolean).join('\n').trim();
  return '';
}

async function generateCurrentChat(provider, input = {}, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(options.timeoutMs) || 120000);
  try {
    const response = await fetch(chatEndpoint(provider.baseUrl), {
      method: 'POST',
      headers: { Authorization: `Bearer ${provider.apiKey}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        model: input.model || provider.defaults.chatModel,
        messages: normalizeMessages(input.messages || []),
        temperature: input.temperature ?? 0.2,
        max_tokens: input.maxTokens || input.max_tokens || 1200,
      }),
      signal: controller.signal,
    });
    const rawText = await response.text();
    let raw;
    try { raw = rawText ? JSON.parse(rawText) : {}; } catch { raw = { message: rawText }; }
    if (!response.ok) return { ok: false, code: 'http_error', error: raw?.error?.message || raw?.message || `API HTTP ${response.status}`, raw };
    const text = responseText(raw);
    if (!text) return { ok: false, code: 'empty_text', error: '当前 API 没有返回文本。', raw };
    return { ok: true, text, raw };
  } catch (error) {
    return { ok: false, code: error?.name === 'AbortError' ? 'timeout' : 'network_error', error: error?.name === 'AbortError' ? '当前 API 调用超时。' : (error?.message || '当前 API 调用失败。') };
  } finally {
    clearTimeout(timeout);
  }
}

function publicProvider(provider) {
  return { id: provider.id, label: provider.label, baseUrl: provider.baseUrl, protocol: provider.protocol, enabled: true, defaults: provider.defaults };
}

module.exports = { generateCurrentChat, publicProvider, resolveCurrentChatProvider };
