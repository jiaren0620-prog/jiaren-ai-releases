"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const buildRoot = path.join(projectRoot, "build");
const cacheRoot = path.join(buildRoot, "mac-runtime-cache");
const releaseRoot = path.join(projectRoot, "release-v113-macos");

const packageSpecs = [
  ["@img/sharp-darwin-arm64", "0.34.5"],
  ["@img/sharp-libvips-darwin-arm64", "1.2.4"],
  ["@img/sharp-darwin-x64", "0.34.5"],
  ["@img/sharp-libvips-darwin-x64", "1.2.4"],
];

const ffmpegSpecs = {
  arm64: ["@ffmpeg-installer/darwin-arm64", "4.1.5"],
  x64: ["@ffmpeg-installer/darwin-x64", "4.1.0"],
};

const electronVersion = "33.2.1";
const electronSpecs = {
  arm64: `https://cdn.npmmirror.com/binaries/electron/${electronVersion}/electron-v${electronVersion}-darwin-arm64.zip`,
  x64: `https://cdn.npmmirror.com/binaries/electron/${electronVersion}/electron-v${electronVersion}-darwin-x64.zip`,
};

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: projectRoot, stdio: "inherit", ...options });
  if (result.error || result.status !== 0) {
    throw result.error || new Error(`${command} exited with ${result.status}`);
  }
}

function findToolRoot() {
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
  const found = candidates.find((candidate) =>
    fs.existsSync(path.join(candidate, "node_modules", "electron-builder"))
  );
  if (!found) throw new Error(`Cannot locate Jiaren build tools. Checked: ${candidates.join(", ")}`);
  return found;
}

function download(url, destination) {
  const isTarball = destination.endsWith(".tgz");
  const isZip = destination.endsWith(".zip");
  const isValid = () => {
    if (!fs.existsSync(destination) || fs.statSync(destination).size <= 0) return false;
    if (isTarball) {
      const check = spawnSync("tar.exe", ["-tzf", destination], { stdio: "ignore" });
      return !check.error && check.status === 0;
    }
    if (isZip) {
      const check = spawnSync("python", [
        "-c",
        "import sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); sys.exit(1 if z.testzip() else 0)",
        destination,
      ], { stdio: "ignore" });
      return !check.error && check.status === 0;
    }
    return true;
  };
  if (isValid()) return Promise.resolve(destination);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const partial = `${destination}.partial`;
  fs.rmSync(destination, { force: true });
  fs.rmSync(partial, { force: true });
  run("curl.exe", [
    "--fail",
    "--location",
    "--retry", "8",
    "--retry-delay", "3",
    "--connect-timeout", "30",
    "--output", partial,
    url,
  ]);
  fs.renameSync(partial, destination);
  if (!isValid()) {
    fs.rmSync(destination, { force: true });
    throw new Error(`Downloaded package failed integrity check: ${url}`);
  }
  return Promise.resolve(destination);
}

function extractPackage(tarball, destination) {
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(destination, { recursive: true });
  run("tar.exe", ["-xzf", tarball, "--strip-components=1", "-C", destination]);
}

