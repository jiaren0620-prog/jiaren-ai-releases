"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function write(relativePath, content) {
  fs.writeFileSync(path.join(root, relativePath), content, "utf8");
}

function replaceRequired(content, search, replacement, label) {
  if (!content.includes(search)) {
    throw new Error(`Cannot apply ${label}: anchor was not found.`);
  }
  return content.replace(search, replacement);
}

function replacePatternRequired(content, pattern, replacement, label) {
  if (!pattern.test(content)) {
    throw new Error(`Cannot apply ${label}: pattern anchor was not found.`);
  }
  pattern.lastIndex = 0;
  return content.replace(pattern, replacement);
}

function patchMainProcess() {
  const relativePath = "dist-electron/electron/main.js";
  let source = read(relativePath);
  if (source.includes("Jiaren v0.1.9 runtime hardening queue")) return;

  source = replaceRequired(
    source,
    "async function generateImageV2Raw(request) {",
    "async function generateImageV2Raw(request, externalSignal) {",
    "external image cancellation signature",
  );
  source = replaceRequired(
    source,
    "  const controller = new AbortController();\n  const timeout = setTimeout(() => controller.abort(), 6e5);",
    `  const controller = new AbortController();
  const abortFromExternal = () => controller.abort(externalSignal?.reason);
  if (externalSignal?.aborted) abortFromExternal();
  else externalSignal?.addEventListener?.("abort", abortFromExternal, { once: true });
  const timeout = setTimeout(() => controller.abort(), 6e5);`,
    "external image cancellation bridge",
  );
  source = replaceRequired(
    source,
    "  } finally {\n    clearTimeout(timeout);\n  }\n}\n// Jiaren v0.1.9 transparent image fallback",
    `  } finally {
    clearTimeout(timeout);
    externalSignal?.removeEventListener?.("abort", abortFromExternal);
  }
}
// Jiaren v0.1.9 transparent image fallback`,
    "external image cancellation cleanup",
  );
  source = replaceRequired(
    source,
    "async function generateImageV2(request) {\n  const result = await generateImageV2Raw(request);",
    "async function generateImageV2(request, signal) {\n  const result = await generateImageV2Raw(request, signal);",
    "image wrapper cancellation forwarding",
  );

  source = replaceRequired(
    source,
    "function listSavedProjects() {",
    `// Jiaren v0.1.9 runtime hardening queue
let projectOperationQueue = Promise.resolve();
function enqueueProjectOperation(operation) {
  const pending = projectOperationQueue.then(operation, operation);
  projectOperationQueue = pending.then(() => void 0, () => void 0);
  return pending;
}
function atomicWriteProjectFile(filePath, serialized) {
  ensureDir(node_path_1.default.dirname(filePath));
  const temporaryPath = node_path_1.default.join(
    node_path_1.default.dirname(filePath),
    \`.\${node_path_1.default.basename(filePath)}.\${process.pid}.\${node_crypto_1.default.randomUUID()}.tmp\`,
  );
  const backupPath = \`\${temporaryPath}.bak\`;
  let descriptor;
  let movedExistingFile = false;
  try {
    descriptor = (0, node_fs_1.openSync)(temporaryPath, "w");
    (0, node_fs_1.writeFileSync)(descriptor, serialized, "utf8");
    (0, node_fs_1.fsyncSync)(descriptor);
    (0, node_fs_1.closeSync)(descriptor);
    descriptor = void 0;
    if ((0, node_fs_1.existsSync)(filePath)) {
      (0, node_fs_1.renameSync)(filePath, backupPath);
      movedExistingFile = true;
    }
    (0, node_fs_1.renameSync)(temporaryPath, filePath);
    if (movedExistingFile && (0, node_fs_1.existsSync)(backupPath)) {
      try { (0, node_fs_1.unlinkSync)(backupPath); } catch {}
    }
  } catch (error) {
    if (descriptor !== void 0) {
      try { (0, node_fs_1.closeSync)(descriptor); } catch {}
    }
    if (movedExistingFile && !(0, node_fs_1.existsSync)(filePath) && (0, node_fs_1.existsSync)(backupPath)) {
      try { (0, node_fs_1.renameSync)(backupPath, filePath); } catch {}
    }
    try {
      if ((0, node_fs_1.existsSync)(temporaryPath)) (0, node_fs_1.unlinkSync)(temporaryPath);
    } catch {}
    throw error;
  }
}
function listSavedProjects() {`,
    "project operation queue and atomic writer",
  );
  source = replaceRequired(
    source,
    "    (0, node_fs_1.writeFileSync)(node_path_1.default.join(projectRoot, \"workflow.json\"), JSON.stringify(project, null, 2), \"utf-8\");",
    "    atomicWriteProjectFile(node_path_1.default.join(projectRoot, \"workflow.json\"), JSON.stringify(project, null, 2));",
    "atomic loaded-project activation",
  );
  source = replaceRequired(
    source,
    `    const project = {
      ...payload,
      projectId,
      projectName: cleanText(payload?.projectName, defaultProjectName, 80),`,
    `    const revision = Math.max(
      Number(payload?.revision) || 0,
      Number(currentProject?.revision) || 0,
    ) + 1;
    const savedAt = new Date().toISOString();
    const project = {
      ...payload,
      projectId,
      projectName: cleanText(payload?.projectName, defaultProjectName, 80),
      revision,
      savedAt,`,
    "project revision and timestamp",
  );
  source = replaceRequired(
    source,
    `    (0, node_fs_1.writeFileSync)(filePath, serialized, "utf-8");
    if (payload?.explicitSave === true) {
      ensureDir(projectDirectory);
      (0, node_fs_1.writeFileSync)(projectFilePath, serialized, "utf-8");
      (0, node_fs_1.writeFileSync)(savedProjectPath(projectId), serialized, "utf-8");
    }`,
    `    atomicWriteProjectFile(filePath, serialized);
    if (payload?.explicitSave === true) {
      ensureDir(projectDirectory);
      atomicWriteProjectFile(projectFilePath, serialized);
      atomicWriteProjectFile(savedProjectPath(projectId), serialized);
    }`,
    "atomic project save destinations",
  );
  source = replaceRequired(
    source,
    `      projectFilePath,
      explicitSaved: payload?.explicitSave === true`,
    `      projectFilePath,
      revision,
      savedAt,
      explicitSaved: payload?.explicitSave === true`,
    "saved project revision result",
  );

  source = replaceRequired(
    source,
    "function buildOpenAIImageEditFormData(request, references) {",
    "function buildOpenAIImageEditFormData(request, references, maskImage) {",
    "OpenAI image edit mask signature",
  );
  source = replaceRequired(
    source,
    `  references.slice(0, 10).forEach((image, index) => {
    const blob = new Blob([new Uint8Array(image.bytes)], { type: image.mime });
    form.append("image", blob, image.name || \`reference-\${index + 1}\${imageExtensionFromMime(image.mime)}\`);
  });
  return form;`,
    `  references.slice(0, 10).forEach((image, index) => {
    const blob = new Blob([new Uint8Array(image.bytes)], { type: image.mime });
    form.append("image", blob, image.name || \`reference-\${index + 1}\${imageExtensionFromMime(image.mime)}\`);
  });
  if (maskImage?.bytes) {
    const maskBlob = new Blob([new Uint8Array(maskImage.bytes)], { type: maskImage.mime || "image/png" });
    form.set("mask", maskBlob, maskImage.name || "jiaren-edit-mask.png");
  }
  return form;`,
    "OpenAI image edit mask form field",
  );
  source = replaceRequired(
    source,
    "body: buildOpenAIImageEditFormData({ ...request, endpointModelId: endpointModelIdForRequest(request, attempt, modelMeta) }, references),",
    "body: buildOpenAIImageEditFormData({ ...request, endpointModelId: endpointModelIdForRequest(request, attempt, modelMeta) }, references, maskImage),",
    "OpenAI image edit mask forwarding",
  );

  const registrationAnchor = "electron_1.app.whenReady().then(async () => {";
  source = replaceRequired(
    source,
    registrationAnchor,
    `const imageTaskStates = new Map();
const activeImageTasks = new Map();
function publicImageTaskState(task) {
  if (!task) return void 0;
  return {
    id: task.id,
    state: task.state,
    queuedAt: task.queuedAt,
    startedAt: task.startedAt,
    completedAt: task.completedAt,
    message: task.message || "",
    position: 0,
  };
}
function emitImageTaskState(task) {
  const payload = publicImageTaskState(task);
  if (!payload || !task.sender || task.sender.isDestroyed?.()) return;
  task.sender.send("runtime:imageTaskState", payload);
}
function parseSupportedRatio(value) {
  const match = String(value || "").match(/^(\\d+(?:\\.\\d+)?):(\\d+(?:\\.\\d+)?)$/);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width > 0 && height > 0 ? { label: match[0], value: width / height } : null;
}
function resolveAutomaticImageRatio(request) {
  const supported = [...new Set(Array.isArray(request?.supportedAspectRatios)
    ? request.supportedAspectRatios.map((item) => String(item || "").trim()).filter(Boolean)
    : [])];
  const parsed = supported.map(parseSupportedRatio).filter(Boolean);
  const sources = [request?.maskImage, ...(Array.isArray(request?.referenceImages) ? request.referenceImages : [])];
  const dimensions = sources.find((item) => Number(item?.width) > 0 && Number(item?.height) > 0);
  if (!parsed.length) return "1:1";
  if (!dimensions) return parsed[0].label;
  const target = Number(dimensions.width) / Number(dimensions.height);
  return parsed.reduce((best, candidate) =>
    Math.abs(Math.log(candidate.value / target)) < Math.abs(Math.log(best.value / target)) ? candidate : best,
  parsed[0]).label;
}
function normalizeImageRequest(request) {
  const next = { ...(request || {}) };
  if (String(next.aspectRatio || "").toLowerCase() === "auto" || /\\bauto\\b/i.test(String(next.size || ""))) {
    const aspectRatio = resolveAutomaticImageRatio(next);
    next.aspectRatio = aspectRatio;
    next.size = String(next.size || "").replace(/\\bauto\\b/gi, aspectRatio).trim() || aspectRatio;
  }
  delete next.supportedAspectRatios;
  return next;
}
function trimImageTaskHistory() {
  if (imageTaskStates.size <= 200) return;
  for (const [id, task] of imageTaskStates) {
    if (!activeImageTasks.has(id) && task.state !== "running") imageTaskStates.delete(id);
    if (imageTaskStates.size <= 160) break;
  }
}
async function runImageTask(task) {
  activeImageTasks.set(task.id, task);
  emitImageTaskState(task);
  try {
    const result = await generateImageV2(normalizeImageRequest(task.request), task.controller.signal);
    task.state = task.controller.signal.aborted ? "canceled" : result?.status === "failed" ? "failed" : "succeeded";
    task.message = task.state === "canceled" ? "图片任务已取消" : String(result?.message || "图片任务已完成");
    task.resolve(result);
  } catch (error) {
    const canceled = task.controller.signal.aborted;
    task.state = canceled ? "canceled" : "failed";
    task.message = canceled ? "图片任务已取消" : error instanceof Error ? error.message : String(error);
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
      state: "running",
      queuedAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      message: "图片任务正在生成",
    };
    imageTaskStates.set(id, task);
    void runImageTask(task);
  });
}
function cancelImageTask(taskId) {
  const task = imageTaskStates.get(String(taskId || ""));
  if (!task) return { ok: false, message: "图片任务不存在" };
  if (task.state === "running") task.controller.abort();
  return { ok: task.state === "running", task: publicImageTaskState(task) };
}
${registrationAnchor}`,
    "parallel image task runtime",
  );
  source = replaceRequired(
    source,
    "  electron_1.ipcMain.handle(\"runtime:generateImage\", async (_event, request) => withCleanUiMessage(await generateImageV2(request)));",
    `  electron_1.ipcMain.handle("runtime:generateImage", async (event, request) => withCleanUiMessage(await enqueueImageGeneration(event.sender, request)));
  electron_1.ipcMain.handle("runtime:getImageTaskState", (_event, taskId) => publicImageTaskState(imageTaskStates.get(String(taskId || ""))));
  electron_1.ipcMain.handle("runtime:cancelImageTask", (_event, taskId) => cancelImageTask(taskId));`,
    "queued image IPC",
  );

  const projectHandlers = [
    ["electron_1.ipcMain.handle(\"system:saveProject\", (_event, payload) => saveProject(payload));", "electron_1.ipcMain.handle(\"system:saveProject\", (_event, payload) => enqueueProjectOperation(() => saveProject(payload)));"],
    ["electron_1.ipcMain.handle(\"system:loadProject\", () => loadProject());", "electron_1.ipcMain.handle(\"system:loadProject\", () => enqueueProjectOperation(() => loadProject()));"],
    ["electron_1.ipcMain.handle(\"system:startNewProject\", () => startNewProject());", "electron_1.ipcMain.handle(\"system:startNewProject\", () => enqueueProjectOperation(() => startNewProject()));"],
    ["electron_1.ipcMain.handle(\"system:listSavedProjects\", () => listSavedProjects());", "electron_1.ipcMain.handle(\"system:listSavedProjects\", () => enqueueProjectOperation(() => listSavedProjects()));"],
    ["electron_1.ipcMain.handle(\"system:loadSavedProject\", (_event, projectId) => loadSavedProject(projectId));", "electron_1.ipcMain.handle(\"system:loadSavedProject\", (_event, projectId) => enqueueProjectOperation(() => loadSavedProject(projectId)));"],
    ["electron_1.ipcMain.handle(\"system:deleteSavedProject\", (_event, projectId) => deleteSavedProject(projectId));", "electron_1.ipcMain.handle(\"system:deleteSavedProject\", (_event, projectId) => enqueueProjectOperation(() => deleteSavedProject(projectId)));"],
  ];
  for (const [search, replacement] of projectHandlers) {
    source = replaceRequired(source, search, replacement, `queued project handler ${search}`);
  }
  write(relativePath, source);
}

