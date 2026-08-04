"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const main = fs.readFileSync(path.join(root, "dist-electron", "electron", "main.js"), "utf8");
const canvas = fs.readFileSync(path.join(root, "dist", "assets", "MainCanvasFlow-BbsMxxcM.js"), "utf8");
const history = fs.readFileSync(path.join(root, "dist", "assets", "main-BvGlsrDH.js"), "utf8");
const bridge = fs.readFileSync(path.join(root, "dist", "community", "bridge.js"), "utf8");
const css = fs.readFileSync(path.join(root, "dist", "assets", "jiaren-dark-lime-20260728.css"), "utf8");

test("SVG downloads preserve the source MIME and extension", () => {
  assert.match(main, /"\.svg": "image\/svg\+xml"/);
  assert.match(main, /function saveAssetMime\(request, parsedData\)/);
  assert.match(main, /function saveAssetFileName\(fileName, mimeType\)/);
  assert.match(main, /"image\/svg\+xml": "\.svg"/);
  assert.match(canvas, /function JiarenAssetMime\(asset\)/);
  assert.match(canvas, /JiarenAssetDownloadName\(Ie, "jiaren-asset"\)/);
  assert.match(canvas, /JiarenAssetDownloadName\(ct, "jiaren-preview"\)/);
  assert.match(history, /mime === "image\/svg\+xml" \? "svg"/);
});

test("the complete image context menu remains visible and themed", () => {
  assert.doesNotMatch(canvas, /打开更多图片工具/);
  assert.doesNotMatch(canvas, /jiarenImageToolsExpanded \? o\.jsxs\(o\.Fragment/);
  for (const label of [
    "快速编辑", "放大", "无损高清", "姿势大师", "继续生成", "PSD 分层", "放入画布",
    "分享到社区", "AI 扩图", "加入 @", "素材库", "LLM-智能体", "反推", "GenPSD",
    "角色锁定", "A/B 对比", "去背景", "提示词库", "图片精修", "转矢量", "3D", "橡皮工具",
    "下载", "删除",
  ]) assert.match(canvas, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(bridge, /if \(!nativeMenu\.querySelector\("\.jc-community-context-item"\)\)/);
  assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\) !important;/);
  assert.match(css, /Jiaren complete image menu v112/);
  assert.match(css, /background: #0d100d !important;/);
});
