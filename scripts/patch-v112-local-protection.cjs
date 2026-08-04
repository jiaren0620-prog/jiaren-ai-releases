"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const mainPath = path.join(root, "dist-electron", "electron", "main.js");
const localServerPath = path.join(root, "dist-electron", "electron", "jiaren-local-server.js");
const localServicePath = path.join(root, "jiaren-local-service", "src", "server.js");
const marker = "/* Jiaren v1.1.2 local application protection */";

const read = (filePath) => fs.readFileSync(filePath, "utf8");
const write = (filePath, value) => fs.writeFileSync(filePath, value, "utf8");

function patchMain() {
  let source = read(mainPath);
  if (source.includes(marker)) return false;

  const oldWindowOptions = `      sandbox: false,
      backgroundThrottling: false
    }
  });`;
  const newWindowOptions = `      sandbox: false,
      devTools: isDev,
      backgroundThrottling: !isDev
    }
  });`;
  if (!source.includes(oldWindowOptions)) {
    throw new Error("Cannot locate the v1.1.2 BrowserWindow security options.");
  }
  source = source.replace(oldWindowOptions, newWindowOptions);

  const oldAfterWindow = `  });
  let startupFallbackTimer;
  const showMainWindow = () => {`;
  const newAfterWindow = `  });
  if (!isDev) {
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (/^https?:\\/\\//i.test(url)) openExternalUrl(url);
      return { action: "deny" };
    });
    mainWindow.webContents.on("will-navigate", (event, url) => {
      const localServiceUrl = jiarenLocalServicePort > 0 && url.startsWith("http://127.0.0.1:" + jiarenLocalServicePort + "/");
      if (!url.startsWith("file:") && !localServiceUrl) event.preventDefault();
    });
    mainWindow.webContents.on("before-input-event", (event, input) => {
      const key = String(input.key || "").toLowerCase();
      const opensDevTools = key === "f12" || (input.control && input.shift && (key === "i" || key === "j" || key === "c"));
      if (opensDevTools) event.preventDefault();
    });
  }
  let startupFallbackTimer;
  const showMainWindow = () => {`;
  if (!source.includes(oldAfterWindow)) {
    throw new Error("Cannot locate the v1.1.2 BrowserWindow setup boundary.");
  }
  source = source.replace(oldAfterWindow, newAfterWindow);
  source += `\n${marker}\n`;
  write(mainPath, source);
  return true;
}

function patchLocalServer() {
  let source = read(localServerPath);
  const marker = "/* Jiaren v1.1.2 local service module path */";
  if (source.includes(marker)) return false;
  const needle = `  const entry = fs.existsSync(externalEntry) ? externalEntry : asarEntry;
  log(`;
  const replacement = `  const entry = fs.existsSync(externalEntry) ? externalEntry : asarEntry;
  const unpackedNodeModules = path.join(resourcesPath, "app.asar.unpacked", "node_modules");
  if (fs.existsSync(unpackedNodeModules)) {
    process.env.NODE_PATH = [unpackedNodeModules, process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
    require("node:module").Module._initPaths();
  }
  log(`;
  if (!source.includes(needle)) throw new Error("Cannot locate the local service module path boundary.");
  source = source.replace(needle, replacement) + `\n${marker}\n`;
  write(localServerPath, source);
  return true;
}

function auditSourceMaps() {
  const roots = [path.join(root, "dist"), path.join(root, "dist-electron")];
  const maps = [];
  for (const base of roots) {
    if (!fs.existsSync(base)) continue;
    for (const entry of fs.readdirSync(base, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".map")) continue;
      const relative = path.relative(base, path.join(entry.parentPath || entry.path, entry.name));
      maps.push(path.join(base, relative));
    }
  }
  if (maps.length) throw new Error(`Production bundle contains source maps: ${maps.join(", ")}`);
}

function auditLocalAuth() {
  const main = read(mainPath);
  const localServer = read(localServerPath);
  const localService = read(localServicePath);
  const checks = [
    [main.includes("jiarenLocalAuthToken"), "main process local auth token"],
    [main.includes("?jiaren_token="), "authenticated renderer URL"],
    [localServer.includes("JIAREN_LOCAL_AUTH_TOKEN"), "local service token bridge"],
    [localService.includes("timingSafeEqual"), "constant-time local token validation"],
    [localService.includes("status(401)"), "unauthorized local request rejection"],
  ];
  const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
  if (missing.length) throw new Error(`Local service authentication is incomplete: ${missing.join(", ")}`);
}

const changed = patchMain();
const localServerChanged = patchLocalServer();
auditSourceMaps();
auditLocalAuth();
console.log(`${changed || localServerChanged ? "Applied" : "Verified"} Jiaren v1.1.2 local application protection.`);
