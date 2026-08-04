"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const relativePath = "dist-electron/electron/jiaren-codex-app-server-runtime.js";
const filePath = path.join(projectRoot, relativePath);
const marker = "Jiaren Codex direct vector output v112";

let source = fs.readFileSync(filePath, "utf8");
if (source.includes(marker)) {
  console.log("Jiaren Codex direct vector output patch already applied.");
  process.exit(0);
}

const oldInstruction = "Do not create a separate prompt node, duplicate generation node, or fallback SVG unless the user explicitly asks for an editable workflow or SVG.";
const newInstruction = "When the user explicitly asks for SVG, vector art, an icon, a logo, or editable line art, use jiaren_canvas_create_svg when available and never call the image-generation tool or an image API; if that helper is unavailable, submit exactly one imageInput node containing a safe data:image/svg+xml source. Do not create a separate prompt node, duplicate generation node, or fallback SVG for ordinary raster-image requests.";
if (!source.includes(oldInstruction)) throw new Error("Missing Codex SVG routing instruction.");
source = source.replace(oldInstruction, newInstruction);
source += `\n/* ${marker} */\n`;
fs.writeFileSync(filePath, source, "utf8");
console.log("Local Codex now routes explicit vector requests directly to SVG canvas output.");
