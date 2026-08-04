"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(projectRoot, file), "utf8");
const write = (file, value) => fs.writeFileSync(path.join(projectRoot, file), value, "utf8");
function replaceOnce(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Missing ${label}.`);
  return source.replace(search, replacement);
}

function patchMain() {
  const file = "dist-electron/electron/main.js";
  let source = read(file);
  if (source.includes("Jiaren MIME-preserving asset downloads v112")) return;
  source = replaceOnce(source, '  ".png": "image/png",', '  ".png": "image/png",\n  ".svg": "image/svg+xml",', "SVG MIME mapping");
  source = replaceOnce(source, "function uniquePath(directory, fileName) {", `function saveAssetMime(request, parsedData) {
  if (parsedData?.mime) return String(parsedData.mime).split(";")[0].trim().toLowerCase();
  if (request?.localPath && (0, node_fs_1.existsSync)(request.localPath)) return guessMime(request.localPath);
  const explicit = String(request?.mimeType || "").split(";")[0].trim().toLowerCase();
  if (explicit) return explicit;
  const source = String(request?.source || request?.dataUrl || "").trim();
  if (/^https?:\\/\\//i.test(source)) {
    try { return guessMime(new URL(source).pathname); } catch {}
  }
  return guessMime(String(request?.fileName || ""));
}
function saveAssetFileName(fileName, mimeType) {
  const mime = String(mimeType || "").split(";")[0].trim().toLowerCase();
  const extension = extensionFromMime(mime, "");
  const safe = safeFileName(String(fileName || ("jiaren-asset" + (extension || ".bin"))), extension || ".bin");
  if (!extension) return safe;
  const parsed = node_path_1.default.parse(safe);
  return parsed.ext.toLowerCase() === extension ? safe : parsed.name + extension;
}
function uniquePath(directory, fileName) {`, "MIME-aware save helpers");
  const start = source.indexOf("async function saveAsset(request) {");
  const end = source.indexOf("\nfunction readTextFile(request)", start);
  if (start < 0 || end < 0) throw new Error("Missing saveAsset function.");
  const replacement = `async function saveAsset(request = {}) {
  try {
    const directory = String(request.directory || "").trim() || defaultDownloadsDir;
    ensureDir(directory);
    const source = String(request.source || request.dataUrl || "");
    const parsedData = source.startsWith("data:") ? parseDataUrl(source) : void 0;
    const mimeType = saveAssetMime(request, parsedData);
    let targetPath = uniquePath(directory, saveAssetFileName(request.fileName, mimeType));
    if (typeof request.textContent === "string") {
      (0, node_fs_1.writeFileSync)(targetPath, request.textContent, "utf-8");
    } else if (request.localPath && (0, node_fs_1.existsSync)(request.localPath)) {
      (0, node_fs_1.copyFileSync)(request.localPath, targetPath);
    } else if (parsedData) {
      (0, node_fs_1.writeFileSync)(targetPath, parsedData.bytes);
    } else if (/^https?:\\/\\//i.test(source)) {
      const downloaded = await (0, jiaren_safe_download_1.downloadFile)(source, targetPath, { maxBytes: 2 * 1024 * 1024 * 1024 });
      const remoteMime = String(downloaded.contentType || "").split(";")[0].trim().toLowerCase();
      const correctedName = saveAssetFileName(request.fileName, remoteMime || mimeType);
      if (remoteMime && correctedName !== node_path_1.default.basename(targetPath)) {
        const correctedPath = uniquePath(directory, correctedName);
        (0, node_fs_1.renameSync)(targetPath, correctedPath);
        targetPath = correctedPath;
      }
    } else {
      return { ok: false, message: "No image source can be saved." };
    }
    const dimensions = /\\.(png|jpe?g|webp|gif|bmp)$/i.test(targetPath) ? imageDimensions(targetPath) : {};
    return {
      ok: true,
      path: targetPath,
      dataUrl: dimensions.width || dimensions.height ? fileToDataUrl(targetPath) : void 0,
      width: dimensions.width,
      height: dimensions.height
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed.";
    return { ok: false, message };
  }
}
`;
  source = source.slice(0, start) + replacement + source.slice(end + 1);
  source = replaceOnce(source, '    "image/png": ".png",', '    "image/png": ".png",\n    "image/svg+xml": ".svg",', "SVG extension mapping");
  source += "\n/* Jiaren MIME-preserving asset downloads v112 */\n";
  write(file, source);
}

function patchCanvas() {
  const file = "dist/assets/MainCanvasFlow-BbsMxxcM.js";
  let source = read(file);
  if (source.includes("Jiaren SVG-aware image tool downloads v112")) return;
  source = replaceOnce(source, "function eo(e) {", `function JiarenAssetMime(asset) {
  const declared = String(asset?.mimeType || "").split(";")[0].trim().toLowerCase();
  if (declared) return declared;
  const sources = [asset?.dataUrl, asset?.source, asset?.localPath, asset?.name, asset?.fileName].filter(Boolean).map(String);
  const dataMime = sources.map((value) => value.match(/^data:([^;,]+)/i)?.[1]).find(Boolean);
  if (dataMime) return dataMime.toLowerCase();
  const value = sources.find((item) => /\\.(svg|png|jpe?g|webp|gif|bmp)(?:[?#]|$)/i.test(item)) || "";
  const extension = value.match(/\\.(svg|png|jpe?g|webp|gif|bmp)(?:[?#]|$)/i)?.[1]?.toLowerCase();
  return extension === "svg" ? "image/svg+xml" : extension === "jpg" || extension === "jpeg" ? "image/jpeg" : extension === "webp" ? "image/webp" : extension === "gif" ? "image/gif" : extension === "bmp" ? "image/bmp" : "image/png";
}
function JiarenAssetDownloadName(asset, fallback = "jiaren-asset") {
  const mime = JiarenAssetMime(asset);
  const extension = mime === "image/svg+xml" ? ".svg" : mime === "image/jpeg" ? ".jpg" : mime === "image/webp" ? ".webp" : mime === "image/gif" ? ".gif" : mime === "image/bmp" ? ".bmp" : mime.startsWith("video/") ? ".mp4" : mime.startsWith("audio/") ? ".mp3" : ".png";
  const raw = String(asset?.name || asset?.fileName || fallback).trim() || fallback;
  const base = raw.replace(/[<>:"/\\\\|?*\\u0000-\\u001F]/g, "_").replace(/\\.[^.\\/\\\\]+$/, "");
  return base + extension;
}
function eo(e) {`, "canvas asset MIME helper");
  source = source.replace('            name: e.prompt || e.fileName || e.label || "画布图片",\n            x:', '            name: e.fileName || e.prompt || e.label || "画布图片",\n            mimeType: (P == null ? void 0 : P.mimeType) || e.mimeType || JiarenAssetMime({ source: J, name: e.fileName }),\n            x:');
  source = source.replace('            name: e.modelAlias || e.label || "图片预览",\n            subtitle:', '            name: e.fileName || e.modelAlias || e.label || "图片预览",\n            mimeType: (P == null ? void 0 : P.mimeType) || e.mimeType || JiarenAssetMime({ source: J, name: e.fileName }),\n            subtitle:');
  source = source.replace('            title: e.modelAlias || e.label || "图片预览",\n            subtitle:', '            title: e.modelAlias || e.label || "图片预览",\n            name: e.fileName || e.modelAlias || e.label || "图片预览",\n            mimeType: (P == null ? void 0 : P.mimeType) || e.mimeType || JiarenAssetMime({ source: J, name: e.fileName }),\n            subtitle:');
  source = replaceOnce(source, '      dataUrl: Fe.source,\n        localPath: Fe.localPath,\n        x:', '      dataUrl: Fe.source,\n        localPath: Fe.localPath,\n        mimeType: Fe.mimeType || JiarenAssetMime(Fe),\n        fileName: Fe.name,\n        x:', "context asset metadata");
  source = replaceOnce(source, 'name: t.name || "画布图片",\n        screenX:', 'name: t.name || "画布图片",\n        mimeType: t.mimeType || JiarenAssetMime(t),\n        fileName: t.name,\n        screenX:', "direct context metadata");
  source = replaceOnce(source, 'name: c.name || "画布图片",\n          screenX:', 'name: c.name || "画布图片",\n          mimeType: c.mimeType || JiarenAssetMime(c),\n          fileName: c.name,\n          screenX:', "event context metadata");
  source = replaceOnce(source, '          fileName: Ie.name || "jiaren-asset.png",', '          fileName: JiarenAssetDownloadName(Ie, "jiaren-asset"),\n          mimeType: JiarenAssetMime(Ie),', "image context download name");
  source = replaceOnce(source, '                              fileName: "jiaren-preview.png",', '                              fileName: JiarenAssetDownloadName(ct, "jiaren-preview"),\n                              mimeType: JiarenAssetMime(ct),', "image preview download name");
  source = source.replace('      localPath: t.localPath,\n      assetId: t.id,\n      width:', '      localPath: t.localPath,\n      mimeType: t.mimeType || JiarenAssetMime(t),\n      name: t.name,\n      assetId: t.id,\n      width:');
  patchMenu(source, file);
}

function patchMenu(source, file) {
  const menuStart = source.indexOf('        Ie && Et\n          ? o.jsxs("div", {\n              className: "image-selection-popover"');
  const menuEnd = source.indexOf('        jiarenBatchPanel\n', menuStart);
  if (menuStart < 0 || menuEnd < 0) throw new Error("Missing image menu range.");
  let menu = source.slice(menuStart, menuEnd);
  menu = menu.replace(/\n\s*o\.jsxs\("button", \{\n\s*type: "button",\n\s*title: "打开更多图片工具",[\s\S]*?\n\s*\}\),\n\s*jiarenImageToolsExpanded \? o\.jsxs\(o\.Fragment, \{ children: \[/, "\n");
  menu = menu.replace(/\n\s*\]\}\) : null,\n\s*o\.jsx\("button", \{\n\s*type: "button",\n\s*title: "下载",/, '\n                o.jsx("button", {\n                  type: "button",\n                  title: "下载",');
  if (/打开更多图片工具|jiarenImageToolsExpanded \? o\.jsxs\(o\.Fragment/.test(menu)) throw new Error("Image menu remains collapsed.");
  const downloadNeedle = '                o.jsx("button", {\n                  type: "button",\n                  title: "下载",';
  if (!menu.includes(downloadNeedle)) throw new Error("Missing image download button in menu.");
  const shareButton = `                o.jsxs("button", {
                  type: "button",
                  title: "分享到社区",
                  className: "jc-community-context-item",
                  onClick: () => {
                    const sourceUrl = Ie.source || Ie.dataUrl || Ie.localPath;
                    if (!sourceUrl || !window.JiarenCommunity?.openShare) {
                      W("创作者社区暂未加载，请稍后重试。");
                      return;
                    }
                    window.JiarenCommunity.openShare({
                      type: Ie.kind === "video" ? "video" : "image",
                      url: sourceUrl,
                      mimeType: JiarenAssetMime(Ie),
                      fileName: JiarenAssetDownloadName(Ie, "jiaren-community"),
                      title: Ie.name || "Jiaren AI 作品",
                      prompt: Ie.prompt || "",
                      model: Ie.modelAlias || Ie.modelId || "",
                      width: Ie.width,
                      height: Ie.height,
                      nodeType: Ie.kind || "image",
                    });
                    ce(void 0);
                  },
                  children: [o.jsx(La, { size: 15 }), "分享到社区"],
                }),
`;
  menu = menu.replace(downloadNeedle, shareButton + downloadNeedle);
  source = source.slice(0, menuStart) + menu + source.slice(menuEnd);
  source += "\n/* Jiaren SVG-aware image tool downloads v112 */\n";
  write(file, source);
}

function patchHistory() {
  const file = "dist/assets/main-BvGlsrDH.js";
  let source = read(file);
  if (source.includes("Jiaren history MIME-preserving downloads v112")) return;
  source = replaceOnce(source, 'function Or(n, i) {\n  return `jiaren_${new Date(n.createdAt).toISOString().replace(/\\D/g, "").slice(0, 14) || Date.now()}_${i + 1}.${n.assetType === "video" ? "mp4" : "png"}`;\n}', `function Or(n, i) {
  const mime = String(n.mimeType || "").split(";")[0].toLowerCase();
  const extension = n.assetType === "video" ? "mp4" : mime === "image/svg+xml" ? "svg" : mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png";
  return \`jiaren_\${new Date(n.createdAt).toISOString().replace(/\\D/g, "").slice(0, 14) || Date.now()}_\${i + 1}.\${extension}\`;
}`, "history download name");
  source += "\n/* Jiaren history MIME-preserving downloads v112 */\n";
  write(file, source);
}

function patchBridge() {
  const file = "dist/community/bridge.js";
  let source = read(file);
  if (source.includes("Jiaren native image menu share dedupe v112")) return;
  source = replaceOnce(source, '      if (nativeMenu) {\n        nativeMenu.append(createShareItem(draft));\n        return;\n      }', '      if (nativeMenu) {\n        if (!nativeMenu.querySelector(".jc-community-context-item")) nativeMenu.append(createShareItem(draft));\n        return;\n      }', "community menu share dedupe");
  source += "\n/* Jiaren native image menu share dedupe v112 */\n";
  write(file, source);
}

function patchCss() {
  const file = "dist/assets/jiaren-dark-lime-20260728.css";
  let source = read(file);
  if (source.includes("Jiaren complete image menu v112")) return;
  source = source.replace("width: min(500px, calc(100vw - 24px)) !important;", "width: min(438px, calc(100vw - 24px)) !important;");
  source += `

/* Jiaren complete image menu v112 */
#root .canvas-app-shell .image-selection-popover .jc-community-context-item {
  order: 1 !important;
  border-color: rgba(199, 255, 61, 0.58) !important;
  color: #c7ff3d !important;
  background: rgba(199, 255, 61, 0.08) !important;
}
#root .canvas-app-shell .image-selection-popover .jc-community-context-item:hover {
  background: rgba(199, 255, 61, 0.16) !important;
}
`;
  write(file, source);
}

patchMain();
patchCanvas();
patchHistory();
patchBridge();
patchCss();
console.log("Restored the complete image menu and MIME-preserving SVG downloads.");
