import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error("JIAREN_QA_RUNTIME is required");

const executablePath = process.env.JIAREN_QA_EXECUTABLE || path.join(runtimeDir, "Jiaren AI.exe");
const profileDir = process.env.JIAREN_QA_PROFILE || path.join(os.tmpdir(), `jiaren-agent-image-${Date.now()}-${process.pid}`);
const port = Number(process.env.JIAREN_QA_PORT || 9393);
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function findTarget() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const target = targets.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
      if (target) return target;
    } catch {}
    await pause(250);
  }
  throw new Error("Jiaren AI CDP target was not found");
}

await fs.mkdir(profileDir, { recursive: true });
const child = spawn(executablePath, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "--no-first-run",
], { cwd: runtimeDir, stdio: "ignore", windowsHide: true });

let socket;
try {
  const target = await findTarget();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let requestId = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++requestId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
    return response.result?.value;
  };
  const waitFor = async (expression, label, timeout = 20000) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await evaluate(expression)) return;
      await pause(200);
    }
    throw new Error(`Timed out waiting for ${label}`);
  };

  await send("Runtime.enable");
  await waitFor("Boolean(document.querySelector('.jiaren-launch-art button[data-mode=\"free\"]'))", "launcher");
  await evaluate(`(() => {
    const notice = [...document.querySelectorAll('button')].find((button) =>
      button.textContent.trim() === '确认进入' && button.getBoundingClientRect().width > 0
    );
    notice?.click();
    document.querySelector('.jiaren-launch-art button[data-mode="free"]')?.click();
    return true;
  })()`);
  await waitFor("Boolean(window.__JIAREN_CANVAS_AGENT__)", "canvas agent bridge");

  const result = await evaluate(`(async () => {
    const canvasModule = await import('./assets/jiaren-canvas-Cdxozcx-.js');
    const bridge = window.__JIAREN_CANVAS_AGENT__;
    const before = bridge.getSnapshot();
    const editableRef = 'qa-editable-image';
    const model = {
      id: 'qa-agent-image-model',
      alias: 'QA Agent Image',
      modelId: 'gpt-image-2',
      endpointModelId: 'gpt-image-2',
      apiGroup: 'a2',
      category: 'image',
      provider: 'openai',
      requestMode: 'openai-image',
      baseUrl: 'http://127.0.0.1:65534',
      apiKey: 'qa-agent-image-key',
      enabled: true
    };
    const fallbackModel = {
      ...model,
      id: 'qa-agent-image-fallback',
      alias: 'QA Agent Image Fallback',
      modelId: 'qa-image-fallback',
      endpointModelId: 'qa-image-fallback',
      apiGroup: 'a1'
    };
    const store = canvasModule.u;
    const initialState = store.getState();
    store.setState({
      runtimeSettings: {
        ...initialState.runtimeSettings,
        global: {
          ...initialState.runtimeSettings.global,
          baseUrl: model.baseUrl,
          apiKey: model.apiKey,
          fallbackBaseUrl: model.baseUrl,
          fallbackApiKey: model.apiKey
        },
        models: [model, fallbackModel]
      }
    });
    const created = await bridge.applyOperations([
      {
        type: 'node.add',
        ref: editableRef,
        kind: 'generateImage',
        position: { x: 820, y: 260 },
        data: { kind: 'generateImage', label: 'QA editable workflow', prompt: 'QA editable' }
      }
    ]);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const editableId = created.receipts[0].nodeId;
    const editableState = bridge.getSnapshot();

    const vectorSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="40" fill="#b7ff2a"/></svg>';
    const vectorSource = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(vectorSvg);
    const vectorCreated = await bridge.applyOperations([{
      type: 'node.add',
      ref: 'qa-vector-output',
      kind: 'imageInput',
      position: { x: 1180, y: 260 },
      width: 480,
      height: 480,
      data: {
        kind: 'imageInput',
        title: 'QA vector output',
        label: 'QA vector output',
        imageSource: vectorSource,
        imageUrl: vectorSource,
        mimeType: 'image/svg+xml',
        vectorSource: vectorSvg,
        vectorFormat: 'svg',
        status: 'succeeded'
      }
    }]);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const vectorId = vectorCreated.receipts[0].nodeId;
    const vectorState = bridge.getSnapshot();

    const statuses = [];
    window.addEventListener('jiaren-agent-generation-status', (event) => statuses.push(event.detail));
    const successRequests = [];
    canvasModule.a.generateImage = async (request) => {
      successRequests.push(request);
      return {
        id: crypto.randomUUID(),
        status: 'succeeded',
        assets: [{
          id: crypto.randomUUID(),
          type: 'image',
          dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XwTzWQAAAABJRU5ErkJggg==',
          mimeType: 'image/png',
          width: 1,
          height: 1
        }],
        message: 'QA success'
      };
    };
    const success = await bridge.applyOperations([
      {
        type: 'node.add',
        ref: 'qa-transient-success',
        kind: 'generateImage',
        position: { x: 480, y: 260 },
        data: {
          kind: 'generateImage',
          label: 'QA transient executor',
          prompt: 'QA image',
          agentTransient: true,
          agentSource: 'jiaren-codex',
          agentResultMode: 'image-only',
          modelId: model.id,
          modelAlias: model.alias,
          modelApiGroup: model.apiGroup
        }
      },
      { type: 'run.node', nodeId: 'qa-transient-success' }
    ]);
    const successId = success.receipts[0].nodeId;
    const successDeadline = Date.now() + 8000;
    while (Date.now() < successDeadline) {
      const node = bridge.getSnapshot().nodes.find((item) => item.id === successId);
      if (node?.data?.agentResult === true) break;
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    const successState = bridge.getSnapshot();
    const successNode = successState.nodes.find((node) => node.id === successId);

    let failureCalls = 0;
    canvasModule.a.generateImage = async () => {
      failureCalls += 1;
      throw new Error('Grsai 任务 undefined 已提交，暂未返回图片。');
    };
    const failed = await bridge.applyOperations([
      {
        type: 'node.add',
        ref: 'qa-transient-failure',
        kind: 'generateImage',
        position: { x: 480, y: 620 },
        data: {
          kind: 'generateImage',
          label: 'QA failed transient executor',
          prompt: 'QA failed image',
          agentTransient: true,
          agentSource: 'jiaren-codex',
          agentResultMode: 'image-only',
          modelId: model.id,
          modelAlias: model.alias,
          modelApiGroup: model.apiGroup
        }
      },
      { type: 'run.node', nodeId: 'qa-transient-failure' }
    ]);
    const failedId = failed.receipts[0].nodeId;
    const failureDeadline = Date.now() + 8000;
    while (Date.now() < failureDeadline) {
      if (!bridge.getSnapshot().nodes.some((node) => node.id === failedId)) break;
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    const finalState = bridge.getSnapshot();
    return {
      beforeCount: before.nodes.length,
      editableId,
      editableKind: editableState.nodes.find((node) => node.id === editableId)?.data?.kind,
      editableRendered: Boolean(document.querySelector(\`.react-flow__node[data-id="\${editableId}"]\`)),
      vectorId,
      vectorKind: vectorState.nodes.find((node) => node.id === vectorId)?.data?.kind,
      vectorFormat: vectorState.nodes.find((node) => node.id === vectorId)?.data?.vectorFormat,
      vectorRendered: Boolean(document.querySelector(\`.react-flow__node[data-id="\${vectorId}"]\`)),
      successId,
      successKind: successNode?.data?.kind,
      successAgentResult: successNode?.data?.agentResult,
      successTransient: successNode?.data?.agentTransient,
      successModelId: successNode?.data?.modelId,
      successRendered: Boolean(document.querySelector(\`.react-flow__node[data-id="\${successId}"]\`)),
      successCalls: successRequests.length,
      successRequestModelIds: successRequests.map((request) => request.modelId),
      failedRemoved: !finalState.nodes.some((node) => node.id === failedId),
      failedRendered: Boolean(document.querySelector(\`.react-flow__node[data-id="\${failedId}"]\`)),
      failureCalls,
      statuses
    };
  })()`);

  assert.equal(result.editableKind, "generateImage");
  assert.equal(result.editableRendered, true);
  assert.equal(result.vectorKind, "imageInput");
  assert.equal(result.vectorFormat, "svg");
  assert.equal(result.vectorRendered, true);
  assert.equal(result.successKind, "imageInput");
  assert.equal(result.successAgentResult, true);
  assert.equal(result.successTransient, false);
  assert.equal(result.successModelId, undefined);
  assert.equal(result.successRendered, true);
  assert.equal(result.successCalls, 1);
  assert.deepEqual(result.successRequestModelIds, ['qa-agent-image-model']);
  assert.equal(result.failedRemoved, true);
  assert.equal(result.failedRendered, false);
  assert.equal(result.failureCalls, 1);
  assert.ok(result.statuses.some((status) => status.status === "succeeded"));
  assert.ok(result.statuses.some((status) => status.status === "failed"));
  assert.ok(result.statuses.filter((status) => status.status === "failed").every((status) => !/Grsai|GPT Image|provider-/i.test(status.message || "")));
  assert.ok(result.statuses.some((status) => status.status === "failed" && /图片接口未返回最终图片/.test(status.message || "")));
  console.log(JSON.stringify(result, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  await pause(700);
  if (!process.env.JIAREN_QA_PROFILE) await fs.rm(profileDir, { recursive: true, force: true });
}
