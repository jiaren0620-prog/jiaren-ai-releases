import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error("JIAREN_QA_RUNTIME is required");

const executablePath = path.join(runtimeDir, "Jiaren AI.exe");
const profileDir = process.env.JIAREN_QA_PROFILE || path.join(os.tmpdir(), `jiaren-codex-send-${Date.now()}-${process.pid}`);
const port = Number(process.env.JIAREN_QA_PORT || 9493);
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
  const waitFor = async (expression, label, timeout = 30000) => {
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
    const confirm = [...document.querySelectorAll('button')].find((item) => item.textContent.trim() === '确认进入' && item.getBoundingClientRect().width > 0);
    confirm?.click();
    document.querySelector('.jiaren-launch-art button[data-mode="free"]')?.click();
    return true;
  })()`);
  await waitFor("Boolean(document.querySelector('.react-flow__pane'))", "canvas");
  await evaluate(`(() => {
    const entry = [...document.querySelectorAll('button')].find((item) => item.title === '对话模型' && item.getBoundingClientRect().width > 0);
    entry?.click();
    return Boolean(entry);
  })()`);
  await waitFor("Boolean(document.querySelector('.jiaren-agent-mode-switch button[data-mode=\"local\"]'))", "agent panel");
  await evaluate("document.querySelector('.jiaren-agent-mode-switch button[data-mode=\"local\"]').click(); true");
  await waitFor("document.querySelector('.jiaren-codex-workspace')?.hidden === false", "local Codex workspace");
  await evaluate("document.querySelector('[data-action=\"connect\"]').click(); true");
  await waitFor("document.querySelector('.jiaren-codex-state')?.classList.contains('is-ready')", "Codex connection", 30000);
  await waitFor("/已登录/.test(document.querySelector('.jiaren-codex-state b')?.textContent || '')", "confirmed Codex account", 30000);
  await waitFor("document.querySelector('[data-action=\"send\"]')?.disabled === false", "send button readiness", 30000);
  await evaluate(`(() => {
    const field = document.querySelector('[data-field="prompt"]');
    field.value = 'Reply with UI-CHECK only.';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-action="send"]').click();
    return true;
  })()`);
  await waitFor(`(() => {
    const replies = [...document.querySelectorAll('.jiaren-codex-message.is-assistant .jiaren-codex-bubble span')];
    return replies.some((node) => (node.textContent || '').includes('UI-CHECK'));
  })()`, "packaged Codex reply", 90000);
  await waitFor("document.querySelector('[data-action=\"send\"]')?.disabled === false", "send button recovery", 30000);

  const result = await evaluate(`(() => ({
    status: document.querySelector('.jiaren-codex-state b')?.textContent || '',
    reply: [...document.querySelectorAll('.jiaren-codex-message.is-assistant .jiaren-codex-bubble span')].map((node) => node.textContent || '').join('\\n'),
    failures: [...document.querySelectorAll('.jiaren-codex-message.is-tool .jiaren-codex-bubble span')].map((node) => node.textContent || '').filter((value) => /失败|error|invalid request/i.test(value)),
    sendDisabled: document.querySelector('[data-action="send"]')?.disabled,
  }))()`);
  assert.match(result.status, /已登录/);
  assert.match(result.reply, /UI-CHECK/);
  assert.deepEqual(result.failures, []);
  assert.equal(result.sendDisabled, false);
  console.log(JSON.stringify(result, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  if (child.exitCode === null) {
    await Promise.race([
      new Promise((resolve) => child.once('exit', resolve)),
      pause(5000),
    ]);
  }
  if (!process.env.JIAREN_QA_PROFILE) {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      try {
        await fs.rm(profileDir, { recursive: true, force: true });
        break;
      } catch (error) {
        if (error?.code !== 'EBUSY' && error?.code !== 'EPERM') throw error;
        await pause(500);
      }
    }
  }
}
