"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const relativePath = "dist/assets/jiaren-channel-manager-v112.js";
const marker = "Jiaren Agent mode boundaries v112";
const filePath = path.join(projectRoot, relativePath);

let source = fs.readFileSync(filePath, "utf8");
if (source.includes(marker)) {
  console.log("Jiaren Agent mode boundaries patch already applied.");
  process.exit(0);
}

const start = source.indexOf("  function mountEntry(panel) {");
const end = source.indexOf("\n\n  document.addEventListener", start);
if (start < 0 || end < 0) throw new Error("Missing Jiaren Agent channel entry mount function.");

source = `${source.slice(0, start)}  function mountEntry(panel) {
    if (!panel) return;
    panel.dataset.channelManagerV112 = "disabled";
    panel.querySelectorAll(".jiaren-channel-entry").forEach((entry) => entry.remove());
  }${source.slice(end)}`;
source += `\n/* ${marker} */\n`;
fs.writeFileSync(filePath, source, "utf8");
console.log("Jiaren Agent now uses only software API chat models or the local Codex CLI.");