async function prepareNativeDependencies() {
  fs.mkdirSync(cacheRoot, { recursive: true });
  for (const [name, version] of packageSpecs) {
    const simpleName = name.split("/").at(-1);
    const tarball = path.join(cacheRoot, `${simpleName}-${version}.tgz`);
    await download(`https://registry.npmjs.org/${name}/-/${simpleName}-${version}.tgz`, tarball);
    extractPackage(tarball, path.join(projectRoot, "node_modules", ...name.split("/")));
  }

  const packedOrtTarball = path.join(cacheRoot, "npm-pack", "onnxruntime-node-1.23.2.tgz");
  const packedOrtCheck = fs.existsSync(packedOrtTarball)
    ? spawnSync("tar.exe", ["-tzf", packedOrtTarball], { stdio: "ignore" })
    : null;
  const ortTarball = packedOrtCheck && !packedOrtCheck.error && packedOrtCheck.status === 0
    ? packedOrtTarball
    : path.join(cacheRoot, "onnxruntime-node-1.23.2-download.tgz");
  if (ortTarball !== packedOrtTarball) {
    await download(
      "https://registry.npmjs.org/onnxruntime-node/-/onnxruntime-node-1.23.2.tgz",
      ortTarball,
    );
  }
  const ortTemp = path.join(cacheRoot, "onnxruntime-node-1.23.2");
  extractPackage(ortTarball, ortTemp);
  for (const arch of ["arm64", "x64"]) {
    const source = path.join(
      ortTemp,
      "bin",
      "napi-v6",
      "darwin",
      arch,
      "libonnxruntime.1.23.2.dylib",
    );
    const destination = path.join(
      projectRoot,
      "node_modules",
      "onnxruntime-node",
      "bin",
      "napi-v6",
      "darwin",
      arch,
      "libonnxruntime.1.23.2.dylib",
    );
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }

  for (const [arch, [name, version]] of Object.entries(ffmpegSpecs)) {
    const simpleName = name.split("/").at(-1);
    const tarball = path.join(cacheRoot, `${simpleName}-${version}.tgz`);
    const extracted = path.join(cacheRoot, `${simpleName}-${version}`);
    const binary = path.join(cacheRoot, `ffmpeg-darwin-${arch}`);
    await download(`https://registry.npmjs.org/${name}/-/${simpleName}-${version}.tgz`, tarball);
    extractPackage(tarball, extracted);
    fs.copyFileSync(path.join(extracted, "ffmpeg"), binary);
    try { fs.chmodSync(binary, 0o755); } catch {}
  }

  for (const [arch, url] of Object.entries(electronSpecs)) {
    await download(
      url,
      path.join(cacheRoot, `electron-v${electronVersion}-darwin-${arch}.zip`),
    );
  }
}

async function prepareAppSource(toolRoot) {
  const appSource = path.join(cacheRoot, "app-source-v113");
  fs.rmSync(appSource, { recursive: true, force: true });
  fs.mkdirSync(appSource, { recursive: true });
  const asar = require(path.join(toolRoot, "node_modules", "@electron", "asar"));
  const windowsResources = path.join(projectRoot, "release-v113", "win-unpacked", "resources");
  await asar.extractAll(path.join(windowsResources, "app.asar"), appSource);
  fs.cpSync(path.join(windowsResources, "app.asar.unpacked"), appSource, {
    recursive: true,
    force: true,
  });
  return { appSource, windowsResources };
}

function prepareIcon() {
  const prebuiltIcon = path.join(buildRoot, "jiaren.icns");
  const png2iconsRoot = path.join(buildRoot, "mac-packager-tools", "node_modules", "png2icons");
  if (!fs.existsSync(path.join(png2iconsRoot, "package.json"))) {
    if (fs.existsSync(prebuiltIcon) && fs.statSync(prebuiltIcon).size > 1024) return prebuiltIcon;
    throw new Error(`Missing png2icons and prebuilt macOS icon: ${prebuiltIcon}`);
  }
  const png2icons = require(png2iconsRoot);
  const icon = png2icons.createICNS(
    fs.readFileSync(path.join(buildRoot, "jiaren-logo-source.png")),
    png2icons.BICUBIC2,
    0,
  );
  if (!icon) throw new Error("Failed to generate Jiaren AI macOS icon.");
  const destination = prebuiltIcon;
  fs.writeFileSync(destination, icon);
  return destination;
}

