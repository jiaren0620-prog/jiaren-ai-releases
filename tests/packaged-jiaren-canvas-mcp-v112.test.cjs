"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");

const packageRoot = path.resolve(__dirname, "..", "release-v112", "win-unpacked");
const electronPath = path.join(packageRoot, "Jiaren AI.exe");
const mcpPath = path.join(packageRoot, "resources", "tools", "jiaren-canvas-mcp", "bin", "jiaren-canvas-mcp.cjs");

function startControlServer() {
  const server = http.createServer((request, response) => {
    const result = request.url === "/v1/snapshot"
      ? { ok: true, snapshot: { nodes: [{ id: "packaged-node" }], edges: [], assets: [] } }
      : request.method === "GET" && request.url === "/v1/plans"
        ? { ok: true, plans: [{ id: "packaged-plan", status: "completed" }] }
        : request.method === "GET" && request.url === "/v1/receipts"
          ? { ok: true, receipts: [{ id: "packaged-receipt", planId: "packaged-plan", status: "completed" }] }
          : { ok: true, plan: { id: "packaged-plan", status: "pending" } };
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(result));
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

function startPackagedMcp(dataRoot) {
  const child = spawn(electronPath, [mcpPath], {
    cwd: packageRoot,
    env: { ...process.env, ELECTRON_RUN_AS_NODE: "1", JIAREN_DATA_ROOT: dataRoot },
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
  });
  let buffer = "";
  const pending = [];
  child.stdout.on("data", (chunk) => {
    buffer += chunk.toString("utf8");
    for (;;) {
      const newline = buffer.indexOf("\n");
      if (newline < 0) break;
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line && pending.length) pending.shift()(JSON.parse(line));
    }
  });
  return {
    child,
    send(message) {
      return new Promise((resolve) => {
        pending.push(resolve);
        child.stdin.write(`${JSON.stringify(message)}\n`);
      });
    },
  };
}

test("packaged Electron runtime executes the complete Jiaren Canvas MCP loop", async (t) => {
  assert.equal(fs.existsSync(electronPath), true, electronPath);
  assert.equal(fs.existsSync(mcpPath), true, mcpPath);
  const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), "jiaren-packaged-mcp-"));
  const server = await startControlServer();
  t.after(() => {
    server.close();
    fs.rmSync(dataRoot, { recursive: true, force: true });
  });
  fs.writeFileSync(path.join(dataRoot, "agent-control-mcp.json"), JSON.stringify({
    host: "127.0.0.1",
    port: server.address().port,
    token: "packaged-test-token-123456789012345678901234567890",
  }));
  const mcp = startPackagedMcp(dataRoot);
  t.after(() => mcp.child.kill());

  const initialized = await mcp.send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18" } });
  assert.equal(initialized.result.serverInfo.name, "jiaren-canvas");
  const tools = await mcp.send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
  assert.equal(tools.result.tools.length, 26);
  for (const name of [
    "jiaren_canvas_generate_image",
    "jiaren_canvas_generate_video",
    "jiaren_canvas_generate_audio",
    "jiaren_canvas_wait_for_plan",
    "jiaren_canvas_create_svg",
  ]) assert.ok(tools.result.tools.some((tool) => tool.name === name), name);

  const state = await mcp.send({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "jiaren_canvas_get_state", arguments: {} } });
  assert.match(state.result.content[0].text, /packaged-node/);
  const generated = await mcp.send({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "jiaren_canvas_generate_image", arguments: { prompt: "packaged image test" } } });
  assert.equal(JSON.parse(generated.result.content[0].text).approvalRequired, true);
  const waited = await mcp.send({ jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "jiaren_canvas_wait_for_plan", arguments: { planId: "packaged-plan", timeoutSeconds: 1 } } });
  assert.equal(JSON.parse(waited.result.content[0].text).receipt.status, "completed");
});
