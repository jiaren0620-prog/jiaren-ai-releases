"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const siteRoot = path.join(root, "deploy", "win-site-v019");
const html = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
const script = fs.readFileSync(path.join(siteRoot, "script.js"), "utf8");
const styles = fs.readFileSync(path.join(siteRoot, "styles.css"), "utf8");
const configSource = fs.readFileSync(path.join(siteRoot, "download.config.js"), "utf8");

const sandbox = { window: {} };
vm.runInNewContext(configSource, sandbox);
const downloads = sandbox.window.JIAREN_DOWNLOADS;

assert.equal(downloads.version, "1.1.1");
assert.equal(downloads.windows.sha256, "F48E04D3FB93E621D2B5F6ABC124874A673B209133BE22D7BD3834A0DCF1F7B7");
assert.equal(downloads.macos.arm64.sha256, "5AF33836F5D7130A13EEF64B7A239A44E5A46E9180BECCF2F294CC7E2BF3E49C");
assert.equal(downloads.macos.x64.sha256, "CA36F916C15DD154E7D6683AD93A5880CCFE8806F55313CDC0CF4774FE6288F4");
assert.match(downloads.macos.arm64.url, /Jiaren-AI-1\.1\.1-macOS-arm64\.zip$/);
assert.match(downloads.macos.x64.url, /Jiaren-AI-1\.1\.1-macOS-x64\.zip$/);
assert.match(downloads.macos.note, /无需 Xcode/);

assert.equal((html.match(/data-macos-download="arm64"/g) || []).length, 2);
assert.equal((html.match(/data-macos-download="x64"/g) || []).length, 2);
assert.match(html, /Windows 正式安装包 · macOS 完整未签名 ZIP/);
assert.match(html, /Windows x64 · macOS arm64 \/ x64/);
assert.match(html, /styles\.css\?v=20260802-macos-v111/);
assert.match(html, /script\.js\?v=20260802-macos-v111/);

assert.match(script, /data-macos-download/);
assert.match(script, /macDownloads\[arch\]/);
assert.match(script, /data-macos-meta/);
assert.match(styles, /\.mac-download-panel/);
assert.match(styles, /\.platform-download/);
assert.match(styles, /\.final-platform-downloads/);
assert.match(styles, /@media \(max-width: 600px\)/);

console.log("Jiaren AI 1.1.1 macOS download site contracts passed.");
