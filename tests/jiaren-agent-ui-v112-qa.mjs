import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error("JIAREN_QA_RUNTIME is required");

const executablePath = process.env.JIAREN_QA_EXECUTABLE || path.join(runtimeDir, "Jiaren AI.exe");
const appPath = process.env.JIAREN_QA_APP || "";
const profileDir = process.env.JIAREN_QA_PROFILE || path.join(os.tmpdir(), `jiaren-agent-ui-${Date.now()}-${process.pid}`);
const screenshotPath = process.env.JIAREN_QA_SCREENSHOT || path.resolve("tests", "artifacts", "jiaren-agent-v112.png");
const port = Number(process.env.JIAREN_QA_PORT || 9391);
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
await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
const child = spawn(executablePath, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "--no-first-run",
  ...(appPath ? [appPath] : []),
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
    if (response.exceptionDetails) {
      const detail = response.exceptionDetails.exception?.description
        || response.exceptionDetails.exception?.value
        || response.exceptionDetails.text;
      throw new Error(String(detail));
    }
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
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await waitFor("Boolean(document.querySelector('.jiaren-launch-art button[data-mode=\"free\"]'))", "launcher");
  await evaluate(`(() => {
    const button = [...document.querySelectorAll('button')].find((item) =>
      item.textContent.trim() === '确认进入' && item.getBoundingClientRect().width > 0
    );
    if (button) button.click();
    return true;
  })()`);
  await pause(250);
  await evaluate("document.querySelector('.jiaren-launch-art button[data-mode=\"free\"]').click(); true");
  await waitFor("Boolean(document.querySelector('.react-flow__pane'))", "primary canvas");

  const candidates = await evaluate(`(() => [...document.querySelectorAll('button')]
    .filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })
    .map((node) => ({
      text: (node.textContent || '').trim(),
      title: node.title || '',
      aria: node.getAttribute('aria-label') || '',
    }))
    .filter((item) => /agent|智能|助手|对话|codex/i.test(item.text + ' ' + item.title + ' ' + item.aria))
    .slice(0, 80))()`);

  const clicked = await evaluate(`(() => {
    const node = [...document.querySelectorAll('button')].find((item) =>
      item.title === '对话模型' && item.getBoundingClientRect().width > 0
    );
    if (!node) return null;
    node.click();
    return { text: (node.textContent || '').trim(), title: node.title || '', aria: node.getAttribute('aria-label') || '' };
  })()`);
  assert.ok(clicked, `Jiaren Agent entry was not found: ${JSON.stringify(candidates)}`);
  await waitFor("Boolean(document.querySelector('.jiaren-agent-panel .jiaren-agent-mode-switch'))", "Jiaren Agent panel");
  await evaluate(`(() => {
    const button = document.querySelector('.jiaren-agent-mode-switch button[data-mode="local"]');
    if (!button) return false;
    button.click();
    return true;
  })()`);
  await waitFor("document.querySelector('.jiaren-codex-workspace')?.hidden === false", "local Codex workspace");

  const separation = await evaluate(`(() => {
    const timeline = document.querySelector('.jiaren-codex-timeline');
    const dialogue = document.createElement('article');
    dialogue.className = 'jiaren-codex-message is-assistant';
    dialogue.dataset.qaDialogue = '1';
    const log = document.createElement('article');
    log.className = 'jiaren-codex-message is-tool is-log-entry';
    log.dataset.qaLog = '1';
    const activity = document.createElement('div');
    activity.className = 'jiaren-codex-activity';
    activity.dataset.qaActivity = '1';
    timeline.append(dialogue, log, activity);
    const visible = (node) => getComputedStyle(node).display !== 'none';
    const chat = { dialogue: visible(dialogue), log: visible(log), activity: visible(activity) };
    document.querySelector('.jiaren-codex-tabs button[data-view="log"]').click();
    const logView = { dialogue: visible(dialogue), log: visible(log), activity: visible(activity) };
    document.querySelector('.jiaren-codex-tabs button[data-view="chat"]').click();
    dialogue.remove();
    log.remove();
    activity.remove();
    return { chat, logView };
  })()`);
  assert.deepEqual(separation.chat, { dialogue: true, log: false, activity: true });
  assert.deepEqual(separation.logView, { dialogue: false, log: true, activity: false });

  await evaluate(`(() => {
    const timeline = document.querySelector('.jiaren-codex-timeline');
    const run = document.createElement('details');
    run.className = 'jiaren-codex-run';
    run.open = true;
    const summary = document.createElement('summary');
    summary.innerHTML = '<strong>处理中 8秒</strong><span class="jiaren-codex-run-meta">2 个命令 · 1 个画布操作</span>';
    const body = document.createElement('div');
    body.className = 'jiaren-codex-run-body';
    const note = document.createElement('p');
    note.className = 'jiaren-codex-run-note is-commentary';
    note.textContent = '我正在读取当前画布并核对节点关系，然后会按你的要求更新内容。';
    const step = document.createElement('div');
    step.className = 'jiaren-codex-run-step is-complete';
    step.innerHTML = '<i></i><span>已读取当前画布</span><small>1秒</small>';
    const process = document.createElement('div');
    process.className = 'jiaren-codex-process-line is-queued';
    process.dataset.qaProcess = '1';
    process.innerHTML = '<i></i><span>图片正在生成</span><small>等待画布收到最终图片，不会提前报告成功。</small>';
    const activity = document.createElement('div');
    activity.className = 'jiaren-codex-activity';
    activity.innerHTML = '<i></i><span>Codex 正在继续处理…</span>';
    body.append(note, step, process, activity);
    run.append(summary, body);
    timeline.append(run);
    return true;
  })()`);

  const planId = await evaluate(`(async () => {
    const plan = await window.jiaren.agentControl.submitPlan({
      source: 'Jiaren Canvas MCP QA',
      title: '审批可见性测试',
      summary: '此计划必须由用户明确批准后才能写入画布。',
      operations: [{
        type: 'node.add',
        ref: 'approval-visibility-node',
        kind: 'textInput',
        position: { x: 120, y: 120 },
        data: { kind: 'textInput', title: '审批可见性测试' }
      }]
    });
    return plan.id;
  })()`);
  await waitFor(`Boolean(document.querySelector('.jiaren-codex-approval.is-canvas-plan[data-plan-id="${planId}"]'))`, "MCP canvas approval card");

  const approval = await evaluate(`(() => {
    const card = document.querySelector('.jiaren-codex-approval.is-canvas-plan[data-plan-id="${planId}"]');
    return {
      text: card?.textContent || '',
      approve: [...(card?.querySelectorAll('button') || [])].some((item) => item.textContent.trim() === '批准一次'),
      approveSession: [...(card?.querySelectorAll('button') || [])].some((item) => item.textContent.trim() === '本对话持续授权'),
      reject: [...(card?.querySelectorAll('button') || [])].some((item) => item.textContent.trim() === '拒绝'),
    };
  })()`);
  assert.match(approval.text, /审批可见性测试/);
  assert.equal(approval.approve, true);
  assert.equal(approval.approveSession, true);
  assert.equal(approval.reject, true);

  const approvalScreenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await fs.writeFile(screenshotPath, Buffer.from(approvalScreenshot.data, "base64"));

  await evaluate(`(() => {
    const card = document.querySelector('.jiaren-codex-approval.is-canvas-plan[data-plan-id="${planId}"]');
    const approve = [...(card?.querySelectorAll('button') || [])].find((item) => item.textContent.trim() === '批准一次');
    approve?.click();
    return Boolean(approve);
  })()`);
  await waitFor(`(async () => {
    const completed = await window.jiaren.agentControl.listPlans('completed');
    return completed.some((plan) => plan.id === '${planId}');
  })()`, "completed canvas plan");

  const execution = await evaluate(`(async () => {
    const snapshot = window.__JIAREN_CANVAS_AGENT__.getSnapshot();
    const receipts = await window.jiaren.agentControl.listReceipts();
    return {
      nodeCreated: snapshot.nodes.some((node) => node.data?.title === '审批可见性测试'),
      receiptCreated: receipts.some((receipt) => receipt.planId === '${planId}' && receipt.status === 'completed'),
      cardRemoved: !document.querySelector('.jiaren-codex-approval.is-canvas-plan[data-plan-id="${planId}"]'),
    };
  })()`);
  assert.equal(execution.nodeCreated, true);
  assert.equal(execution.receiptCreated, true);
  assert.equal(execution.cardRemoved, true);

  const panel = await evaluate(`(() => {
    const node = document.querySelector('.jiaren-agent-panel');
    const rect = node.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      display: getComputedStyle(node).display,
      modes: [...node.querySelectorAll('.jiaren-agent-mode-switch button')].map((item) => item.textContent.trim()),
      hasChannelEntry: Boolean(node.querySelector('.jiaren-channel-entry')),
      actions: [...node.querySelectorAll('.jiaren-codex-account button')].map((item) => item.textContent.trim()),
      hasComposer: Boolean(node.querySelector('.jiaren-codex-composer textarea')),
      activeMode: node.querySelector('.jiaren-agent-mode-switch button.is-active')?.dataset.mode || '',
      hasConnectionControls: Boolean(node.querySelector('[data-action="connect"]') && node.querySelector('[data-action="disconnect"]')),
      hasApprovalShelf: Boolean(node.querySelector('.jiaren-codex-approvals')),
      hasHorizontalOverflow: node.scrollWidth > node.clientWidth,
      processHeight: node.querySelector('[data-qa-process]')?.getBoundingClientRect().height || 0,
      processText: node.querySelector('[data-qa-process]')?.textContent || '',
    };
  })()`);
  assert.ok(panel.modes.includes("本地 Codex"), JSON.stringify(panel));
  assert.ok(panel.modes.includes("API 对话"), JSON.stringify(panel));
  assert.equal(panel.hasChannelEntry, false);
  assert.ok(panel.actions.includes("安装画布桥接"), JSON.stringify(panel));
  assert.equal(panel.hasComposer, true);
  assert.equal(panel.activeMode, "local");
  assert.equal(panel.hasConnectionControls, true);
  assert.equal(panel.hasApprovalShelf, true);
  assert.equal(panel.hasHorizontalOverflow, false);
  assert.ok(panel.processHeight > 0 && panel.processHeight <= 40, JSON.stringify(panel));
  assert.match(panel.processText, /等待画布收到最终图片/);

  console.log(JSON.stringify({ clicked, candidates, separation, panel, approval, execution, screenshotPath }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  await pause(700);
  if (!process.env.JIAREN_QA_PROFILE) await fs.rm(profileDir, { recursive: true, force: true });
}
