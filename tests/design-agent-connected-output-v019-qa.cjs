"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const mainBundle = fs.readFileSync(path.join(root, "dist", "assets", "main-BvGlsrDH.js"), "utf8");
const designBundle = fs.readFileSync(path.join(root, "dist", "assets", "DesignAgentPanel-DdUMLKSc.js"), "utf8");

assert.ok(mainBundle.includes('onAddCanvasAsset: (JiarenDesignAsset) => {'), "Design Agent still uses the raw canvas-layer callback");
assert.ok(mainBundle.includes('kind: "imageInput"'), "Design Agent output does not create a connectable image node");
assert.ok(mainBundle.includes('sourceAgent: "design-agent"'), "Design Agent node provenance is missing");
assert.ok(mainBundle.includes('ze(JiarenDesignNode.id)'), "Generated image node is not selected after insertion");
assert.ok(mainBundle.includes('可保存、可连线节点'), "Connected output confirmation is missing");
assert.ok(designBundle.includes('mimeType:e.mimeType||"image/png",prompt:e.prompt,modelId:e.modelId,modelAlias:e.modelAlias'), "Generated image metadata is not forwarded to the canvas node");
assert.ok(designBundle.includes('Re({...$,prompt:oe||r.prompt,modelId:v.id,modelAlias:v.alias||v.modelId||v.id}'), "Prompt and model metadata are not attached to the generated output");

console.log("Design Agent connected output checks passed.");
