"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  createJiarenAgentControlRuntime,
  validateOperations,
} = require("../dist-electron/electron/jiaren-agent-control-runtime.js");
const {
  downloadBuffer,
  downloadFile,
  isFakeIp,
  isPrivateIp,
} = require("../dist-electron/electron/jiaren-safe-download.js");
const {
  _internals: { buildGenericPayload, isVeo31LiteRequest },
} = require("../dist-electron/electron/jiaren-video-runtime.js");

function temporaryRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "jiaren-v78i-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test("Agent sessions persist messages, suggestions and recovery state", (t) => {
  const root = temporaryRoot(t);
  const first = createJiarenAgentControlRuntime({ dataRoot: root });
  const session = first.createSession("持久化测试");
  first.appendMessage(session.id, { id: 7, role: "user", text: "保留这条消息" });
  first.saveSuggestions(session.id, ["建议一", "建议二", "建议三", "不会保存"]);
  first.markRecovery(session.id, { requestId: "request-1", message: "连接中断" });
  first.appendMessage(session.id, { role: "assistant", text: "已保留的部分回复" });

  const second = createJiarenAgentControlRuntime({ dataRoot: root });
  const restored = second.getSession(session.id);
  assert.equal(restored.messages.length, 2);
  assert.equal(restored.messages[0].id, "7");
  assert.equal(restored.messages[0].text, "保留这条消息");
  assert.deepEqual(restored.suggestions, ["建议一", "建议二", "建议三"]);
  assert.equal(restored.recovery.requestId, "request-1");
});

test("Canvas plans require one explicit approval and produce one receipt", (t) => {
  const runtime = createJiarenAgentControlRuntime({ dataRoot: temporaryRoot(t) });
  const plan = runtime.submitPlan({
    title: "新增节点",
    operations: [{ id: 12, type: "node.add", kind: "text", position: { x: 10, y: 20 } }],
  });
  assert.equal(plan.operations[0].id, "12");
  assert.throws(() => runtime.completePlan(plan.id, { ok: true }), /只有已批准/);

  runtime.setPlanStatus(plan.id, "approved");
  assert.throws(() => runtime.setPlanStatus(plan.id, "approved"), /不能重复审批/);
  const receipt = runtime.completePlan(plan.id, { ok: true, result: { nodeId: "node-1" } });
  assert.equal(receipt.status, "completed");
  assert.equal(runtime.listReceipts().length, 1);
  assert.throws(() => runtime.completePlan(plan.id, { ok: true }), /只有已批准/);

  const rejected = runtime.submitPlan({ operations: [{ type: "node.select", nodeId: 42 }] });
  runtime.setPlanStatus(rejected.id, "rejected", "不执行");
  assert.throws(() => runtime.completePlan(rejected.id, { ok: true }), /只有已批准/);
});

test("Canvas snapshots remove credentials before any Agent or Codex handoff", (t) => {
  const runtime = createJiarenAgentControlRuntime({ dataRoot: temporaryRoot(t) });
  runtime.updateSnapshot({
    nodes: [{ id: "safe-node", data: { prompt: "保留创作提示", apiKey: "key-value", accessToken: "access-value", password: "password-value" } }],
    edges: [],
    assets: [{ id: "safe-asset", credential: "credential-value", cookie: "cookie-value", source: "asset.png" }],
    selectedNodeId: "safe-node",
    secret: "secret-value",
  });
  const serialized = JSON.stringify(runtime.getSnapshot());
  assert.match(serialized, /保留创作提示/);
  assert.match(serialized, /asset\.png/);
  for (const privateValue of ["key-value", "access-value", "password-value", "credential-value", "cookie-value", "secret-value"]) {
    assert.equal(serialized.includes(privateValue), false);
  }
});

