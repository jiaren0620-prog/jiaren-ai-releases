import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error('JIAREN_QA_RUNTIME is required');

const exePath = path.join(runtimeDir, 'Jiaren AI.exe');
const testId = `${Date.now()}-${process.pid}`;
const profileDir = process.env.JIAREN_QA_PROFILE
  || path.join(runtimeDir, `qa-profile-connected-output-${testId}`);
const cdpPort = Number(process.env.JIAREN_QA_PORT || 9383);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XwTzWQAAAABJRU5ErkJggg==';
const productDataUrl = `data:image/png;base64,${imageBase64}`;

const apiRequests = [];
const apiServer = http.createServer((request, response) => {
  const chunks = [];
  request.on('data', (chunk) => chunks.push(chunk));
  request.on('end', () => {
    apiRequests.push({ method: request.method, url: request.url, body: Buffer.concat(chunks).toString('utf8') });
    if (request.method === 'GET') {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: { message: 'QA endpoint only accepts image generation requests' } }));
      return;
    }
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ created: Date.now(), data: [{ b64_json: imageBase64 }] }));
  });
});

await new Promise((resolve) => apiServer.listen(0, '127.0.0.1', resolve));
const apiPort = apiServer.address().port;
await fs.mkdir(profileDir, { recursive: true });

const child = spawn(exePath, [
  `--remote-debugging-port=${cdpPort}`,
  `--user-data-dir=${profileDir}`,
  '--no-first-run',
], { cwd: runtimeDir, stdio: 'ignore' });

async function findTarget() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
      const target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
      if (target) return target;
    } catch {}
    await pause(250);
  }
  throw new Error('Jiaren AI CDP page target not found');
}

