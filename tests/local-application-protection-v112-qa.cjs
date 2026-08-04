"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const packageJson = JSON.parse(read("package.json"));
const windowsBuilder = require(path.join(root, "electron-builder-v019.cjs"));
const macBuilder = require(path.join(root, "electron-builder-macos-v111.cjs"));
const main = read("dist-electron/electron/main.js");
const localServer = read("dist-electron/electron/jiaren-local-server.js");
const localService = read("jiaren-local-service/src/server.js");
const installer = read("build/installer.nsh");
const license = read("LICENSE");
const licenseNotice = read("docs/JIAREN_LICENSE_ZH-CN.txt");

assert.equal(packageJson.private, true);
assert.equal(packageJson.license, "AGPL-3.0-only");

for (const [label, builder] of [["Windows", windowsBuilder], ["macOS", macBuilder]]) {
  assert.equal(builder.asar, true, `${label} must package application code in ASAR`);
  assert.ok(builder.files.includes("dist/**/*"), `${label} package must retain the complete frontend`);
  assert.ok(builder.files.includes("LICENSE"), `${label} package must include the AGPL-3.0 license`);
  assert.ok(!builder.asarUnpack.includes("dist/**/*"), `${label} must not expose the frontend in app.asar.unpacked`);
  for (const secretPattern of ["!**/.codex{,/**}", "!**/auth.json", "!**/credentials.json", "!**/.env"]) {
    assert.ok(builder.files.includes(secretPattern), `${label} must exclude ${secretPattern}`);
  }
}

assert.match(main, /devTools: isDev/);
assert.match(main, /backgroundThrottling: !isDev/);
assert.match(main, /setWindowOpenHandler/);
assert.match(main, /mainWindow\.webContents\.on\("will-navigate"/);
assert.match(main, /mainWindow\.webContents\.on\("before-input-event"/);
assert.match(main, /Jiaren v1\.1\.2 local application protection/);
assert.match(localServer, /app\.asar\.unpacked.*node_modules/);
assert.match(localServer, /Module\._initPaths\(\)/);
assert.match(localServer, /authToken/);
assert.match(localService, /JIAREN_LOCAL_AUTH_TOKEN/);
assert.match(localService, /timingSafeEqual/);
assert.match(localService, /status\(401\)/);

assert.match(installer, /开源免费分享，全程无任何收费项目/);
assert.doesNotMatch(installer, /未开放源代码/);
assert.match(license, /GNU AFFERO GENERAL PUBLIC LICENSE/);
assert.match(license, /Version 3, 19 November 2007/);
assert.match(licenseNotice, /AGPL-3\.0-only/);
assert.match(licenseNotice, /第三方组件不受本说明取代/);
assert.match(licenseNotice, /默认保存在用户本机/);

const sourceMaps = [];
for (const directory of ["dist", "dist-electron"]) {
  const base = path.join(root, directory);
  for (const entry of fs.readdirSync(base, { recursive: true, withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".map")) {
      sourceMaps.push(path.relative(root, path.join(entry.parentPath || entry.path, entry.name)));
    }
  }
}
assert.deepEqual(sourceMaps, [], `Production source maps must be absent: ${sourceMaps.join(", ")}`);

console.log("Jiaren AI v1.1.2 AGPL-3.0 and local application protection contracts passed.");
