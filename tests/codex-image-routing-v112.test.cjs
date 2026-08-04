"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

const ui = read("dist/assets/jiaren-codex-app-server-v112.js");
const runtime = read("dist-electron/electron/jiaren-codex-app-server-runtime.js");
const mcp = read("tools/jiaren-canvas-mcp/bin/jiaren-canvas-mcp.cjs");
const skill = read("plugins/jiaren-canvas/skills/jiaren-canvas/SKILL.md");
const packageScript = read("scripts/package-v019.cjs");

function loadRoutingHelpers() {
  const start = ui.indexOf("function text(value");
  const end = ui.indexOf("function friendlyAuthError", start);
  assert.ok(start >= 0 && end > start, "Could not locate Codex image-routing helpers");
  const source = `${ui.slice(start, end)}\n({ isExplicitVectorRequest, isRasterImageRequest, planContainsSvg, planContainsDelegatedImage, planContainsCodexImage, finalImageSources });`;
  return vm.runInNewContext(source, Object.create(null));
}

test("ordinary product-image prompts route to raster generation, not SVG", () => {
  const helpers = loadRoutingHelpers();
  assert.equal(helpers.isRasterImageRequest("做一张 800x800 天猫牙膏产品主图"), true);
  assert.equal(helpers.isExplicitVectorRequest("做一张 800x800 天猫牙膏产品主图"), false);
  assert.equal(helpers.isRasterImageRequest("Create a photorealistic e-commerce product image as PNG"), true);
  assert.equal(helpers.isExplicitVectorRequest("Create an editable SVG logo"), true);
  assert.equal(helpers.isRasterImageRequest("Create an editable SVG logo"), false);
});

test("SVG plans and delegated image plans are distinguished before approval", () => {
  const helpers = loadRoutingHelpers();
  assert.equal(helpers.planContainsSvg({ operations: [{
    type: "node.add",
    kind: "imageInput",
    data: { mimeType: "image/svg+xml", imageSource: "data:image/svg+xml,%3Csvg%3E" },
  }] }), true);
  assert.equal(helpers.planContainsDelegatedImage({ operations: [{
    type: "node.add",
    kind: "generateImage",
    data: { agentTransient: true, agentSource: "jiaren-codex" },
  }] }), true);
  assert.equal(helpers.planContainsCodexImage({ operations: [{
    type: "node.add",
    kind: "imageInput",
    data: { agentSource: "codex-image-gen", codexImageGeneration: true },
  }] }), true);
  assert.deepEqual(
    [...helpers.finalImageSources({ data: { imageUrl: "https://example.test/final.png" } })],
    ["https://example.test/final.png"],
  );
  assert.equal(helpers.finalImageSources({ data: { kind: "imageInput" } }).length, 0);
});

test("Jiaren Agent uses Codex built-in image generation without delegating to Jiaren image models", () => {
  assert.match(runtime, /use the built-in image_gen tool directly/);
  assert.match(runtime, /Do not read the canvas first/);
  assert.match(runtime, /do not call jiaren_canvas_generate_image/);
  assert.match(runtime, /automatically imports the completed imageGeneration savedPath/);
  assert.match(runtime, /"--enable", "image_generation"/);
  assert.match(runtime, /agentSource: "codex-image-gen"/);
  assert.match(skill, /Ordinary raster-image requests must use `jiaren_canvas_generate_image`/);
  assert.match(skill, /Do not create a local SVG\/PNG with shell commands/);
  assert.doesNotMatch(skill, /queued: true` means the media task was submitted successfully/);
});

test("MCP descriptions and packaged UI keep the image-routing guard", () => {
  assert.match(mcp, /Never use this for ordinary product main images/);
  assert.match(mcp, /ordinary product main images, e-commerce images/);
  assert.match(ui, /普通图片请求不允许使用 SVG/);
  assert.match(ui, /finalImageSources\(finalNode\)\.length === 0/);
  assert.match(ui, /Codex 未返回可导入的最终图片/);
  assert.match(ui, /CODEX_IMAGE_CAPABILITY_REQUIRED/);
  assert.match(packageScript, /patch-v112-codex-raster-canvas-guard\.cjs/);
});
