"use strict";

const net = require("node:net");
const fs = require("node:fs");
const path = require("node:path");

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => server.close(() => resolve(true)));
    server.listen(port, "127.0.0.1");
  });
}

async function findFreePort(start = 18766, attempts = 20) {
  for (let offset = 0; offset < attempts; offset += 1) {
    const port = start + offset;
    if (await isPortFree(port)) return port;
  }
  throw new Error(`No free JiarenAI local service port in ${start}-${start + attempts - 1}`);
}

function waitForPort(port, attempts = 50) {
  return new Promise((resolve, reject) => {
    let remaining = attempts;
    const probe = () => {
      const socket = net.createConnection({ host: "127.0.0.1", port }, () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        remaining -= 1;
        if (remaining <= 0) reject(new Error(`JiarenAI local service did not open port ${port}`));
        else setTimeout(probe, 120);
      });
    };
    probe();
  });
}

async function startJiarenLocalService({ appRoot, dataRoot, resourcesPath, authToken = "", log = () => {} }) {
  const port = await findFreePort();
  process.env.PORT = String(port);
  process.env.HOST = "127.0.0.1";
  process.env.JIAREN_LOCAL_PACKAGED = "1";
  process.env.JIAREN_LOCAL_USER_DATA = path.join(dataRoot, "local-service");
  process.env.JIAREN_LOCAL_AUTH_TOKEN = String(authToken || "");
  process.env.JIAREN_RESOURCES_PATH = resourcesPath;
  const unpackedFrontend = path.join(resourcesPath, "app.asar.unpacked", "dist");
  const packagedFrontend = path.join(appRoot, "dist");
  process.env.JIAREN_LOCAL_FRONTEND_DIST = fs.existsSync(path.join(unpackedFrontend, "index.html"))
    ? unpackedFrontend
    : packagedFrontend;
  try {
    const packagedPath = require("ffmpeg-static");
    const ffmpegName = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
    const candidates = [
      packagedPath.replace(`${path.sep}app.asar${path.sep}`, `${path.sep}app.asar.unpacked${path.sep}`),
      path.join(resourcesPath, "app.asar.unpacked", "node_modules", "ffmpeg-static", ffmpegName),
      packagedPath,
    ];
    const ffmpegPath = candidates.find((candidate) => fs.existsSync(candidate));
    if (ffmpegPath) process.env.JIAREN_FFMPEG_BIN = ffmpegPath;
  } catch {}

  const externalEntry = path.join(resourcesPath, "jiaren-local-service", "src", "server.js");
  const asarEntry = path.join(appRoot, "jiaren-local-service", "src", "server.js");
  const entry = fs.existsSync(externalEntry) ? externalEntry : asarEntry;
  const unpackedNodeModules = path.join(resourcesPath, "app.asar.unpacked", "node_modules");
  if (fs.existsSync(unpackedNodeModules)) {
    process.env.NODE_PATH = [unpackedNodeModules, process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
    require("node:module").Module._initPaths();
  }
  log(`jiaren-local-service loading ${entry} port=${port} frontend=${process.env.JIAREN_LOCAL_FRONTEND_DIST}`);
  require(entry);
  await waitForPort(port);
  log(`jiaren-local-service ready http://127.0.0.1:${port}`);
  return port;
}

module.exports = { startJiarenLocalService };

/* Jiaren v1.1.2 local service module path */
