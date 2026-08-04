"use strict";

const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { PassThrough } = require("node:stream");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  createJiarenCodexAppServerRuntime,
  normalizeInput,
  redact,
} = require("../dist-electron/electron/jiaren-codex-app-server-runtime.js");

class FakeCodexProcess extends EventEmitter {
  constructor(options = {}) {
    super();
    this.stdout = new PassThrough();
    this.stderr = new PassThrough();
    this.stdin = new PassThrough();
    this.killed = false;
    this.requests = [];
    this.account = null;
    this.confirmApiKey = options.confirmApiKey !== false;
    this.imageGenerationCapability = options.imageGenerationCapability !== false;
    let buffer = "";
    this.stdin.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      for (;;) {
        const newline = buffer.indexOf("\n");
        if (newline < 0) break;
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (line) this.handle(JSON.parse(line));
      }
    });
  }

  send(message) {
    this.stdout.write(`${JSON.stringify(message)}\n`);
  }

  handle(message) {
    this.requests.push(message);
    if (!Object.prototype.hasOwnProperty.call(message, "id")) return;
    if (message.method === "initialize") return this.send({ id: message.id, result: { userAgent: "fake" } });
    if (message.method === "account/read") return this.send({ id: message.id, result: { account: this.account, requiresOpenaiAuth: !this.account } });
    if (message.method === "modelProvider/capabilities/read") return this.send({ id: message.id, result: {
      imageGeneration: this.imageGenerationCapability,
      namespaceTools: true,
      webSearch: true,
    } });
    if (message.method === "account/login/start") {
      if (message.params.type === "apiKey") {
        if (this.confirmApiKey) this.account = { type: "apiKey" };
        return this.send({ id: message.id, result: { type: "apiKey" } });
      }
      return this.send({ id: message.id, result: message.params.type === "chatgptDeviceCode"
        ? { type: "chatgptDeviceCode", loginId: "login-1", verificationUrl: "https://auth.openai.com/codex/device", userCode: "ABCD-1234" }
        : { type: "chatgpt", loginId: "login-2", authUrl: "https://chatgpt.com/login" } });
    }
    if (message.method === "model/list") return this.send({ id: message.id, result: { data: [{ id: "gpt-test", displayName: "GPT Test" }] } });
    if (message.method === "thread/start") {
      this.send({ id: message.id, result: { thread: { id: "thr-1", cwd: message.params.cwd } } });
      return this.send({ method: "thread/started", params: { thread: { id: "thr-1" } } });
    }
    if (message.method === "thread/list") return this.send({ id: message.id, result: { data: [{ id: "thr-1" }], nextCursor: null } });
    if (message.method === "turn/start") {
      this.send({ id: message.id, result: { turn: { id: "turn-1", status: "inProgress" } } });
      this.send({ method: "turn/started", params: { turn: { id: "turn-1", status: "inProgress" } } });
      this.send({ method: "item/agentMessage/delta", params: { threadId: "thr-1", turnId: "turn-1", delta: "正在处理" } });
      return this.send({ id: 900, method: "item/commandExecution/requestApproval", params: { threadId: "thr-1", turnId: "turn-1", itemId: "item-1", command: "npm test", cwd: message.params.cwd } });
    }
    if (message.id === 900) this.approvalResponse = message;
    if (message.id === 901) this.canvasToolResponse = message;
    if (message.id === 902) this.canvasPlanResponse = message;
  }

  kill() {
    this.killed = true;
    this.emit("close", 0);
  }
}

