"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function write(relativePath, source) {
  fs.writeFileSync(path.join(projectRoot, relativePath), source, "utf8");
}

function replaceOnce(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Missing ${label}.`);
  return source.replace(search, replacement);
}

function patchCodexUi() {
  const relativePath = "dist/assets/jiaren-codex-app-server-v112.js";
  let source = read(relativePath);
  if (!source.includes("function friendlyCodexError(value)")) {
    source = replaceOnce(
      source,
      "\n  function message(container, role, content, detail) {",
      `
  function friendlyCodexError(value) {
    const source = text(value, "Codex 任务失败。");
    if (/capacity|at capacity|try a different model|model unavailable|temporarily unavailable|rate limit/i.test(source)) {
      return "当前 Codex 服务暂时繁忙，请稍后重试。";
    }
    if (/api[_ -]?key|authorization|https?:\\/\\//i.test(source)) {
      return "Codex 对话服务暂时不可用，请检查登录状态后重试。";
    }
    return source;
  }

  function message(container, role, content, detail) {`,
      "Codex friendly error helper",
    );
  }

  source = source.replace(
    /if \(turn\.status === "failed"\)[^\n]+/,
    'if (turn.status === "failed") message(timeline, "tool", friendlyCodexError(turn.error?.message), "失败");',
  );

  const sendStart = source.indexOf("async function send(workspace)");
  const sendEnd = source.indexOf("\n  function flushStream", sendStart);
  if (sendStart < 0 || sendEnd < 0) throw new Error("Missing Codex send function.");
  const sendSource = source.slice(sendStart, sendEnd);
  const sendPatched = sendSource.replace(
    /message\(timeline, "tool", error\.message \|\| String\(error\), [^;]+;/,
    'message(timeline, "tool", friendlyCodexError(error.message || String(error)), "任务启动失败");',
  );
  if (sendPatched === sendSource && !sendSource.includes("friendlyCodexError(error.message || String(error))")) {
    throw new Error("Missing Codex send error path.");
  }
  source = source.slice(0, sendStart) + sendPatched + source.slice(sendEnd);
  write(relativePath, source);
}

function patchImageRuntime() {
  const relativePath = "dist-electron/electron/main.js";
  let source = read(relativePath);
  if (!source.includes("const MAX_ACTIVE_IMAGE_TASKS = 2;")) {
    source = replaceOnce(
      source,
      "const activeImageTasks = new Map();",
      `const activeImageTasks = new Map();
const imageTaskQueue = [];
const MAX_ACTIVE_IMAGE_TASKS = 2;
function queuePosition(task) {
  if (!task || task.state !== "queued") return 0;
  const index = imageTaskQueue.indexOf(task);
  return index < 0 ? 0 : index + 1;
}
function updateQueuedImageTaskPositions() {
  imageTaskQueue.forEach((task) => emitImageTaskState(task));
}
function safeImageTaskError(error) {
  const value = error instanceof Error ? error.message : String(error || "");
  if (/capacity|at capacity|try a different model|model unavailable|temporarily unavailable|rate limit|api[_ -]?key|authorization|https?:\\/\\//i.test(value)) {
    return "图片任务未完成，请检查当前图片接口配置后重试";
  }
  return value || "图片任务未完成，请稍后重试";
}
function drainImageTaskQueue() {
  while (activeImageTasks.size < MAX_ACTIVE_IMAGE_TASKS && imageTaskQueue.length) {
    const task = imageTaskQueue.shift();
    if (!task || task.state === "canceled") continue;
    task.state = "running";
    task.startedAt = new Date().toISOString();
    task.message = "图片任务正在生成";
    void runImageTask(task);
  }
  updateQueuedImageTaskPositions();
}`,
      "image task scheduler",
    );
    source = replaceOnce(source, "    position: 0,\n  };", "    position: queuePosition(task),\n  };", "image queue position");
  }

  const trimStart = source.indexOf("function trimImageTaskHistory()");
  const appStart = source.indexOf("electron_1.app.whenReady().then", trimStart);
  if (trimStart < 0 || appStart < 0) throw new Error("Missing image task tail.");
  const imageTaskTail = `function trimImageTaskHistory() {
  if (imageTaskStates.size <= 200) return;
  for (const [id, task] of imageTaskStates) {
    if (!activeImageTasks.has(id) && task.state !== "running" && task.state !== "queued") imageTaskStates.delete(id);
    if (imageTaskStates.size <= 160) break;
  }
}
async function runImageTask(task) {
  activeImageTasks.set(task.id, task);
  emitImageTaskState(task);
  try {
    const result = await generateImageV2(normalizeImageRequest(task.request), task.controller.signal);
    const assets = Array.isArray(result?.assets) ? result.assets.filter(Boolean) : [];
    const hasFinalImage = result?.status === "succeeded" && assets.length > 0;
    const canceled = task.controller.signal.aborted;
    task.state = canceled ? "canceled" : hasFinalImage ? "succeeded" : "failed";
    task.message = canceled
      ? "图片任务已取消"
      : hasFinalImage
        ? String(result?.message || "图片任务已完成")
        : safeImageTaskError(result?.message || (result?.status === "queued" ? "图片接口只确认排队，尚未返回最终图片。" : "图片接口未返回最终图片。"));
    task.resolve(canceled
      ? { ...result, id: result?.id || task.id, status: "canceled", assets: [], message: task.message }
      : hasFinalImage
        ? result
        : { ...result, id: result?.id || task.id, status: "failed", assets: [], message: task.message });
  } catch (error) {
    const canceled = task.controller.signal.aborted;
    task.state = canceled ? "canceled" : "failed";
    task.message = canceled ? "图片任务已取消" : safeImageTaskError(error);
    task.resolve({
      id: task.id,
      modelId: task.request?.modelId,
      status: canceled ? "canceled" : "failed",
      elapsedMs: task.startedAt ? Math.max(0, Date.now() - Date.parse(task.startedAt)) : 0,
      assets: [],
      message: task.message,
    });
  } finally {
    task.completedAt = new Date().toISOString();
    emitImageTaskState(task);
    activeImageTasks.delete(task.id);
    trimImageTaskHistory();
    drainImageTaskQueue();
  }
}
function enqueueImageGeneration(sender, request) {
  const id = cleanText(request?.clientTaskId, "", 160) || node_crypto_1.default.randomUUID();
  return new Promise((resolve) => {
    const task = {
      id,
      sender,
      request: { ...(request || {}), clientTaskId: id },
      controller: new AbortController(),
      resolve,
      state: "queued",
      queuedAt: new Date().toISOString(),
      startedAt: "",
      message: "图片任务排队中",
    };
    imageTaskStates.set(id, task);
    imageTaskQueue.push(task);
    emitImageTaskState(task);
    drainImageTaskQueue();
  });
}
function cancelImageTask(taskId) {
  const task = imageTaskStates.get(String(taskId || ""));
  if (!task) return { ok: false, message: "图片任务不存在" };
  if (task.state === "queued") {
    const index = imageTaskQueue.indexOf(task);
    if (index >= 0) imageTaskQueue.splice(index, 1);
    task.state = "canceled";
    task.completedAt = new Date().toISOString();
    task.message = "图片任务已取消";
    task.resolve({ id: task.id, modelId: task.request?.modelId, status: "canceled", assets: [], message: task.message });
    emitImageTaskState(task);
    updateQueuedImageTaskPositions();
    trimImageTaskHistory();
    return { ok: true, task: publicImageTaskState(task) };
  }
  if (task.state === "running") task.controller.abort();
  return { ok: task.state === "running", task: publicImageTaskState(task) };
}
`;
  source = source.slice(0, trimStart) + imageTaskTail + source.slice(appStart);
  write(relativePath, source);
}

function patchImageMenu() {
  const relativePath = "dist/assets/MainCanvasFlow-BbsMxxcM.js";
  let source = read(relativePath);
  if (source.includes("Jiaren image tools secondary menu v112")) return;
  source = replaceOnce(
    source,
    '    [t8ConnectionQuery, setT8ConnectionQuery] = A.useState(""),',
    '    [t8ConnectionQuery, setT8ConnectionQuery] = A.useState(""),\n    [jiarenImageToolsExpanded, setJiarenImageToolsExpanded] = A.useState(false),',
    "image tools menu state",
  );
  source = replaceOnce(
    source,
    "      ce({\n        nodeId: t.nodeId ?? \"canvas-asset-\" + t.id,",
    "      setJiarenImageToolsExpanded(false),\n      ce({\n        nodeId: t.nodeId ?? \"canvas-asset-\" + t.id,",
    "image tools menu reset",
  );
  source = replaceOnce(
    source,
    "        I(void 0),\n        ce({\n          nodeId: c.nodeId,",
    "        I(void 0),\n        setJiarenImageToolsExpanded(false),\n        ce({\n          nodeId: c.nodeId,",
    "image tools event reset",
  );
  const abPattern = /(\n                o\.jsxs\("button", \{\n                  type: "button",\n                  title: "A\/B[^\n]*\n)/;
  const abMatch = source.match(abPattern);
  if (!abMatch) throw new Error("Missing A/B image menu item.");
  const moreButton = `
                o.jsxs("button", {
                  type: "button",
                  title: "打开更多图片工具",
                  onClick: () => setJiarenImageToolsExpanded((value) => !value),
                  className: jiarenImageToolsExpanded ? "is-expanded" : "",
                  children: [o.jsx(ri, { size: 15 }), jiarenImageToolsExpanded ? "收起工具" : "更多工具"],
                }),`;
  source = source.replace(abPattern, `${moreButton}\n                jiarenImageToolsExpanded ? o.jsxs(o.Fragment, { children: [${abMatch[1]}`);
  const downloadPattern = /\n                o\.jsx\("button", \{\n                  type: "button",\n                  title: "下载",/;
  if (!downloadPattern.test(source)) throw new Error("Missing image download menu item.");
  source = source.replace(downloadPattern, "\n                ]}) : null,\n                o.jsx(\"button\", {\n                  type: \"button\",\n                  title: \"下载\",");
  source += "\n/* Jiaren image tools secondary menu v112 */\n";
  write(relativePath, source);
}

function patchDarkMenuCss() {
  const relativePath = "dist/assets/jiaren-dark-lime-20260728.css";
  let source = read(relativePath);
  if (source.includes("Jiaren image tools menu performance v112")) return;
  source += `

/* Jiaren image tools menu performance v112 */
#root .canvas-app-shell .image-selection-popover {
  contain: layout paint style !important;
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: 5px !important;
  padding: 9px !important;
  border: 1px solid rgba(199, 255, 61, 0.2) !important;
  border-radius: 8px !important;
  color: #e8eee4 !important;
  background: #0d100d !important;
  box-shadow: 0 18px 52px rgba(0, 0, 0, 0.58) !important;
}
#root .canvas-app-shell .image-selection-popover button {
  display: inline-flex !important;
  min-width: 0 !important;
  min-height: 34px !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  overflow: hidden !important;
  padding: 0 7px !important;
  border: 1px solid rgba(244, 247, 239, 0.1) !important;
  border-radius: 6px !important;
  color: #dce4d8 !important;
  background: #171c17 !important;
  font-size: 11px !important;
  line-height: 1.2 !important;
  text-align: center !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
#root .canvas-app-shell .image-selection-popover button:hover,
#root .canvas-app-shell .image-selection-popover button.is-expanded {
  border-color: rgba(199, 255, 61, 0.52) !important;
  color: #c7ff3d !important;
  background: rgba(199, 255, 61, 0.1) !important;
}
#root .canvas-app-shell .image-selection-popover button > svg {
  display: block !important;
  flex: 0 0 15px !important;
  width: 15px !important;
  height: 15px !important;
}
@media (max-width: 720px) {
  #root .canvas-app-shell .image-selection-popover {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}
`;
  write(relativePath, source);
}

patchCodexUi();
patchImageRuntime();
patchImageMenu();
patchDarkMenuCss();
