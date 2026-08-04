"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const SCOPES = Object.freeze([
  "canvas:read",
  "canvas:write",
  "asset:read",
  "asset:transfer",
  "run:read",
  "run:execute",
]);
const OPERATION_TYPES = new Set([
  "node.add",
  "node.update",
  "node.delete",
  "node.select",
  "viewport.set",
  "edge.add",
  "edge.remove",
  "asset.add",
  "run.node",
]);

function now() {
  return new Date().toISOString();
}

function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function cleanText(value, fallback = "", max = 4000) {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function tokenHash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

// agent-control atomic writer v019
function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  const backupPath = `${temporaryPath}.bak`;
  let descriptor;
  let movedExistingFile = false;
  try {
    descriptor = fs.openSync(temporaryPath, "w");
    fs.writeFileSync(descriptor, JSON.stringify(value, null, 2), "utf8");
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = undefined;
    if (fs.existsSync(filePath)) {
      fs.renameSync(filePath, backupPath);
      movedExistingFile = true;
    }
    fs.renameSync(temporaryPath, filePath);
    if (movedExistingFile && fs.existsSync(backupPath)) {
      try { fs.unlinkSync(backupPath); } catch {}
    }
  } catch (error) {
    if (descriptor !== undefined) {
      try { fs.closeSync(descriptor); } catch {}
    }
    if (movedExistingFile && !fs.existsSync(filePath) && fs.existsSync(backupPath)) {
      try { fs.renameSync(backupPath, filePath); } catch {}
    }
    try { if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath); } catch {}
    throw error;
  }
}

function defaultState() {
  return {
    version: 1,
    activeSessionId: "",
    sessions: [],
    plans: [],
    receipts: [],
    tokens: [],
  };
}

function normalizeMessage(message) {
  if (!message || typeof message !== "object") return null;
  const role = message.role === "assistant" || message.role === "system" ? message.role : "user";
  const text = cleanText(message.text ?? message.content, "", 60000);
  if (!text) return null;
  return {
    id: cleanText(String(message.id || ""), id("message"), 160),
    role,
    text,
    createdAt: cleanText(message.createdAt, now(), 80),
    attachmentCount: Math.max(0, Math.min(60, Number(message.attachmentCount) || 0)),
  };
}

function normalizeOperation(operation, index) {
  if (!operation || typeof operation !== "object") {
    throw new Error(`第 ${index + 1} 项画布操作无效。`);
  }
  const type = cleanText(operation.type, "", 40);
  if (!OPERATION_TYPES.has(type)) {
    throw new Error(`不支持的画布操作：${type || "空类型"}`);
  }
  const normalized = clone(operation);
  normalized.type = type;
  normalized.id = cleanText(String(operation.id || ""), `operation_${index + 1}`, 160);
  return normalized;
}

function validateOperations(operations) {
  if (!Array.isArray(operations) || operations.length === 0) {
    throw new Error("计划必须至少包含一项画布操作。");
  }
  if (operations.length > 50) {
    throw new Error("单个计划最多包含 50 项画布操作。");
  }
  return operations.map(normalizeOperation);
}

function responseJson(response, statusCode, body) {
  const payload = Buffer.from(JSON.stringify(body));
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": payload.length,
    "Cache-Control": "no-store",
  });
  response.end(payload);
}

function readJsonBody(request, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error("请求内容过大。"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      try {
        const text = Buffer.concat(chunks).toString("utf8").trim();
        resolve(text ? JSON.parse(text) : {});
      } catch {
        reject(new Error("请求 JSON 无效。"));
      }
    });
    request.on("error", reject);
  });
}

class JiarenAgentControlRuntime {
  constructor(options) {
    this.dataRoot = options.dataRoot;
    this.log = typeof options.log === "function" ? options.log : () => {};
    this.broadcast = typeof options.broadcast === "function" ? options.broadcast : () => {};
    this.statePath = path.join(this.dataRoot, "agent-control-state.json");
    this.connectionPath = path.join(this.dataRoot, "agent-control.json");
    this.mcpConnectionPath = path.join(this.dataRoot, "agent-control-mcp.json");
    this.state = this.loadState();
    this.snapshot = { nodes: [], edges: [], assets: [], selectedNodeId: null, capturedAt: now() };
    this.pairings = new Map();
    this.server = null;
    this.port = 0;
    this.mcpToken = "";
    this.ensureSession();
    this.persist();
  }

