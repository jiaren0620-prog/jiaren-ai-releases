"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const script = fs.readFileSync(path.join(root, "dist", "assets", "jiaren-global-service-0720.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "dist", "assets", "jiaren-global-service-0720.css"), "utf8");
const preload = fs.readFileSync(path.join(root, "dist-electron", "electron", "preload.js"), "utf8");
const main = fs.readFileSync(path.join(root, "dist-electron", "electron", "main.js"), "utf8");

assert.ok(script.includes('class="jg-update-progress"'), "Updater progress markup is missing");
assert.ok(script.includes("onUpdateDownloadProgress"), "Renderer does not subscribe to update progress");
assert.ok(script.includes("smoothedSpeed"), "Download speed calculation is missing");
assert.ok(script.includes("formatDuration"), "Remaining-time calculation is missing");
assert.ok(script.includes("正在校验"), "Verification-stage feedback is missing");
const cdnSource = "https://cdn.jiaren.xyz/updates/latest.json";
const githubSource = "https://raw.githubusercontent.com/jiaren0620-prog/jiaren-ai-releases/main/latest.json";
assert.ok(script.includes(cdnSource), "Updater does not read Hong Kong CDN metadata");
assert.ok(script.includes(githubSource), "Updater does not retain GitHub fallback metadata");
assert.ok(script.indexOf(cdnSource) < script.indexOf(githubSource), "Hong Kong CDN is not the primary update source");
assert.ok(script.includes("for (const source of UPDATE_SOURCES)"), "Updater source fallback loop is missing");
assert.ok(script.includes("cache: 'no-store'"), "Update metadata is not cache-busted");
assert.ok(!script.includes("api.jiaren.xyz/v1"), "Updater still depends on the legacy update server");
assert.ok(styles.includes("/* Jiaren v0.1.9 updater progress */"), "Updater progress styles are missing");
assert.ok(styles.includes("--jg-update-progress"), "Progress fill state is not styled");
assert.ok(preload.includes('onUpdateDownloadProgress'), "Preload progress bridge is missing");
assert.ok(main.includes('system:updateDownloadProgress'), "Main process progress events are missing");

console.log("Updater progress UI checks passed.");
