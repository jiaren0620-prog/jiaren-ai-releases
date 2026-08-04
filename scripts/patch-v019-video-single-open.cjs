"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const targetPath = path.join(projectRoot, "dist", "assets", "JiarenVideoNode-v1.js");
const canvasPath = path.join(projectRoot, "dist", "assets", "MainCanvasFlow-BbsMxxcM.js");
const marker = "// Jiaren v0.1.9 single video editor guard";

let videoSource = fs.readFileSync(targetPath, "utf8");
if (!videoSource.includes(marker)) {
  const anchor = `      const editor = document.querySelector(\n        \`[data-jiaren-media-editor=\"${"${mediaKind}"}\"][data-jiaren-node-id=\"${"${nodeId}"}\"]\`,\n      );`;
  const replacement = `      ${marker}\n      const editors = Array.from(\n        document.querySelectorAll(\n          \`[data-jiaren-media-editor=\"${"${mediaKind}"}\"][data-jiaren-node-id=\"${"${nodeId}"}\"]\`,\n        ),\n      );\n      editors.forEach((candidate, index) => {\n        if (index === 0) candidate.removeAttribute("data-jiaren-duplicate");\n        else candidate.setAttribute("data-jiaren-duplicate", "true");\n      });\n      const editor = editors[0] || null;`;
  if (!videoSource.includes(anchor)) {
    throw new Error("Video editor anchor not found.");
  }
  videoSource = videoSource.replace(anchor, replacement);
  fs.writeFileSync(targetPath, videoSource, "utf8");
  console.log("Applied single video editor DOM guard.");
} else {
  console.log("Single video editor DOM guard is already applied.");
}

let canvasSource = fs.readFileSync(canvasPath, "utf8");
const canvasMarker = "// Jiaren v0.1.9 node creation debounce";
if (!canvasSource.includes(canvasMarker)) {
  const anchor = "  function ki(t, i) {\n    const r = D({";
  const replacement = `  ${canvasMarker}\n  function ki(t, i) {\n    const placement = t8NodePlacement(t, i);\n    const now = Date.now();\n    const key = \`${"${t}"}:${"${Math.round(placement.x / 8)}"}:${"${Math.round(placement.y / 8)}"}\`;\n    const guard = globalThis.__JIAREN_NODE_CREATE_GUARD__ || (globalThis.__JIAREN_NODE_CREATE_GUARD__ = new Map());\n    const recent = guard.get(key);\n    if (recent && now - recent.time < 650) {\n      x(recent.id);\n      return (typeof L !== "undefined" && L.getState?.().workflowNodes || []).find((node) => node.id === recent.id) || { id: recent.id };\n    }\n    const r = D({`;
  if (!canvasSource.includes(anchor)) {
    throw new Error("Canvas node creation anchor not found.");
  }
  canvasSource = canvasSource.replace(anchor, replacement);
  const positionAnchor = `      position: t8NodePlacement(t, i),`;
  if (!canvasSource.includes(positionAnchor)) {
    throw new Error("Canvas node position anchor not found after guard insertion.");
  }
  canvasSource = canvasSource.replace(positionAnchor, `      position: placement,`);
  const returnAnchor = `    (pe(void 0),\n      zt(),\n      x(r.id),`;
  if (!canvasSource.includes(returnAnchor)) {
    throw new Error("Canvas node return anchor not found.");
  }
  canvasSource = canvasSource.replace(returnAnchor, `    (guard.set(key, { id: r.id, time: now }),\n      pe(void 0),\n      zt(),\n      x(r.id),`);
  fs.writeFileSync(canvasPath, canvasSource, "utf8");
  console.log("Applied short-window node creation debounce.");
} else {
  console.log("Node creation debounce is already applied.");
}
