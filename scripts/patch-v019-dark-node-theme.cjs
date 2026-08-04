"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const cssPath = path.join(projectRoot, "dist", "assets", "jiaren-v019-fixes.css");
const utilityPath = path.join(projectRoot, "dist", "assets", "T8UtilityNodes-complete-v6.js");
const marker = "/* Jiaren v0.1.9 dark node theme */";
const runtimeNodePolishMarker = "/* Jiaren v0.1.9 runtime node icon polish */";
const runtimeNodeSpecificityMarker = "/* Jiaren v0.1.9 runtime node specificity correction */";

let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(marker)) {
  css += `

${marker}
:root {
  --jiaren-019-bg: #090b09;
  --jiaren-019-panel: #111511;
  --jiaren-019-panel-raised: #171c17;
  --jiaren-019-control: #101410;
  --jiaren-019-text: #eef3e9;
  --jiaren-019-muted: #a3ad9a;
  --jiaren-019-line: rgba(156, 186, 103, .24);
  --jiaren-019-accent: #c7ff3d;
  --jiaren-019-cyan: #7ee7c5;
}
.t8-advanced-node,
.t8-native-video-node,
.t8-codex-node,
.t8-grid-editor-node,
.t8-grid-crop-workbench,
.t8-grid-crop-preview,
.t8-advanced-panel,
.jiaren-media-bottom-editor {
  color: var(--jiaren-019-text) !important;
  background: var(--jiaren-019-panel) !important;
  border: 1px solid var(--jiaren-019-line) !important;
  border-radius: 8px !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, .28) !important;
}
.t8-advanced-node-header,
.t8-native-video-header,
.t8-codex-header,
.jiaren-media-bottom-editor > header,
.jiaren-media-bottom-editor > div:first-of-type {
  color: var(--jiaren-019-text) !important;
  background: var(--jiaren-019-panel-raised) !important;
  border-color: var(--jiaren-019-line) !important;
  border-radius: 8px 8px 0 0 !important;
}
.t8-advanced-node-body,
.t8-native-video-body,
.t8-codex-body,
.t8-codex-card,
.t8-advanced-panel,
.t8-grid-editor-preview,
.t8-grid-editor-board,
.t8-grid-crop-fields,
.t8-grid-crop-batch,
.jiaren-media-bottom-editor .p-2,
.jiaren-media-bottom-editor .p-2\.5 {
  color: var(--jiaren-019-text) !important;
  background: var(--jiaren-019-bg) !important;
  border-color: var(--jiaren-019-line) !important;
  border-radius: 8px !important;
}
.t8-advanced-node-icon,
.t8-native-video-icon,
.t8-codex-icon {
  color: var(--jiaren-019-accent) !important;
  background: rgba(199, 255, 61, .12) !important;
  border: 1px solid rgba(199, 255, 61, .3) !important;
  box-shadow: inset 0 0 0 1px rgba(199, 255, 61, .08) !important;
  border-radius: 7px !important;
}
.t8-native-video-icon svg,
.jiaren-video-square-card svg { color: var(--jiaren-019-accent) !important; }
.t8-grid-editor-node .t8-advanced-node-icon,
.t8-grid-crop-workbench svg,
.t8-grid-editor-board svg { color: #b7eb8f !important; }
.t8-bp-node .t8-advanced-node-icon,
[data-node-kind="bp"] .t8-advanced-node-icon { color: var(--jiaren-019-cyan) !important; }
.t8-codex-node input,
.t8-codex-node select,
.t8-codex-node textarea,
.t8-advanced-node input,
.t8-advanced-node select,
.t8-advanced-node textarea,
.t8-native-video-node input,
.t8-native-video-node select,
.t8-native-video-node textarea,
.t8-grid-editor-node input,
.t8-grid-editor-node select,
.t8-grid-editor-node textarea,
.t8-grid-crop-workbench input,
.t8-grid-crop-workbench select,
.t8-grid-crop-workbench textarea {
  box-sizing: border-box !important;
  color: var(--jiaren-019-text) !important;
  background: var(--jiaren-019-control) !important;
  border: 1px solid var(--jiaren-019-line) !important;
  border-radius: 6px !important;
  min-width: 0 !important;
}
.t8-codex-node option,
.t8-advanced-node option,
.t8-native-video-node option,
.t8-grid-editor-node option,
.t8-grid-crop-workbench option {
  color: var(--jiaren-019-text) !important;
  background: var(--jiaren-019-panel) !important;
}
.t8-codex-node button,
.t8-advanced-node button,
.t8-native-video-node button,
.t8-grid-editor-node button,
.t8-grid-crop-workbench button,
.jiaren-media-bottom-editor button {
  color: var(--jiaren-019-text) !important;
  background: var(--jiaren-019-control) !important;
  border: 1px solid var(--jiaren-019-line) !important;
  border-radius: 6px !important;
  min-height: 28px !important;
  white-space: nowrap !important;
}
.t8-codex-node button:hover,
.t8-advanced-node button:hover,
.t8-native-video-node button:hover,
.t8-grid-editor-node button:hover,
.t8-grid-crop-workbench button:hover,
.jiaren-media-bottom-editor button:hover {
  color: var(--jiaren-019-accent) !important;
  background: rgba(199, 255, 61, .12) !important;
  border-color: rgba(199, 255, 61, .48) !important;
}
.t8-advanced-run,
.t8-codex-footer .primary,
.jiaren-media-bottom-editor button[type="submit"] {
  color: #0a0d0a !important;
  background: var(--jiaren-019-accent) !important;
  border-color: var(--jiaren-019-accent) !important;
}
.t8-grid-editor-preview,
.t8-grid-crop-preview,
.t8-grid-editor-board {
  overflow: hidden !important;
  background: #0c100c !important;
}
.t8-grid-cell {
  min-width: 0 !important;
  min-height: 74px !important;
  overflow: hidden !important;
  background: #101610 !important;
  border: 1px dashed rgba(156, 186, 103, .34) !important;
  border-radius: 4px !important;
}
.t8-grid-cell.is-filled { background: #171d17 !important; }
.t8-grid-cell > img { object-fit: contain !important; }
.t8-grid-editor-footer,
.t8-grid-crop-presets,
.t8-grid-crop-fields,
.t8-grid-crop-batch { gap: 6px !important; }
.t8-advanced-node [class*="bg-white"],
.t8-native-video-node [class*="bg-white"],
.t8-codex-node [class*="bg-white"],
.t8-grid-editor-node [class*="bg-white"],
.t8-grid-crop-workbench [class*="bg-white"] {
  background: rgba(255, 255, 255, .04) !important;
}
.t8-advanced-node [class*="text-black"],
.t8-advanced-node [class*="text-slate"],
.t8-native-video-node [class*="text-black"],
.t8-native-video-node [class*="text-slate"],
.t8-codex-node [class*="text-black"],
.t8-codex-node [class*="text-slate"],
.t8-grid-editor-node [class*="text-black"],
.t8-grid-editor-node [class*="text-slate"],
.t8-grid-crop-workbench [class*="text-black"],
.t8-grid-crop-workbench [class*="text-slate"] { color: var(--jiaren-019-text) !important; }
.t8-advanced-node [class*="text-white"],
.t8-native-video-node [class*="text-white"],
.t8-codex-node [class*="text-white"],
.t8-grid-editor-node [class*="text-white"],
.t8-grid-crop-workbench [class*="text-white"] { color: var(--jiaren-019-text) !important; }
.jiaren-media-bottom-editor[data-jiaren-duplicate="true"] { display: none !important; }
.jiaren-media-bottom-editor,
.jiaren-media-bottom-editor * { scrollbar-color: rgba(199, 255, 61, .38) rgba(255, 255, 255, .04); }
.jiaren-transparent-preview,
[data-transparent="true"] { background-color: #111511 !important; background-image: linear-gradient(45deg, rgba(199,255,61,.08) 25%, transparent 25%, transparent 75%, rgba(199,255,61,.08) 75%), linear-gradient(45deg, rgba(199,255,61,.08) 25%, transparent 25%, transparent 75%, rgba(199,255,61,.08) 75%) !important; background-position: 0 0, 8px 8px !important; background-size: 16px 16px !important; }
`;
  fs.writeFileSync(cssPath, css, "utf8");
  console.log("Applied JiarenAI dark green node theme.");
} else {
  console.log("JiarenAI dark green node theme is already applied.");
}

