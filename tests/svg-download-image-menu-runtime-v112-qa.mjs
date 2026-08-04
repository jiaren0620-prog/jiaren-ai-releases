import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error("JIAREN_QA_RUNTIME is required");

const executablePath = process.env.JIAREN_QA_EXECUTABLE || path.join(runtimeDir, "Jiaren AI.exe");
const profileDir = process.env.JIAREN_QA_PROFILE || path.join(os.tmpdir(), `jiaren-svg-menu-${Date.now()}-${process.pid}`);
const outputDir = process.env.JIAREN_QA_OUTPUT || path.join(os.tmpdir(), `jiaren-svg-output-${Date.now()}-${process.pid}`);
const screenshotPath = process.env.JIAREN_QA_SCREENSHOT || path.resolve("tests", "artifacts", "svg-image-menu-v112.png");
const port = Number(process.env.JIAREN_QA_PORT || 9396);
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
await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
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
    if (response.exceptionDetails) {
      const detail = response.exceptionDetails.exception?.description || response.exceptionDetails.exception?.value || response.exceptionDetails.text;
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
    const notice = [...document.querySelectorAll('button')].find((button) =>
      button.textContent.trim() === '确认进入' && button.getBoundingClientRect().width > 0
    );
    notice?.click();
    document.querySelector('.jiaren-launch-art button[data-mode="free"]')?.click();
    return true;
  })()`);
  await waitFor("Boolean(window.__JIAREN_CANVAS_AGENT__ && document.querySelector('.react-flow__pane'))", "canvas");

  const saveResult = await evaluate(`(async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" rx="24" fill="#111711"/><path d="M52 116 118 54l48 42 44-34 58 54" fill="none" stroke="#c7ff3d" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    const saved = await window.jiaren.system.saveAsset({
      source: dataUrl,
      directory: ${JSON.stringify(outputDir)},
      fileName: 'should-not-remain-png.png',
      mimeType: 'image/png',
    });
    window.dispatchEvent(new CustomEvent('jiaren:canvas:import-media-package', { detail: {
      title: 'SVG 下载验证.svg',
      assets: [{ type: 'image', url: dataUrl, mimeType: 'image/svg+xml', width: 320, height: 180 }],
    }}));
    return saved;
  })()`);

  assert.equal(saveResult?.ok, true, JSON.stringify(saveResult));
  assert.match(saveResult.path, /\.svg$/i);
  const savedSvg = await fs.readFile(saveResult.path, "utf8");
  assert.match(savedSvg, /^<svg\b/);

  await waitFor("[...document.querySelectorAll('.node-preview-image')].some((node) => node.src.startsWith('data:image/svg+xml'))", "SVG canvas node");
  await evaluate(`(() => {
    const image = [...document.querySelectorAll('.node-preview-image')].find((node) => node.src.startsWith('data:image/svg+xml'));
    const rect = image.getBoundingClientRect();
    image.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: rect.left + 20, clientY: rect.top + 20 }));
    return true;
  })()`);
  await waitFor("Boolean(document.querySelector('.image-selection-popover'))", "image context menu");
  await pause(150);

  const menu = await evaluate(`(() => {
    const root = document.querySelector('.image-selection-popover');
    const buttons = [...root.querySelectorAll('button')].filter((button) => {
      const rect = button.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(button).display !== 'none';
    });
    return {
      labels: buttons.map((button) => (button.textContent || button.title || '').trim()),
      titles: buttons.map((button) => button.title || ''),
      columns: getComputedStyle(root).gridTemplateColumns.split(' ').filter(Boolean).length,
      width: root.getBoundingClientRect().width,
      background: getComputedStyle(root).backgroundColor,
      hasMore: buttons.some((button) => /更多工具/.test(button.textContent || button.title)),
    };
  })()`);

  assert.equal(menu.columns, 3, JSON.stringify(menu));
  assert.equal(menu.hasMore, false, JSON.stringify(menu));
  assert.ok(menu.labels.length >= 20, JSON.stringify(menu));
  for (const label of ["快速编辑", "AI 扩图", "A/B 对比", "放大", "去背景", "无损高清", "素材库", "提示词库", "姿势大师", "LLM-智能体", "继续生成", "反推", "PSD 分层", "GenPSD", "放入画布", "角色锁定", "橡皮工具", "分享到社区"]) {
    assert.ok(menu.labels.some((value) => value.includes(label)), `${label}: ${JSON.stringify(menu)}`);
  }
  assert.ok(menu.titles.includes("下载"));
  assert.ok(menu.titles.includes("删除"));

  const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));
  console.log(JSON.stringify({ saveResult, menu, screenshotPath }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  if (child.pid) spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
}
