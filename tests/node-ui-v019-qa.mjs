import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error("JIAREN_QA_RUNTIME is required");

const exePath = path.join(runtimeDir, "Jiaren AI.exe");
const testId = `${Date.now()}-${process.pid}`;
const profileDir = path.join(runtimeDir, `qa-profile-node-ui-${testId}`);
const artifactDir = path.resolve("tests", "artifacts");
const port = Number(process.env.JIAREN_QA_PORT || 9386);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  throw new Error("Jiaren AI CDP page target not found");
}

await fs.mkdir(profileDir, { recursive: true });
await fs.mkdir(artifactDir, { recursive: true });

const child = spawn(exePath, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "--no-first-run",
], { cwd: runtimeDir, stdio: "ignore" });

let socket;
try {
  const target = await findTarget();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
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
    const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result?.value;
  };

  await send("Runtime.enable");
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const readyDeadline = Date.now() + 20000;
  while (Date.now() < readyDeadline) {
    if (await evaluate("document.readyState === 'complete' && document.body.innerText.length > 0")) break;
    await pause(200);
  }

  await evaluate(`(() => {
    const notice = document.querySelector('.jiaren-launch-notice-backdrop');
    const confirm = notice?.querySelector('button');
    if (!confirm) return false;
    confirm.click();
    return true;
  })()`);
  await pause(250);

  const launcher = await evaluate(`(() => ({
    text: document.body.innerText.slice(0, 3000),
    buttons: [...document.querySelectorAll("button")].filter((element) => element.offsetParent).map((element) => element.innerText.trim()).filter(Boolean),
  }))()`);

  await evaluate(`(() => {
    const candidates = [...document.querySelectorAll("button")].filter((element) => element.offsetParent);
    const button = candidates.find((element) => /自由创作|自由画布|空白画布|开始创作/.test(element.innerText));
    if (!button) return false;
    button.click();
    return true;
  })()`);

  const canvasDeadline = Date.now() + 20000;
  while (Date.now() < canvasDeadline) {
    if (await evaluate("Boolean(document.querySelector('.react-flow__pane'))")) break;
    await pause(200);
  }

  await evaluate(`(() => {
    const pane = document.querySelector(".react-flow__pane");
    if (!pane) return false;
    pane.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2, clientX: 620, clientY: 380 }));
    return true;
  })()`);
  await pause(500);

  const contextMenu = await evaluate(`(() => ({
    text: document.body.innerText.slice(-5000),
    candidates: [...document.querySelectorAll("button,[role='menuitem'],[role='option']")]
      .filter((element) => element.offsetParent)
      .map((element) => element.innerText.trim())
      .filter(Boolean),
  }))()`);

  const nestedMenus = {};
  for (const group of ["AI 创作", "图像工具", "流程工具"]) {
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
    await evaluate(`(() => {
      const pane = document.querySelector(".react-flow__pane");
      if (!pane) return false;
      pane.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2, clientX: 620, clientY: 380 }));
      return true;
    })()`);
    await pause(150);
    const groupRect = await evaluate(`(() => {
      const label = ${JSON.stringify(group)};
      const element = [...document.querySelectorAll("button,[role='menuitem']")]
        .filter((candidate) => candidate.offsetParent && candidate.innerText.trim() === label)
        .sort((left, right) => left.innerText.length - right.innerText.length)[0];
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    if (groupRect) {
      await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: groupRect.x, y: groupRect.y });
    }
    await pause(250);
    nestedMenus[group] = await evaluate(`(() => [...document.querySelectorAll("button,[role='menuitem'],[role='option']")]
      .filter((element) => element.offsetParent)
      .map((element) => element.innerText.trim())
      .filter(Boolean))()`);
  }

  const createNode = async (group, label, x, y) => {
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x: 1280, y: 170, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: 1280, y: 170, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "right", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "right", clickCount: 1 });
    await pause(180);
    const groupRect = await evaluate(`(() => {
      const group = ${JSON.stringify(group)};
      const element = [...document.querySelectorAll("button,[role='menuitem']")]
        .find((candidate) => candidate.offsetParent && candidate.innerText.trim() === group);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    if (!groupRect) throw new Error(`Context group not found: ${group}`);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: groupRect.x, y: groupRect.y });
    await pause(220);
    let itemRect = await evaluate(`(() => {
      const label = ${JSON.stringify(label)};
      const element = [...document.querySelectorAll("button,[role='menuitem']")]
        .filter((candidate) => candidate.offsetParent && candidate.innerText.trim().split("\\n")[0] === label)
        .sort((left, right) => left.innerText.length - right.innerText.length)[0];
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    if (!itemRect) {
      await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: groupRect.x + 1, y: groupRect.y + 1 });
      await pause(300);
      itemRect = await evaluate(`(() => {
        const label = ${JSON.stringify(label)};
        const element = [...document.querySelectorAll("button,[role='menuitem']")]
          .filter((candidate) => candidate.offsetParent && candidate.innerText.trim().split("\\n")[0] === label)
          .sort((left, right) => left.innerText.length - right.innerText.length)[0];
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()`);
    }
    if (!itemRect) {
      await send("Input.dispatchMouseEvent", { type: "mousePressed", x: groupRect.x, y: groupRect.y, button: "left", clickCount: 1 });
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: groupRect.x, y: groupRect.y, button: "left", clickCount: 1 });
      await pause(300);
      itemRect = await evaluate(`(() => {
        const label = ${JSON.stringify(label)};
        const element = [...document.querySelectorAll("button,[role='menuitem']")]
          .filter((candidate) => candidate.offsetParent && candidate.innerText.trim().split("\\n")[0] === label)
          .sort((left, right) => left.innerText.length - right.innerText.length)[0];
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()`);
    }
    if (!itemRect) {
      const diagnostic = await evaluate(`(() => {
        const groupLabel = ${JSON.stringify(group)};
        const itemLabel = ${JSON.stringify(label)};
        const parent = [...document.querySelectorAll('.jiaren-menu-parent')]
          .find((candidate) => candidate.innerText.trim() === groupLabel);
        const groupElement = parent?.closest('.jiaren-menu-group');
        const submenu = groupElement?.querySelector('.jiaren-menu-submenu');
        const item = [...(submenu?.querySelectorAll('button') || [])]
          .find((candidate) => candidate.innerText.trim().split('\\n')[0] === itemLabel);
        const submenuStyle = submenu ? getComputedStyle(submenu) : null;
        const itemStyle = item ? getComputedStyle(item) : null;
        return {
          parentFound: Boolean(parent),
          parentFocused: document.activeElement === parent,
          groupFocusWithin: Boolean(groupElement?.matches(':focus-within')),
          groupHover: Boolean(groupElement?.matches(':hover')),
          submenuFound: Boolean(submenu),
          submenuDisplay: submenuStyle?.display,
          submenuVisibility: submenuStyle?.visibility,
          submenuRect: submenu?.getBoundingClientRect().toJSON(),
          itemFound: Boolean(item),
          itemDisplay: itemStyle?.display,
          itemRect: item?.getBoundingClientRect().toJSON(),
          submenuItems: [...(submenu?.querySelectorAll('button') || [])].map((button) => button.innerText.trim()),
          hitAtParentCenter: parent ? (() => {
            const rect = parent.getBoundingClientRect();
            const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
            return { tag: hit?.tagName, className: hit?.className, text: hit?.textContent?.trim() };
          })() : null,
        };
      })()`);
      throw new Error(`Context item not found: ${group} > ${label}; ${JSON.stringify(diagnostic)}`);
    }
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x: itemRect.x, y: itemRect.y, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: itemRect.x, y: itemRect.y, button: "left", clickCount: 1 });
    await pause(650);
  };

  await createNode("AI 创作", "视频生成", 330, 240);
  const videoNodeRect = await evaluate(`(() => {
    const node = document.querySelector(".react-flow__node-t8\\\\:video");
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + Math.min(40, rect.height / 2) };
  })()`);
  if (videoNodeRect) {
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x: videoNodeRect.x, y: videoNodeRect.y, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: videoNodeRect.x, y: videoNodeRect.y, button: "left", clickCount: 1 });
    await pause(700);
  }
  const videoEditorState = await evaluate(`(() => ({
    nodeCount: document.querySelectorAll(".react-flow__node-t8\\\\:video").length,
    editors: [...document.querySelectorAll('[data-jiaren-media-editor="video"]')].map((element) => ({
      nodeId: element.getAttribute("data-jiaren-node-id"),
      duplicate: element.getAttribute("data-jiaren-duplicate"),
      display: getComputedStyle(element).display,
      visible: Boolean(element.offsetParent),
    })),
  }))()`);

  await createNode("AI 创作", "Seedance 2.0", 740, 220);
  await createNode("图像工具", "宫格裁切", 1030, 260);
  await createNode("流程工具", "BP 蓝图", 950, 610);

  const styleState = await evaluate(`(() => {
    const inspect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const panel = node.querySelector(":scope > .t8-original-scope > div") || node.firstElementChild;
      const icon = node.querySelector('div[class~="w-6"][class~="h-6"]:has(> svg)');
      const svg = icon?.querySelector("svg") || null;
      const handle = node.querySelector(".react-flow__handle");
      const panelStyle = panel ? getComputedStyle(panel) : null;
      const iconStyle = icon ? getComputedStyle(icon) : null;
      const svgStyle = svg ? getComputedStyle(svg) : null;
      const handleStyle = handle ? getComputedStyle(handle) : null;
      return {
        className: node.className,
        radius: panelStyle?.borderRadius || null,
        overflow: panelStyle?.overflow || null,
        panelBackground: panelStyle?.backgroundColor || null,
        iconColor: iconStyle?.color || null,
        iconBackground: iconStyle?.backgroundColor || null,
        svgColor: svgStyle?.color || null,
        svgStroke: svgStyle?.stroke || null,
        handleBackground: handleStyle?.backgroundColor || null,
        handleClassName: handle?.className || null,
        handleInlineStyle: handle?.getAttribute("style") || null,
        handleInlinePriority: handle?.style.getPropertyPriority("background") || handle?.style.getPropertyPriority("background-color") || null,
      };
    };
    return {
      seedance: inspect(".react-flow__node-sdVideo"),
      gridCrop: inspect(".react-flow__node-t8\\\\:grid-crop"),
      bp: inspect(".react-flow__node-bp"),
      seedanceSelects: [...document.querySelectorAll(".react-flow__node-sdVideo select")].map((select) => ({
        value: select.value,
        options: [...select.options].map((option) => option.text),
      })),
      seedanceText: document.querySelector(".react-flow__node-sdVideo")?.innerText || "",
    };
  })()`);

  const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const screenshotPath = path.join(artifactDir, "node-ui-v019-menu.png");
  await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));

  const visibleEditors = videoEditorState.editors.filter((editor) => editor.display !== "none");
  if (videoEditorState.nodeCount !== 1) throw new Error(`Expected one video node, received ${videoEditorState.nodeCount}`);
  if (visibleEditors.length !== 1) throw new Error(`Expected one visible video editor, received ${visibleEditors.length}`);
  if (!videoEditorState.editors.some((editor) => editor.duplicate === "true" && editor.display === "none")) {
    throw new Error("The duplicate video editor was not marked and hidden");
  }
  for (const [name, state] of Object.entries({ seedance: styleState.seedance, gridCrop: styleState.gridCrop, bp: styleState.bp })) {
    if (!state) throw new Error(`${name} node is missing`);
    if (state.radius !== "8px") throw new Error(`${name} radius is ${state.radius}, expected 8px`);
    if (state.iconColor !== "rgb(199, 255, 61)") throw new Error(`${name} icon color is ${state.iconColor}`);
    if (state.handleBackground !== "rgb(199, 255, 61)") throw new Error(`${name} handle color is ${state.handleBackground}`);
  }
  if (!styleState.seedanceSelects.some((select) => select.value === "seedance" && select.options.includes("影视工坊 + 导演"))) {
    throw new Error("Seedance studio/director mode selector is missing");
  }

  console.log(JSON.stringify({
    ok: true,
    videoEditorState,
    nodeStyles: {
      seedance: styleState.seedance,
      gridCrop: styleState.gridCrop,
      bp: styleState.bp,
    },
    seedanceStudioMode: "available-opt-in",
    screenshotPath,
  }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  await pause(700);
  await fs.rm(profileDir, { recursive: true, force: true });
}
