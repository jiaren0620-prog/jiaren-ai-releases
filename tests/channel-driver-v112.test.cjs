"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  createJiarenChannelDriverRuntime,
  renderTemplate,
  validateDefinition,
} = require("../dist-electron/electron/jiaren-channel-driver-runtime.js");

function response(data) {
  return { ok: true, status: 200, text: async () => JSON.stringify(data) };
}

test("Declarative channel driver renders requests, injects ephemeral secrets and polls results", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "jiaren-channel-v112-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const calls = [];
  let pollCount = 0;
  const runtime = createJiarenChannelDriverRuntime({
    dataRoot: root,
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      if (url.includes("/create")) return response({ task: { id: "task-7" } });
      pollCount += 1;
      return response({ state: "completed", output: { url: "https://cdn.example/result.png" } });
    },
  });
  runtime.save({
    id: "custom-image",
    name: "自定义图片渠道",
    capabilities: ["image"],
    models: [{ modelId: "image-v1", alias: "Image V1", capability: "image" }],
    request: {
      method: "POST",
      urlTemplate: "https://api.example/create",
      headers: { Authorization: "Bearer {{secret.apiKey}}" },
      bodyTemplate: { model: "{{input.model}}", prompt: "{{input.prompt}}" },
    },
    taskIdPath: "task.id",
    polling: {
      method: "GET",
      urlTemplate: "https://api.example/tasks/{{task.id}}",
      statusPath: "state",
      resultPath: "output.url",
      intervalMs: 500,
      maxAttempts: 3,
    },
  });

  runtime.setSessionSecrets("custom-image", { apiKey: "sk-private" });
  const catalog = runtime.modelCatalog();
  assert.equal(catalog.length, 1);
  assert.equal(runtime.resolveIdFromRequest({ modelId: catalog[0].catalogId }), "custom-image");
  const result = await runtime.invokeForRequest(
    { modelId: catalog[0].catalogId },
    "image",
    { model: "image-v1", prompt: "green chair" },
  );
  assert.equal(result.data, "https://cdn.example/result.png");
  assert.equal(JSON.parse(calls[0].init.body).prompt, "green chair");
  assert.equal(calls[0].init.headers.Authorization, "Bearer sk-private");
  assert.equal(calls[1].url, "https://api.example/tasks/task-7");
  assert.equal(fs.readFileSync(path.join(root, "channel-drivers-v1.json"), "utf8").includes("sk-private"), false);
});

test("Channel routing enforces declared capabilities", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "jiaren-channel-route-v112-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const runtime = createJiarenChannelDriverRuntime({ dataRoot: root, fetchImpl: async () => response({ text: "ok" }) });
  const saved = runtime.save({
    id: "text-only",
    name: "Text only",
    capabilities: ["text"],
    models: [{ modelId: "writer-v1", capability: "text" }],
    request: { method: "POST", urlTemplate: "https://example.com/chat", bodyTemplate: { prompt: "{{input.prompt}}" } },
    resultPath: "text",
  });
  const modelId = saved.models[0].catalogId;
  assert.equal((await runtime.invokeForRequest({ modelId }, "text", { prompt: "hello" })).data, "ok");
  assert.throws(() => runtime.invokeForRequest({ modelId }, "image", { prompt: "hello" }), /不支持 image/);
});

test("Channel definitions reject scripts, stored secrets and unsupported methods", () => {
  const base = { name: "test", capabilities: ["image"], request: { method: "POST", urlTemplate: "https://example.com/generate" } };
  assert.equal(validateDefinition(base).protocol, "jiaren-declarative-http-v1");
  assert.throws(() => validateDefinition({ ...base, request: { ...base.request, method: "TRACE" } }), /HTTP/);
  assert.throws(() => validateDefinition({ ...base, apiKey: "secret" }), /不能保存密钥/);
  assert.throws(() => validateDefinition({ ...base, request: { ...base.request, bodyTemplate: "new Function('return 1')" } }), /可执行脚本/);
  assert.deepEqual(renderTemplate({ prompt: "{{input.prompt}}" }, { input: { prompt: "hello" } }), { prompt: "hello" });
});