test("Codex App Server performs handshake, threads, turns and explicit approvals", async (t) => {
  const fake = new FakeCodexProcess();
  const events = [];
  const runtime = createJiarenCodexAppServerRuntime({
    workspaceRoot: __dirname,
    resolveExecutable: () => ({ usable: true, fromWindowsApps: false, command: "codex.cmd", executable: "codex.cmd", shell: true }),
    spawnProcess: () => fake,
    broadcast: (_channel, event) => events.push(event),
    readCanvas: () => ({ nodes: [{ id: "node-1", data: { prompt: "safe", apiKey: "hidden" } }], edges: [], assets: [] }),
    submitCanvasPlan: (plan) => ({ id: "plan-1", status: "pending", ...plan }),
  });
  t.after(() => runtime.stop());

  const status = await runtime.start();
  assert.equal(status.running, true);
  assert.equal(status.initialized, true);
  assert.deepEqual(fake.requests.slice(0, 3).map((request) => request.method), ["initialize", "initialized", "account/read"]);

  const login = await runtime.login("chatgptDeviceCode");
  assert.equal(login.userCode, "ABCD-1234");
  const apiLogin = await runtime.login("apiKey", "sk-test-123456789012345678901234567890");
  assert.equal(apiLogin.type, "apiKey");
  const apiRequest = fake.requests.find((request) => request.method === "account/login/start" && request.params.type === "apiKey");
  assert.equal(apiRequest.params.apiKey, "sk-test-123456789012345678901234567890");
  const models = await runtime.listModels();
  assert.equal(models.data[0].id, "gpt-test");
  const thread = await runtime.startThread({ model: "gpt-test" });
  assert.equal(thread.thread.id, "thr-1");
  await runtime.startTurn({ input: [{ type: "text", text: "检查项目" }] });

  const pending = runtime.status().pendingApprovals;
  assert.equal(pending.length, 1);
  assert.equal(pending[0].command, "npm test");
  runtime.resolveApproval(pending[0].requestId, "accept");
  assert.deepEqual(fake.approvalResponse.result, { decision: "accept" });
  assert.equal(runtime.status().pendingApprovals.length, 0);
  assert.ok(events.some((event) => event.type === "notification" && event.method === "item/agentMessage/delta"));

  fake.send({ id: 901, method: "item/tool/call", params: { threadId: "thr-1", turnId: "turn-1", callId: "call-1", tool: "jiaren_canvas_read", arguments: {} } });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(fake.canvasToolResponse.result.success, true);
  assert.equal(JSON.stringify(fake.canvasToolResponse).includes("hidden"), false);
  fake.send({
    id: 902,
    method: "item/tool/call",
    params: {
      threadId: "thr-1",
      turnId: "turn-1",
      callId: "call-2",
      tool: "jiaren_canvas_submit_plan",
      arguments: { title: "Add image node", operations: [{ type: "node.add", kind: "generateImage" }] },
    },
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(fake.canvasPlanResponse.result.success, true);
  const submittedPlan = JSON.parse(fake.canvasPlanResponse.result.contentItems[0].text);
  assert.equal(submittedPlan.plan.status, "pending");
  assert.equal(submittedPlan.plan.operations[0].type, "node.add");
  const threadStart = fake.requests.find((request) => request.method === "thread/start");
  assert.equal(threadStart.params.dynamicTools, undefined);
  assert.equal(threadStart.params.config.mcp_servers["jiaren-canvas"].command, process.execPath);
  assert.equal(threadStart.params.config.mcp_servers["jiaren-canvas"].env.ELECTRON_RUN_AS_NODE, "1");
  assert.match(threadStart.params.config.mcp_servers["jiaren-canvas"].args[0], /jiaren-canvas-mcp\.cjs$/);
  assert.equal(threadStart.params.approvalPolicy, "on-request");
  assert.equal(threadStart.params.sandbox, "workspace-write");
  const turnStart = fake.requests.find((request) => request.method === "turn/start");
  assert.equal(turnStart.params.approvalPolicy, "on-request");
  assert.equal(turnStart.params.sandboxPolicy.type, "workspaceWrite");
  assert.match(threadStart.params.developerInstructions, /use the built-in image_gen tool directly/);
  assert.match(threadStart.params.developerInstructions, /Do not read the canvas first/);
  assert.match(threadStart.params.developerInstructions, /do not call jiaren_canvas_generate_image/);
  assert.deepEqual(runtime.status().capabilities, { imageGeneration: true, namespaceTools: true, webSearch: true });
});

test("completed Codex imageGeneration items are imported once as real canvas image nodes", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "jiaren-codex-image-import-"));
  const imagePath = path.join(root, "generated.png");
  fs.writeFileSync(imagePath, Buffer.from("89504e470d0a1a0a", "hex"));
  const fake = new FakeCodexProcess();
  const imported = [];
  const plans = [];
  const runtime = createJiarenCodexAppServerRuntime({
    workspaceRoot: root,
    resolveExecutable: () => ({ usable: true, fromWindowsApps: false, command: "codex.cmd", executable: "codex.cmd", shell: true }),
    spawnProcess: () => fake,
    readCanvas: () => ({ nodes: [], edges: [], assets: [] }),
    importGeneratedImage: (sourcePath) => {
      imported.push(sourcePath);
      return {
        url: "/files/input/codex/generated.png",
        localPath: sourcePath,
        fileName: "generated.png",
        mimeType: "image/png",
        width: 1024,
        height: 1024,
      };
    },
    submitCanvasPlan: (plan) => {
      plans.push(plan);
      return { id: `plan-${plans.length}`, status: "pending", ...plan };
    },
  });
  t.after(async () => {
    await runtime.stop();
    fs.rmSync(root, { recursive: true, force: true });
  });
  await runtime.start();

  const notification = {
    method: "item/completed",
    params: {
      threadId: "thr-image",
      turnId: "turn-image",
      item: {
        id: "image-1",
        type: "imageGeneration",
        status: "completed",
        savedPath: imagePath,
        revisedPrompt: "A product image",
        result: "completed",
      },
    },
  };
  fake.send(notification);
  fake.send(notification);
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(imported, [fs.realpathSync(imagePath)]);
  assert.equal(plans.length, 1);
  assert.equal(plans[0].operations.length, 1);
  const operation = plans[0].operations[0];
  assert.equal(operation.kind, "imageInput");
  assert.equal(operation.data.imageSource, "/files/input/codex/generated.png");
  assert.equal(operation.data.agentResult, true);
  assert.equal(operation.data.agentSource, "codex-image-gen");
  assert.equal(operation.data.codexImageGeneration, true);
});

