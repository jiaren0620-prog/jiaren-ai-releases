"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const CAPABILITIES = new Set(["text", "image", "video", "audio"]);
const SECRET_KEY = /apiKey|authorization|cookie|token|password|credential|secret/i;
const SESSION_SECRET_PLACEHOLDER = "jiaren-channel-session";

function cleanText(value, fallback = "", max = 8000) {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

function atomicWrite(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(temporary, filePath);
}

function getPath(value, dottedPath) {
  if (!dottedPath) return value;
  return cleanText(dottedPath, "", 500).split(".").reduce((current, key) => current?.[key], value);
}

function templateString(source, context) {
  return String(source).replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_match, key) => {
    const value = getPath(context, key);
    if (value === undefined || value === null) return "";
    return typeof value === "object" ? JSON.stringify(value) : String(value);
  });
}

function renderTemplate(value, context, depth = 0) {
  if (depth > 12) throw new Error("渠道模板嵌套过深。");
  if (typeof value === "string") return templateString(value, context);
  if (Array.isArray(value)) return value.map((item) => renderTemplate(item, context, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, renderTemplate(item, context, depth + 1)]));
  }
  return value;
}

function validateUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("渠道请求仅支持 HTTP 或 HTTPS。");
  return url.toString();
}

function slug(value, fallback) {
  return cleanText(value, fallback, 120).replace(/[^a-zA-Z0-9_.-]/g, "-").replace(/-+/g, "-");
}

function normalizeModels(input, driverId, capabilities) {
  const models = Array.isArray(input) ? input : [];
  const seen = new Set();
  return models.slice(0, 100).flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const capability = cleanText(item.capability, capabilities[0] || "image", 20);
    if (!CAPABILITIES.has(capability) || !capabilities.includes(capability)) return [];
    const modelId = cleanText(item.modelId || item.id, "", 160);
    if (!modelId) return [];
    const modelSlug = slug(item.catalogId || modelId, `model-${index + 1}`);
    const catalogId = `provider-channel-${driverId}-${modelSlug}`.slice(0, 160);
    if (seen.has(catalogId)) return [];
    seen.add(catalogId);
    return [{
      catalogId,
      modelId,
      alias: cleanText(item.alias || item.name, modelId, 120),
      capability,
      enabled: item.enabled !== false,
    }];
  });
}

function validateDefinition(input) {
  if (!input || typeof input !== "object") throw new Error("渠道配置无效。");
  const id = slug(input.id, crypto.randomUUID());
  const name = cleanText(input.name, "未命名渠道", 80);
  const capabilities = [...new Set((Array.isArray(input.capabilities) ? input.capabilities : []).map(String))];
  if (!capabilities.length || capabilities.some((item) => !CAPABILITIES.has(item))) {
    throw new Error("渠道必须声明 text/image/video/audio 能力。");
  }
  const request = input.request && typeof input.request === "object" ? input.request : {};
  const method = cleanText(request.method, "POST", 10).toUpperCase();
  if (!METHODS.has(method)) throw new Error("渠道 HTTP 方法不受支持。");
  const urlTemplate = cleanText(request.urlTemplate, "", 4000);
  if (!urlTemplate) throw new Error("渠道 URL 模板不能为空。");
  const headers = request.headers && typeof request.headers === "object" && !Array.isArray(request.headers) ? request.headers : {};
  if (Object.keys(headers).some((key) => /[\r\n]/.test(key))) throw new Error("渠道 Header 名称无效。");
  const serialized = JSON.stringify(input);
  if (/\bnew\s+Function\b|\beval\s*\(|<script/i.test(serialized)) throw new Error("渠道配置不允许包含可执行脚本。");
  if (Object.keys(input).some((key) => SECRET_KEY.test(key))) {
    throw new Error("渠道配置不能保存密钥，请在调用时注入。");
  }
  const polling = input.polling && typeof input.polling === "object" ? {
    urlTemplate: cleanText(input.polling.urlTemplate, "", 4000),
    method: cleanText(input.polling.method, "GET", 10).toUpperCase(),
    statusPath: cleanText(input.polling.statusPath, "status", 500),
    resultPath: cleanText(input.polling.resultPath, cleanText(input.resultPath, "", 500), 500),
    successValues: (Array.isArray(input.polling.successValues) ? input.polling.successValues : ["succeeded", "completed", "success"]).map(String).slice(0, 20),
    failureValues: (Array.isArray(input.polling.failureValues) ? input.polling.failureValues : ["failed", "error", "cancelled"]).map(String).slice(0, 20),
    intervalMs: Math.min(30000, Math.max(500, Number(input.polling.intervalMs) || 1500)),
    maxAttempts: Math.min(1200, Math.max(1, Number(input.polling.maxAttempts) || 120)),
  } : null;
  if (polling && (!polling.urlTemplate || !METHODS.has(polling.method))) throw new Error("轮询配置无效。");
  return {
    id,
    name,
    protocol: "jiaren-declarative-http-v1",
    capabilities,
    models: normalizeModels(input.models, id, capabilities),
    request: { method, urlTemplate, headers, bodyTemplate: request.bodyTemplate ?? null },
    resultPath: cleanText(input.resultPath, "", 500),
    taskIdPath: cleanText(input.taskIdPath, "", 500),
    polling,
    timeoutMs: Math.min(300000, Math.max(1000, Number(input.timeoutMs) || 60000)),
    enabled: input.enabled !== false,
  };
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error("渠道任务已取消。"));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new Error("渠道任务已取消。"));
    }, { once: true });
  });
}

