const fs = require("node:fs");
const path = require("node:path");

const projectDir = __dirname;

function findToolRoot() {
  const candidates = [
    process.env.JIAREN_BUILDER_ROOT,
    path.resolve(projectDir, "..", ".h-source"),
    process.env.USERPROFILE && path.join(
      process.env.USERPROFILE,
      "Documents",
      "jiareAI\u65e0\u7ebf\u753b\u5e03",
      ".h-source",
    ),
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(path.join(candidate, "node_modules", "electron-builder")));
  if (!found) throw new Error(`Cannot locate Jiaren build tools. Checked: ${candidates.join(", ")}`);
  return found;
}

function requiredPath(...segments) {
  const resolved = path.join(...segments);
  if (!fs.existsSync(resolved)) throw new Error(`Required macOS build input is missing: ${resolved}`);
  return resolved;
}

const toolRoot = findToolRoot();
const buildRoot = requiredPath(projectDir, "build");
const macUpscaylRoot = requiredPath(buildRoot, "upscayl", "macos");

module.exports = {
  appId: "com.jiaren.ai.canvas",
  productName: "Jiaren AI",
  electronVersion: "33.2.1",
  asar: true,
  npmRebuild: false,
  nodeGypRebuild: false,
  buildDependenciesFromSource: false,
  directories: {
    output: path.join(projectDir, "release-v111-macos"),
    buildResources: buildRoot,
  },
  files: [
    "dist/**/*",
    "dist-electron/**/*",
    "data/**/*",
    ".agents/**/*",
    "jiaren-local-service/**/*",
    "python/**/*",
    "tools/**/*",
    "shared/**/*",
    "docs/**/*",
    "LICENSE",
    "package.json",
    "node_modules/onnxruntime-node/**/*",
    "node_modules/onnxruntime-common/**/*",
    "node_modules/adm-zip/**/*",
    "node_modules/global-agent/**/*",
    "node_modules/boolean/**/*",
    "node_modules/es6-error/**/*",
    "node_modules/matcher/**/*",
    "node_modules/roarr/**/*",
    "node_modules/serialize-error/**/*",
    "node_modules/semver/**/*",
    "node_modules/sharp/**/*",
    "node_modules/@img/sharp-darwin-*/**/*",
    "node_modules/@img/sharp-libvips-darwin-*/**/*",
    "node_modules/detect-libc/**/*",
    "node_modules/ffmpeg-static/**/*",
    "node_modules/ag-psd/**/*",
    "node_modules/base64-js/**/*",
    "node_modules/pako/**/*",
    "node_modules/sql.js/**/*",
    "!**/.codex{,/**}",
    "!**/auth.json",
    "!**/credentials.json",
    "!**/cookies.json",
    "!**/cookies.sqlite",
    "!**/.env",
    "!**/.env.*",
    "!node_modules/ffmpeg-static/ffmpeg.exe",
    "!node_modules/ffmpeg-static/ffmpeg.exe.*",
    "!node_modules/onnxruntime-node/bin/napi-v6/win32{,/**}",
    "!node_modules/@img/sharp-win32-*/**/*",
    "!node_modules/@img/sharp-libvips-win32-*/**/*",
  ],
  extraResources: [
    { from: requiredPath(buildRoot, "sql-wasm.wasm"), to: "sql-wasm.wasm" },
    { from: requiredPath(buildRoot, "rmbg2"), to: "rmbg2" },
    { from: macUpscaylRoot, to: "upscayl" },
    { from: requiredPath(projectDir, "data"), to: "data" },
    { from: requiredPath(projectDir, ".agents"), to: ".agents" },
    { from: requiredPath(projectDir, "jiaren-local-service"), to: "jiaren-local-service" },
    { from: requiredPath(projectDir, "python"), to: "python" },
    { from: requiredPath(projectDir, "tools"), to: "tools" },
    { from: requiredPath(projectDir, "shared"), to: "shared" },
  ],
  asarUnpack: [
    "node_modules/onnxruntime-node/**/*",
    "node_modules/sharp/**/*",
    "node_modules/@img/**/*",
    "node_modules/detect-libc/**/*",
    "node_modules/semver/**/*",
    "node_modules/ffmpeg-static/ffmpeg",
    "node_modules/ag-psd/**/*",
  ],
  mac: {
    target: ["zip"],
    category: "public.app-category.graphics-design",
    icon: requiredPath(buildRoot, "jiaren-logo-source.png"),
    identity: null,
    hardenedRuntime: false,
    gatekeeperAssess: false,
    darkModeSupport: true,
    artifactName: "Jiaren-AI-1.1.1-macOS-${arch}.${ext}",
  },
};