test("Codex helper validation protects inputs and secrets", () => {
  assert.deepEqual(normalizeInput([{ type: "text", text: "  hello  " }]), [{ type: "text", text: "hello" }]);
  assert.throws(() => normalizeInput([{ type: "image", url: "http://example.com/a.png" }]), /HTTPS/);
  assert.deepEqual(redact({ apiKey: "secret", nested: { accessToken: "token", prompt: "safe" } }), {
    apiKey: "[redacted]",
    nested: { accessToken: "[redacted]", prompt: "safe" },
  });
});

test("API key login is not reported as complete until account/read confirms it", async (t) => {
  const fake = new FakeCodexProcess({ confirmApiKey: false });
  const runtime = createJiarenCodexAppServerRuntime({
    workspaceRoot: __dirname,
    resolveExecutable: () => ({ usable: true, fromWindowsApps: false, command: "codex.cmd", executable: "codex.cmd", shell: true }),
    spawnProcess: () => fake,
  });
  t.after(() => runtime.stop());
  await runtime.start();
  await assert.rejects(
    runtime.login("apiKey", "sk-test-123456789012345678901234567890"),
    /API Key.*未完成/,
  );
  assert.equal(runtime.status().account, null);
});

test("missing default workspace is created before Codex starts", async (t) => {
  const root = path.join(os.tmpdir(), `jiaren-codex-workspace-${Date.now()}-${process.pid}`);
  const fake = new FakeCodexProcess();
  const runtime = createJiarenCodexAppServerRuntime({
    workspaceRoot: root,
    resolveExecutable: () => ({ usable: true, fromWindowsApps: false, command: "codex.cmd", executable: "codex.cmd", shell: true }),
    spawnProcess: () => fake,
  });
  t.after(async () => {
    await runtime.stop();
    fs.rmSync(root, { recursive: true, force: true });
  });
  await runtime.start();
  assert.equal(fs.statSync(root).isDirectory(), true);
});

test("Codex canvas plugin installer writes a portable local marketplace", async (t) => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), "jiaren-plugin-test-"));
  const commands = [];
  t.after(() => fs.rmSync(target, { recursive: true, force: true }));
  const runtime = createJiarenCodexAppServerRuntime({
    workspaceRoot: __dirname,
    mcpMarketplaceRoot: target,
    resolveExecutable: () => ({ usable: true, fromWindowsApps: false, command: "codex.cmd", executable: "codex.cmd", shell: true }),
    spawnProcess: (_command, args) => {
      commands.push(args);
      const child = new EventEmitter();
      child.stdout = new PassThrough();
      child.stderr = new PassThrough();
      process.nextTick(() => child.emit("close", 0));
      return child;
    },
  });
  const result = await runtime.installCanvasMcp();
  assert.equal(result.ok, true);
  const pluginRoot = path.join(target, "plugins", "jiaren-canvas");
  const mcp = JSON.parse(fs.readFileSync(path.join(pluginRoot, ".mcp.json"), "utf8"));
  assert.equal(mcp.mcpServers["jiaren-canvas"].command, process.execPath);
  assert.equal(mcp.mcpServers["jiaren-canvas"].env.ELECTRON_RUN_AS_NODE, "1");
  assert.match(mcp.mcpServers["jiaren-canvas"].args[0], /jiaren-canvas-mcp\.cjs$/);
  const marketplace = JSON.parse(fs.readFileSync(path.join(target, ".agents", "plugins", "marketplace.json"), "utf8"));
  assert.equal(marketplace.name, "jiaren-ai-local");
  assert.deepEqual(commands.map((args) => args.slice(0, 3)), [
    ["plugin", "remove", "jiaren-canvas@jiaren-ai-local"],
    ["plugin", "marketplace", "remove"],
    ["plugin", "marketplace", "add"],
    ["plugin", "add", "jiaren-canvas@jiaren-ai-local"],
  ]);
});
