"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const checks = [
  {
    file: "plugins/jiaren-canvas/skills/jiaren-canvas/SKILL.md",
    required: [
      "Ordinary raster-image requests must use `jiaren_canvas_generate_image`",
      "A `run.node` receipt with `queued: true` means only that the renderer accepted the dispatch",
      "Do not create a local SVG/PNG with shell commands",
    ],
    forbidden: [
      "A `run.node` receipt with `queued: true` means the media task was submitted successfully",
    ],
  },
  {
    file: "tools/jiaren-canvas-mcp/bin/jiaren-canvas-mcp.cjs",
    required: [
      "Never use this for ordinary product main images",
      "must use jiaren_canvas_generate_image",
      "queued ",
    ],
  },
  {
    file: "dist-electron/electron/jiaren-codex-app-server-runtime.js",
    required: [
      "use the built-in image_gen tool directly",
      "Do not read the canvas first",
      "do not call jiaren_canvas_generate_image",
      "automatically imports the completed imageGeneration savedPath",
      '\"--enable\", \"image_generation\"',
      'agentSource: \"codex-image-gen\"',
    ],
    forbidden: ["For every ordinary raster-image request"],
  },
  {
    file: "dist/assets/jiaren-codex-app-server-v112.js",
    required: [
      "function isExplicitVectorRequest(value)",
      "function planContainsSvg(plan)",
      "function planContainsCodexImage(plan)",
      "function finalImageSources(node)",
      "普通图片请求不允许使用 SVG",
      "Codex 未返回可导入的最终图片",
      "CODEX_IMAGE_CAPABILITY_REQUIRED",
      "finalImageSources(finalNode).length === 0",
    ],
  },
];

for (const check of checks) {
  const filePath = path.join(projectRoot, check.file);
  const source = fs.readFileSync(filePath, "utf8");
  for (const needle of check.required || []) {
    if (!source.includes(needle)) throw new Error(`Missing Codex raster canvas guard in ${check.file}: ${needle}`);
  }
  for (const needle of check.forbidden || []) {
    if (source.includes(needle)) throw new Error(`Stale Codex raster rule remains in ${check.file}: ${needle}`);
  }
}

console.log("Verified Codex raster-image routing and visible-canvas completion guards.");
