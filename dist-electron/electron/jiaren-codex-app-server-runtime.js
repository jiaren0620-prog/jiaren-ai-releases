"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const WebSocket = require("ws");
const {
  CODEX_INSTALL_COMMAND,
  resolveCodexExecutable,
} = require("../../jiaren-local-service/src/utils/codexCliRunner.js");

const APPROVAL_METHODS = new Set([
  "item/commandExecution/requestApproval",
  "item/fileChange/requestApproval",
  "item/permissions/requestApproval",
]);
const CANVAS_TOOL_METHOD = "item/tool/call";
const CANVAS_TOOLS = Object.freeze([
  {
    type: "function",
    name: "jiaren_canvas_read",
    description: "Read the current Jiaren canvas snapshot. API keys and credentials are always removed.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    type: "function",
    name: "jiaren_canvas_submit_plan",
    description: "Submit canvas operations for explicit user approval. This never applies changes directly.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        summary: { type: "string" },
        operations: {
          type: "array",
          minItems: 1,
          maxItems: 50,
          items: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["node.add", "node.update", "node.delete", "node.select", "viewport.set", "edge.add", "edge.remove", "asset.add", "run.node"] },
            },
            required: ["type"],
            additionalProperties: true,
          },
        },
      },
      required: ["operations"],
      additionalProperties: false,
    },
  },
]);
const SECRET_KEY = /apiKey|authorization|cookie|token|password|credential|secret/i;
const RASTER_IMAGE_EXT = /\.(png|jpe?g|webp|gif|bmp|avif|tiff?)$/i;
const DIRECT_CODEX_INSTRUCTIONS = [
  "You are Jiaren Agent inside an infinite canvas. Respond in the user's language and send short, natural progress commentary so the user can see what is happening.",
  "For a brand-new raster image request, use the built-in image_gen tool directly. Do not read the canvas first, do not call jiaren_canvas_generate_image, and do not delegate to any image model configured in Jiaren AI.",
  "Jiaren AI automatically imports the completed imageGeneration savedPath into the current canvas, so do not create a second image node or submit a canvas plan for that generated file.",
  "Read the canvas or selection only when the request edits an existing node, uses a canvas image as a reference, connects nodes, or depends on current layout or content.",
  "If built-in image_gen is unavailable for the current Codex login, say that Codex account login with image-generation capability is required and stop. Never fall back to jiaren_canvas_generate_image, GPT Image, GrsAI, another provider, SVG, shell-generated artwork, HTML, or canvas drawing code.",
  "Use jiaren_canvas_create_svg only when the user explicitly requests SVG, vector artwork, an icon, a logo, or editable line art. A product main image or e-commerce main image is not a vector request.",
  "For non-image canvas writes, submit one scoped plan through the Jiaren approval bridge and preserve existing nodes unless the user asks to remove them.",
  "Never expose API keys, login tokens, provider routes, or hidden executor details, and never claim success before the built-in imageGeneration item has completed.",
].join(" ");

function cleanText(value, fallback = "", max = 4000) {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

function redact(value, depth = 0) {
  if (depth > 8) return "[truncated]";
  if (Array.isArray(value)) return value.slice(0, 200).map((item) => redact(item, depth + 1));
  if (!value || typeof value !== "object") return value;
  const output = {};
  for (const [key, item] of Object.entries(value)) {
    output[key] = SECRET_KEY.test(key) ? "[redacted]" : redact(item, depth + 1);
  }
  return output;
}

function isInside(root, candidate) {
  const resolvedRoot = path.resolve(root);
  const resolvedCandidate = path.resolve(candidate);
  return resolvedCandidate === resolvedRoot || resolvedCandidate.startsWith(`${resolvedRoot}${path.sep}`);
}

function imageMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".bmp") return "image/bmp";
  if (ext === ".avif") return "image/avif";
  if (ext === ".tif" || ext === ".tiff") return "image/tiff";
  return "application/octet-stream";
}