if (!css.includes(runtimeNodePolishMarker)) {
  css += `

${runtimeNodePolishMarker}
.react-flow__node-sdVideo > .t8-original-scope > div,
.react-flow__node-t8\\:grid-crop > .t8-original-scope > div,
.react-flow__node-bp > .t8-original-scope > div {
  overflow: hidden !important;
  color: var(--jiaren-019-text) !important;
  background: var(--jiaren-019-panel) !important;
  border: 1px solid var(--jiaren-019-line) !important;
  border-radius: 8px !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, .28) !important;
}
.react-flow__node-sdVideo > .t8-original-scope > div > div[class*="border-b"],
.react-flow__node-t8\\:grid-crop > .t8-original-scope > div > div[class*="border-b"],
.react-flow__node-bp > .t8-original-scope > div > div[class*="border-b"] {
  background: var(--jiaren-019-panel-raised) !important;
  border-color: var(--jiaren-019-line) !important;
  border-radius: 7px 7px 0 0 !important;
}
.react-flow__node-sdVideo div[class~="w-6"][class~="h-6"]:has(> svg),
.react-flow__node-t8\\:grid-crop div[class~="w-6"][class~="h-6"]:has(> svg),
.react-flow__node-bp div[class~="w-6"][class~="h-6"]:has(> svg) {
  color: var(--jiaren-019-accent) !important;
  background: rgba(199, 255, 61, .12) !important;
  border: 1px solid rgba(199, 255, 61, .3) !important;
  border-radius: 7px !important;
  box-shadow: inset 0 0 0 1px rgba(199, 255, 61, .08) !important;
}
.react-flow__node-sdVideo div[class~="w-6"][class~="h-6"] > svg,
.react-flow__node-t8\\:grid-crop div[class~="w-6"][class~="h-6"] > svg,
.react-flow__node-bp div[class~="w-6"][class~="h-6"] > svg {
  color: var(--jiaren-019-accent) !important;
  stroke: currentColor !important;
}
.react-flow__node-sdVideo .react-flow__handle,
.react-flow__node-t8\\:grid-crop .react-flow__handle,
.react-flow__node-bp .react-flow__handle {
  background: var(--jiaren-019-accent) !important;
  border: 2px solid #27351a !important;
  box-shadow: 0 0 0 1px rgba(199, 255, 61, .55), 0 0 10px rgba(199, 255, 61, .22) !important;
}
.react-flow__node-sdVideo input,
.react-flow__node-t8\\:grid-crop input,
.react-flow__node-bp input {
  accent-color: var(--jiaren-019-accent) !important;
}
`;
  fs.writeFileSync(cssPath, css, "utf8");
  console.log("Applied runtime node icon and corner polish.");
} else {
  console.log("Runtime node icon and corner polish is already applied.");
}

