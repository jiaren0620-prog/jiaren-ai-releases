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
  if (!found) {
    throw new Error(`Cannot locate Jiaren build tools. Checked: ${candidates.join(", ")}`);
  }
  return found;
}

const toolRoot = findToolRoot();

function requiredPath(...segments) {
  const resolved = path.join(...segments);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Required build input is missing: ${resolved}`);
  }
  return resolved;
}

const buildRoot = requiredPath(projectDir, "build");
const nodeModulesRoot = requiredPath(toolRoot, "node_modules");

module.exports = {
  appId: "com.jiaren.ai.canvas",
  productName: "Jiaren AI",
  electronVersion: "33.2.1",
  electronDist: requiredPath(process.env.JIAREN_ELECTRON_DIST || path.join(nodeModulesRoot, "electron", "dist")),
  asar: true,
  npmRebuild: false,
  nodeGypRebuild: false,
  buildDependenciesFromSource: false,
  directories: {
    output: path.join(projectDir, "release-v112"),
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
    "plugins/**/*",
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
    "node_modules/@img/**/*",
    "node_modules/detect-libc/**/*",
    "node_modules/ffmpeg-static/**/*",
    "node_modules/ag-psd/**/*",
    "node_modules/base64-js/**/*",
    "node_modules/pako/**/*",
    "node_modules/sql.js/**/*",
    "node_modules/ws/**/*",
    "!**/.codex{,/**}",
    "!**/auth.json",
    "!**/credentials.json",
    "!**/cookies.json",
    "!**/cookies.sqlite",
    "!**/.env",
    "!**/.env.*",
  ],
  extraResources: [
    { from: requiredPath(buildRoot, "sql-wasm.wasm"), to: "sql-wasm.wasm" },
    { from: requiredPath(buildRoot, "rmbg2"), to: "rmbg2" },
    { from: requiredPath(buildRoot, "upscayl"), to: "upscayl" },
    { from: requiredPath(projectDir, "data"), to: "data" },
    { from: requiredPath(projectDir, ".agents"), to: ".agents" },
    { from: requiredPath(projectDir, "jiaren-local-service"), to: "jiaren-local-service" },
    { from: requiredPath(projectDir, "python"), to: "python" },
    { from: requiredPath(projectDir, "tools"), to: "tools" },
    { from: requiredPath(projectDir, "plugins"), to: "plugins" },
    { from: requiredPath(projectDir, "shared"), to: "shared" },
  ],
  asarUnpack: [
    "node_modules/onnxruntime-node/**/*",
    "node_modules/sharp/**/*",
    "node_modules/@img/**/*",
    "node_modules/detect-libc/**/*",
    "node_modules/semver/**/*",
    "node_modules/ffmpeg-static/ffmpeg.exe",
    "node_modules/ag-psd/**/*",
  ],
  win: {
    icon: requiredPath(buildRoot, "icon.ico"),
    target: ["nsis"],
    sign: false,
  },
  nsis: {
    include: requiredPath(buildRoot, "installer.nsh"),
    artifactName: "Jiaren-AI-Setup-1.1.2-x64.${ext}",
    oneClick: false,
    perMachine: false,
    allowElevation: false,
    allowToChangeInstallationDirectory: false,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "Jiaren AI",
    deleteAppDataOnUninstall: false,
    installerIcon: requiredPath(buildRoot, "icon.ico"),
    installerHeaderIcon: requiredPath(buildRoot, "icon.ico"),
    uninstallerIcon: requiredPath(buildRoot, "icon.ico"),
  },
};
