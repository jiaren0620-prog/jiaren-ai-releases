import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error('JIAREN_QA_RUNTIME is required');

const exePath = path.join(runtimeDir, 'Jiaren AI.exe');
const testId = `${Date.now()}-${process.pid}`;
const profileDir = path.join(runtimeDir, `qa-profile-launch-layout-${testId}`);
const artifactDir = path.resolve('tests', 'artifacts');
const port = Number(process.env.JIAREN_QA_PORT || 9372);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
await fs.mkdir(artifactDir, { recursive: true });

const child = spawn(exePath, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  '--no-first-run',
], {
  cwd: runtimeDir,
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
  await send('Page.enable');
  const readyDeadline = Date.now() + 20000;
  while (Date.now() < readyDeadline) {
    if (await evaluate(`Boolean(document.querySelector('.jiaren-launch-history'))`)) break;
    await pause(200);
  }
  if (await evaluate(`Boolean(document.querySelector('.jiaren-launch-notice-backdrop button'))`)) {
    await evaluate(`document.querySelector('.jiaren-launch-notice-backdrop button')?.click()`);
    const noticeDeadline = Date.now() + 5000;
    while (Date.now() < noticeDeadline) {
      if (await evaluate(`!document.querySelector('.jiaren-launch-notice-backdrop')`)) break;
      await pause(100);
    }
  }

  const viewports = [
    { width: 1460, height: 375, label: '1460x375' },
    { width: 1440, height: 900, label: '1440x900' },
  ];
  const results = [];

  for (const viewport of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await pause(300);

    const layout = await evaluate(`(() => {
      const rect = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const box = element.getBoundingClientRect();
        return { top: box.top, right: box.right, bottom: box.bottom, left: box.left, width: box.width, height: box.height };
      };
      const list = document.querySelector('.jiaren-saved-project-list');
      const cards = [...document.querySelectorAll('.jiaren-launch-art > button')].map((element) => {
        const box = element.getBoundingClientRect();
        return { top: box.top, bottom: box.bottom, height: box.height };
      });
      return {
        viewport: { width: innerWidth, height: innerHeight },
        home: rect('.jiaren-launch-home'),
        history: rect('.jiaren-launch-history'),
        historyHeader: rect('.jiaren-launch-history > header'),
        list: rect('.jiaren-saved-project-list'),
        empty: rect('.jiaren-saved-project-empty'),
        communityCue: rect('.jc-startup-community-cue'),
        cards,
        listClientHeight: list?.clientHeight ?? 0,
        listScrollHeight: list?.scrollHeight ?? 0,
      };
    })()`);

    if (!layout.home || !layout.history || !layout.historyHeader || !layout.list || !layout.empty) {
      throw new Error(`${viewport.label}: launcher elements are missing`);
    }
    if (layout.home.bottom > layout.history.top + 1) {
      throw new Error(`${viewport.label}: creation cards overlap recent projects`);
    }
    if (layout.historyHeader.bottom > viewport.height || layout.empty.bottom > viewport.height) {
      throw new Error(`${viewport.label}: recent projects are clipped by the viewport`);
    }
    if (layout.cards.some((card) => card.bottom > layout.history.top + 1)) {
      throw new Error(`${viewport.label}: a creation card overlaps recent projects`);
    }
    if (viewport.width >= 981 && layout.cards.length >= 4) {
      const firstTop = layout.cards[0].top;
      if (layout.cards.slice(0, 4).some((card) => Math.abs(card.top - firstTop) > 1)) {
        throw new Error(`${viewport.label}: desktop creation cards wrapped instead of staying on one row`);
      }
    }
    if (layout.communityCue) {
      const horizontalOverlap = layout.communityCue.left < layout.history.right && layout.communityCue.right > layout.history.left;
      const verticalOverlap = layout.communityCue.top < layout.history.bottom && layout.communityCue.bottom > layout.history.top;
      if (horizontalOverlap && verticalOverlap) {
        throw new Error(`${viewport.label}: community cue overlaps recent projects`);
      }
    }
    const contentCenter = (layout.home.top + layout.history.bottom) / 2;
    if (viewport.height >= 700 && Math.abs(contentCenter - viewport.height / 2) > 48) {
      throw new Error(`${viewport.label}: launcher content is not vertically centered`);
    }

    const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const screenshotPath = path.join(artifactDir, `launch-layout-${viewport.label}.png`);
    await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
    results.push({ ...layout, screenshotPath });
  }

  console.log(JSON.stringify(results, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  await pause(500);
  await fs.rm(profileDir, { recursive: true, force: true });
}