  loadState() {
    try {
      const value = JSON.parse(fs.readFileSync(this.statePath, "utf8"));
      return {
        ...defaultState(),
        ...value,
        sessions: Array.isArray(value.sessions) ? value.sessions : [],
        plans: Array.isArray(value.plans) ? value.plans : [],
        receipts: Array.isArray(value.receipts) ? value.receipts : [],
        tokens: Array.isArray(value.tokens) ? value.tokens : [],
      };
    } catch {
      return defaultState();
    }
  }

  persist() {
    this.state.sessions = this.state.sessions.slice(-40);
    this.state.plans = this.state.plans.slice(-300);
    this.state.receipts = this.state.receipts.slice(-500);
    this.state.tokens = this.state.tokens.slice(-20);
    atomicWriteJson(this.statePath, this.state);
  }

  emit(type, payload = {}) {
    this.broadcast("agentControl:event", { type, ...clone(payload), at: now() });
  }

  ensureSession() {
    let session = this.state.sessions.find((item) => item.id === this.state.activeSessionId);
    if (!session) {
      session = this.createSession("新对话", false);
    }
    return clone(session);
  }

  createSession(title = "新对话", persist = true) {
    const timestamp = now();
    const session = {
      id: id("session"),
      title: cleanText(title, "新对话", 80),
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [],
      suggestions: [],
      recovery: null,
    };
    this.state.sessions.push(session);
    this.state.activeSessionId = session.id;
    if (persist) this.persist();
    this.emit("session.created", { session });
    return clone(session);
  }