function patchPreload() {
  const relativePath = "dist-electron/electron/preload.js";
  let source = read(relativePath);
  if (source.includes("getImageTaskState:")) return;
  source = replaceRequired(
    source,
    "        generateImage: (request) => electron_1.ipcRenderer.invoke(\"runtime:generateImage\", request),",
    `        generateImage: (request) => electron_1.ipcRenderer.invoke("runtime:generateImage", request),
        getImageTaskState: (taskId) => electron_1.ipcRenderer.invoke("runtime:getImageTaskState", taskId),
        cancelImageTask: (taskId) => electron_1.ipcRenderer.invoke("runtime:cancelImageTask", taskId),
        onImageTaskState: (callback) => {
            const listener = (_event, payload) => callback(payload);
            electron_1.ipcRenderer.on("runtime:imageTaskState", listener);
            return () => electron_1.ipcRenderer.removeListener("runtime:imageTaskState", listener);
        },`,
    "image task preload bridge",
  );
  write(relativePath, source);
}

function patchCanvasBundle() {
  const relativePath = "dist/assets/MainCanvasFlow-BbsMxxcM.js";
  let source = read(relativePath);
  if (source.includes("Jiaren v0.1.9 canvas runtime hardening")) return;

  source = replacePatternRequired(
    source,
    /      if \(kt === "serial" && we > 1\) \{[\s\S]*?      const at = xe\[0\],/,
    `      const Vt = [];
      for (let Ft = 0; Ft < we; Ft += 1) {
        try {
          Vt.push({ status: "fulfilled", value: await Lo(Ft) });
        } catch (Te) {
          Ct.push(Te instanceof Error ? \`第 \${Ft + 1} 张：\${Te.message}\` : \`第 \${Ft + 1} 张生成失败\`);
          Vt.push({ status: "rejected", reason: Te });
        }
      }
      const at = xe[0],`,
    "sequential primary image generation",
  );
  source = replaceRequired(
    source,
    "        await Promise.allSettled(Array.from({ length: $ }, (et, oo) => rt(oo)));",
    `        for (let et = 0; et < $; et += 1) {
          try { await rt(et); }
          catch (oo) { Ge.push(oo instanceof Error ? oo.message : String(oo)); }
        }`,
    "sequential QuickMind image generation",
  );
  source = replaceRequired(
    source,
    "              outputFormat: JiarenTransparentBackground ? \"png\" : void 0,\n              referenceImagePaths:",
    `              outputFormat: JiarenTransparentBackground ? "png" : void 0,
              maskImage: Me.data.maskImage,
              supportedAspectRatios: Ye.aspectRatios,
              referenceImagePaths:`,
    "image mask and supported ratios",
  );
  source = replaceRequired(
    source,
    "                mimeType: Ae.mimeType,\n              })),",
    `                mimeType: Ae.mimeType,
                width: Ae.width,
                height: Ae.height,
              })),`,
    "reference image dimensions",
  );
  source = replaceRequired(
    source,
    "        Ye.aspectRatios.includes(oe) || Se(Ye.aspectRatios[0] ?? \"1:1\"),",
    "        (oe === \"Auto\" || Ye.aspectRatios.includes(oe)) || Se(Ye.aspectRatios[0] ?? \"1:1\"),",
    "Auto ratio validation",
  );
  source = replaceRequired(
    source,
    "      ne = O.aspectRatios.includes(oe) ? oe : (O.aspectRatios[0] ?? \"1:1\"),",
    "      ne = oe === \"Auto\" || O.aspectRatios.includes(oe) ? oe : (O.aspectRatios[0] ?? \"1:1\"),",
    "Auto ratio model switch",
  );
  source = replaceRequired(
    source,
    "                    children: Ye.aspectRatios.map((M) =>",
    "                    children: [\"Auto\", ...Ye.aspectRatios].map((M) =>",
    "Auto ratio selector",
  );
  source = replaceRequired(
    source,
    "function km(e) {\n  const [n, a] = e.split(\":\").map(Number),",
    "function km(e) {\n  if (e === \"Auto\") return { width: \"22px\", height: \"16px\" };\n  const [n, a] = e.split(\":\").map(Number),",
    "Auto ratio icon",
  );
  source = replaceRequired(
    source,
    `      return {
        nodes: serializable(state.workflowNodes) || [],
        edges: serializable(state.workflowEdges) || [],
        assets: serializable(state.canvasAssets) || [],
        selectedNodeId: state.selectedNodeId || null,
        capturedAt: new Date().toISOString(),
      };`,
    `      const selectedNodeId = state.selectedNodeId || null;
      const selectedAssetId = state.selectedAssetId || null;
      return {
        nodes: serializable(state.workflowNodes) || [],
        edges: serializable(state.workflowEdges) || [],
        assets: serializable(state.canvasAssets) || [],
        selectedNodeId,
        selectedAssetId,
        selectedNode: serializable(state.workflowNodes.find((node) => node.id === selectedNodeId)) || null,
        selectedAsset: serializable(state.canvasAssets.find((asset) => asset.id === selectedAssetId)) || null,
        capturedAt: new Date().toISOString(),
      };`,
    "selected canvas snapshot metadata",
  );
  source = replacePatternRequired(
    source,
    /    xt\(\{\n      source: eo\(t\) \?\? t\.source,\n      localPath: t\.localPath,\n      title: t\.name \|\| "[^"]*",\n      subtitle: t\.width && t\.height \? `\$\{t\.width\} x \$\{t\.height\}` : void 0,\n    \}\);/,
    `    xt({
      source: eo(t) ?? t.source,
      localPath: t.localPath,
      assetId: t.id,
      width: t.width,
      height: t.height,
      title: t.name || "图片预览",
      subtitle: t.width && t.height ? \`\${t.width} x \${t.height}\` : void 0,
    });`,
    "preview asset metadata",
  );
  source += "\n/* Jiaren v0.1.9 canvas runtime hardening */\n";
  write(relativePath, source);
}

function patchAgentControl() {
  const relativePath = "dist-electron/electron/jiaren-agent-control-runtime.js";
  let source = read(relativePath);
  if (source.includes("selectedAssetId: source.selectedAssetId")) return;
  source = replaceRequired(
    source,
    `  updateSnapshot(snapshot) {
    const source = snapshot && typeof snapshot === "object" ? snapshot : {};
    this.snapshot = {
      nodes: Array.isArray(source.nodes) ? clone(source.nodes).slice(0, 2000) : [],
      edges: Array.isArray(source.edges) ? clone(source.edges).slice(0, 4000) : [],
      assets: Array.isArray(source.assets) ? clone(source.assets).slice(0, 2000) : [],
      selectedNodeId: source.selectedNodeId == null ? null : String(source.selectedNodeId),
      capturedAt: now(),
    };`,
    `  updateSnapshot(snapshot) {
    const input = snapshot && typeof snapshot === "object" ? snapshot : {};
    const source = JSON.parse(JSON.stringify(input, (key, value) =>
      /apiKey|authorization|cookie|token|password|credential|secret/i.test(key) ? void 0 : value
    ));
    this.snapshot = {
      nodes: Array.isArray(source.nodes) ? clone(source.nodes).slice(0, 2000) : [],
      edges: Array.isArray(source.edges) ? clone(source.edges).slice(0, 4000) : [],
      assets: Array.isArray(source.assets) ? clone(source.assets).slice(0, 2000) : [],
      selectedNodeId: source.selectedNodeId == null ? null : String(source.selectedNodeId),
      selectedAssetId: source.selectedAssetId == null ? null : String(source.selectedAssetId),
      selectedNode: source.selectedNode && typeof source.selectedNode === "object" ? clone(source.selectedNode) : null,
      selectedAsset: source.selectedAsset && typeof source.selectedAsset === "object" ? clone(source.selectedAsset) : null,
      capturedAt: now(),
    };`,
    "sanitized selected snapshot persistence",
  );
  write(relativePath, source);
}

function patchAgentControlAtomicWrite() {
  const relativePath = "dist-electron/electron/jiaren-agent-control-runtime.js";
  let source = read(relativePath);
  if (source.includes("agent-control atomic writer v019")) return;
  source = replaceRequired(
    source,
    `function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = \`\${filePath}.\${process.pid}.tmp\`;
  fs.writeFileSync(temporaryPath, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(temporaryPath, filePath);
}`,
    `// agent-control atomic writer v019
function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = \`\${filePath}.\${process.pid}.\${crypto.randomUUID()}.tmp\`;
  const backupPath = \`\${temporaryPath}.bak\`;
  let descriptor;
  let movedExistingFile = false;
  try {
    descriptor = fs.openSync(temporaryPath, "w");
    fs.writeFileSync(descriptor, JSON.stringify(value, null, 2), "utf8");
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = undefined;
    if (fs.existsSync(filePath)) {
      fs.renameSync(filePath, backupPath);
      movedExistingFile = true;
    }
    fs.renameSync(temporaryPath, filePath);
    if (movedExistingFile && fs.existsSync(backupPath)) {
      try { fs.unlinkSync(backupPath); } catch {}
    }
  } catch (error) {
    if (descriptor !== undefined) {
      try { fs.closeSync(descriptor); } catch {}
    }
    if (movedExistingFile && !fs.existsSync(filePath) && fs.existsSync(backupPath)) {
      try { fs.renameSync(backupPath, filePath); } catch {}
    }
    try { if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath); } catch {}
    throw error;
  }
}`,
    "Windows-safe agent-control atomic writer",
  );
  write(relativePath, source);
}

function patchAgentApprovalExecution() {
  const relativePath = "dist/assets/main-BvGlsrDH.js";
  let source = read(relativePath);
  if (source.includes("const JiarenExecutingPlans = new Set();")) return;
  source = replaceRequired(
    source,
    "const Pc =",
    "const JiarenExecutingPlans = new Set();\nconst Pc =",
    "agent plan execution lock",
  );
  source = replaceRequired(
    source,
    `  async function JiarenApprovePlan(plan) {
    const bridge = window.__JIAREN_CANVAS_AGENT__;
    const control = window.jiaren?.agentControl;
    if (!bridge || !control) return;
    try {
      bridge.previewOperations(plan.operations);
      await control.approvePlan(plan.id);
      const result = await bridge.applyOperations(plan.operations);
      await control.completePlan(plan.id, { ok: true, summary: T("画布操作已执行。", "Canvas operations completed."), result });
      E((messages) => [...messages, { id: crypto.randomUUID(), role: "assistant", text: T(\`已执行“\${plan.title}”，共 \${plan.operations.length} 项操作。\`, \`Executed “\${plan.title}” with \${plan.operations.length} operation(s).\`) }]);
    } catch (error) {
      await control.completePlan(plan.id, { ok: false, summary: T("画布操作执行失败。", "Canvas operations failed."), error: error instanceof Error ? error.message : String(error) });
      E((messages) => [...messages, { id: crypto.randomUUID(), role: "assistant", text: T(\`执行失败：\${error instanceof Error ? error.message : String(error)}\`, \`Execution failed: \${error instanceof Error ? error.message : String(error)}\`) }]);
    }
    const plans = await control.listPlans("pending");
    setJiarenPlans(plans || []);
  }`,
    `  async function JiarenApprovePlan(plan) {
    const bridge = window.__JIAREN_CANVAS_AGENT__;
    const control = window.jiaren?.agentControl;
    if (!bridge || !control || JiarenExecutingPlans.has(plan.id)) return;
    JiarenExecutingPlans.add(plan.id);
    let approved = false;
    try {
      bridge.previewOperations(plan.operations);
      await control.approvePlan(plan.id);
      approved = true;
      const result = await bridge.applyOperations(plan.operations);
      await control.completePlan(plan.id, { ok: true, summary: T("画布操作已执行。", "Canvas operations completed."), result });
      E((messages) => [...messages, { id: crypto.randomUUID(), role: "assistant", text: T(\`已执行“\${plan.title}”，共 \${plan.operations.length} 项操作。\`, \`Executed “\${plan.title}” with \${plan.operations.length} operation(s).\`) }]);
    } catch (error) {
      if (approved) {
        try {
          await control.completePlan(plan.id, { ok: false, summary: T("画布操作执行失败。", "Canvas operations failed."), error: error instanceof Error ? error.message : String(error) });
        } catch {}
      }
      E((messages) => [...messages, { id: crypto.randomUUID(), role: "assistant", text: T(\`执行失败：\${error instanceof Error ? error.message : String(error)}\`, \`Execution failed: \${error instanceof Error ? error.message : String(error)}\`) }]);
    } finally {
      JiarenExecutingPlans.delete(plan.id);
      const plans = await control.listPlans("pending");
      setJiarenPlans(plans || []);
    }
  }`,
    "approval-only plan execution and duplicate-click lock",
  );
  write(relativePath, source);
}

function patchCodexService() {
  const relativePath = "jiaren-local-service/src/utils/codexCliRunner.js";
  let source = read(relativePath);
  if (source.includes("Jiaren canvas approval contract")) return;
  source = replaceRequired(
    source,
    "  const instructions = [];",
    `  const instructions = [];
  // Jiaren canvas approval contract: snapshots are context only, never authority to mutate.
  let canvasSnapshot = null;
  if (body.canvasSnapshot && typeof body.canvasSnapshot === "object") {
    try {
      canvasSnapshot = JSON.parse(JSON.stringify(body.canvasSnapshot, (key, value) =>
        /apiKey|authorization|cookie|token|password|credential|secret/i.test(key) ? undefined : value
      ));
    } catch {}
  }`,
    "Codex snapshot sanitization",
  );
  source = replaceRequired(
    source,
    "  if (selectedSkillNames.length > 0) {",
    `  if (canvasSnapshot) {
    const snapshotText = JSON.stringify(canvasSnapshot).slice(0, 120000);
    instructions.push([
      "当前 JiarenAI 画布快照（只读、已脱敏）：",
      snapshotText,
      "允许提出的画布操作仅限：node.add、node.update、node.delete、node.select、edge.add、edge.remove、asset.add、run.node。",
      "如用户要求修改画布，请先解释计划，并在回复末尾额外给出一个 JSON 代码块：{\\\"title\\\":\\\"...\\\",\\\"summary\\\":\\\"...\\\",\\\"operations\\\":[...]}。不要自行执行；JiarenAI 会将该计划送入用户审批，批准后才执行。",
      "任何 API Key、Cookie、Codex 登录状态或令牌都不得写入计划。",
    ].join("\\n"));
  }
  if (selectedSkillNames.length > 0) {`,
    "Codex approval prompt contract",
  );
  write(relativePath, source);
}

function patchCodexCanvasNode() {
  const relativePath = "dist/assets/T8CodexNodes-complete-v6.js";
  let source = read(relativePath);
  if (source.includes("canvasSnapshot:window.__JIAREN_CANVAS_AGENT__")) return;
  source = replaceRequired(
    source,
    "extraArgs:Kl(a.codexExtraArgs)",
    "canvasSnapshot:window.__JIAREN_CANVAS_AGENT__?.getSnapshot?.(),extraArgs:Kl(a.codexExtraArgs)",
    "Codex request canvas snapshot",
  );
  source = replaceRequired(
    source,
    "const lo=String(Te.text||Te.reply||st||\"\").trim();if(lo){",
    "const lo=String(Te.text||Te.reply||st||\"\").trim();if(lo){window.__JIAREN_CODEX_CANVAS_PLAN__?.(lo,{sessionId:ne,source:\"Codex CLI\"});",
    "Codex operation plan submission",
  );
  write(relativePath, source);
}

function patchIndex() {
  const relativePath = "dist/index.html";
  let source = read(relativePath);
  if (!source.includes("jiaren-runtime-hardening-v019.css")) {
    source = replaceRequired(
      source,
      "    <link rel=\"stylesheet\" href=\"./assets/jiaren-v019-fixes.css?v=20260731-v019\">",
      `    <link rel="stylesheet" href="./assets/jiaren-v019-fixes.css?v=20260731-v019">
    <link rel="stylesheet" href="./assets/jiaren-runtime-hardening-v019.css?v=20260801-v019">`,
      "runtime hardening stylesheet",
    );
  }
  if (!source.includes("jiaren-runtime-hardening-v019.js")) {
    source = replaceRequired(
      source,
      "    <script src=\"./assets/jiaren-v019-fixes.js?v=20260731-v019\"></script>",
      `    <script src="./assets/jiaren-v019-fixes.js?v=20260731-v019"></script>
    <script src="./assets/jiaren-runtime-hardening-v019.js?v=20260801-v019"></script>`,
      "runtime hardening script",
    );
  }
  write(relativePath, source);
}

patchMainProcess();
patchPreload();
patchCanvasBundle();
patchAgentControl();
patchAgentControlAtomicWrite();
patchAgentApprovalExecution();
patchCodexService();
patchCodexCanvasNode();
patchIndex();
console.log("Jiaren AI 0.1.9 runtime hardening and Codex canvas integration applied.");
