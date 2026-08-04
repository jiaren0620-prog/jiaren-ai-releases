import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error('JIAREN_QA_RUNTIME is required');

const exePath = path.join(runtimeDir, 'Jiaren AI.exe');
const testId = `${Date.now()}-${process.pid}`;
const profileDir = path.join(runtimeDir, `qa-profile-project-menu-${testId}`);
const customProjectDir = path.join(runtimeDir, `qa-menu-project-${testId}`);
const port = Number(process.env.JIAREN_QA_PORT || 9374);
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
await fs.mkdir(customProjectDir, { recursive: true });
const child = spawn(exePath, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  '--no-first-run',
], { cwd: runtimeDir, env: { ...process.env, JIAREN_QA_PROJECT_DIR: customProjectDir }, stdio: 'ignore' });

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
  const clickSelector = async (selector) => {
    const point = await evaluate(`(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const hit = document.elementFromPoint(x, y);
      return {
        x,
        y,
        target: element.className,
        hitTag: hit?.tagName || '',
        hitClass: typeof hit?.className === 'string' ? hit.className : '',
        hitsTarget: hit === element || element.contains(hit)
      };
    })()`);
    if (!point) throw new Error(`Cannot click missing element: ${selector}`);
    console.log('CLICK', selector, JSON.stringify(point));
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x, y: point.y });
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: point.x, y: point.y, button: 'left', clickCount: 1 });
  };
  const waitFor = async (expression, label, timeout = 20000) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await evaluate(expression)) return;
      await pause(150);
    }
    throw new Error(`Timed out waiting for ${label}`);
  };
  const enterWorkspace = async () => {
    await waitFor(`Boolean(document.querySelector('.jiaren-launch-art button[data-mode="free"]'))`, 'launcher');
    if (await evaluate(`Boolean(document.querySelector('.jiaren-launch-notice-backdrop button'))`)) {
      await clickSelector('.jiaren-launch-notice-backdrop button');
      await waitFor(`!document.querySelector('.jiaren-launch-notice-backdrop')`, 'launch notice dismissal');
    }
    await clickSelector('.jiaren-launch-art button[data-mode="free"]');
    await waitFor(`!document.body.classList.contains('jiaren-launch-active') && Boolean(document.querySelector('.jiaren-canvas-project-pill'))`, 'workspace');
  };
  const openMenu = async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await evaluate(`(() => {
        const trigger = document.querySelector('.jiaren-canvas-project-pill');
        const rect = trigger.getBoundingClientRect();
        trigger.dispatchEvent(new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: rect.left + 12,
          clientY: rect.bottom + 6,
          view: window
        }));
      })()`);
      await pause(180);
      if (await evaluate(`Boolean(document.querySelector('.project-context-menu[data-jiaren-v019-enhanced="true"]'))`)) return;
    }
    throw new Error('Timed out waiting for stable enhanced project menu');
  };

  await send('Runtime.enable');
  await enterWorkspace();

  const topChromeLayout = await evaluate(`(() => {
    const rect = (selector) => {
      const box = document.querySelector(selector).getBoundingClientRect();
      return { top: box.top, right: box.right, bottom: box.bottom, left: box.left, width: box.width, height: box.height };
    };
    return {
      back: rect('.jiaren-startup-back-button'),
      project: rect('.jiaren-canvas-project-pill')
    };
  })()`);
  if (topChromeLayout.back.right + 6 > topChromeLayout.project.left) {
    throw new Error('Top back button overlaps the project logo pill');
  }

  await clickSelector('.jiaren-startup-back-button');
  await waitFor(`document.body.classList.contains('jiaren-launch-active')`, 'launcher from top back button');
  const topBackButton = true;

  await enterWorkspace();
  await openMenu();
  const menuButtons = await evaluate(`[...document.querySelectorAll('.project-context-menu button')].map((button) => ({
    text: button.textContent.trim(),
    className: button.className,
    disabled: button.disabled,
    pointerEvents: getComputedStyle(button).pointerEvents
  }))`);

  await clickSelector('.project-context-menu .jiaren-project-home');
  await waitFor(`document.body.classList.contains('jiaren-launch-active')`, 'launcher from project menu');
  const menuHome = true;

  await enterWorkspace();
  await openMenu();
  await clickSelector('.project-context-menu .jiaren-project-community');
  await waitFor(`document.querySelector('.jc-shell')?.dataset.open === 'true'`, 'community from project menu');
  const menuCommunity = true;
  await evaluate(`window.JiarenCommunity.close()`);
  await waitFor(`document.querySelector('.jc-shell')?.dataset.open !== 'true'`, 'community close');

  await openMenu();
  await clickSelector('.project-context-menu button[data-jiaren-explicit-save="true"]');
  await waitFor(`(async () => (await window.jiaren.system.listSavedProjects()).projects.length === 1)()`, 'explicit project save');
  const savedProjects = await evaluate(`window.jiaren.system.listSavedProjects()`);
  if (savedProjects.projects[0]?.projectDirectory !== customProjectDir) throw new Error('Project menu save did not bind the selected custom directory');
  await fs.access(path.join(customProjectDir, 'jiaren-project.json'));

  console.log(JSON.stringify({
    topBackButton,
    topChromeLayout,
    menuButtons,
    menuHome,
    menuCommunity,
    savedProjectCount: savedProjects.projects.length,
    savedProjectName: savedProjects.projects[0]?.projectName,
    savedProjectDirectory: savedProjects.projects[0]?.projectDirectory,
  }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  await pause(500);
  await fs.rm(profileDir, { recursive: true, force: true });
  await fs.rm(customProjectDir, { recursive: true, force: true });
}
