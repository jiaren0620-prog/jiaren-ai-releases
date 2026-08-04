"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const main = fs.readFileSync(path.join(root, "dist-electron", "electron", "main.js"), "utf8");
const canvas = fs.readFileSync(path.join(root, "dist", "assets", "MainCanvasFlow-BbsMxxcM.js"), "utf8");
const darkCss = fs.readFileSync(path.join(root, "dist", "assets", "jiaren-dark-lime-20260728.css"), "utf8");

test("image generation keeps multi-task support while scheduling heavy work", () => {
  assert.match(main, /const MAX_ACTIVE_IMAGE_TASKS = 2;/);
  assert.match(main, /const imageTaskQueue = \[\];/);
  assert.match(main, /state: "queued"/);
  assert.match(main, /task\.state === "queued"/);
  assert.match(main, /task\.controller\.abort\(\)/);
  assert.match(main, /drainImageTaskQueue\(\);/);
  assert.match(main, /const hasFinalImage = result\?\.status === "succeeded" && assets\.length > 0;/);
  assert.match(main, /result\?\.status === "queued" \? "图片接口只确认排队，尚未返回最终图片。"/);
  assert.match(main, /status: "failed", assets: \[\]/);
});

test("image context tools remain complete and use the Jiaren dark theme", () => {
  assert.doesNotMatch(canvas, /打开更多图片工具/);
  assert.doesNotMatch(canvas, /jiarenImageToolsExpanded \? o\.jsxs\(o\.Fragment/);
  assert.match(canvas, /分享到社区/);
  assert.match(canvas, /Jiaren image tools secondary menu v112/);
  assert.match(canvas, /Jiaren SVG-aware image tool downloads v112/);
  assert.match(darkCss, /Jiaren image tools menu performance v112/);
  assert.match(darkCss, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(darkCss, /background: #0d100d/);
  assert.doesNotMatch(darkCss, /image-selection-popover[^{}]*background:\s*rgba\(255,255,255/);
});
