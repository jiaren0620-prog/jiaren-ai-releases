"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const bundlePath = path.join(projectRoot, "dist", "assets", "DesignAgentPanel-DdUMLKSc.js");
const source = fs.readFileSync(bundlePath, "utf8");

const patchMarker = "/* jiaren:image-only-design-planning */";
const planningStart = source.indexOf(patchMarker);
const guardEndMarker = "return}if(!e||!k(e))";
const guardEnd = source.indexOf(guardEndMarker, planningStart + patchMarker.length);

const failures = [];
function expect(condition, message) {
  if (!condition) failures.push(message);
}

expect(planningStart >= 0, "image-only Design Agent patch marker is missing");
expect(source.includes('summary:"仅调用图片模型"'), "image-only workflow status is missing");
expect(source.includes('u("方案与提示词已在本地生成；出图时只调用当前选择的图片模型。")'), "image-only completion notice is missing");
expect(source.includes('const o=V(i,v.id);'), "generation no longer resolves credentials from the selected image model");
expect(source.includes('baseUrl:o.baseUrl,apiKey:o.apiKey'), "generation no longer sends the selected image model credentials");
expect(source.includes('endpointModelId:v.endpointModelId'), "generation no longer sends the selected provider model id");
expect(source.includes('count:1'), "Design Agent image count must remain one");
expect(guardEnd > planningStart, "legacy planning block was not retained behind the image-only return guard");

const patchedBlock = source.slice(planningStart, guardEnd + "return}".length);
expect(!patchedBlock.includes("Ue.chat"), "image-only planning block still calls the chat runtime");
expect(!patchedBlock.includes("await ze("), "image-only planning block still calls the legacy LLM planner");
expect(patchedBlock.endsWith("return}"), "image-only planning does not return before the legacy chat planner");

if (failures.length) {
  console.error(`Design Agent image-only checks failed: ${failures.length}`);
  failures.forEach((failure) => console.error(`  FAIL ${failure}`));
  process.exit(1);
}

console.log("Design Agent image-only checks passed: local planning uses no chat API and generation keeps the selected image provider route.");
