"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const mainSource = fs.readFileSync(path.join(projectRoot, "dist-electron", "electron", "main.js"), "utf8");
const preloadSource = fs.readFileSync(path.join(projectRoot, "dist-electron", "electron", "preload.js"), "utf8");
const rendererSource = fs.readFileSync(path.join(projectRoot, "dist", "assets", "main-BvGlsrDH.js"), "utf8");
const builderSource = fs.readFileSync(path.join(projectRoot, "electron-builder-v019.cjs"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));

assert.equal(packageJson.version, "1.1.2");
assert.match(mainSource, /app\.getPath\("userData"\)/);
assert.match(mainSource, /const legacyWritableRoot = portableRoot/);
assert.match(mainSource, /for \(const directoryName of \["\.jiaren", "\.project"\]\)/);
assert.match(mainSource, /cpSync\)\(source, target/);
assert.match(mainSource, /force: false/);
assert.match(mainSource, /const preferencesPath = .*"preferences\.json"/);
assert.match(mainSource, /function findLegacyPreferencesWithApiKey\(\)/);
assert.match(mainSource, /function bundledRuntimePath\(\.\.\.segments\)/);
assert.match(mainSource, /system:listSavedProjects/);
assert.match(mainSource, /system:loadSavedProject/);
assert.match(mainSource, /system:deleteSavedProject/);
assert.match(mainSource, /system:startNewProject/);
assert.match(mainSource, /projectManifestName = "jiaren-project\.json"/);
assert.match(preloadSource, /listSavedProjects/);
assert.match(preloadSource, /loadSavedProject/);
assert.match(preloadSource, /deleteSavedProject/);
assert.match(preloadSource, /startNewProject/);
assert.match(rendererSource, /explicitSave/);
assert.match(builderSource, /data\/\*\*\/\*/);
assert.match(builderSource, /\.agents\/\*\*\/\*/);
assert.match(builderSource, /jiaren-local-service\/\*\*\/\*/);
assert.match(builderSource, /python\/\*\*\/\*/);
assert.match(builderSource, /tools\/\*\*\/\*/);
assert.match(builderSource, /node_modules\/onnxruntime-node\/\*\*\/\*/);
assert.match(builderSource, /node_modules\/sharp\/\*\*\/\*/);
assert.match(builderSource, /node_modules\/ffmpeg-static\/\*\*\/\*/);
assert.match(builderSource, /requiredPath\(buildRoot, "rmbg2"\)/);
assert.match(builderSource, /requiredPath\(buildRoot, "upscayl"\)/);
assert.match(builderSource, /requiredPath\(projectDir, "jiaren-local-service"\)/);
assert.match(builderSource, /requiredPath\(projectDir, "\.agents"\)/);
assert.match(builderSource, /JIAREN_ELECTRON_DIST/);

console.log("Jiaren AI 1.1.2 configuration persistence and package manifest checks passed.");
