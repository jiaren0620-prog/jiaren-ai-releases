"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const canvasSource = fs.readFileSync(
  path.join(projectRoot, "dist", "assets", "MainCanvasFlow-BbsMxxcM.js"),
  "utf8",
);

test("Agent-only image generation uses the selected configured model without changing manual nodes", () => {
  assert.match(canvasSource, /function jiarenGenerateAgentImage\(request\)/);
  assert.match(canvasSource, /if \(!jiarenIsTransientAgentImage\) return en\.generateImage\(request\)/);
  assert.match(canvasSource, /currentSettings\.models\.filter/);
  assert.match(canvasSource, /\.slice\(0, 1\)/);
  assert.match(canvasSource, /Te = await jiarenGenerateAgentImage\(\{/);
  assert.match(canvasSource, /function jiarenAgentSafeFailureMessage\(value\)/);
  assert.match(canvasSource, /status: "failed",\s*assets: \[\],\s*message: jiarenAgentSafeFailureMessage/);
  assert.doesNotMatch(canvasSource, /result\?\.status === "queued" && result\?\.taskId/);
});

test("Agent image failover diagnostics are redacted", () => {
  const helperStart = canvasSource.indexOf("function jiarenAgentFailureKind");
  const helperEnd = canvasSource.indexOf("function $o", helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart);
  const helper = canvasSource.slice(helperStart, helperEnd);
  const diagnostics = [...helper.matchAll(/console\.(?:info|warn)\("\[Jiaren Agent image failover\]", \{([\s\S]*?)\}\);/g)];
  assert.ok(diagnostics.length >= 4);
  for (const diagnostic of diagnostics) {
    assert.doesNotMatch(diagnostic[1], /model(?:Id|Alias)|provider|baseUrl|apiKey/);
  }
});
