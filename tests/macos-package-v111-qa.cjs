"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const config = fs.readFileSync(path.join(root, "electron-builder-macos-v111.cjs"), "utf8");
const packager = fs.readFileSync(path.join(root, "scripts", "package-macos-unsigned-v111.cjs"), "utf8");
const zipBuilder = fs.readFileSync(path.join(root, "scripts", "build-macos-zip-v111.py"), "utf8");
const localServer = fs.readFileSync(path.join(root, "dist-electron", "electron", "jiaren-local-server.js"), "utf8");

assert.match(config, /target: \["zip"\]/);
assert.match(config, /identity: null/);
assert.match(config, /hardenedRuntime: false/);
assert.match(config, /gatekeeperAssess: false/);
assert.match(config, /artifactName: "Jiaren-AI-1\.1\.3-macOS-\$\{arch\}\.\$\{ext\}"/);
assert.match(config, /buildRoot, "upscayl", "macos"/);
assert.match(config, /node_modules\/@img\/sharp-darwin-/);
assert.match(config, /node_modules\/ffmpeg-static\/ffmpeg"/);
assert.match(packager, /ffmpeg-darwin-\$\{arch\}/);
assert.match(packager, /@ffmpeg-installer\/darwin-arm64/);
assert.match(packager, /@ffmpeg-installer\/darwin-x64/);
assert.doesNotMatch(packager, /github\.com\/eugeneware\/ffmpeg-static/);
assert.match(packager, /libonnxruntime\.1\.23\.2\.dylib/);
assert.match(packager, /xattr -dr com\.apple\.quarantine/);
assert.match(packager, /codesign --force --deep --sign -/);
assert.match(packager, /prebuiltIcon/);
assert.match(packager, /Missing png2icons and prebuilt macOS icon/);
assert.match(packager, /electron-v\$\{electronVersion\}-darwin-\$\{arch\}\.zip/);
assert.match(packager, /extractAll/);
assert.match(zipBuilder, /APP_NAME = "Jiaren AI"/);
assert.match(zipBuilder, /return 0o100755/);
assert.match(zipBuilder, /external_attr = mode << 16/);
assert.match(zipBuilder, /skip_platform_app_file/);
assert.match(zipBuilder, /sharp-darwin-\{arch\}/);
assert.match(zipBuilder, /ffmpeg-darwin-\{arch\}/);
assert.match(zipBuilder, /onnxruntime-node.*darwin/s);
assert.doesNotMatch(zipBuilder, /elevate\.exe/);
assert.match(localServer, /process\.platform === "win32" \? "ffmpeg\.exe" : "ffmpeg"/);

assert.match(packager, /release-v113/);
assert.match(packager, /Jiaren-AI-1\.1\.3-macOS-\$\{arch\}\.zip/);
console.log("Jiaren AI 1.1.3 unsigned macOS packaging contracts passed.");