  listSessions() {
    return {
      activeSessionId: this.state.activeSessionId,
      sessions: this.state.sessions
        .map(({ messages, ...session }) => ({ ...session, messageCount: Array.isArray(messages) ? messages.length : 0 }))
        .sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt))),
    };
  }

  getSession(sessionId) {
    const targetId = cleanText(String(sessionId || this.state.activeSessionId), "", 160);
    const session = this.state.sessions.find((item) => item.id === targetId);
    if (!session) throw new Error("对话不存在。")
    this.state.activeSessionId = session.id;
    this.persist();
    return clone(session);
  }

  appendMessage(sessionId, message) {
    const session = this.state.sessions.find((item) => item.id === sessionId) || this.state.sessions.find((item) => item.id === this.state.activeSessionId);
    if (!session) throw new Error("对话不存在。")
    const normalized = normalizeMessage(message);
    if (!normalized) throw new Error("消息内容为空。")
    session.messages = Array.isArray(session.messages) ? session.messages : [];
    session.messages.push(normalized);
    session.messages = session.messages.slice(-240);
    session.updatedAt = now();
    if (session.messages.filter((item) => item.role === "user").length === 1) {
      session.title = normalized.text.replace(/\s+/g, " ").slice(0, 32) || session.title;
    }
    if (normalized.role === "user") session.recovery = null;
    this.persist();
    this.emit("session.message", { sessionId: session.id, message: normalized });
    return clone(normalized);
  }

  saveSuggestions(sessionId, suggestions) {
    const session = this.state.sessions.find((item) => item.id === sessionId);
    if (!session) throw new Error("对话不存在。")
    session.suggestions = (Array.isArray(suggestions) ? suggestions : [])
      .map((item) => cleanText(item, "", 120))
      .filter(Boolean)
      .slice(0, 3);
    session.updatedAt = now();
    this.persist();
    return clone(session.suggestions);
  }

  markRecovery(sessionId, recovery) {
    const session = this.state.sessions.find((item) => item.id === sessionId);
    if (!session) return null;
    session.recovery = recovery ? { message: cleanText(recovery.message, "连接中断，可继续上次任务。", 300), requestId: cleanText(recovery.requestId, "", 160), at: now() } : null;
    session.updatedAt = now();
    this.persist();
    this.emit("session.recovery", { sessionId, recovery: session.recovery });
    return clone(session.recovery);
  }

  updateSnapshot(snapshot) {
    const input = snapshot && typeof snapshot === "object" ? snapshot : {};
    const source = JSON.parse(JSON.stringify(input, (key, value) =>
      /apiKey|authorization|cookie|token|password|credential|secret/i.test(key) ? void 0 : value
    ));
    this.snapshot = {
      nodes: Array.isArray(source.nodes) ? clone(source.nodes).slice(0, 2000) : [],
      edges: Array.isArray(source.edges) ? clone(source.edges).slice(0, 4000) : [],
      assets: Array.isArray(source.assets) ? clone(source.assets).slice(0, 2000) : [],
      selectedNodeId: source.selectedNodeId == null ? null : String(source.selectedNodeId),
      selectedAssetId: source.selectedAssetId == null ? null : String(source.selectedAssetId),
      selectedNode: source.selectedNode && typeof source.selectedNode === "object" ? clone(source.selectedNode) : null,
      selectedAsset: source.selectedAsset && typeof source.selectedAsset === "object" ? clone(source.selectedAsset) : null,
      viewport: source.viewport && typeof source.viewport === "object" ? clone(source.viewport) : null,
      capturedAt: now(),
    };
    return { ok: true, capturedAt: this.snapshot.capturedAt };
  }

  getSnapshot() {
    return clone(this.snapshot);
  }

  capabilityManifest() {
    return {
      id: "jiaren-canvas-control",
      name: "Jiaren Canvas Control",
      version: "1.0.0",
      scopes: [...SCOPES],
      operations: [...OPERATION_TYPES],
      approvalRequired: true,
      apiKeysExposed: false,
    };
  }

  submitPlan(input, source = "Jiaren Agent") {
    const operations = validateOperations(input?.operations);
    const timestamp = now();
    const plan = {
      id: id("plan"),
      source: cleanText(input?.source, source, 80),
      sessionId: cleanText(String(input?.sessionId || ""), "", 160) || null,
      title: cleanText(input?.title, "画布操作计划", 120),
      summary: cleanText(input?.summary, `${operations.length} 项画布操作待审批`, 500),
      operations,
      status: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.state.plans.push(plan);
    this.persist();
    this.emit("plan.pending", { plan });
    return clone(plan);
  }

  listPlans(status) {
    const wanted = cleanText(status, "", 30);
    const plans = wanted ? this.state.plans.filter((item) => item.status === wanted) : this.state.plans;
    return clone(plans.slice().reverse());
  }

  getPlan(planId) {
    const plan = this.state.plans.find((item) => item.id === String(planId));
    if (!plan) throw new Error("计划不存在。")
    return clone(plan);
  }

  setPlanStatus(planId, status, note = "") {
    const plan = this.state.plans.find((item) => item.id === String(planId));
    if (!plan) throw new Error("计划不存在。")
    if (status !== "approved" && status !== "rejected") {
      throw new Error(`不支持的审批状态：${status}`);
    }
    if (plan.status !== "pending") {
      throw new Error(`计划当前状态为 ${plan.status}，不能重复审批。`);
    }
    plan.status = status;
    plan.note = cleanText(note, "", 500) || undefined;
    plan.updatedAt = now();
    if (status === "approved") plan.approvedAt = plan.updatedAt;
    if (status === "rejected") plan.rejectedAt = plan.updatedAt;
    this.persist();
    this.emit(`plan.${status}`, { plan });
    return clone(plan);
  }

  completePlan(planId, result) {
    const plan = this.state.plans.find((item) => item.id === String(planId));
    if (!plan) throw new Error("计划不存在。")
    if (plan.status !== "approved") {
      throw new Error(`计划当前状态为 ${plan.status}，只有已批准的计划可以执行。`);
    }
    const ok = Boolean(result?.ok);
    plan.status = ok ? "completed" : "failed";
    plan.updatedAt = now();
    const receipt = {
      id: id("receipt"),
      planId: plan.id,
      status: plan.status,
      summary: cleanText(result?.summary, ok ? "画布操作已执行。" : "画布操作执行失败。", 500),
      result: clone(result?.result ?? null),
      error: cleanText(result?.error, "", 1000) || null,
      createdAt: plan.updatedAt,
    };
    this.state.receipts.push(receipt);
    this.persist();
    this.emit("plan.receipt", { plan, receipt });
    return clone(receipt);
  }

  listReceipts() {
    return clone(this.state.receipts.slice().reverse());
  }

  startPairing(label = "Jiaren Canvas CLI") {
    const pairingId = id("pairing");
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    const expiresAt = Date.now() + 5 * 60 * 1000;
    this.pairings.set(pairingId, { pairingId, codeHash: tokenHash(code), label: cleanText(label, "Jiaren Canvas CLI", 80), expiresAt, status: "waiting" });
    this.emit("pairing.waiting", { pairingId, label, expiresAt: new Date(expiresAt).toISOString() });
    return { pairingId, code, host: "127.0.0.1", port: this.port, expiresAt: new Date(expiresAt).toISOString(), scopes: [...SCOPES] };
  }

  pair(code, label) {
    const codeDigest = tokenHash(cleanText(String(code || ""), "", 16));
    const pairing = [...this.pairings.values()].find((item) => item.status === "waiting" && item.expiresAt > Date.now() && item.codeHash === codeDigest);
    if (!pairing) throw new Error("配对码无效或已过期。")
    pairing.status = "paired";
    const token = crypto.randomBytes(32).toString("base64url");
    this.state.tokens.push({ id: id("token"), hash: tokenHash(token), label: cleanText(label, pairing.label, 80), scopes: [...SCOPES], createdAt: now(), lastUsedAt: now() });
    this.persist();
    this.emit("pairing.paired", { pairingId: pairing.pairingId, label: pairing.label });
    return { token, scopes: [...SCOPES] };
  }

  provisionMcpCredential() {
    const token = crypto.randomBytes(32).toString("base64url");
    this.state.tokens = this.state.tokens.filter((item) => item.id !== "mcp-session");
    this.state.tokens.push({ id: "mcp-session", hash: tokenHash(token), label: "Jiaren Canvas MCP", scopes: [...SCOPES], createdAt: now(), lastUsedAt: now() });
    this.mcpToken = token;
    this.persist();
    atomicWriteJson(this.mcpConnectionPath, { version: 1, host: "127.0.0.1", port: this.port, token, pid: process.pid, startedAt: now() });
  }

  authorize(request, scope) {
    const header = cleanText(request.headers.authorization, "", 500);
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) return false;
    const hash = tokenHash(match[1]);
    const token = this.state.tokens.find((item) => item.hash === hash);
    if (!token || !Array.isArray(token.scopes) || !token.scopes.includes(scope)) return false;
    token.lastUsedAt = now();
    this.persist();
    return true;
  }

  async handleHttp(request, response) {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    try {
      if (request.method === "GET" && url.pathname === "/v1/status") {
        responseJson(response, 200, { ok: true, name: "Jiaren Canvas Control", version: "1.0.0", port: this.port, pairedClients: this.state.tokens.length });
        return;
      }
      if (request.method === "POST" && url.pathname === "/v1/pair") {
        responseJson(response, 200, { ok: true, ...this.pair(await readJsonBody(request).then((body) => body.code), request.headers["user-agent"] || "Jiaren Canvas CLI") });
        return;
      }
      const requiredScope = request.method === "GET" ? "canvas:read" : "canvas:write";
      if (!this.authorize(request, requiredScope)) {
        responseJson(response, 401, { ok: false, error: "未配对或权限不足。" });
        return;
      }
      if (request.method === "GET" && url.pathname === "/v1/capabilities") {
        responseJson(response, 200, { ok: true, manifest: this.capabilityManifest() });
      } else if (request.method === "GET" && url.pathname === "/v1/snapshot") {
        responseJson(response, 200, { ok: true, snapshot: this.getSnapshot() });
      } else if (request.method === "POST" && url.pathname === "/v1/plans") {
        responseJson(response, 201, { ok: true, plan: this.submitPlan(await readJsonBody(request), "Jiaren Canvas CLI") });
      } else if (request.method === "GET" && url.pathname === "/v1/plans") {
        responseJson(response, 200, { ok: true, plans: this.listPlans(url.searchParams.get("status") || "") });
      } else if (request.method === "GET" && url.pathname === "/v1/receipts") {
        responseJson(response, 200, { ok: true, receipts: this.listReceipts() });
      } else {
        responseJson(response, 404, { ok: false, error: "接口不存在。" });
      }
    } catch (error) {
      responseJson(response, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
    }
  }

  start() {
    if (this.server) return Promise.resolve(this.status());
    return new Promise((resolve, reject) => {
      this.server = http.createServer((request, response) => void this.handleHttp(request, response));
      this.server.once("error", reject);
      this.server.listen(0, "127.0.0.1", () => {
        this.port = this.server.address().port;
        atomicWriteJson(this.connectionPath, { version: 1, host: "127.0.0.1", port: this.port, pid: process.pid, startedAt: now() });
        this.provisionMcpCredential();
        this.log(`agent-control listening=127.0.0.1:${this.port}`);
        resolve(this.status());
      });
    });
  }

  status() {
    return {
      ok: Boolean(this.server && this.port),
      host: "127.0.0.1",
      port: this.port,
      activeSessionId: this.state.activeSessionId,
      pendingPlans: this.state.plans.filter((item) => item.status === "pending").length,
      pairedClients: this.state.tokens.length,
      manifest: this.capabilityManifest(),
    };
  }

  stop() {
    if (!this.server) return Promise.resolve();
    const server = this.server;
    this.server = null;
    this.port = 0;
    this.mcpToken = "";
    try { fs.unlinkSync(this.connectionPath); } catch {}
    try { fs.unlinkSync(this.mcpConnectionPath); } catch {}
    return new Promise((resolve) => server.close(resolve));
  }
}

function createJiarenAgentControlRuntime(options) {
  return new JiarenAgentControlRuntime(options);
}

module.exports = {
  OPERATION_TYPES,
  SCOPES,
  createJiarenAgentControlRuntime,
  validateOperations,
};
