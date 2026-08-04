"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const releaseRoot = path.resolve(projectRoot, "release-v113");

const localProtectionPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v112-local-protection.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (localProtectionPatch.error || localProtectionPatch.status !== 0) {
  console.error(localProtectionPatch.error || "Failed to apply local application protection.");
  process.exit(localProtectionPatch.status ?? 1);
}

const iconGeneration = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "generate-windows-icon.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (iconGeneration.error || iconGeneration.status !== 0) {
  console.error(iconGeneration.error || "Failed to generate the Jiaren Windows icon.");
  process.exit(iconGeneration.status ?? 1);
}

function temporarilyEnableLargeAddressAwareNsis() {
  const localAppData = process.env.LOCALAPPDATA;
  if (!localAppData) return () => {};
  const candidates = [
    path.join(localAppData, "electron-builder", "Cache", "nsis", "nsis-3.0.4.1", "Bin", "makensis.exe"),
    path.join(localAppData, "electron-builder", "Cache", "nsis-3.0.4.1", "Bin", "makensis.exe"),
  ];
  const compilerPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!compilerPath) return () => {};

  const binary = fs.readFileSync(compilerPath);
  const peOffset = binary.readUInt32LE(0x3c);
  const characteristicsOffset = peOffset + 22;
  const characteristics = binary.readUInt16LE(characteristicsOffset);
  if ((characteristics & 0x20) !== 0) return () => {};

  const writeCharacteristics = (value) => {
    const word = Buffer.allocUnsafe(2);
    word.writeUInt16LE(value, 0);
    const handle = fs.openSync(compilerPath, "r+");
    try {
      fs.writeSync(handle, word, 0, word.length, characteristicsOffset);
    } finally {
      fs.closeSync(handle);
    }
  };

  writeCharacteristics(characteristics | 0x20);
  console.log(`Temporarily enabled Large Address Aware for ${compilerPath}`);
  return () => {
    writeCharacteristics(characteristics);
    console.log("Restored the NSIS compiler PE flags.");
  };
}

const designAgentPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-design-agent-image-only.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (designAgentPatch.error || designAgentPatch.status !== 0) {
  console.error(designAgentPatch.error || "Failed to apply the Design Agent image-only planning patch.");
  process.exit(designAgentPatch.status ?? 1);
}

const connectedOutputPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v019-connected-design-output-and-update-progress.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (connectedOutputPatch.error || connectedOutputPatch.status !== 0) {
  console.error(connectedOutputPatch.error || "Failed to apply the connected Design Agent output and updater progress patch.");
  process.exit(connectedOutputPatch.status ?? 1);
}

const imageParameterPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v019-image-parameter-stability.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (imageParameterPatch.error || imageParameterPatch.status !== 0) {
  console.error(imageParameterPatch.error || "Failed to apply the image parameter stability patch.");
  process.exit(imageParameterPatch.status ?? 1);
}

const videoSingleOpenPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v019-video-single-open.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (videoSingleOpenPatch.error || videoSingleOpenPatch.status !== 0) {
  console.error(videoSingleOpenPatch.error || "Failed to apply the single video editor patch.");
  process.exit(videoSingleOpenPatch.status ?? 1);
}

const transparentImagePatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v019-transparent-image-fallback.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (transparentImagePatch.error || transparentImagePatch.status !== 0) {
  console.error(transparentImagePatch.error || "Failed to apply the transparent image fallback patch.");
  process.exit(transparentImagePatch.status ?? 1);
}

const darkNodeThemePatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v019-dark-node-theme.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (darkNodeThemePatch.error || darkNodeThemePatch.status !== 0) {
  console.error(darkNodeThemePatch.error || "Failed to apply the dark node theme patch.");
  process.exit(darkNodeThemePatch.status ?? 1);
}

const seedanceSkillsPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v019-seedance-skills.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (seedanceSkillsPatch.error || seedanceSkillsPatch.status !== 0) {
  console.error(seedanceSkillsPatch.error || "Failed to apply the Seedance skills patch.");
  process.exit(seedanceSkillsPatch.status ?? 1);
}

const runtimeHardeningPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v019-runtime-hardening-and-codex.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (runtimeHardeningPatch.error || runtimeHardeningPatch.status !== 0) {
  console.error(runtimeHardeningPatch.error || "Failed to apply runtime hardening and Codex canvas integration patch.");
  process.exit(runtimeHardeningPatch.status ?? 1);
}

const agentImageResultsPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v112-agent-image-results.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (agentImageResultsPatch.error || agentImageResultsPatch.status !== 0) {
  console.error(agentImageResultsPatch.error || "Failed to apply the Jiaren Agent image-only result patch.");
  process.exit(agentImageResultsPatch.status ?? 1);
}

const agentImageFailoverPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v112-agent-image-failover.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (agentImageFailoverPatch.error || agentImageFailoverPatch.status !== 0) {
  console.error(agentImageFailoverPatch.error || "Failed to apply the Jiaren Agent image model failover patch.");
  process.exit(agentImageFailoverPatch.status ?? 1);
}

const capacityQueueMenuPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v112-capacity-queue-menu.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (capacityQueueMenuPatch.error || capacityQueueMenuPatch.status !== 0) {
  console.error(capacityQueueMenuPatch.error || "Failed to apply the Codex capacity, image queue, and image menu patch.");
  process.exit(capacityQueueMenuPatch.status ?? 1);
}

const grsaiTerminalPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v112-grsai-terminal.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (grsaiTerminalPatch.error || grsaiTerminalPatch.status !== 0) {
  console.error(grsaiTerminalPatch.error || "Failed to verify Grsai terminal image handling.");
  process.exit(grsaiTerminalPatch.status ?? 1);
}

const channelModelPersistencePatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v112-channel-model-persistence.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (channelModelPersistencePatch.error || channelModelPersistencePatch.status !== 0) {
  console.error(channelModelPersistencePatch.error || "Failed to preserve Jiaren channel models during catalog refresh.");
  process.exit(channelModelPersistencePatch.status ?? 1);
}

const agentModeBoundariesPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v112-agent-mode-boundaries.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (agentModeBoundariesPatch.error || agentModeBoundariesPatch.status !== 0) {
  console.error(agentModeBoundariesPatch.error || "Failed to isolate Jiaren Agent from the custom channel manager.");
  process.exit(agentModeBoundariesPatch.status ?? 1);
}

const codexVectorOutputPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v112-codex-vector-output.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (codexVectorOutputPatch.error || codexVectorOutputPatch.status !== 0) {
  console.error(codexVectorOutputPatch.error || "Failed to add direct local Codex SVG output.");
  process.exit(codexVectorOutputPatch.status ?? 1);
}

const codexRasterCanvasGuard = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v112-codex-raster-canvas-guard.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (codexRasterCanvasGuard.error || codexRasterCanvasGuard.status !== 0) {
  console.error(codexRasterCanvasGuard.error || "Failed to verify Codex raster-image canvas routing.");
  process.exit(codexRasterCanvasGuard.status ?? 1);
}

const svgDownloadAndImageToolsPatch = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts", "patch-v112-svg-download-and-image-tools.cjs")],
  { cwd: projectRoot, stdio: "inherit" },
);
if (svgDownloadAndImageToolsPatch.error || svgDownloadAndImageToolsPatch.status !== 0) {
  console.error(svgDownloadAndImageToolsPatch.error || "Failed to restore SVG downloads and the complete image context menu.");
  process.exit(svgDownloadAndImageToolsPatch.status ?? 1);
}

if (path.dirname(releaseRoot) !== projectRoot || path.basename(releaseRoot) !== "release-v113") {
  console.error(`Refusing to clean an unexpected release directory: ${releaseRoot}`);
  process.exit(1);
}
fs.rmSync(releaseRoot, { recursive: true, force: true });

const candidates = [
  process.env.JIAREN_BUILDER_ROOT,
  path.resolve(projectRoot, "..", ".h-source"),
  process.env.USERPROFILE && path.join(
    process.env.USERPROFILE,
    "Documents",
    "jiareAI\u65e0\u7ebf\u753b\u5e03",
    ".h-source",
  ),
].filter(Boolean);

const toolRoot = candidates.find((candidate) => fs.existsSync(path.join(candidate, "node_modules", "electron-builder")));
if (!toolRoot) {
  console.error(`Cannot locate Jiaren build tools. Checked: ${candidates.join(", ")}`);
  process.exit(1);
}

const sourceElectronDist = path.join(toolRoot, "node_modules", "electron", "dist");
const cleanElectronDist = path.resolve(projectRoot, "build", "electron-dist-clean");
const expectedBuildRoot = path.resolve(projectRoot, "build");
const packageTempRoot = path.resolve(expectedBuildRoot, "package-temp-v113");
if (path.dirname(cleanElectronDist) !== expectedBuildRoot || path.basename(cleanElectronDist) !== "electron-dist-clean") {
  console.error(`Refusing to clean an unexpected Electron staging directory: ${cleanElectronDist}`);
  process.exit(1);
}
if (path.dirname(packageTempRoot) !== expectedBuildRoot || path.basename(packageTempRoot) !== "package-temp-v113") {
  console.error(`Refusing to clean an unexpected package temp directory: ${packageTempRoot}`);
  process.exit(1);
}
fs.rmSync(cleanElectronDist, { recursive: true, force: true });
fs.mkdirSync(cleanElectronDist, { recursive: true });
fs.rmSync(packageTempRoot, { recursive: true, force: true });
fs.mkdirSync(packageTempRoot, { recursive: true });
for (const entry of fs.readdirSync(sourceElectronDist, { withFileTypes: true })) {
  if (entry.name.startsWith(".") || /^qa-/i.test(entry.name)) continue;
  fs.cpSync(
    path.join(sourceElectronDist, entry.name),
    path.join(cleanElectronDist, entry.name),
    { recursive: true, force: true },
  );
}
if (!fs.existsSync(path.join(cleanElectronDist, "electron.exe"))) {
  console.error(`Clean Electron runtime is incomplete: ${cleanElectronDist}`);
  process.exit(1);
}

const cliPath = path.join(toolRoot, "node_modules", "electron-builder", "out", "cli", "cli.js");
const restoreNsisCompiler = temporarilyEnableLargeAddressAwareNsis();
let result;
try {
  result = spawnSync(
    process.execPath,
    [cliPath, "--config", "electron-builder-v019.cjs", "--win", "nsis", "--x64"],
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        JIAREN_BUILDER_ROOT: toolRoot,
        JIAREN_ELECTRON_DIST: cleanElectronDist,
        TEMP: packageTempRoot,
        TMP: packageTempRoot,
      },
      stdio: "inherit",
    },
  );
} finally {
  restoreNsisCompiler();
  fs.rmSync(packageTempRoot, { recursive: true, force: true });
}

if (result.error) {
  console.error(result.error);
  process.exit(1);
}
process.exit(result.status ?? 1);