function publicSecretStatus(value) {
  return Object.fromEntries(Object.entries(value || {}).map(([key, secret]) => [key, Boolean(cleanText(secret, "", 16000))]));
}

function cleanSecrets(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([key, secret]) => {
    if (!/^[a-zA-Z0-9_.-]{1,80}$/.test(key)) return [];
    const cleaned = cleanText(secret, "", 16000);
    if (!cleaned || cleaned === SESSION_SECRET_PLACEHOLDER) return [];
    return [[key, cleaned]];
  }));
}

class JiarenChannelDriverRuntime {
  constructor(options = {}) {
    this.filePath = path.join(options.dataRoot, "channel-drivers-v1.json");
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
    this.log = typeof options.log === "function" ? options.log : () => {};
    this.sessionSecrets = new Map();
    this.definitions = this.load();
  }

  load() {
    try {
      const value = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
      return Array.isArray(value) ? value.map(validateDefinition) : [];
    } catch {
      return [];
    }
  }

  persist() {
    atomicWrite(this.filePath, this.definitions);
  }

  list() {
    return this.definitions.map((item) => ({
      ...JSON.parse(JSON.stringify(item)),
      sessionSecrets: publicSecretStatus(this.sessionSecrets.get(item.id)),
    }));
  }

  save(definition) {
    const normalized = validateDefinition(definition);
    const index = this.definitions.findIndex((item) => item.id === normalized.id);
    if (index >= 0) this.definitions[index] = normalized;
    else this.definitions.push(normalized);
    this.persist();
    return { ...normalized, sessionSecrets: publicSecretStatus(this.sessionSecrets.get(normalized.id)) };
  }

  remove(id) {
    const before = this.definitions.length;
    this.definitions = this.definitions.filter((item) => item.id !== id);
    this.sessionSecrets.delete(id);
    if (this.definitions.length !== before) this.persist();
    return { ok: this.definitions.length !== before };
  }

  setSessionSecrets(id, secrets) {
    const definition = this.definitions.find((item) => item.id === id);
    if (!definition) throw new Error("渠道不存在。");
    const cleaned = cleanSecrets(secrets);
    if (Object.keys(cleaned).length) this.sessionSecrets.set(id, cleaned);
    else this.sessionSecrets.delete(id);
    return { ok: true, id, sessionSecrets: publicSecretStatus(cleaned) };
  }

  modelCatalog() {
    return this.definitions.flatMap((definition) => definition.models.filter((model) => model.enabled).map((model) => ({
      ...model,
      driverId: definition.id,
      driverName: definition.name,
      providerSource: `jiaren-channel:${definition.id}`,
    })));
  }

  resolveIdFromRequest(request = {}) {
    const direct = cleanText(request.channelDriverId || request.driverId, "", 120);
    if (direct && this.definitions.some((item) => item.id === direct)) return direct;
    const source = cleanText(request.providerSource, "", 200);
    const sourceMatch = source.match(/^jiaren-channel:(.+)$/);
    if (sourceMatch && this.definitions.some((item) => item.id === sourceMatch[1])) return sourceMatch[1];
    const candidates = [request.modelId, request.endpointModelId].map((value) => cleanText(value, "", 200)).filter(Boolean);
    const match = this.definitions.find((definition) => definition.models.some((model) => candidates.includes(model.catalogId) || candidates.includes(model.modelId)));
    return match?.id || "";
  }

