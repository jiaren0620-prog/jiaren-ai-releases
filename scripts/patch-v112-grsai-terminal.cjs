"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const files = {
  main: fs.readFileSync(path.join(projectRoot, "dist-electron", "electron", "main.js"), "utf8"),
  codexUi: fs.readFileSync(path.join(projectRoot, "dist", "assets", "jiaren-codex-app-server-v112.js"), "utf8"),
  canvas: fs.readFileSync(path.join(projectRoot, "dist", "assets", "MainCanvasFlow-BbsMxxcM.js"), "utf8"),
};

const contracts = [
  [files.main, "function normalizeGrsaiTaskId(value)", "Grsai task ID validation"],
  [files.main, "const taskId = extractGrsaiTaskId(payload);", "Grsai task ID extraction"],
  [files.main, 'status: succeeded ? "succeeded" : "failed"', "Grsai terminal status"],
  [files.main, "Grsai 未返回有效任务 ID，无法继续查询最终图片。", "Grsai missing task error"],
  [files.codexUi, 'const generationNoticeId = `generation:${runReceipt.nodeId}`;', "Codex generation notice deduplication"],
  [files.codexUi, '`generation:${delegatedImageNodeId}`', "Codex generation failure deduplication"],
  [files.canvas, "图片接口未返回最终图片，请检查当前图片接口配置后重试。", "Codex provider redaction"],
];

for (const [source, expected, label] of contracts) {
  if (!source.includes(expected)) throw new Error(`Missing ${label}.`);
}
if (files.main.includes("Grsai 任务 ${taskId} 已提交，暂未返回图片。")) {
  throw new Error("Grsai still contains the false queued-success message.");
}

console.log("Verified Grsai terminal image handling and Codex failure deduplication.");
