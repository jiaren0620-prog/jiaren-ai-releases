"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const main = read("dist-electron/electron/main.js");
const preload = read("dist-electron/electron/preload.js");
const canvas = read("dist/assets/MainCanvasFlow-BbsMxxcM.js");
const agentUi = read("dist/assets/main-BvGlsrDH.js");
const codexAppUi = read("dist/assets/jiaren-codex-app-server-v112.js");
const agentRuntime = read("dist-electron/electron/jiaren-agent-control-runtime.js");
const runtimeUi = read("dist/assets/jiaren-runtime-hardening-v019.js");
const runtimeCss = read("dist/assets/jiaren-runtime-hardening-v019.css");
const codexNode = read("dist/assets/T8CodexNodes-complete-v6.js");
const codexRunner = read("jiaren-local-service/src/utils/codexCliRunner.js");
const installer = read("build/installer.nsh");
const builder = read("electron-builder-v019.cjs");
const index = read("dist/index.html");

assert.match(main, /const activeImageTasks = new Map\(\)/);
assert.match(main, /async function runImageTask\(task\)/);
assert.doesNotMatch(main, /pumpImageTaskQueue/);
assert.match(main, /runtime:getImageTaskState/);
assert.match(main, /runtime:cancelImageTask/);
assert.match(main, /enqueueProjectOperation\(\(\) => saveProject\(payload\)\)/);
assert.match(main, /try \{ \(0, node_fs_1\.unlinkSync\)\(backupPath\); \} catch \{\}/);
assert.match(main, /form\.set\("mask", maskBlob/);
assert.match(main, /resolveAutomaticImageRatio/);

assert.match(preload, /getImageTaskState:/);
assert.match(preload, /cancelImageTask:/);
assert.match(preload, /onImageTaskState:/);

assert.match(canvas, /for \(let Ft = 0; Ft < we; Ft \+= 1\)/);
assert.match(canvas, /for \(let et = 0; et < \$; et \+= 1\)/);
assert.match(canvas, /maskImage: Me\.data\.maskImage/);
assert.match(canvas, /children: \["Auto", \.\.\.Ye\.aspectRatios\]/);
assert.match(canvas, /apiKey\|authorization\|cookie\|token\|password\|credential\|secret/);
assert.match(canvas, /jiarenAppendNodesAtCaret\(wt\.current/);

assert.match(runtimeUi, /function neutralizeApiCopy/);
assert.match(runtimeUi, /接口已接入/);
assert.match(runtimeUi, /请输入兼容接口地址/);
assert.match(runtimeUi, /function removeObsoleteInstallerEntry/);
assert.match(runtimeUi, /showLaunchNotice\(\)/);
assert.match(runtimeUi, /createAnnotatedEditNode/);
assert.match(runtimeUi, /type: "node\.update",[\s\S]{0,240}inputPrompt: prompt/);
assert.match(runtimeUi, /__JIAREN_CODEX_CANVAS_PLAN__/);
assert.match(index, /jiaren-runtime-hardening-v019\.js/);
assert.match(runtimeCss, /\.image-preview-header \.jiaren-preview-tools/);
assert.match(runtimeCss, /flex-wrap: nowrap !important/);
assert.match(runtimeCss, /\.canvas-app-shell \.jc-launcher/);

assert.match(codexNode, /canvasSnapshot:window\.__JIAREN_CANVAS_AGENT__/);
assert.match(codexRunner, /Jiaren canvas approval contract/);
assert.match(codexRunner, /apiKey\|authorization\|cookie\|token\|password\|credential\|secret/);
assert.match(codexRunner, /CODEX_INSTALL_COMMAND/);
assert.match(codexRunner, /rejectedWindowsApps/);
assert.match(codexRunner, /\['\/d', '\/k', scriptPath\]/);
assert.doesNotMatch(codexRunner, /start \"\"/);
assert.match(agentRuntime, /approvalRequired: true/);
assert.match(agentRuntime, /只有已批准的计划可以执行/);
assert.match(agentRuntime, /agent-control atomic writer v019/);
assert.match(agentUi, /JiarenExecutingPlans\.has\(plan\.id\)/);
assert.match(agentUi, /bridge\.previewOperations\(plan\.operations\)[\s\S]{0,300}control\.approvePlan\(plan\.id\)[\s\S]{0,300}bridge\.applyOperations\(plan\.operations\)/);
assert.match(agentUi, /批准并执行/);
assert.match(agentUi, /拒绝/);
assert.match(agentUi, /本地配对码/);
assert.match(codexAppUi, /批准一次/);
assert.match(codexAppUi, /本对话持续授权/);
assert.match(codexAppUi, /canvasApprovedThreads\.has\(state\.threadId\)/);

assert.match(installer, /我已仔细阅读，同意所有免责条款/);
assert.match(installer, /\$\{NSD_CreateCheckbox\} 0 108u 100% 16u/);
assert.match(installer, /\$\{NSD_GetState\} \$JiarenDisclaimerCheckbox \$0/);
assert.match(installer, /请先勾选同意所有免责条款，才能继续安装/);
assert.match(builder, /!\*\*\/\.codex/);
assert.match(builder, /!\*\*\/auth\.json/);

console.log("Jiaren AI 1.1.2 runtime hardening, approval, privacy and installer contracts passed.");
