"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const targetPath = path.join(projectRoot, "dist-electron", "electron", "main.js");
const marker = "// Jiaren v0.1.9 transparent image fallback";
let source = fs.readFileSync(targetPath, "utf8");

if (source.includes(marker)) {
  console.log("Transparent image fallback is already applied.");
  process.exit(0);
}

const rawAnchor = "async function generateImageV2(request) {";
if (!source.includes(rawAnchor)) {
  throw new Error("generateImageV2 anchor not found.");
}
source = source.replace(rawAnchor, "async function generateImageV2Raw(request) {");

const wrapper = `${marker}
async function imageBufferHasUsefulAlpha(sourceBuffer) {
  try {
    const sharp = await importSharp();
    const { data, info } = await sharp(sourceBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (!info || info.channels < 4) return false;
    const pixelCount = Math.floor(data.length / info.channels);
    let transparentPixels = 0;
    let clearPixels = 0;
    for (let index = 3; index < data.length; index += info.channels) {
      if (data[index] < 250) transparentPixels += 1;
      if (data[index] < 32) clearPixels += 1;
    }
    return transparentPixels >= Math.max(8, Math.floor(pixelCount * 0.001))
      || clearPixels >= Math.max(4, Math.floor(pixelCount * 0.0002));
  } catch (error) {
    appendStartupLog(\`transparent-alpha-check-error=\${error instanceof Error ? error.message : String(error)}\`);
  }
  return false;
}
async function sourceBufferForImageAsset(asset) {
  if (asset?.localPath && (0, node_fs_1.existsSync)(asset.localPath)) {
    return (0, node_fs_1.readFileSync)(asset.localPath);
  }
  if (typeof asset?.dataUrl === "string" && asset.dataUrl.startsWith("data:")) {
    return parseDataUrl(asset.dataUrl).bytes;
  }
  return void 0;
}
async function ensureTransparentImageAssets(assets, request) {
  const nextAssets = [];
  let applied = 0;
  let failed = 0;
  for (const asset of assets) {
    if (asset?.type !== "image") {
      nextAssets.push(asset);
      continue;
    }
    const sourceBuffer = await sourceBufferForImageAsset(asset);
    if (!sourceBuffer || await imageBufferHasUsefulAlpha(sourceBuffer)) {
      nextAssets.push(asset);
      continue;
    }
    try {
      const transparentAsset = await removeBackgroundWithBundledModel(sourceBuffer, {
        ...request,
        outputFormat: "png",
        crop: false,
        border: 0,
      });
      if (transparentAsset) {
        nextAssets.push({
          ...asset,
          ...transparentAsset,
          id: asset.id || transparentAsset.id,
          type: "image",
          mimeType: "image/png",
        });
        applied += 1;
      } else {
        nextAssets.push(asset);
        failed += 1;
      }
    } catch (error) {
      nextAssets.push(asset);
      failed += 1;
      appendStartupLog(\`transparent-fallback-error=\${error instanceof Error ? error.message : String(error)}\`);
    }
  }
  return { assets: nextAssets, applied, failed };
}
async function generateImageV2(request) {
  const result = await generateImageV2Raw(request);
  if (request?.background !== "transparent" || !Array.isArray(result?.assets) || result.assets.length === 0) {
    return result;
  }
  const normalized = await ensureTransparentImageAssets(result.assets, request);
  let message = result.message;
  if (normalized.applied > 0) {
    message = \`${"${message || \"图片生成完成。\"}"} 已按透明底要求使用 JiarenAI 本地 Alpha 兜底处理。\`;
  }
  if (normalized.failed > 0) {
    message = \`${"${message || \"图片生成完成。\"}"} 有 \${normalized.failed} 张图片未能生成可靠透明蒙版，已保留原图。\`;
  }
  return { ...result, assets: normalized.assets, message };
}
`;
const nextAnchor = "async function reverseAnalyze(request) {";
if (!source.includes(nextAnchor)) {
  throw new Error("generateImageV2 wrapper insertion anchor not found.");
}
source = source.replace(nextAnchor, `${wrapper}${nextAnchor}`);
fs.writeFileSync(targetPath, source, "utf8");
console.log("Applied real-alpha transparent image fallback.");