function resolveGeneratedImagePath(item, workspaceRoot) {
  const rawCandidates = [item?.savedPath, item?.result]
    .map((value) => cleanText(value, "", 12000))
    .filter(Boolean);
  const allowedRoots = [
    path.join(os.homedir(), ".codex", "generated_images"),
    path.resolve(workspaceRoot),
  ].filter((root) => fs.existsSync(root));
  for (const raw of rawCandidates) {
    if (!path.isAbsolute(raw) || !RASTER_IMAGE_EXT.test(raw)) continue;
    let resolved;
    try {
      resolved = fs.realpathSync(raw);
      const stat = fs.statSync(resolved);
      if (!stat.isFile() || stat.size <= 0 || stat.size > 128 * 1024 * 1024) continue;
    } catch {
      continue;
    }
    if (allowedRoots.some((root) => isInside(fs.realpathSync(root), resolved))) return resolved;
  }
  return "";
}

function nextCanvasPosition(snapshot) {
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : [];
  if (nodes.length === 0) return { x: 420, y: 260 };
  const right = nodes.reduce((max, node) => {
    const x = Number(node?.position?.x) || 0;
    const width = Number(node?.width || node?.data?.width) || 360;
    return Math.max(max, x + width);
  }, 0);
  return { x: right + 80, y: 260 };
}