function writeAuthorizationFiles(arch) {
  const helper = path.join(buildRoot, "macos-first-open.command");
  const readme = path.join(buildRoot, "macos-install-readme.txt");
  const helperText = [
    "#!/bin/zsh",
    "set -e",
    'DIR="${0:A:h}"',
    'APP="$DIR/Jiaren AI.app"',
    'if [[ ! -d "$APP" && -d "/Applications/Jiaren AI.app" ]]; then',
    '  APP="/Applications/Jiaren AI.app"',
    "fi",
    'if [[ ! -d "$APP" ]]; then',
    "  echo \"\u672a\u627e\u5230 Jiaren AI.app\uff0c\u8bf7\u4fdd\u6301\u811a\u672c\u4e0e\u5e94\u7528\u4f4d\u4e8e\u540c\u4e00\u6587\u4ef6\u5939\u3002\"",
    "  read -k 1",
    "  exit 1",
    "fi",
    '/usr/bin/xattr -dr com.apple.quarantine "$APP" || true',
    '/usr/bin/codesign --force --deep --sign - "$APP"',
    'open "$APP"',
    "echo \"Jiaren AI \u5df2\u5b8c\u6210\u672c\u673a\u6388\u6743\u5e76\u6253\u5f00\u3002\"",
    "",
  ].join("\n");
  const readmeText = [
    `Jiaren AI 1.1.3 macOS ${arch}`,
    "",
    "\u672c\u7248\u672c\u672a\u4f7f\u7528 Apple \u5f00\u53d1\u8005\u8bc1\u4e66\uff0c\u4e5f\u672a\u8fdb\u884c Apple \u516c\u8bc1\u3002",
    "\u7528\u6237\u4e0d\u9700\u8981\u5b89\u88c5 Xcode \u6216\u4efb\u4f55\u5f00\u53d1\u8005\u5de5\u5177\u3002",
    "",
    "\u9996\u6b21\u6253\u5f00\uff1a",
    "1. \u89e3\u538b ZIP\u3002",
    "2. \u5c06\u201cJiaren AI.app\u201d\u62d6\u5165\u201c\u5e94\u7528\u7a0b\u5e8f\u201d\u3002",
    "3. \u53f3\u952e\u201c\u9996\u6b21\u6253\u5f00.command\u201d\u5e76\u9009\u62e9\u201c\u6253\u5f00\u201d\uff1b\u811a\u672c\u4f1a\u81ea\u52a8\u8bc6\u522b\u540c\u76ee\u5f55\u6216\u201c\u5e94\u7528\u7a0b\u5e8f\u201d\u4e2d\u7684 Jiaren AI.app\u3002",
    "4. macOS \u4f1a\u4f7f\u7528\u7cfb\u7edf\u81ea\u5e26\u7684 xattr \u4e0e codesign \u5b8c\u6210\u672c\u673a\u4e34\u65f6\u6388\u6743\uff0c\u7136\u540e\u542f\u52a8\u8f6f\u4ef6\u3002",
    "",
    "\u4e5f\u53ef\u4ee5\u5728\u201c\u7cfb\u7edf\u8bbe\u7f6e > \u9690\u79c1\u4e0e\u5b89\u5168\u201d\u4e2d\u9009\u62e9\u201c\u4ecd\u8981\u6253\u5f00\u201d\u3002",
    "\u8f6f\u4ef6\u4e0d\u5185\u7f6e API \u5bc6\u94a5\uff0c\u4ecd\u4f7f\u7528\u7528\u6237\u81ea\u5df1\u914d\u7f6e\u7684 API\u3002",
    "",
  ].join("\n");
  fs.writeFileSync(helper, helperText, "utf8");
  fs.writeFileSync(readme, readmeText, "utf8");

  return { helper, readme };
}

async function main() {
  await prepareNativeDependencies();
  if (path.dirname(releaseRoot) !== projectRoot || path.basename(releaseRoot) !== "release-v113-macos") {
    throw new Error(`Refusing to clean unexpected directory: ${releaseRoot}`);
  }
  fs.rmSync(releaseRoot, { recursive: true, force: true });

  const toolRoot = findToolRoot();
  const { appSource, windowsResources } = await prepareAppSource(toolRoot);
  const icon = prepareIcon();
  for (const arch of ["arm64", "x64"]) {
    const { helper, readme } = writeAuthorizationFiles(arch);
    const zipPath = path.join(releaseRoot, `Jiaren-AI-1.1.3-macOS-${arch}.zip`);
    run("python", [
      path.join(projectRoot, "scripts", "build-macos-zip-v111.py"),
      "--project", projectRoot,
      "--arch", arch,
      "--runtime-zip", path.join(cacheRoot, `electron-v${electronVersion}-darwin-${arch}.zip`),
      "--app-source", appSource,
      "--windows-resources", windowsResources,
      "--icon", icon,
      "--helper", helper,
      "--readme", readme,
      "--output", zipPath,
    ]);
    if (!fs.existsSync(zipPath) || fs.statSync(zipPath).size === 0) {
      throw new Error(`Missing macOS artifact: ${zipPath}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