  async fetchJson(request, timeoutMs, externalSignal) {
    const controller = new AbortController();
    const abort = () => controller.abort(externalSignal?.reason);
    if (externalSignal?.aborted) abort();
    else externalSignal?.addEventListener?.("abort", abort, { once: true });
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await this.fetchImpl(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        signal: controller.signal,
      });
      const text = await response.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; }
      catch { data = { text }; }
      if (!response.ok) throw new Error(`渠道请求失败（HTTP ${response.status}）。`);
      return data;
    } finally {
      clearTimeout(timer);
      externalSignal?.removeEventListener?.("abort", abort);
    }
  }

  buildRequest(definition, context, polling = false) {
    const source = polling ? definition.polling : definition.request;
    const renderedHeaders = renderTemplate(source.headers || definition.request.headers || {}, context);
    const headers = Object.fromEntries(Object.entries(renderedHeaders).map(([key, value]) => [key, String(value)]));
    const renderedBody = polling ? null : renderTemplate(source.bodyTemplate, context);
    if (renderedBody !== null && renderedBody !== undefined && !Object.keys(headers).some((key) => key.toLowerCase() === "content-type")) {
      headers["Content-Type"] = "application/json";
    }
    return {
      url: validateUrl(templateString(source.urlTemplate, context)),
      method: source.method,
      headers,
      body: renderedBody === null || renderedBody === undefined || source.method === "GET" ? undefined : JSON.stringify(renderedBody),
    };
  }

  async invoke(id, input = {}, secrets = {}, options = {}) {
    const definition = this.definitions.find((item) => item.id === id && item.enabled);
    if (!definition) throw new Error("渠道不存在或已停用。");
    if (!this.fetchImpl) throw new Error("当前运行环境不支持网络请求。");
    const mergedSecrets = { ...(this.sessionSecrets.get(id) || {}), ...cleanSecrets(secrets) };
    const context = { input, secret: mergedSecrets, task: {} };
    let response = await this.fetchJson(this.buildRequest(definition, context), definition.timeoutMs, options.signal);
    const taskId = getPath(response, definition.taskIdPath);
    if (definition.polling && taskId !== undefined && taskId !== null) {
      context.task.id = taskId;
      for (let attempt = 0; attempt < definition.polling.maxAttempts; attempt += 1) {
        await wait(definition.polling.intervalMs, options.signal);
        response = await this.fetchJson(this.buildRequest(definition, context, true), definition.timeoutMs, options.signal);
        const status = String(getPath(response, definition.polling.statusPath) ?? "").toLowerCase();
        if (definition.polling.successValues.map((item) => item.toLowerCase()).includes(status)) break;
        if (definition.polling.failureValues.map((item) => item.toLowerCase()).includes(status)) throw new Error(`渠道任务失败：${status}`);
        if (attempt === definition.polling.maxAttempts - 1) throw new Error("渠道任务轮询超时。");
      }
    }
    const resultPath = definition.polling?.resultPath || definition.resultPath;
    return { ok: true, channelId: definition.id, data: getPath(response, resultPath), raw: response };
  }

  invokeForRequest(request, capability, input = request, secrets = {}, options = {}) {
    if (!CAPABILITIES.has(capability)) throw new Error("渠道能力无效。");
    const id = this.resolveIdFromRequest(request);
    if (!id) throw new Error("没有找到请求对应的自定义渠道。");
    const definition = this.definitions.find((item) => item.id === id && item.enabled);
    if (!definition?.capabilities.includes(capability)) throw new Error(`渠道不支持 ${capability} 能力。`);
    return this.invoke(id, input, secrets, options);
  }
}

function createJiarenChannelDriverRuntime(options) {
  return new JiarenChannelDriverRuntime(options);
}

module.exports = {
  CAPABILITIES,
  SESSION_SECRET_PLACEHOLDER,
  createJiarenChannelDriverRuntime,
  getPath,
  renderTemplate,
  validateDefinition,
};
