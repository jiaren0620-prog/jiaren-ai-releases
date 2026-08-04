import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const runtimeDir = process.env.JIAREN_QA_RUNTIME || 'H:/V1.6/JiarenAI-rework-20260728-dark-lime/isolated-preview-v8';
const exePath = path.join(runtimeDir, 'Jiaren AI.exe');
const userDataDir = process.env.JIAREN_QA_PROFILE || path.join(runtimeDir, 'qa-profile-community-v83');
const screenshotPath = process.env.JIAREN_QA_SCREENSHOT || path.join(runtimeDir, 'qa-v83-community.png');
const localImage = process.env.JIAREN_QA_IMAGE || path.join(runtimeDir, 'qa-v78l-canvas.png');
const port = Number(process.env.JIAREN_QA_PORT || 9360);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function findTarget() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const target = targets.find((item) => item.type === 'page' && item.title === 'Jiaren AI');
      if (target) return target;
    } catch {}
    await pause(400);
  }
  throw new Error('Jiaren AI CDP page target not found');
}

await fs.mkdir(userDataDir, { recursive: true });
const child = spawn(exePath, [`--remote-debugging-port=${port}`, `--user-data-dir=${userDataDir}`, '--no-first-run'], {
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
  const runtimeErrors = [];
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (message.id && pending.has(message.id)) {
      const task = pending.get(message.id);
      pending.delete(message.id);
      message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') {
      runtimeErrors.push(message.params?.exceptionDetails?.text || 'Runtime exception');
    } else if (message.method === 'Log.entryAdded' && message.params?.entry?.level === 'error') {
      runtimeErrors.push(message.params.entry.text);
    }
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
  await send('Log.enable');
  const chooserDeadline = Date.now() + 20000;
  while (Date.now() < chooserDeadline) {
    if (await evaluate(`Boolean(document.querySelector('.jiaren-launch-chooser'))`)) break;
    await pause(250);
  }
  await evaluate(`document.querySelector('.jiaren-launch-chooser button[data-mode="free"]')?.click()`);
  await pause(1200);
  await evaluate(`window.JiarenCommunity?.open()`);
  const feedDeadline = Date.now() + 15000;
  while (Date.now() < feedDeadline) {
    if (await evaluate(`document.querySelectorAll('.jc-card').length > 0`)) break;
    await pause(400);
  }

  const ui = await evaluate(`(() => {
    const empty = document.querySelector('.jc-empty');
    const masonry = document.querySelector('.jc-masonry');
    const card = document.querySelector('.jc-card');
    const media = document.querySelector('.jc-card-media');
    const body = document.querySelector('.jc-card-body');
    const upload = document.querySelector('.jc-upload-fab');
    const style = (node) => node ? getComputedStyle(node) : null;
    return {
      cards: document.querySelectorAll('.jc-card').length,
      emptyHidden: empty?.hidden,
      emptyDisplay: style(empty)?.display,
      masonryHidden: masonry?.hidden,
      masonryDisplay: style(masonry)?.display,
      cardBackground: style(card)?.backgroundColor,
      mediaRadius: style(media)?.borderRadius,
      bodyPosition: style(body)?.position,
      uploadText: upload?.textContent?.trim(),
      uploadWidth: style(upload)?.width,
      uploadHeight: style(upload)?.height,
      uploadDirection: style(upload)?.flexDirection,
      assetBridge: typeof window.jiaren?.system?.readCommunityAsset,
      remoteUrl: card?.querySelector('img,video')?.currentSrc || card?.querySelector('img,video')?.src || '',
    };
  })()`);

  const appVersion = await evaluate(`window.jiaren.system.getAppVersion()`);

  const localRead = await evaluate(`(async () => {
    const result = await window.jiaren.system.readCommunityAsset({
      source: ${JSON.stringify(localImage)},
      mimeType: 'image/png',
      fileName: 'qa-local.png',
      maxBytes: 20 * 1024 * 1024,
    });
    return { ok: result?.ok, mimeType: result?.mimeType, fileName: result?.fileName, size: result?.size, bytes: result?.bytes?.byteLength };
  })()`);

  const remoteRead = ui.remoteUrl.startsWith('https:') ? await evaluate(`(async () => {
    const result = await window.jiaren.system.readCommunityAsset({
      source: ${JSON.stringify(ui.remoteUrl)},
      mimeType: 'image/png',
      fileName: 'qa-remote.png',
      maxBytes: 20 * 1024 * 1024,
    });
    return { ok: result?.ok, mimeType: result?.mimeType, fileName: result?.fileName, size: result?.size, bytes: result?.bytes?.byteLength, message: result?.message };
  })()`) : { skipped: true };

  const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  console.log(JSON.stringify({ appVersion, ui, localRead, remoteRead, runtimeErrors, screenshotPath }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  child.kill();
}