function resolveMcpServerPath(explicitPath = "") {
  const candidates = [
    cleanText(explicitPath, "", 12000),
    process.resourcesPath && path.join(process.resourcesPath, "tools", "jiaren-canvas-mcp", "bin", "jiaren-canvas-mcp.cjs"),
    path.resolve(__dirname, "..", "..", "tools", "jiaren-canvas-mcp", "bin", "jiaren-canvas-mcp.cjs"),
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || "";
}

function resolvePluginTemplatePath(explicitPath = "") {
  const candidates = [
    cleanText(explicitPath, "", 12000),
    process.resourcesPath && path.join(process.resourcesPath, "plugins", "jiaren-canvas"),
    path.resolve(__dirname, "..", "..", "plugins", "jiaren-canvas"),
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(path.join(candidate, ".codex-plugin", "plugin.json"))) || "";
}

function normalizeInput(items) {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Codex 输入不能为空。");
  return items.slice(0, 80).map((item) => {
    if (!item || typeof item !== "object") throw new Error("Codex 输入格式无效。");
    if (item.type === "text") {
      const text = cleanText(item.text, "", 120000);
      if (!text) throw new Error("Codex 文本输入不能为空。");
      return { type: "text", text };
    }
    if (item.type === "image") {
      const url = cleanText(item.url, "", 12000);
      if (!/^https:\/\//i.test(url)) throw new Error("网络图片必须使用 HTTPS 地址。");
      return { type: "image", url };
    }
    if (item.type === "localImage") {
      const localPath = path.resolve(cleanText(item.path, "", 12000));
      if (!fs.existsSync(localPath) || !fs.statSync(localPath).isFile()) throw new Error("本地图片不存在。");
      return { type: "localImage", path: localPath };
    }
    throw new Error(`不支持的 Codex 输入类型：${item.type || "空"}`);
  });
}

class JiarenCodexAppServerRuntime {
  constructor(options = {}) {
    this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
    this.log = typeof options.log === "function" ? options.log : () => {};
    this.broadcast = typeof options.broadcast === "function" ? options.broadcast : () => {};
    this.spawnProcess = options.spawnProcess || spawn;
    this.WebSocketImpl = options.WebSocketImpl || WebSocket;
    this.resolveExecutable = options.resolveExecutable || resolveCodexExecutable;
    this.readCanvas = typeof options.readCanvas === "function" ? options.readCanvas : () => ({ nodes: [], edges: [], assets: [] });
    this.submitCanvasPlan = typeof options.submitCanvasPlan === "function" ? options.submitCanvasPlan : null;
    this.importGeneratedImage = typeof options.importGeneratedImage === "function" ? options.importGeneratedImage : null;
    this.mcpServerPath = resolveMcpServerPath(options.mcpServerPath);
    this.pluginTemplatePath = resolvePluginTemplatePath(options.pluginTemplatePath);
    this.mcpMarketplaceRoot = path.resolve(options.mcpMarketplaceRoot || path.join(os.homedir(), ".jiaren-ai", "codex-marketplace"));
    this.child = null;
    this.socket = null;
    this.mode = "local";
    this.buffer = "";
    this.requestId = 0;
    this.pending = new Map();
    this.approvals = new Map();
    this.initialized = false;
    this.executable = "";
    this.account = null;
    this.capabilities = { imageGeneration: false, namespaceTools: false, webSearch: false };
    this.importedImageItems = new Set();
    this.activeThread = null;
    this.activeTurn = null;
    this.lastError = "";
    this.resolvedExecutable = null;
  }

  emit(type, payload = {}) {
    this.broadcast("codexAppServer:event", { type, ...redact(payload), at: new Date().toISOString() });
  }

  publicApproval(requestId, method, params) {
    return {
      requestId: String(requestId),
      method,
      threadId: params?.threadId || "",
      turnId: params?.turnId || "",
      itemId: params?.itemId || "",
      reason: cleanText(params?.reason, "", 2000),
      command: cleanText(params?.command, "", 8000),
      cwd: cleanText(params?.cwd, "", 12000),
      commandActions: redact(params?.commandActions || []),
      networkApprovalContext: redact(params?.networkApprovalContext || null),
      requestedPermissions: redact(params?.permissions || params?.requestedPermissions || params?.additionalPermissions || null),
    };
  }

  status() {
    const resolved = this.resolvedExecutable || this.resolveExecutable({ executablePath: this.executable || undefined });
    this.resolvedExecutable = resolved;
    return {
      available: Boolean(resolved.usable && !resolved.fromWindowsApps),
      running: Boolean((this.child && !this.child.killed) || (this.socket && this.socket.readyState === this.WebSocketImpl.OPEN)),
      initialized: this.initialized,
      executable: this.executable || resolved.executable || "",
      installCommand: CODEX_INSTALL_COMMAND,
      message: resolved.fromWindowsApps
        ? `检测到 Codex 桌面应用，但没有可调用的 Codex CLI。请安装：${CODEX_INSTALL_COMMAND}`
        : resolved.usable ? (this.lastError || "Codex CLI 已就绪。") : `未检测到 Codex CLI。请安装：${CODEX_INSTALL_COMMAND}`,
      account: redact(this.account),
      capabilities: redact(this.capabilities),
      activeThread: redact(this.activeThread),
      activeTurn: redact(this.activeTurn),
      pendingApprovals: [...this.approvals.values()].map((item) => item.public),
      workspaceRoot: this.workspaceRoot,
      mode: this.mode,
    };
  }

  setWorkspaceRoot(candidate) {
    if (this.child && !this.child.killed) throw new Error("请先断开 Codex，再切换项目目录。");
    const resolved = path.resolve(cleanText(candidate, "", 12000));
    if (!resolved || !fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) throw new Error("Codex 项目目录不存在。");
    this.workspaceRoot = resolved;
    this.emit("workspace.changed", { workspaceRoot: resolved });
    return this.status();
  }

  async start(options = {}) {
    const requestedMode = options.mode === "remote" ? "remote" : "local";
    if (this.initialized && this.status().running && this.mode === requestedMode) return this.status();
    if (this.child || this.socket) await this.stop();
    this.mode = requestedMode;
    if (requestedMode === "remote") return this.startRemote(options);
    fs.mkdirSync(this.workspaceRoot, { recursive: true });
    const resolved = this.resolveExecutable({ executablePath: options.executablePath });
    this.resolvedExecutable = resolved;
    if (!resolved.usable || resolved.fromWindowsApps) {
      this.lastError = resolved.fromWindowsApps
        ? `Codex 桌面应用不能作为 CLI 调用。请安装：${CODEX_INSTALL_COMMAND}`
        : `未检测到 Codex CLI。请安装：${CODEX_INSTALL_COMMAND}`;
      return this.status();
    }
    this.executable = resolved.command;
    this.lastError = "";
    const child = this.spawnProcess(resolved.command, ["app-server", "--enable", "image_generation", "-c", 'model_reasoning_effort="low"'], {
      cwd: this.workspaceRoot,
      shell: resolved.shell,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ...(options.env || {}) },
    });
    this.child = child;
    this.buffer = "";
    child.stdout?.on("data", (chunk) => this.consume(chunk));
    child.stderr?.on("data", (chunk) => {
      const message = cleanText(chunk.toString("utf8"), "", 4000);
      if (message) this.log(`codex-app-server stderr=${message.replace(/\s+/g, " ")}`);
    });
    child.on("error", (error) => this.handleExit(error));
    child.on("close", (code) => this.handleExit(new Error(`Codex App Server 已退出（${code ?? "未知"}）。`)));
    await this.request("initialize", {
      clientInfo: { name: "jiaren_ai_canvas", title: "Jiaren AI", version: "1.1.2" },
      capabilities: { experimentalApi: true },
    }, 20000);
    this.notify("initialized", {});
    this.initialized = true;
    this.emit("connection.ready", this.status());
    try { await this.readAccount(false); } catch {}
    return this.status();
  }

  async startRemote(options = {}) {
    const remoteUrl = new URL(cleanText(options.remoteUrl, "", 4000));
    if (remoteUrl.protocol !== "wss:") throw new Error("网络 Agent 仅允许使用加密的 wss:// 地址。");
    const token = cleanText(options.token, "", 16000);
    if (token.length < 24) throw new Error("网络 Agent 必须使用高强度访问令牌。");
    const socket = new this.WebSocketImpl(remoteUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      handshakeTimeout: 15000,
      perMessageDeflate: false,
      maxPayload: 16 * 1024 * 1024,
    });
    this.socket = socket;
    this.lastError = "";
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("网络 Agent 连接超时。")), 16000);
      socket.once("open", () => { clearTimeout(timer); resolve(); });
      socket.once("error", (error) => { clearTimeout(timer); reject(error); });
    });
    socket.on("message", (data) => {
      const payload = Buffer.isBuffer(data) ? data.toString("utf8") : String(data);
      this.consume(Buffer.from(`${payload}\n`));
    });
    socket.on("error", (error) => this.handleExit(error));
    socket.on("close", (code) => this.handleExit(new Error(`网络 Agent 已断开（${code}）。`)));
    await this.request("initialize", {
      clientInfo: { name: "jiaren_ai_canvas", title: "Jiaren AI", version: "1.1.2" },
      capabilities: { experimentalApi: true },
    }, 20000);
    this.notify("initialized", {});
    this.initialized = true;
    this.emit("connection.ready", this.status());
    try { await this.readAccount(false); } catch {}
    return this.status();
  }

  ensureReady() {
    if (!this.status().running || !this.initialized) throw new Error("Codex App Server 尚未连接。");
  }

  send(message) {
    if (this.socket && this.socket.readyState === this.WebSocketImpl.OPEN) {
      this.socket.send(JSON.stringify(message));
      return;
    }
    if (!this.child?.stdin?.writable) throw new Error("Codex App Server 连接不可写。");
    this.child.stdin.write(`${JSON.stringify(message)}\n`);
  }

  notify(method, params = {}) {
    this.send({ method, params });
  }

  request(method, params = {}, timeoutMs = 30000) {
    if (method !== "initialize") this.ensureReady();
    const id = ++this.requestId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Codex 请求超时：${method}`));
      }, Math.max(1000, timeoutMs));
      this.pending.set(id, { method, resolve, reject, timer });
      try { this.send({ method, id, params }); }
      catch (error) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(error);
      }
    });
  }

  consume(chunk) {
    this.buffer += chunk.toString("utf8");
    for (;;) {
      const newline = this.buffer.indexOf("\n");
      if (newline < 0) break;
      const line = this.buffer.slice(0, newline).trim();
      this.buffer = this.buffer.slice(newline + 1);
      if (!line) continue;
      try { this.handleMessage(JSON.parse(line)); }
      catch (error) { this.log(`codex-app-server invalid-json=${cleanText(error?.message || String(error), "", 500)}`); }
    }
  }

  handleMessage(message) {
    if (message && Object.prototype.hasOwnProperty.call(message, "id") && !message.method) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(cleanText(message.error.message, "Codex 请求失败。", 4000)));
      else pending.resolve(message.result);
      return;
    }
    if (!message?.method) return;
    if (Object.prototype.hasOwnProperty.call(message, "id")) {
      if (APPROVAL_METHODS.has(message.method)) {
        const publicRequest = this.publicApproval(message.id, message.method, message.params || {});
        this.approvals.set(String(message.id), { id: message.id, method: message.method, params: message.params || {}, public: publicRequest });
        this.emit("approval.requested", { approval: publicRequest });
      } else if (message.method === CANVAS_TOOL_METHOD) {
        this.handleCanvasTool(message);
      } else {
        this.send({ id: message.id, error: { code: -32601, message: "Jiaren AI 不支持此服务端请求。" } });
      }
      return;
    }
    this.handleNotification(message.method, message.params || {});
  }

  handleCanvasTool(message) {
    const params = message.params || {};
    const tool = cleanText(params.tool, "", 120);
    try {
      let value;
      if (tool === "jiaren_canvas_read") {
        value = { ok: true, snapshot: redact(this.readCanvas()) };
      } else if (tool === "jiaren_canvas_submit_plan") {
        if (!this.submitCanvasPlan) throw new Error("Jiaren 画布审批服务不可用。");
        value = { ok: true, plan: this.submitCanvasPlan({ ...(params.arguments || {}), source: "Codex App Server" }) };
      } else {
        throw new Error(`未知的 Jiaren 画布工具：${tool || "空"}`);
      }
      this.send({ id: message.id, result: { contentItems: [{ type: "inputText", text: JSON.stringify(redact(value)) }], success: true } });
      this.emit("canvas.tool.completed", { tool, threadId: params.threadId, turnId: params.turnId, callId: params.callId });
    } catch (error) {
      const messageText = cleanText(error?.message || String(error), "画布工具执行失败。", 4000);
      this.send({ id: message.id, result: { contentItems: [{ type: "inputText", text: JSON.stringify({ ok: false, error: messageText }) }], success: false } });
      this.emit("canvas.tool.failed", { tool, message: messageText });
    }
  }

  handleImageGenerationItem(params) {
    const item = params?.item || {};
    if (item.type !== "imageGeneration") return;
    const key = `${params?.threadId || ""}:${params?.turnId || ""}:${item.id || ""}:${item.savedPath || ""}`;
    if (this.importedImageItems.has(key)) return;
    if (String(item.status || "").toLowerCase() !== "completed") {
      this.emit("image.generation.failed", {
        threadId: params?.threadId || "",
        turnId: params?.turnId || "",
        itemId: item.id || "",
        message: "Codex image generation did not complete.",
      });
      return;
    }
    try {
      if (!this.importGeneratedImage || !this.submitCanvasPlan) {
        throw new Error("Jiaren image import bridge is unavailable.");
      }
      const sourcePath = resolveGeneratedImagePath(item, this.workspaceRoot);
      if (!sourcePath) throw new Error("Codex did not return a readable final image file.");
      const asset = this.importGeneratedImage(sourcePath, item) || {};
      const imageSource = cleanText(asset.url || asset.imageSource || asset.dataUrl, "", 160000000);
      if (!imageSource) throw new Error("Jiaren could not import the Codex image file.");
      const title = cleanText(asset.title || asset.fileName || path.basename(sourcePath), "Codex image", 120);
      const operation = {
        type: "node.add",
        ref: `codex-image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        kind: "imageInput",
        position: nextCanvasPosition(this.readCanvas()),
        ...(Number(asset.width) > 0 ? { width: Number(asset.width) } : {}),
        ...(Number(asset.height) > 0 ? { height: Number(asset.height) } : {}),
        data: {
          kind: "imageInput",
          label: title,
          title,
          description: "Generated by Codex and imported into Jiaren AI.",
          status: "succeeded",
          message: "Codex image generation completed.",
          imageSource,
          imageUrl: imageSource,
          imageUrls: [imageSource],
          directImageUrl: imageSource,
          directImageUrls: [imageSource],
          localPath: cleanText(asset.localPath, "", 12000) || undefined,
          fileName: cleanText(asset.fileName, path.basename(sourcePath), 260),
          mimeType: cleanText(asset.mimeType, imageMime(sourcePath), 120),
          width: Number(asset.width) || undefined,
          height: Number(asset.height) || undefined,
          generationPrompt: cleanText(item.revisedPrompt, "", 60000),
          agentResult: true,
          agentSource: "codex-image-gen",
          codexImageGeneration: true,
          codexItemId: cleanText(item.id, "", 200),
        },
      };
      const plan = this.submitCanvasPlan({
        title: "Codex image ready",
        summary: "Import the completed Codex image into the current Jiaren canvas.",
        source: "Codex App Server Image Generation",
        operations: [operation],
      });
      this.importedImageItems.add(key);
      if (this.importedImageItems.size > 256) {
        this.importedImageItems.delete(this.importedImageItems.values().next().value);
      }
      this.emit("image.generation.imported", {
        threadId: params?.threadId || "",
        turnId: params?.turnId || "",
        itemId: item.id || "",
        plan,
      });
    } catch (error) {
      this.emit("image.generation.failed", {
        threadId: params?.threadId || "",
        turnId: params?.turnId || "",
        itemId: item.id || "",
        message: cleanText(error?.message || String(error), "Codex image import failed.", 2000),
      });
    }
  }

  handleNotification(method, params) {
    if (method === "account/updated") this.account = { ...(this.account || {}), authMode: params.authMode, planType: params.planType };
    if (method === "thread/started") this.activeThread = params.thread || this.activeThread;
    if (method === "turn/started") this.activeTurn = params.turn || this.activeTurn;
    if (method === "turn/completed") this.activeTurn = params.turn || null;
    if (method === "serverRequest/resolved" && params.requestId !== undefined) this.approvals.delete(String(params.requestId));
    if (method === "item/completed" && params?.item?.type === "imageGeneration") this.handleImageGenerationItem(params);
    const publicParams = params?.item?.type === "imageGeneration"
      ? { ...params, item: { ...params.item, savedPath: undefined, result: undefined } }
      : params;
    this.emit("notification", { method, params: publicParams });
  }

  handleExit(error) {
    if (!this.child && !this.socket && !this.initialized) return;
    this.lastError = cleanText(error?.message || String(error), "Codex App Server 已断开。", 2000);
    this.initialized = false;
    this.child = null;
    this.socket = null;
    this.activeTurn = null;
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(new Error(this.lastError));
    }
    this.pending.clear();
    this.approvals.clear();
    this.emit("connection.closed", { message: this.lastError });
  }

  async readAccount(refreshToken = false) {
    const result = await this.request("account/read", { refreshToken: Boolean(refreshToken) });
    this.account = result?.account || null;
    try {
      const capabilities = await this.request("modelProvider/capabilities/read", {});
      this.capabilities = {
        imageGeneration: capabilities?.imageGeneration === true,
        namespaceTools: capabilities?.namespaceTools === true,
        webSearch: capabilities?.webSearch === true,
      };
    } catch {
      this.capabilities = { imageGeneration: false, namespaceTools: false, webSearch: false };
    }
    this.emit("account.updated", { account: this.account, capabilities: this.capabilities, requiresOpenaiAuth: result?.requiresOpenaiAuth });
    return redact(result);
  }

  async installCanvasMcp() {
    const resolved = this.resolveExecutable({});
    this.resolvedExecutable = resolved;
    if (!resolved.usable || resolved.fromWindowsApps) throw new Error(`未检测到可调用的 Codex CLI。请先安装：${CODEX_INSTALL_COMMAND}`);
    if (!this.mcpServerPath) throw new Error("Jiaren Canvas MCP 运行文件不存在。");
    if (!this.pluginTemplatePath) throw new Error("Jiaren Canvas Codex 插件模板不存在。");
    const marketplaceRoot = this.mcpMarketplaceRoot;
    const pluginRoot = path.join(marketplaceRoot, "plugins", "jiaren-canvas");
    const marketplacePath = path.join(marketplaceRoot, ".agents", "plugins", "marketplace.json");
    fs.mkdirSync(path.dirname(marketplacePath), { recursive: true });
    fs.mkdirSync(path.dirname(pluginRoot), { recursive: true });
    fs.cpSync(this.pluginTemplatePath, pluginRoot, { recursive: true, force: true });
    fs.writeFileSync(path.join(pluginRoot, ".mcp.json"), JSON.stringify({
      mcpServers: {
        "jiaren-canvas": {
          command: process.execPath,
          args: [this.mcpServerPath],
          env: { ELECTRON_RUN_AS_NODE: "1" },
          startup_timeout_sec: 20,
          tool_timeout_sec: 90,
        },
      },
    }, null, 2), "utf8");
    fs.writeFileSync(marketplacePath, JSON.stringify({
      name: "jiaren-ai-local",
      interface: { displayName: "JiarenAI Local" },
      plugins: [{
        name: "jiaren-canvas",
        source: { source: "local", path: "./plugins/jiaren-canvas" },
        policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
        category: "Productivity",
      }],
    }, null, 2), "utf8");
    const run = (args, allowFailure = false) => new Promise((resolve, reject) => {
      const child = this.spawnProcess(resolved.command, args, { cwd: this.workspaceRoot, shell: resolved.shell, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: process.env });
      let stdout = "";
      let stderr = "";
      child.stdout?.on("data", (chunk) => { stdout += chunk.toString("utf8"); });
      child.stderr?.on("data", (chunk) => { stderr += chunk.toString("utf8"); });
      child.once("error", reject);
      child.once("close", (code) => code === 0 || allowFailure ? resolve({ code, stdout, stderr }) : reject(new Error(cleanText(stderr || stdout, `Codex MCP 安装失败（${code}）。`, 4000))));
    });
    await run(["plugin", "remove", "jiaren-canvas@jiaren-ai-local"], true);
    await run(["plugin", "marketplace", "remove", "jiaren-ai-local"], true);
    await run(["plugin", "marketplace", "add", marketplaceRoot], true);
    const result = await run(["plugin", "add", "jiaren-canvas@jiaren-ai-local"]);
    this.emit("canvas.mcp.installed", { name: "jiaren-canvas" });
    return { ok: true, name: "jiaren-canvas", marketplacePath, message: "Jiaren Canvas 插件与 MCP 已安装到本机 Codex。请在 Codex 中开启新对话以加载工具。", output: cleanText(result.stdout || result.stderr, "", 1000) };
  }

  async login(type = "chatgpt", credential = "") {
    const allowed = new Set(["chatgpt", "chatgptDeviceCode", "apiKey"]);
    if (!allowed.has(type)) throw new Error("Jiaren AI 仅支持 OpenAI 账号、设备码或 API Key 登录。");
    let params;
    if (type === "chatgpt") {
      params = { type, useHostedLoginSuccessPage: true, appBrand: "codex" };
    } else if (type === "apiKey") {
      const apiKey = cleanText(credential, "", 16000);
      if (apiKey.length < 20) throw new Error("请输入有效的 OpenAI API Key。");
      params = { type, apiKey };
    } else {
      params = { type };
    }
    const result = await this.request("account/login/start", params, 30000);
    this.emit("login.started", { login: result });
    if (type === "apiKey") {
      const accountResult = await this.readAccount(true);
      const authMode = accountResult?.account?.authMode || accountResult?.account?.type;
      if (authMode !== "apiKey") {
        this.account = null;
        throw new Error("OpenAI API Key 登录未完成，请检查 Key 是否有效后重试。");
      }
    }
    return redact(result);
  }

  cancelLogin(loginId) {
    return this.request("account/login/cancel", { loginId: cleanText(loginId, "", 200) });
  }

  logout() {
    return this.request("account/logout", {});
  }

  listModels() {
    return this.request("model/list", { limit: 100, includeHidden: false });
  }

  listThreads(options = {}) {
    return this.request("thread/list", { limit: Math.min(100, Math.max(1, Number(options.limit) || 30)), sortKey: "updated_at", sortDirection: "desc", cwd: this.workspaceRoot });
  }

  readThread(threadId, includeTurns = true) {
    return this.request("thread/read", { threadId: cleanText(threadId, "", 200), includeTurns: Boolean(includeTurns) });
  }

  async startThread(options = {}) {
    const canvasBridge = this.mcpServerPath
      ? {
          config: {
            model_reasoning_summary: "auto",
            mcp_servers: {
              "jiaren-canvas": {
                command: process.execPath,
                args: [this.mcpServerPath],
                env: { ELECTRON_RUN_AS_NODE: "1" },
                default_tools_approval_mode: "approve",
                startup_timeout_sec: 20,
                tool_timeout_sec: 90,
              },
            },
          },
        }
      : { dynamicTools: CANVAS_TOOLS };
    const result = await this.request("thread/start", {
      cwd: this.workspaceRoot,
      approvalPolicy: "on-request",
      sandbox: "workspace-write",
      serviceName: "jiaren_ai_canvas",
      developerInstructions: DIRECT_CODEX_INSTRUCTIONS,
      ...canvasBridge,
      ...(cleanText(options.model, "", 200) ? { model: cleanText(options.model, "", 200) } : {}),
      ...(cleanText(options.personality, "", 60) ? { personality: cleanText(options.personality, "", 60) } : {}),
    });
    this.activeThread = result?.thread || null;
    return redact(result);
  }

  async resumeThread(threadId) {
    const result = await this.request("thread/resume", { threadId: cleanText(threadId, "", 200) });
    this.activeThread = result?.thread || null;
    return redact(result);
  }

  async startTurn(request = {}) {
    const threadId = cleanText(request.threadId || this.activeThread?.id, "", 200);
    if (!threadId) throw new Error("请先新建或恢复一个 Codex 对话。");
    const result = await this.request("turn/start", {
      threadId,
      input: normalizeInput(request.input),
      cwd: this.workspaceRoot,
      approvalPolicy: "on-request",
      sandboxPolicy: { type: "workspaceWrite", writableRoots: [this.workspaceRoot], networkAccess: false },
      ...(cleanText(request.model, "", 200) ? { model: cleanText(request.model, "", 200) } : {}),
    }, 60000);
    this.activeTurn = result?.turn || null;
    return redact(result);
  }

  interrupt(threadId, turnId) {
    return this.request("turn/interrupt", { threadId: cleanText(threadId, "", 200), turnId: cleanText(turnId, "", 200) });
  }

  resolveApproval(requestId, action = "decline", options = {}) {
    const approval = this.approvals.get(String(requestId));
    if (!approval) throw new Error("审批请求已失效或已处理。");
    const accepted = action === "accept" || action === "acceptForSession";
    let result;
    if (approval.method === "item/permissions/requestApproval") {
      const requested = approval.params.permissions || approval.params.requestedPermissions || approval.params.additionalPermissions || {};
      result = { permissions: accepted ? redact(requested) : {}, scope: action === "acceptForSession" ? "session" : "turn" };
    } else {
      result = { decision: accepted ? action : (action === "cancel" ? "cancel" : "decline") };
    }
    this.send({ id: approval.id, result });
    this.approvals.delete(String(requestId));
    this.emit("approval.resolved", { requestId: String(requestId), action: result.decision || (accepted ? "granted" : "declined") });
    return { ok: true };
  }

  async stop() {
    const child = this.child;
    const socket = this.socket;
    this.child = null;
    this.socket = null;
    this.initialized = false;
    this.approvals.clear();
    if (child) {
      try { child.stdin?.end(); } catch {}
      try { child.kill(); } catch {}
    }
    if (socket) {
      try { socket.close(1000, "Jiaren AI disconnected"); } catch {}
    }
  }
}

function createJiarenCodexAppServerRuntime(options) {
  return new JiarenCodexAppServerRuntime(options);
}

module.exports = {
  APPROVAL_METHODS,
  CANVAS_TOOLS,
  createJiarenCodexAppServerRuntime,
  isInside,
  normalizeInput,
  redact,
  resolveMcpServerPath,
  resolvePluginTemplatePath,
};

/* Jiaren Codex direct vector output v112 */
