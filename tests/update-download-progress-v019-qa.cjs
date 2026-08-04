"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { downloadFile } = require("../dist-electron/electron/jiaren-safe-download.js");

const byteSize = 4 * 1024 * 1024;
const chunk = Buffer.alloc(64 * 1024, 0x5a);
const target = path.join(__dirname, "runtime-update-progress.bin");
const progress = [];

const server = http.createServer((_request, response) => {
  response.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-Length": String(byteSize),
  });
  let sent = 0;
  const send = () => {
    if (sent >= byteSize) {
      response.end();
      return;
    }
    response.write(chunk);
    sent += chunk.length;
    setTimeout(send, 5);
  };
  send();
});

(async () => {
  try {
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    const result = await downloadFile(`http://127.0.0.1:${address.port}/installer.exe`, target, {
      allowPrivate: true,
      maxBytes: byteSize + 1024,
      timeoutMs: 5000,
      onProgress: (value) => progress.push(value),
    });
    assert.equal(result.byteSize, byteSize);
    assert.ok(progress.length >= 2, `Expected multiple progress events, got ${progress.length}`);
    assert.equal(progress.at(-1).downloadedBytes, byteSize);
    assert.equal(progress.at(-1).totalBytes, byteSize);
    assert.equal(progress.every((item, index) => index === 0 || item.downloadedBytes >= progress[index - 1].downloadedBytes), true);
    console.log(`Update download progress checks passed: ${progress.length} events, ${result.byteSize} bytes`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    try { fs.unlinkSync(target); } catch {}
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