let socket;
try {
  const target = await findTarget();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result?.value;
  };
  const waitFor = async (expression, label, timeout = 30000) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await evaluate(expression)) return;
      await pause(150);
    }
    throw new Error(`Timed out waiting for ${label}`);
  };

  await send('Runtime.enable');
  await waitFor(`Boolean(document.querySelector('.jiaren-launch-art button[data-mode="free"]'))`, 'launcher');
  await evaluate(`window.jiaren.system.startNewProject()`);
  await evaluate(`document.querySelector('.jiaren-launch-art button[data-mode="free"]').click()`);
  await waitFor(`Boolean(document.querySelector('.react-flow__pane'))`, 'main canvas');
  await evaluate(`(async () => {
    const module = await import('./assets/jiaren-canvas-Cdxozcx-.js');
    const baseUrl = 'http://127.0.0.1:${apiPort}/v1';
    const apiKey = 'qa-connected-output-key';
    const state = module.u.getState();
    state.setWorkflowNodes([]);
    state.setWorkflowEdges([]);
    state.setCanvasAssets([]);
    state.setGlobalApiSettings({ baseUrl, apiKey, fallbackBaseUrl: baseUrl, fallbackApiKey: apiKey });
    state.replaceRuntimeProviderModels([{
      id: 'qa-connected-gpt-image-2', alias: 'QA Connected Image', modelId: 'gpt-image-2',
      endpointModelId: 'gpt-image-2', apiGroup: 'a2', category: 'image', provider: 'openai',
      providerSource: 'discovered', requestMode: 'openai-image', baseUrl, apiKey, enabled: true
    }]);
    module.u.getState().addCanvasAsset({
      id: 'qa-connected-product', kind: 'image', name: 'product.png', source: ${JSON.stringify(productDataUrl)},
      dataUrl: ${JSON.stringify(productDataUrl)}, mimeType: 'image/png', x: 120, y: 120, width: 320, height: 320
    });
  })()`);
  await evaluate(`(() => {
    const pane = document.querySelector('.react-flow__pane');
    const rect = pane.getBoundingClientRect();
    pane.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: rect.left + 420, clientY: rect.top + 280, view: window }));
  })()`);
  await waitFor(`Boolean(document.querySelector('.jiaren-context-menu-v2'))`, 'canvas context menu');
  const opened = await evaluate(`(() => {
    const button = [...document.querySelectorAll('.jiaren-context-menu-v2 .jiaren-menu-submenu button')]
      .filter((item) => item.textContent.includes('LLM')).at(-1);
    if (!button) return false;
    button.click();
    return true;
  })()`);
  assert.equal(opened, true, 'LLM Design Agent menu item is missing');
  await waitFor(`Boolean(document.querySelector('.design-agent-panel'))`, 'Design Agent panel');

  for (let step = 0; step < 4; step += 1) {
    const clicked = await evaluate(`(() => {
      const button = document.querySelector('.design-agent-primary');
      if (!button || button.disabled) return false;
      button.click();
      return true;
    })()`);
    assert.equal(clicked, true, `Design planning step ${step + 1} could not be clicked`);
    await pause(120);
  }
  await waitFor(`document.querySelectorAll('.design-agent-plans button').length === 3`, 'local design plans');
  const generated = await evaluate(`(() => {
    const button = document.querySelector('.design-agent-primary');
    if (!button || button.disabled || !button.textContent.includes('生成')) return false;
    button.click();
    return true;
  })()`);
  assert.equal(generated, true, 'Generate and add-to-canvas button is unavailable');
  try {
    await waitFor(`(async () => {
      const module = await import('./assets/jiaren-canvas-Cdxozcx-.js');
      return module.u.getState().workflowNodes.some((node) => node.data?.sourceAgent === 'design-agent');
    })()`, 'connected Design Agent image node', 45000);
  } catch (error) {
    const diagnostics = await evaluate(`(async () => {
      const module = await import('./assets/jiaren-canvas-Cdxozcx-.js');
      return {
        toast: document.querySelector('.app-toast')?.textContent || '',
        panel: document.querySelector('.design-agent-panel')?.textContent || '',
        nodes: module.u.getState().workflowNodes.map((node) => ({ id: node.id, type: node.type, kind: node.data?.kind, sourceAgent: node.data?.sourceAgent, message: node.data?.message }))
      };
    })()`);
    throw new Error(`${error.message}; diagnostics=${JSON.stringify(diagnostics)}; requests=${JSON.stringify(apiRequests.map(({ method, url, body }) => ({ method, url, body: body.slice(0, 500) })))}`);
  }

  const result = await evaluate(`(async () => {
    const module = await import('./assets/jiaren-canvas-Cdxozcx-.js');
    const state = module.u.getState();
    const node = state.workflowNodes.find((item) => item.data?.sourceAgent === 'design-agent');
    const element = document.querySelector('.react-flow__node[data-id="' + node.id + '"]');
    const preview = element?.querySelector('.node-preview-image');
    preview?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 520, clientY: 360, view: window }));
    await new Promise((resolve) => setTimeout(resolve, 100));
    const menu = document.querySelector('.image-selection-popover');
    const project = await window.jiaren.system.saveProject({
      version: 1,
      projectName: 'Connected Design Output QA',
      explicitSave: false,
      workflow: { nodes: state.workflowNodes, edges: state.workflowEdges },
      canvas: { canvasAssets: state.canvasAssets }
    });
    const loaded = await window.jiaren.system.loadProject();
    return {
      node: { id: node.id, type: node.type, data: node.data },
      hasOutputHandle: Boolean(element?.querySelector('.flow-handle-plus')),
      hasDownloadAction: [...(menu?.querySelectorAll('button') || [])].some((button) => button.title === '下载'),
      savedProjectId: project?.projectId,
      restored: loaded?.workflow?.nodes?.some((item) => item.id === node.id && item.data?.sourceAgent === 'design-agent') || false
    };
  })()`);

  assert.equal(result.node.type, 'imageInput');
  assert.equal(result.node.data.kind, 'imageInput');
  assert.equal(result.node.data.status, 'succeeded');
  assert.ok(result.node.data.localPath, 'Generated image node has no durable local path');
  assert.ok(result.node.data.imageSource, 'Generated image node has no image source');
  assert.equal(result.hasOutputHandle, true, 'Generated image node has no output connector');
  assert.equal(result.hasDownloadAction, true, 'Generated image node has no download action');
  assert.equal(result.restored, true, 'Generated image node was not restored from project persistence');
  assert.ok(
    apiRequests.some((request) => request.method === 'POST' && /\/images\/(?:generations|edits)/.test(request.url)),
    `Fake image API was not called: ${JSON.stringify(apiRequests.map(({ method, url }) => ({ method, url })))}`,
  );

  console.log(JSON.stringify({ apiRequests: apiRequests.map(({ method, url }) => ({ method, url })), result }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  await new Promise((resolve) => apiServer.close(resolve));
  await pause(500);
  await fs.rm(profileDir, { recursive: true, force: true });
}
