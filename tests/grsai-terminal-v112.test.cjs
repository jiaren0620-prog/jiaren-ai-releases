"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const main = fs.readFileSync(path.join(root, "dist-electron", "electron", "main.js"), "utf8");
const codexUi = fs.readFileSync(path.join(root, "dist", "assets", "jiaren-codex-app-server-v112.js"), "utf8");
const canvas = fs.readFileSync(path.join(root, "dist", "assets", "MainCanvasFlow-BbsMxxcM.js"), "utf8");

test("Grsai requires a real task ID and never reports an empty queued result as success", () => {
  assert.match(main, /function normalizeGrsaiTaskId\(value\)/);
  assert.match(main, /\^\(\?:undefined\|null\|none\|unknown\|false\|true\|nan\)\$/);
  assert.match(main, /const taskId = extractGrsaiTaskId\(payload\);/);
  assert.match(main, /status: succeeded \? "succeeded" : "failed"/);
  assert.match(main, /Grsai 未返回有效任务 ID，无法继续查询最终图片。/);
  assert.doesNotMatch(main, /Grsai 任务 \$\{taskId\} 已提交，暂未返回图片。/);
});

test("Codex image failures are deduplicated and hide provider names", () => {
  assert.match(codexUi, /const generationNoticeId = `generation:\$\{runReceipt\.nodeId\}`/);
  assert.match(codexUi, /`generation:\$\{delegatedImageNodeId\}`/);
  assert.doesNotMatch(codexUi, /delegatedImageNodeId[\s\S]{0,220}`plan:\$\{plan\.id\}`/);
  assert.match(canvas, /图片接口未返回最终图片，请检查当前图片接口配置后重试。/);
  assert.match(canvas, /grsai\|gpt\[- \]\?image/);
});
