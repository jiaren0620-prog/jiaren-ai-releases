"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const unpackedRoot = path.resolve(process.argv[2] || path.join(projectRoot, "release-v112", "win-unpacked"));
const resourcesRoot = path.join(unpackedRoot, "resources");
const asarPath = path.join(resourcesRoot, "app.asar");
const asarUnpackedRoot = path.join(resourcesRoot, "app.asar.unpacked");

function findBuilderToolRoot() {
  const candidates = [
    process.env.JIAREN_BUILDER_ROOT,
    path.resolve(projectRoot, "..", ".h-source"),
    process.env.USERPROFILE && path.join(
      process.env.USERPROFILE,
      "Documents",
      "jiareAI\u65e0\u7ebf\u753b\u5e03",
      ".h-source",
    ),
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(path.join(candidate, "node_modules", "@electron", "asar")));
}

const builderToolRoot = findBuilderToolRoot();

const failures = [];
const passes = [];

function checkFile(filePath, minimumBytes = 1) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing file: ${filePath}`);
    return;
  }
  const size = fs.statSync(filePath).size;
  if (size < minimumBytes) {
    failures.push(`file too small: ${filePath} (${size} < ${minimumBytes})`);
    return;
  }
  passes.push(`${path.relative(unpackedRoot, filePath)} (${size} bytes)`);
}

function checkDirectory(directoryPath, minimumFiles = 1) {
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    failures.push(`missing directory: ${directoryPath}`);
    return;
  }
  const fileCount = fs.readdirSync(directoryPath, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile()).length;
  if (fileCount < minimumFiles) {
    failures.push(`directory incomplete: ${directoryPath} (${fileCount} < ${minimumFiles})`);
    return;
  }
  passes.push(`${path.relative(unpackedRoot, directoryPath)} (${fileCount} files)`);
}

function checkAbsent(targetPath) {
  if (fs.existsSync(targetPath)) failures.push(`unexpected private or test data: ${targetPath}`);
  else passes.push(`absent:${path.relative(unpackedRoot, targetPath)}`);
}

const sensitiveEntryPattern = /(^|\/)(?:\.codex|auth\.json|credentials\.json|cookies\.json|cookies\.sqlite|\.env(?:\.[^/]+)?|login data|web data|local state|tokens?\.json)(?:\/|$)/i;

function checkSensitiveEntries(entries, label) {
  for (const entry of entries) {
    const normalized = String(entry).replace(/\\/g, "/").replace(/^\//, "");
    if (sensitiveEntryPattern.test(normalized)) failures.push(`private credential material in ${label}: ${normalized}`);
  }
}

checkFile(path.join(unpackedRoot, "Jiaren AI.exe"), 50 * 1024 * 1024);
checkAbsent(path.join(unpackedRoot, ".jiaren"));
checkAbsent(path.join(unpackedRoot, ".project"));
checkAbsent(path.join(unpackedRoot, "preferences.json"));
checkAbsent(path.join(asarUnpackedRoot, "dist"));
for (const entry of fs.existsSync(unpackedRoot) ? fs.readdirSync(unpackedRoot) : []) {
  if (/^qa-(?:profile|cache)-/i.test(entry)) failures.push(`unexpected QA data in release: ${entry}`);
}
if (fs.existsSync(unpackedRoot)) {
  const unpackedEntries = fs.readdirSync(unpackedRoot, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(unpackedRoot, path.join(entry.parentPath || entry.path, entry.name)));
  checkSensitiveEntries(unpackedEntries, "unpacked release");
}
checkFile(path.join(resourcesRoot, "rmbg2", "birefnet-lite.onnx"), 220 * 1024 * 1024 - 8 * 1024 * 1024);
checkFile(path.join(resourcesRoot, "rmbg2", "birefnet-512.onnx"), 900 * 1024 * 1024 - 8 * 1024 * 1024);
checkFile(path.join(resourcesRoot, "upscayl", "realesrgan-ncnn-vulkan.exe"), 1 * 1024 * 1024);
checkDirectory(path.join(resourcesRoot, "upscayl", "models"), 10);
checkFile(path.join(resourcesRoot, "sql-wasm.wasm"), 500 * 1024);
checkFile(path.join(resourcesRoot, "data", "skills", "jiaren_agent.md"), 1000);
checkFile(path.join(resourcesRoot, "data", "skills", "anime_short_drama_studio.md"), 500);
checkFile(path.join(resourcesRoot, "data", "skills", "seedance_video_director.md"), 500);
checkFile(path.join(resourcesRoot, "data", "video-skills", "pipeline.json"), 500);
checkFile(path.join(resourcesRoot, ".agents", "skills", "chat-ui", "SKILL.md"), 100);
checkFile(path.join(resourcesRoot, ".agents", "skills", "claude-handoff", "SKILL.md"), 100);
checkFile(path.join(resourcesRoot, ".agents", "skills", "pexo-agent", "SKILL.md"), 100);
checkFile(path.join(resourcesRoot, ".agents", "skills", "writing-shape", "SKILL.md"), 100);
checkFile(path.join(resourcesRoot, "jiaren-local-service", "src", "server.js"), 500);
checkFile(path.join(resourcesRoot, "jiaren-local-service", "node_modules", "express", "index.js"), 100);
checkFile(path.join(resourcesRoot, "jiaren-local-service", "node_modules", "multer", "index.js"), 100);
checkFile(path.join(resourcesRoot, "jiaren-local-service", "node_modules", "undici", "index.js"), 100);
checkFile(path.join(resourcesRoot, "python", "jiaren_skill_factory", "prepare_dataset.py"), 1000);
checkFile(path.join(resourcesRoot, "tools", "jiaren-canvas-cli", "bin", "jiaren-canvas.cjs"), 1000);
checkFile(path.join(resourcesRoot, "tools", "jiaren-canvas-mcp", "bin", "jiaren-canvas-mcp.cjs"), 3000);
checkFile(path.join(resourcesRoot, "plugins", "jiaren-canvas", ".codex-plugin", "plugin.json"), 300);
checkFile(path.join(resourcesRoot, "plugins", "jiaren-canvas", ".mcp.json"), 100);
checkFile(path.join(resourcesRoot, "shared", "achievementManifest.json"), 1000);
checkFile(path.join(resourcesRoot, "shared", "inlineMediaContent.cjs"), 1000);
checkFile(path.join(asarUnpackedRoot, "node_modules", "onnxruntime-node", "bin", "napi-v6", "win32", "x64", "onnxruntime_binding.node"), 200 * 1024);
checkFile(path.join(asarUnpackedRoot, "node_modules", "sharp", "lib", "index.js"), 100);
checkFile(path.join(asarUnpackedRoot, "node_modules", "@img", "sharp-win32-x64", "lib", "sharp-win32-x64.node"), 100 * 1024);
checkFile(path.join(asarUnpackedRoot, "node_modules", "detect-libc", "lib", "detect-libc.js"), 100);
checkFile(path.join(asarUnpackedRoot, "node_modules", "semver", "index.js"), 100);
checkFile(path.join(asarUnpackedRoot, "node_modules", "ffmpeg-static", "ffmpeg.exe"), 50 * 1024 * 1024);
checkFile(asarPath, 1 * 1024 * 1024);

const packagedMcpPath = path.join(resourcesRoot, "tools", "jiaren-canvas-mcp", "bin", "jiaren-canvas-mcp.cjs");
if (fs.existsSync(packagedMcpPath)) {
  const packagedMcpSource = fs.readFileSync(packagedMcpPath, "utf8");
  const packagedToolCount = (packagedMcpSource.match(/name: "jiaren_canvas_/g) || []).length;
  if (packagedToolCount === 26) passes.push("contract:26 packaged canvas MCP tools");
  else failures.push(`packaged canvas MCP tool count is ${packagedToolCount}, expected 26`);
  for (const toolName of ["jiaren_canvas_generate_image", "jiaren_canvas_generate_video", "jiaren_canvas_generate_audio", "jiaren_canvas_wait_for_plan", "jiaren_canvas_create_svg"]) {
    if (packagedMcpSource.includes(toolName)) passes.push(`contract:${toolName}`);
    else failures.push(`missing packaged canvas MCP tool: ${toolName}`);
  }
}

let asar;
try {
  if (!builderToolRoot) throw new Error("Jiaren build tools were not found");
  asar = require(path.join(builderToolRoot, "node_modules", "@electron", "asar"));
} catch (error) {
  failures.push(`cannot load @electron/asar for package audit: ${error.message}`);
}

if (asar && fs.existsSync(asarPath)) {
  const entries = new Set(asar.listPackage(asarPath).map((entry) => entry.replace(/^[/\\]/, "").replace(/\\/g, "/")));
  checkSensitiveEntries(entries, "app.asar");
  const requiredEntries = [
    "LICENSE",
    "COMMERCIAL_LICENSE.md",
    "package.json",
    "docs/JIAREN_LICENSE_ZH-CN.txt",
    "dist/index.html",
    "dist-electron/electron/main.js",
    "dist-electron/electron/preload.js",
    "dist-electron/electron/jiaren-channel-driver-runtime.js",
    "dist-electron/electron/jiaren-codex-app-server-runtime.js",
    "dist/assets/jiaren-channel-manager-v112.js",
    "dist/assets/jiaren-channel-manager-v112.css",
    "dist/assets/jiaren-codex-app-server-v112.js",
    "dist/assets/jiaren-codex-app-server-v112.css",
    "data/skills/jiaren_agent.md",
    "data/skills/anime_short_drama_studio.md",
    "data/skills/seedance_video_director.md",
    "data/video-skills/pipeline.json",
    ".agents/skills/chat-ui/SKILL.md",
    ".agents/skills/claude-handoff/SKILL.md",
    ".agents/skills/pexo-agent/SKILL.md",
    ".agents/skills/writing-shape/SKILL.md",
    "jiaren-local-service/src/server.js",
    "python/jiaren_skill_factory/prepare_dataset.py",
    "tools/jiaren-canvas-cli/bin/jiaren-canvas.cjs",
    "tools/jiaren-canvas-mcp/bin/jiaren-canvas-mcp.cjs",
    "plugins/jiaren-canvas/.codex-plugin/plugin.json",
    "plugins/jiaren-canvas/.mcp.json",
    "shared/achievementManifest.json",
    "shared/inlineMediaContent.cjs",
  ];
  for (const entry of requiredEntries) {
    if (entries.has(entry)) passes.push(`app.asar:${entry}`);
    else failures.push(`missing app.asar entry: ${entry}`);
  }

  const mainSource = asar.extractFile(asarPath, path.join("dist-electron", "electron", "main.js")).toString("utf8");
  const codexRuntimeSource = asar.extractFile(asarPath, path.join("dist-electron", "electron", "jiaren-codex-app-server-runtime.js")).toString("utf8");
  const codexUiSource = asar.extractFile(asarPath, path.join("dist", "assets", "jiaren-codex-app-server-v112.js")).toString("utf8");
  const canvasSource = asar.extractFile(asarPath, path.join("dist", "assets", "MainCanvasFlow-BbsMxxcM.js")).toString("utf8");
  const darkThemeSource = asar.extractFile(asarPath, path.join("dist", "assets", "jiaren-dark-lime-20260728.css")).toString("utf8");
  const canvasMcpSource = asar.extractFile(asarPath, path.join("tools", "jiaren-canvas-mcp", "bin", "jiaren-canvas-mcp.cjs")).toString("utf8");
  const pipelineSource = asar.extractFile(asarPath, path.join("data", "video-skills", "pipeline.json")).toString("utf8");
  const packedContracts = [
    ["transparent image fallback", mainSource.includes("Jiaren v0.1.9 transparent image fallback")],
    ["useful alpha validation", mainSource.includes("imageBufferHasUsefulAlpha")],
    ["transparent API request", mainSource.includes('background = "transparent"')],
    ["transparent PNG output", mainSource.includes('output_format = "png"')],
    ["Seedance pure mode default", /"defaultMode"\s*:\s*"seedance"/.test(pipelineSource)],
    ["Seedance studio opt-in", /"enabledByDefault"\s*:\s*false/.test(pipelineSource)],
    ["custom channel image routing", mainSource.includes("return generateChannelImage(request, externalSignal)")],
    ["custom channel video routing", mainSource.includes('channelDriverIdForRequest(request) ? generateChannelMedia(request, "video")')],
    ["custom channel audio routing", mainSource.includes('channelDriverIdForRequest(request) ? generateChannelMedia(request, "audio")')],
    ["Codex capacity errors are sanitized", codexUiSource.includes("function friendlyCodexError(value)") && !codexUiSource.includes("Selected model is at capacity")],
    ["Image tasks retain bounded multi-task scheduling", mainSource.includes("const MAX_ACTIVE_IMAGE_TASKS = 2;") && mainSource.includes('state: "queued"')],
    ["Image context tools remain complete", canvasSource.includes("分享到社区") && canvasSource.includes("Jiaren SVG-aware image tool downloads v112") && !canvasSource.includes("打开更多图片工具")],
    ["Image context menu stays on the dark theme", darkThemeSource.includes("Jiaren image tools menu performance v112") && darkThemeSource.includes("Jiaren complete image menu v112") && darkThemeSource.includes("grid-template-columns: repeat(3") && darkThemeSource.includes("background: #0d100d")],
    ["Codex current approval policy", codexRuntimeSource.includes('approvalPolicy: "on-request"') && !codexRuntimeSource.includes('approvalPolicy: "unlessTrusted"')],
    ["Codex thread sandbox protocol", codexRuntimeSource.includes('sandbox: "workspace-write"')],
    ["Codex turn sandbox protocol", codexRuntimeSource.includes('sandboxPolicy: { type: "workspaceWrite"')],
    ["Codex App Server enables built-in image generation", codexRuntimeSource.includes('"--enable", "image_generation"') && codexRuntimeSource.includes("use the built-in image_gen tool directly")],
    ["Codex image results return to the canvas", codexRuntimeSource.includes("handleImageGenerationItem(params)") && codexRuntimeSource.includes('agentSource: "codex-image-gen"') && mainSource.includes("importCodexGeneratedImage")],
    ["Codex workspace self-healing", codexRuntimeSource.includes('fs.mkdirSync(this.workspaceRoot, { recursive: true })')],
    ["Codex streaming frame batching", codexUiSource.includes('requestAnimationFrame(() => flushStream(timeline))')],
    ["Startup keeps four creation modes on one desktop row", /body\.jiaren-launch-active \.jiaren-launch-art \{[\s\S]{0,260}grid-template-columns: repeat\(4, minmax\(0, 1fr\)\) !important;/.test(darkThemeSource)],
    ["Codex silent-send failure guard", codexUiSource.includes('throw new Error("Codex 对话创建失败，请重试。")')],
    ["Agent image executor is transient", canvasMcpSource.includes('agentTransient: true') && canvasMcpSource.includes('agentResultMode: "image-only"')],
    ["Agent image executor is hidden", canvasSource.includes('nodes: e.filter((node) => node.data?.agentTransient !== true)')],
    ["Agent image result becomes imageInput", canvasSource.includes('function jiarenFinalizeTransientImages') && canvasSource.includes('type: "imageInput"')],
    ["Agent image failure removes executor", canvasSource.includes('function jiarenRemoveTransientExecutor') && canvasSource.includes('state.deleteWorkflowNode(M)')],
    ["Agent image starts are queued safely", canvasSource.includes('__JIAREN_AGENT_IMAGE_RUN_QUEUE__')],
    ["Agent image execution is once-only", canvasSource.includes('agentExecutionStarted === true')],
    ["Agent image uses the selected configured model", canvasSource.includes("function jiarenGenerateAgentImage") && canvasSource.includes(".slice(0, 1)")],
    ["Manual image nodes keep explicit model routing", canvasSource.includes("if (!jiarenIsTransientAgentImage) return en.generateImage(request)")],
    ["Jiaren Agent has no duplicate channel entry", asar.extractFile(asarPath, path.join("dist", "assets", "jiaren-channel-manager-v112.js")).toString("utf8").includes('panel.dataset.channelManagerV112 = "disabled"')],
    ["Agent image model selection is delegated", canvasMcpSource.includes('cannot select or return the underlying image model') || (canvasMcpSource.includes('不能选择或返回底层图片模型') && !/name: "jiaren_canvas_generate_image"[^\n]+modelId/.test(canvasMcpSource))],
    ["Agent image receipts hide provider details", canvasMcpSource.includes('AGENT_PRIVATE_FIELDS') && canvasMcpSource.includes('sanitizeAgentResult')],
    ["Agent image UI waits for terminal canvas output", codexUiSource.includes('await waitForGeneration(runReceipt.nodeId)') && codexUiSource.includes('等待画布收到最终图片，不会提前报告成功') && !codexUiSource.includes('执行模型：${modelLabel}')],
    ["Codex direct image route never delegates to a Jiaren image model", codexRuntimeSource.includes("do not call jiaren_canvas_generate_image") && codexRuntimeSource.includes("Never fall back to jiaren_canvas_generate_image")],
    ["Local Codex routes vector requests without image API", /use jiaren_canvas_create_svg/i.test(codexRuntimeSource) && canvasMcpSource.includes('name: "jiaren_canvas_create_svg"')],
    ["Production DevTools are disabled", mainSource.includes("devTools: isDev") && mainSource.includes('key === "f12"')],
    ["Production navigation is restricted", mainSource.includes("setWindowOpenHandler") && mainSource.includes('mainWindow.webContents.on("will-navigate"')],
    ["Background windows are throttled in production", mainSource.includes("backgroundThrottling: !isDev")],
  ];
  for (const [label, ok] of packedContracts) {
    if (ok) passes.push(`contract:${label}`);
    else failures.push(`missing packed contract: ${label}`);
  }
}

console.log(`Package content checks passed: ${passes.length}`);
for (const item of passes) console.log(`  OK ${item}`);

if (failures.length) {
  console.error(`Package content checks failed: ${failures.length}`);
  for (const item of failures) console.error(`  FAIL ${item}`);
  process.exit(1);
}

console.log("Jiaren AI 1.1.2 package contains all required local runtimes and application features.");
