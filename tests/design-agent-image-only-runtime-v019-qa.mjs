import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error('JIAREN_QA_RUNTIME is required');

const exePath = path.join(runtimeDir, 'Jiaren AI.exe');
const testId = `${Date.now()}-${process.pid}`;
const ownsProfile = !process.env.JIAREN_QA_PROFILE;
const profileDir = process.env.JIAREN_QA_PROFILE || path.join(os.tmpdir(), `jiaren-qa-design-agent-${testId}`);
const port = Number(process.env.JIAREN_QA_PORT || 9381);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const productDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XwTzWQAAAABJRU5ErkJggg==';

async function findTarget() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
      if (target) return target;
    } catch {}
    await pause(250);
  }
  throw new Error('Jiaren AI CDP page target not found');
}

await fs.mkdir(profileDir, { recursive: true });
const child = spawn(exePath, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  '--no-first-run',
], { cwd: runtimeDir, stdio: 'ignore' });

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
  const waitFor = async (expression, label, timeout = 20000) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await evaluate(expression)) return;
      await pause(150);
    }
    throw new Error(`Timed out waiting for ${label}`);
  };

  await send('Runtime.enable');
  await waitFor(`Boolean(document.querySelector('.jiaren-launch-art button[data-mode="free"]'))`, 'launcher');
  await evaluate(`(async () => {
    const baseUrl = 'http://127.0.0.1:65534';
    const apiKey = 'qa-image-only-key';
    await window.jiaren.system.savePreferences({
      runtimeSettings: {
        global: { baseUrl, apiKey, fallbackBaseUrl: baseUrl, fallbackApiKey: apiKey },
        models: [{
          id: 'provider-qa-image-only-gpt-image-2',
          alias: 'QA GPT Image 2',
          modelId: 'gpt-image-2',
          endpointModelId: 'gpt-image-2',
          apiGroup: 'a2',
          category: 'image',
          provider: 'openai',
          requestMode: 'openai-image',
          baseUrl,
          apiKey,
          enabled: true
        }]
      }
    });
    location.reload();
  })()`);

  await waitFor(`Boolean(document.querySelector('.jiaren-launch-art button[data-mode="free"]'))`, 'reloaded launcher');
  await evaluate(`document.querySelector('.jiaren-launch-art button[data-mode="free"]').click()`);
  await waitFor(`Boolean(document.querySelector('.react-flow__pane'))`, 'main canvas');
  await evaluate(`(async () => {
    const canvasModule = await import('./assets/jiaren-canvas-Cdxozcx-.js');
    canvasModule.u.getState().addCanvasAsset({
      id: 'qa-product-image',
      kind: 'image',
      name: 'qa-product.png',
      source: ${JSON.stringify(productDataUrl)},
      dataUrl: ${JSON.stringify(productDataUrl)},
      mimeType: 'image/png',
      x: 120,
      y: 120,
      width: 320,
      height: 320
    });
  })()`);
  await evaluate(`(() => {
    const pane = document.querySelector('.react-flow__pane');
    const rect = pane.getBoundingClientRect();
    pane.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + Math.min(460, rect.width / 2),
      clientY: rect.top + Math.min(320, rect.height / 2),
      view: window
    }));
  })()`);
  await waitFor(`Boolean(document.querySelector('.jiaren-context-menu-v2'))`, 'canvas context menu');
  const menuResult = await evaluate(`(() => {
    const matches = [...document.querySelectorAll('.jiaren-context-menu-v2 .jiaren-menu-submenu button')]
      .filter((item) => item.textContent.includes('LLM'));
    const button = matches.at(-1);
    if (!button) return { clicked: false, labels: [...document.querySelectorAll('.jiaren-context-menu-v2 .jiaren-menu-submenu button')].map((item) => item.textContent.trim()) };
    button.click();
    return { clicked: true };
  })()`);
  assert.equal(menuResult.clicked, true, `LLM Design Agent menu item was not found: ${JSON.stringify(menuResult)}`);

  await waitFor(`Boolean(document.querySelector('.design-agent-panel'))`, 'Design Agent panel');
  const before = await evaluate(`(() => ({
    productLoaded: Boolean(document.querySelector('.design-agent-preview img')),
    modelOptions: [...document.querySelectorAll('.design-agent-control select option')].map((option) => option.textContent.trim()),
    bodyText: document.querySelector('.design-agent-panel')?.textContent || ''
  }))()`);
  assert.equal(before.productLoaded, true, `Saved product image was not restored: ${JSON.stringify(before)}`);
  assert.ok(before.modelOptions.some((label) => label.includes('GPT Image 2')), `Configured image model is missing: ${JSON.stringify(before.modelOptions)}`);

  for (let step = 0; step < 4; step += 1) {
    const planningClick = await evaluate(`(() => {
      const button = document.querySelector('.design-agent-primary');
      if (!button || button.disabled) return false;
      button.click();
      return true;
    })()`);
    assert.equal(planningClick, true, `Design workflow button was not available at step ${step + 1}`);
    await pause(100);
  }
  await waitFor(`document.querySelectorAll('.design-agent-plans button').length === 3`, 'three local image plans');

  const result = await evaluate(`(() => ({
    planCount: document.querySelectorAll('.design-agent-plans button').length,
    steps: [...document.querySelectorAll('.design-agent-step')].map((step) => step.textContent.trim()),
    toast: document.querySelector('.app-toast')?.textContent.trim() || '',
    panelText: document.querySelector('.design-agent-panel')?.textContent || ''
  }))()`);
  assert.equal(result.planCount, 3);
  assert.ok(result.steps.some((step) => step.includes('仅调用图片模型')), `Image-only status is missing: ${JSON.stringify(result.steps)}`);
  assert.ok(result.toast.includes('只调用当前选择的图片模型'), `Image-only completion notice is missing: ${JSON.stringify(result)}`);
  assert.equal(result.panelText.includes('没有可用的对话模型'), false, 'Design Agent still requires a chat model');

  console.log(JSON.stringify({ before, result }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  await pause(500);
  if (ownsProfile) await fs.rm(profileDir, { recursive: true, force: true });
}
