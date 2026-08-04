import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error('JIAREN_QA_RUNTIME is required');
const exePath = path.join(runtimeDir, 'Jiaren AI.exe');
const ownsUserDataDir = !process.env.JIAREN_QA_PROFILE;
const userDataDir = process.env.JIAREN_QA_PROFILE || path.join(runtimeDir, 'qa-profile-grsai-v87');
const port = Number(process.env.JIAREN_QA_PORT || 9363);
const ownsCacheDir = !process.env.JIAREN_QA_CACHE;
const cacheDir = process.env.JIAREN_QA_CACHE || path.join(runtimeDir, 'qa-cache-grsai-v87');
const screenshotPath = process.env.JIAREN_QA_SCREENSHOT || path.resolve('tests', 'artifacts', 'qa-grsai-models-v87.png');
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

const submitPayloads = [];
let pollCount = 0;
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', 'http://127.0.0.1');
  if (request.method === 'POST' && url.pathname === '/grsai/v1/api/generate') {
    let body = '';
    for await (const chunk of request) body += chunk;
    const submitPayload = JSON.parse(body);
    submitPayloads.push(submitPayload);
    if (request.headers.authorization !== 'Bearer test-key') {
      response.writeHead(401, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'unauthorized' }));
      return;
    }
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(submitPayload.prompt === 'Jiaren Grsai missing task id QA'
      ? { id: 'undefined', status: 'running', progress: 0, results: [] }
      : { id: '14-5f3cf761-a4bb-486a-8016-77f490998f80', status: 'running', progress: 0, results: [] }));
    return;
  }
  if (request.method === 'GET' && url.pathname === '/grsai/v1/api/result') {
    pollCount += 1;
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      id: url.searchParams.get('id'),
      status: 'succeeded',
      progress: 100,
      results: [{ b64_json: `data:image/png;base64,${pixel}` }],
    }));
    return;
  }
  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: 'not found' }));
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}/grsai`;
await fs.mkdir(userDataDir, { recursive: true });
await fs.mkdir(cacheDir, { recursive: true });
await fs.mkdir(path.dirname(screenshotPath), { recursive: true });

async function findTarget() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
      if (target) return target;
    } catch {}
    await pause(300);
  }
  throw new Error('Jiaren AI CDP page target not found');
}

const child = spawn(exePath, [`--remote-debugging-port=${port}`, `--user-data-dir=${userDataDir}`, '--no-first-run'], {
  cwd: runtimeDir,
  env: { ...process.env, JIAREN_GRSAI_TEST_BASE_URL: baseUrl },
  stdio: 'ignore',
});

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
    const task = pending.get(message.id);
    pending.delete(message.id);
    message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result?.value;
  };
  await send('Runtime.enable');

  const models = await evaluate(`window.jiaren.runtime.listProviderModels(${JSON.stringify({ baseUrl, apiKey: 'test-key', category: 'image' })})`);
  const officialModels = await evaluate(`window.jiaren.runtime.listProviderModels(${JSON.stringify({ baseUrl: 'https://grsai.dakka.com.cn', apiKey: 'not-used-for-documented-catalog', category: 'image' })})`);
  const connection = await evaluate(`window.jiaren.runtime.testConnection(${JSON.stringify({
    modelId: 'provider-grsai-nano-banana-2',
    endpointModelId: 'nano-banana-2',
    requestMode: 'openai-image',
    category: 'image',
    baseUrl,
    apiKey: 'test-key',
  })})`);
  const generation = await evaluate(`window.jiaren.runtime.generateImage(${JSON.stringify({
    modelId: 'provider-grsai-nano-banana-2',
    modelAlias: 'Nano Banana 2',
    endpointModelId: 'nano-banana-2',
    requestMode: 'openai-image',
    category: 'image',
    baseUrl,
    apiKey: 'test-key',
    prompt: 'Jiaren Grsai runtime QA',
    size: '2048x1152',
    resolution: '2K',
    aspectRatio: '16:9',
    quality: 'Auto',
    count: 1,
    async: true,
    referenceImagePaths: [],
    referenceImages: [],
    cacheDir,
    downloadsDir: cacheDir,
  })})`);
  const missingTask = await evaluate(`window.jiaren.runtime.generateImage(${JSON.stringify({
    modelId: 'provider-grsai-nano-banana-2',
    modelAlias: 'Nano Banana 2',
    endpointModelId: 'nano-banana-2',
    requestMode: 'openai-image',
    category: 'image',
    baseUrl,
    apiKey: 'test-key',
    prompt: 'Jiaren Grsai missing task id QA',
    size: '1024x1024',
    resolution: '1K',
    aspectRatio: '1:1',
    quality: 'Auto',
    count: 1,
    async: true,
    referenceImagePaths: [],
    referenceImages: [],
    cacheDir,
    downloadsDir: cacheDir,
  })})`);

  const ids = models.models.map((item) => item.id);
  if (!models.ok || ids.length !== 13 || !ids.includes('nano-banana-2') || !ids.includes('gpt-image-2-vip')) {
    throw new Error(`Unexpected Grsai catalog: ${JSON.stringify(models)}`);
  }
  if (!officialModels.ok || officialModels.models.length !== 13) throw new Error(`Official Grsai hostname was not detected: ${JSON.stringify(officialModels)}`);
  if (!connection.ok || connection.status !== 200) throw new Error(`Grsai connection test failed: ${JSON.stringify(connection)}`);
  if (generation.status !== 'succeeded' || generation.assets.length !== 1) throw new Error(`Grsai generation failed: ${JSON.stringify(generation)}`);
  const submitPayload = submitPayloads[0];
  if (!submitPayload || submitPayload.model !== 'nano-banana-2' || submitPayload.aspectRatio !== '16:9' || submitPayload.imageSize !== '2K' || submitPayload.replyType !== 'async') {
    throw new Error(`Unexpected Grsai payload: ${JSON.stringify(submitPayload)}`);
  }
  if (pollCount < 1 || !generation.taskId?.startsWith('14-')) throw new Error('Grsai result polling was not completed');
  if (missingTask.status !== 'failed' || missingTask.taskId !== undefined || /undefined|已提交/.test(missingTask.message || '')) {
    throw new Error(`Invalid Grsai task IDs must fail once without a false submission: ${JSON.stringify(missingTask)}`);
  }
  await fs.access(generation.assets[0].localPath);

  const chooserDeadline = Date.now() + 10000;
  while (Date.now() < chooserDeadline) {
    if (await evaluate(`Boolean(document.querySelector('.jiaren-launch-chooser'))`)) break;
    await pause(150);
  }
  await evaluate(`document.querySelector('.jiaren-launch-chooser button[data-mode="free"]')?.click()`);
  await pause(800);
  const opened = await evaluate(`(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const button = buttons.find((node) => node.textContent.trim() === 'API')
      || buttons.find((node) => /API\s*(?:\u8bbe\u7f6e|\u4e0e\u6a21\u578b)/i.test([
        node.textContent,
        node.title,
        node.getAttribute('aria-label')
      ].filter(Boolean).join(' ')));
    button?.click();
    return button ? { text: button.textContent.trim(), title: button.title, ariaLabel: button.getAttribute('aria-label') } : {
      candidates: buttons.map((node) => ({ text: node.textContent.trim(), title: node.title })).filter((item) => /API/i.test(item.text + item.title)).slice(0, 20)
    };
  })()`);
  if (!opened || opened.candidates) throw new Error(`API settings entry was not found: ${JSON.stringify(opened)}`);
  await pause(300);
  const filled = await evaluate(`(() => {
    const labels = Array.from(document.querySelectorAll('.global-config label'));
    const findInput = (name) => labels.find((label) => label.querySelector('span')?.textContent.trim() === name)?.querySelector('input');
    const setValue = (input, value) => {
      if (!input) return false;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    };
    const ok = setValue(findInput('Base URL'), 'https://grsai.dakka.com.cn')
      && setValue(findInput('API Key'), 'ui-catalog-test-key');
    return {
      ok,
      modalTitle: document.querySelector('.settings-modal h2')?.textContent.trim(),
      labels: labels.map((label) => label.querySelector('span')?.textContent.trim()),
    };
  })()`);
  if (!filled.ok) throw new Error(`API settings inputs were not found: ${JSON.stringify({ opened, filled })}`);
  const cardsDeadline = Date.now() + 10000;
  while (Date.now() < cardsDeadline) {
    if (await evaluate(`document.querySelectorAll('.model-card').length === 13`)) break;
    await pause(200);
  }
  const ui = await evaluate(`(() => ({
    title: document.querySelector('.settings-modal h2')?.textContent.trim(),
    cardCount: document.querySelectorAll('.model-card').length,
    cardText: Array.from(document.querySelectorAll('.model-card')).map((node) => node.textContent.trim()),
  }))()`);
  if (ui.title !== '\u0041\u0050\u0049\u0020\u4e0e\u6a21\u578b\u8def\u7531' || ui.cardCount !== 13 || !ui.cardText.some((text) => text.includes('nano-banana-2'))) {
    throw new Error(`Grsai models were not rendered in API settings: ${JSON.stringify(ui)}`);
  }
  const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));

  console.log(JSON.stringify({
    catalogCount: ids.length,
    officialCatalogCount: officialModels.models.length,
    connection,
    generation: { status: generation.status, taskId: generation.taskId, assetCount: generation.assets.length },
    missingTask: { status: missingTask.status, taskId: missingTask.taskId, message: missingTask.message },
    submitPayload,
    pollCount,
    ui: { title: ui.title, cardCount: ui.cardCount },
    screenshotPath,
  }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  child.kill();
  await new Promise((resolve) => server.close(resolve));
  await pause(500);
  if (ownsUserDataDir) await fs.rm(userDataDir, { recursive: true, force: true });
  if (ownsCacheDir) await fs.rm(cacheDir, { recursive: true, force: true });
}
