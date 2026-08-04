import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error('JIAREN_QA_RUNTIME is required');
const exePath = path.join(runtimeDir, 'Jiaren AI.exe');
const userDataDir = process.env.JIAREN_QA_PROFILE || path.join(runtimeDir, 'qa-profile-codex-v86');
const screenshotPath = process.env.JIAREN_QA_SCREENSHOT || path.join(runtimeDir, 'qa-codex-v86.png');
const port = Number(process.env.JIAREN_QA_PORT || 9362);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function findTarget() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const pages = targets.filter((item) => item.type === 'page' && item.webSocketDebuggerUrl);
      const target = pages.find((item) => item.title === 'Jiaren AI')
        || pages.find((item) => item.url && item.url !== 'about:blank')
        || pages[0];
      if (target) return target;
    } catch {}
    await pause(300);
  }
  throw new Error('Jiaren AI CDP page target not found');
}

await fs.mkdir(userDataDir, { recursive: true });
const launchApp = () => spawn(exePath, [`--remote-debugging-port=${port}`, `--user-data-dir=${userDataDir}`, '--no-first-run'], {
    cwd: runtimeDir,
    stdio: 'ignore',
  });
let child = launchApp();

let socket;
let id = 0;
let pending = new Map();
const runtimeErrors = [];

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

async function connectTarget() {
  const target = await findTarget();
  const nextSocket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    nextSocket.addEventListener('open', resolve, { once: true });
    nextSocket.addEventListener('error', reject, { once: true });
  });
  nextSocket.addEventListener('message', (event) => {
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
  nextSocket.addEventListener('close', () => {
    for (const task of pending.values()) task.reject(new Error('CDP connection closed'));
    pending = new Map();
  }, { once: true });
  socket = nextSocket;
  await Promise.all([
    send('Runtime.enable'),
    send('Page.enable'),
    send('Log.enable'),
  ]);
}

try {
  await connectTarget();
  await evaluate(`localStorage.setItem('jiaren-community-session', JSON.stringify({
      accessToken: 'layout-qa', refreshToken: 'layout-qa',
      user: { id: 'layout-qa', displayName: '\u5e03\u5c40\u6d4b\u8bd5\u8d26\u53f7' }
    })); true`);

  const firstChild = child;
  const firstExit = new Promise((resolve) => firstChild.once('exit', resolve));
  await evaluate(`setTimeout(() => window.jiaren.system.windowCommand('close'), 0); true`);
  await Promise.race([firstExit, pause(5000)]);
  try { socket?.close(); } catch {}
  socket = undefined;
  pending = new Map();
  await pause(500);

  child = launchApp();
  await connectTarget();
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await pause(500);

  const chooserDeadline = Date.now() + 20000;
  while (Date.now() < chooserDeadline) {
    if (await evaluate(`Boolean(document.querySelector('.jiaren-launch-chooser'))`)) break;
    await pause(250);
  }
  const closedDetail = await evaluate(`(() => {
    const dialog = document.querySelector('.jc-codex-detail');
    return {
      open: dialog?.dataset.open,
      display: dialog ? getComputedStyle(dialog).display : null,
    };
  })()`);
  if (closedDetail.open !== 'false' || closedDetail.display !== 'none') {
    throw new Error(`Closed Codex detail is visible on startup: ${JSON.stringify(closedDetail)}`);
  }
  await evaluate(`document.querySelector('.jiaren-launch-chooser button[data-mode="free"]')?.click()`);
  await pause(900);
  await evaluate(`window.JiarenCommunity?.open()`);
  await pause(350);
  await evaluate(`Array.from(document.querySelectorAll('button')).find((node) => node.textContent.trim() === 'Codex')?.click()`);
  await pause(200);
  await evaluate(`document.querySelector('.jc-upload-fab')?.click()`);

  const dialogDeadline = Date.now() + 10000;
  while (Date.now() < dialogDeadline) {
    if (await evaluate(`document.querySelector('.jc-codex-composer')?.dataset.open === 'true'`)) break;
    await pause(150);
  }

  const result = await evaluate(`(() => {
    const dialog = document.querySelector('.jc-codex-composer');
    const scroll = document.querySelector('.jc-codex-form-scroll');
    const actions = document.querySelector('.jc-codex-form-actions');
    const publish = actions?.querySelector('[data-variant="primary"]');
    const rect = (node) => node ? {
      top: node.getBoundingClientRect().top,
      bottom: node.getBoundingClientRect().bottom,
      width: node.getBoundingClientRect().width,
      height: node.getBoundingClientRect().height,
    } : null;
    return {
      viewport: { width: innerWidth, height: innerHeight },
      dialogOpen: dialog?.dataset.open,
      dialogDisplay: dialog ? getComputedStyle(dialog).display : null,
      scroll: { ...rect(scroll), scrollHeight: scroll?.scrollHeight, clientHeight: scroll?.clientHeight },
      actions: rect(actions),
      publish: { ...rect(publish), text: publish?.textContent.trim() },
      publishVisible: Boolean(publish && publish.getBoundingClientRect().top >= 0 && publish.getBoundingClientRect().bottom <= innerHeight),
    };
  })()`);
  const appVersion = await evaluate(`window.jiaren.system.getAppVersion()`);
  const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));

  if (appVersion?.version !== '1.1.1') throw new Error(`Unexpected app version: ${appVersion?.version}`);
  if (result.dialogOpen !== 'true' || result.dialogDisplay !== 'grid') throw new Error('Codex composer did not open as a grid');
  if (!result.publishVisible || result.publish?.text !== '\u53d1\u5e03') throw new Error('Publish action is not fully visible');
  if (!(result.scroll.scrollHeight > result.scroll.clientHeight)) throw new Error('Composer fields are not independently scrollable');
  if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join('; ')}`);

  console.log(JSON.stringify({ appVersion, closedDetail, result, runtimeErrors, screenshotPath }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  child.kill();
}