test("Pairing stores only a token hash and enforces scopes", (t) => {
  const root = temporaryRoot(t);
  const runtime = createJiarenAgentControlRuntime({ dataRoot: root });
  const pairing = runtime.startPairing("测试 CLI");
  assert.match(pairing.code, /^\d{6}$/);
  const paired = runtime.pair(pairing.code, "测试 CLI");
  assert.equal(runtime.authorize({ headers: { authorization: `Bearer ${paired.token}` } }, "canvas:read"), true);
  assert.equal(runtime.authorize({ headers: { authorization: `Bearer ${paired.token}` } }, "unknown:scope"), false);
  const persisted = fs.readFileSync(path.join(root, "agent-control-state.json"), "utf8");
  assert.equal(persisted.includes(paired.token), false);
});

test("Operation validation accepts numeric identifiers but rejects unsupported work", () => {
  const operations = validateOperations([{ id: 9, type: "node.update", nodeId: 101, patch: { prompt: "测试" } }]);
  assert.equal(operations[0].id, "9");
  assert.equal(operations[0].nodeId, 101);
  assert.throws(() => validateOperations([{ type: "shell.execute" }]), /不支持/);
});

test("Fake-IP detection is exact and literal private download targets are blocked", async () => {
  assert.equal(isFakeIp("198.18.0.1"), true);
  assert.equal(isFakeIp("198.19.255.254"), true);
  assert.equal(isFakeIp("198.20.0.1"), false);
  assert.equal(isPrivateIp("127.0.0.1"), true);
  await assert.rejects(downloadBuffer("http://198.18.0.1/result.png"), /Fake-IP/);
  await assert.rejects(downloadBuffer("http://127.0.0.1/result.png"), /内网/);
});

test("Local service downloads require explicit permission and stream atomically", async (t) => {
  const root = temporaryRoot(t);
  const payload = Buffer.from("jiaren-safe-download");
  const server = http.createServer((_request, response) => {
    response.writeHead(200, { "Content-Type": "application/octet-stream", "Content-Length": payload.length });
    response.end(payload);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}/asset.bin`;
  const blockedPath = path.join(root, "blocked.bin");
  await assert.rejects(downloadFile(url, blockedPath), /内网/);
  assert.equal(fs.existsSync(blockedPath), false);

  const targetPath = path.join(root, "allowed.bin");
  const downloaded = await downloadFile(url, targetPath, { allowPrivate: true, maxBytes: 1024 });
  assert.equal(downloaded.networkSource, "explicit-private");
  assert.equal(downloaded.byteSize, payload.length);
  assert.deepEqual(fs.readFileSync(targetPath), payload);
  assert.equal(fs.existsSync(`${targetPath}.${process.pid}.part`), false);
});

test("Veo 3.1 Lite is forced to official text-only request limits", async () => {
  const request = {
    endpointModelId: "veo3.1-lite",
    prompt: "雨夜城市慢速推进",
    duration: 30,
    aspectRatio: "1:1",
    resolution: "8K",
    referenceImages: [{ localPath: "Z:\\does-not-exist.png" }],
    refImage: "Z:\\also-missing.png",
  };
  assert.equal(isVeo31LiteRequest(request, { endpointModelId: "veo3.1-lite" }), true);
  const payload = await buildGenericPayload(request, { endpointModelId: "veo3.1-lite" });
  assert.equal(payload.duration, 8);
  assert.equal(payload.seconds, 8);
  assert.equal(payload.aspect_ratio, "16:9");
  assert.equal(payload.resolution, "1080p");
  assert.equal(payload.mode, "text-to-video");
  assert.equal("image" in payload, false);
  assert.equal("images" in payload, false);
});

test("Canvas teardown guard ignores stale removals and preserves normal DOM cleanup", () => {
  const guardPath = path.join(__dirname, "..", "dist", "assets", "jiaren-dom-compat-v1.js");
  const guardSource = fs.readFileSync(guardPath, "utf8");
  const indexSource = fs.readFileSync(path.join(__dirname, "..", "dist", "index.html"), "utf8");
  assert.match(guardSource, /child\.parentNode !== this/);
  assert.match(guardSource, /return child/);
  assert.match(guardSource, /nativeRemoveChild\.call\(this, child\)/);
  assert.match(indexSource, /jiaren-dom-compat-v1\.js\?v=20260730-v78k/);
});
