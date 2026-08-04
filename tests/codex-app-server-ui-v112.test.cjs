"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const source = fs.readFileSync(path.resolve(__dirname, "../dist/assets/jiaren-codex-app-server-v112.js"), "utf8");
const styles = fs.readFileSync(path.resolve(__dirname, "../dist/assets/jiaren-codex-app-server-v112.css"), "utf8");
const runtime = fs.readFileSync(path.resolve(__dirname, "../dist-electron/electron/jiaren-codex-app-server-runtime.js"), "utf8");

test("Codex UI catches first-thread failures instead of silently dropping send", () => {
  const sendStart = source.indexOf("async function send(workspace)");
  const tryStart = source.indexOf("try {", sendStart);
  const threadStart = source.indexOf("await startThread(workspace)", sendStart);
  const catchStart = source.indexOf("} catch (error) {", threadStart);
  assert.ok(sendStart >= 0 && tryStart > sendStart && threadStart > tryStart && catchStart > threadStart);
  assert.match(source.slice(catchStart, catchStart + 400), /任务启动失败/);
});

test("Codex capacity errors stay user-facing and do not expose the executor", () => {
  assert.match(source, /function friendlyCodexError\(value\)/);
  assert.match(source, /当前 Codex 服务暂时繁忙，请稍后重试/);
  assert.match(source, /friendlyCodexError\(turn\.error\?\.message\)/);
  assert.doesNotMatch(source, /Selected model is at capacity/);
});

test("Codex UI batches streaming deltas and deduplicates catalog refreshes", () => {
  assert.match(source, /requestAnimationFrame\(\(\) => flushStream\(timeline\)\)/);
  assert.match(source, /if \(state\.catalogsPromise\) return state\.catalogsPromise/);
  assert.match(source, /if \(state\.refreshPromise\) return state\.refreshPromise/);
  assert.doesNotMatch(source, /state\.streamElement\.textContent \+= params\.delta/);
  assert.match(source, /if \(!hasNewPanel\) return/);
});

test("confirmed API key state ignores stale browser-login failures", () => {
  assert.match(source, /if \(accountMode === "apiKey"\) return/);
  assert.match(source, /data-auth-error/);
});

test("Codex login choices explain which path includes built-in image generation", () => {
  assert.match(source, /data-action="browser-login"[^>]+>Codex 账号<\/button>/);
  assert.match(source, /data-action="api-key-toggle"[^>]+>API Key（仅对话）<\/button>/);
  assert.match(source, /Codex 账号支持对话、内置生图，并将成图直接返回当前画布/);
  assert.match(styles, /\.jiaren-codex-account-capability/);
});

test("MCP canvas plans remain visible and require explicit approval", () => {
  assert.match(source, /agentControl\?\.listPlans\("pending"\)/);
  assert.match(source, /agentControl\?\.onEvent\?/);
  assert.match(source, /event\?\.type\?\.startsWith\("plan\."\)/);
  assert.match(source, /control\.rejectPlan\(plan\.id/);

  const handlerStart = source.indexOf("async function resolveCanvasPlan");
  const preview = source.indexOf("bridge.previewOperations", handlerStart);
  const approve = source.indexOf("control.approvePlan", handlerStart);
  const apply = source.indexOf("bridge.applyOperations", handlerStart);
  const wait = source.indexOf("await waitForGeneration", apply);
  const complete = source.indexOf("control.completePlan", wait);
  assert.ok(handlerStart >= 0 && preview > handlerStart && approve > preview && apply > approve && wait > apply && complete > wait);
  assert.match(source, /generationResults: new Map\(\)/);
  assert.match(source, /const previous = state\.generationResults\.get\(key\)/);
  assert.match(source, /generation: terminal/);
  assert.match(source, /finalNode\?\.data\?\.agentResult !== true/);
});

test("chat shows Codex dialogue while raw tool parameters stay in the log tab", () => {
  assert.match(source, /function logMessage\(container, content, detail\)/);
  assert.match(source, /logMessage\(timeline, item\.command \|\| item\.tool/);
  assert.match(source, /setActivity\(timeline, "Codex 正在思考/);
  assert.match(source, /clearActivity\(\);[\s\S]{0,160}state\.busy = false/);
  assert.match(styles, /timeline:not\(\.is-log-view\)[^{]+\.is-log-entry[\s\S]*?display: none/);
  assert.match(styles, /timeline\.is-log-view[^{]+:not\(\.is-log-entry\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("chat renders official Codex progress narration and readable tool summaries", () => {
  assert.match(source, /item\/reasoning\/summaryTextDelta/);
  assert.match(source, /item\.phase === "commentary"/);
  assert.match(source, /item\.phase === "final_answer"/);
  assert.match(source, /function startRun\(timeline\)/);
  assert.match(source, /已处理 \$\{durationText\(elapsed\)\}/);
  assert.match(source, /正在读取当前画布/);
  assert.match(source, /正在运行命令/);
  assert.match(source, /已编辑 \$\{count\} 个文件/);
  assert.match(styles, /\.jiaren-codex-run-body/);
  assert.match(styles, /\.jiaren-codex-run-step\.is-running/);
  assert.match(styles, /timeline\.is-log-view[^{]+\.jiaren-codex-run/);
  assert.match(source, /function toolFamily\(item\)/);
  assert.match(source, /生成任务已提交/);
  assert.match(source, /等待画布收到最终图片，不会提前报告成功/);
  assert.doesNotMatch(source, /Jiaren 正在后台生成 · 完成后仅显示最终图片/);
  assert.doesNotMatch(source, /执行模型：\$\{modelLabel\}/);
  assert.doesNotMatch(source, /generatedNode\?\.data\?\.modelAlias/);
  assert.match(styles, /\.jiaren-codex-process-line/);
  assert.doesNotMatch(source, /appendRunNarrative\(timeline, `reasoning:/);
});

test("canvas approval can be scoped to the current Codex conversation", () => {
  assert.match(source, /canvasApprovedThreads: new Set\(\)/);
  assert.match(source, /本对话持续授权/);
  assert.match(source, /state\.canvasApprovedThreads\.add\(state\.threadId\)/);
  assert.match(source, /state\.canvasApprovedThreads\.has\(state\.threadId\)/);
  assert.match(source, /state\.canvasApprovedThreads\.clear\(\)/);
  assert.doesNotMatch(source, /localStorage\.setItem\([^\n]*canvasApprovedThreads/);
});

test("canvas Codex imports built-in imageGeneration results without a Jiaren image API hop", () => {
  assert.match(runtime, /model_reasoning_effort="low"/);
  assert.match(runtime, /"--enable", "image_generation"/);
  assert.match(runtime, /use the built-in image_gen tool directly/);
  assert.match(runtime, /do not call jiaren_canvas_generate_image/);
  assert.match(runtime, /handleImageGenerationItem\(params\)/);
  assert.match(runtime, /resolveGeneratedImagePath\(item, this\.workspaceRoot\)/);
  assert.match(runtime, /agentSource: "codex-image-gen"/);
  assert.match(source, /function planContainsSvg\(plan\)/);
  assert.match(source, /function planContainsCodexImage\(plan\)/);
  assert.match(source, /CODEX_IMAGE_CAPABILITY_REQUIRED/);
  assert.match(source, /finalImageSources\(finalNode\)\.length === 0/);
  assert.doesNotMatch(runtime, /For every ordinary raster-image request/);
});
