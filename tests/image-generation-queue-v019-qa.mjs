import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error('JIAREN_QA_RUNTIME is required');

const exePath = path.join(runtimeDir, 'Jiaren AI.exe');
const testId = `${Date.now()}-${process.pid}`;
const profileDir = path.join(runtimeDir, `qa-profile-image-queue-${testId}`);
const cacheDir = path.join(profileDir, 'cache');
const downloadsDir = path.join(profileDir, 'downloads');
const cdpPort = Number(process.env.JIAREN_QA_PORT || 9395);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XwTzWQAAAABJRU5ErkJggg==';

let activeRequests = 0;
let maxConcurrentRequests = 0;
const requests = [];
const apiServer = http.createServer((request, response) => {
  const chunks = [];
  request.on('data', (chunk) => chunks.push(chunk));
  request.on('end', () => {
    if (request.method !== 'POST' || !/\/images\/(?:generations|edits)/.test(request.url || '')) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: { message: 'QA image endpoint only' } }));
      return;
    }

    const entry = { url: request.url, startedAt: Date.now(), completedAt: 0, bodyBytes: Buffer.concat(chunks).length };
    requests.push(entry);
    activeRequests += 1;
    maxConcurrentRequests = Math.max(maxConcurrentRequests, activeRequests);
    setTimeout(() => {
      entry.completedAt = Date.now();
      activeRequests -= 1;
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ created: Date.now(), data: [{ b64_json: imageBase64 }] }));
    }, 600);
  });
});

await new Promise((resolve) => apiServer.listen(0, '127.0.0.1', resolve));
const apiPort = apiServer.address().port;
await fs.mkdir(cacheDir, { recursive: true });
await fs.mkdir(downloadsDir, { recursive: true });

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

  await send('Runtime.enable');
  const result = await evaluate(`(async () => {
    const deadline = Date.now() + 20000;
    while (!window.jiaren?.runtime?.generateImage && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!window.jiaren?.runtime?.generateImage) throw new Error('Image runtime bridge is unavailable');

    const states = [];
    const unsubscribe = window.jiaren.runtime.onImageTaskState((state) => states.push(state));
    const common = {
      modelId: 'qa-image-queue-model',
      modelAlias: 'QA Image Queue',
      endpointModelId: 'gpt-image-2',
      requestMode: 'openai-image',
      apiGroup: 'a2',
      baseUrl: 'http://127.0.0.1:${apiPort}/v1',
      apiKey: 'qa-image-queue-key',
      prompt: 'A simple green square on transparent background',
      aspectRatio: '1:1',
      resolution: '1K',
      quality: 'medium',
      count: 1,
      async: false,
      referenceImagePaths: [],
      referenceImages: [],
      references: [],
      cacheDir: ${JSON.stringify(cacheDir)},
      downloadsDir: ${JSON.stringify(downloadsDir)}
    };
    const [first, second, third] = await Promise.all([
      window.jiaren.runtime.generateImage({ ...common, clientTaskId: 'qa-image-queue-first' }),
      window.jiaren.runtime.generateImage({ ...common, clientTaskId: 'qa-image-queue-second' }),
      window.jiaren.runtime.generateImage({ ...common, clientTaskId: 'qa-image-queue-third' })
    ]);
    await new Promise((resolve) => setTimeout(resolve, 100));
    unsubscribe?.();
    return { first, second, third, states };
  })()`);

  assert.equal(child.exitCode, null, 'Jiaren AI exited while three image tasks were submitted');
  assert.equal(result.first?.status, 'succeeded', JSON.stringify(result.first));
  assert.equal(result.second?.status, 'succeeded', JSON.stringify(result.second));
  assert.equal(result.third?.status, 'succeeded', JSON.stringify(result.third));
  assert.equal(requests.length, 3, `Expected three image requests, got ${requests.length}`);
  assert.ok(maxConcurrentRequests >= 2, `Image requests did not run concurrently; max concurrency was ${maxConcurrentRequests}`);
  assert.ok(maxConcurrentRequests <= 2, `Image scheduler exceeded the heavy-task limit: ${maxConcurrentRequests}`);
  assert.ok(
    Math.max(requests[0].startedAt, requests[1].startedAt) < Math.min(requests[0].completedAt, requests[1].completedAt),
    `Image request execution windows did not overlap: ${JSON.stringify(requests)}`,
  );
  assert.ok(
    requests[2].startedAt >= Math.min(requests[0].completedAt, requests[1].completedAt),
    `Third image request started before a scheduler slot was released: ${JSON.stringify(requests)}`,
  );
  assert.ok(result.states.some((state) => state.id === 'qa-image-queue-first' && state.state === 'running'), 'First image task did not enter the running state');
  assert.ok(result.states.some((state) => state.id === 'qa-image-queue-second' && state.state === 'running'), 'Second image task did not enter the running state');
  assert.ok(result.states.some((state) => state.id === 'qa-image-queue-third' && state.state === 'queued'), 'Third image task did not enter the queued state');
  assert.ok(result.states.some((state) => state.id === 'qa-image-queue-first' && state.state === 'succeeded'), 'First image task did not emit success');
  assert.ok(result.states.some((state) => state.id === 'qa-image-queue-second' && state.state === 'succeeded'), 'Second image task did not emit success');
  assert.ok(result.states.some((state) => state.id === 'qa-image-queue-third' && state.state === 'succeeded'), 'Third image task did not emit success');

  console.log(JSON.stringify({
    maxConcurrentRequests,
    requests,
    states: result.states,
    statuses: [result.first.status, result.second.status, result.third.status],
    appStillRunning: child.exitCode === null
  }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  await new Promise((resolve) => apiServer.close(resolve));
  await pause(500);
  await fs.rm(profileDir, { recursive: true, force: true });
}