if (!css.includes(runtimeNodeSpecificityMarker)) {
  css += `

${runtimeNodeSpecificityMarker}
html body #root .react-flow__node-sdVideo > .t8-original-scope > div,
html body #root .react-flow__node-t8\\:grid-crop > .t8-original-scope > div,
html body #root .react-flow__node-bp > .t8-original-scope > div {
  overflow: hidden !important;
  color: var(--jiaren-019-text) !important;
  background: var(--jiaren-019-panel) !important;
  border: 1px solid var(--jiaren-019-line) !important;
  border-radius: 8px !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, .28) !important;
}
html body #root .react-flow__node-sdVideo > .t8-original-scope > div > div[class*="border-b"],
html body #root .react-flow__node-t8\\:grid-crop > .t8-original-scope > div > div[class*="border-b"],
html body #root .react-flow__node-bp > .t8-original-scope > div > div[class*="border-b"] {
  background: var(--jiaren-019-panel-raised) !important;
  border-color: var(--jiaren-019-line) !important;
  border-radius: 7px 7px 0 0 !important;
}
html body #root .react-flow__node-sdVideo div[class~="w-6"][class~="h-6"]:has(> svg),
html body #root .react-flow__node-t8\\:grid-crop div[class~="w-6"][class~="h-6"]:has(> svg),
html body #root .react-flow__node-bp div[class~="w-6"][class~="h-6"]:has(> svg) {
  color: #c7ff3d !important;
  background: rgba(199, 255, 61, .12) !important;
  border: 1px solid rgba(199, 255, 61, .3) !important;
  border-radius: 7px !important;
  box-shadow: inset 0 0 0 1px rgba(199, 255, 61, .08) !important;
}
html body #root .canvas-app-shell .react-flow__node-sdVideo .t8-original-scope[data-app-shell-theme] .react-flow__handle.react-flow__handle,
html body #root .canvas-app-shell .react-flow__node-t8\\:grid-crop .t8-original-scope[data-app-shell-theme] .react-flow__handle.react-flow__handle,
html body #root .canvas-app-shell .react-flow__node-bp .t8-original-scope[data-app-shell-theme] .react-flow__handle.react-flow__handle {
  background-color: #c7ff3d !important;
  background-image: none !important;
  border: 2px solid #27351a !important;
  box-shadow: 0 0 0 1px rgba(199, 255, 61, .55), 0 0 10px rgba(199, 255, 61, .22) !important;
  animation: none !important;
  transition: none !important;
}
html body #root .react-flow__node-sdVideo input,
html body #root .react-flow__node-t8\\:grid-crop input,
html body #root .react-flow__node-bp input {
  accent-color: #c7ff3d !important;
}
`;
  fs.writeFileSync(cssPath, css, "utf8");
  console.log("Applied runtime node specificity correction.");
} else {
  console.log("Runtime node specificity correction is already applied.");
}

let utility = fs.readFileSync(utilityPath, "utf8");
const utilityReplacements = [
  ['Go = "#fb923c"', 'Go = "#c7ff3d"'],
  ['rgba(251,146,60,.2)', 'rgba(199,255,61,.12)'],
  ['rgba(251,146,60,.18)', 'rgba(199,255,61,.10)'],
  ['#fed7aa', '#e7f7c7'],
  ['bg-orange-500/20 hover:bg-orange-500/30 text-orange-200', 'bg-lime-300/10 hover:bg-lime-300/20 text-lime-100'],
];
let utilityChanged = false;
for (const [from, to] of utilityReplacements) {
  if (utility.includes(from)) {
    utility = utility.split(from).join(to);
    utilityChanged = true;
  }
}
if (utilityChanged) {
  fs.writeFileSync(utilityPath, utility, "utf8");
  console.log("Updated utility node accent colors.");
} else {
  console.log("Utility node accent colors are already updated.");
}
