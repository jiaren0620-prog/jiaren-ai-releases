"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { createJiarenAgentControlRuntime } = require("../dist-electron/electron/jiaren-agent-control-runtime.js");

function getJson(port, requestPath, token) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: "127.0.0.1", port, path: requestPath, headers: { Authorization: `Bearer ${token}` } }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({ status: response.statusCode, body: JSON.parse(Buffer.concat(chunks).toString("utf8")) }));
    });
    req.once("error", reject);
  });
}

test("Agent Control provisions and rotates an ephemeral MCP credential", async (t) => {
  const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), "jiaren-agent-mcp-"));
  t.after(() => fs.rmSync(dataRoot, { recursive: true, force: true }));
  const runtime = createJiarenAgentControlRuntime({ dataRoot });
  await runtime.start();
  const credentialPath = path.join(dataRoot, "agent-control-mcp.json");
  const credential = JSON.parse(fs.readFileSync(credentialPath, "utf8"));
  assert.equal(credential.host, "127.0.0.1");
  assert.ok(credential.token.length >= 32);
  const authorized = await getJson(credential.port, "/v1/snapshot", credential.token);
  assert.equal(authorized.status, 200);
  assert.equal(authorized.body.ok, true);
  const rejected = await getJson(credential.port, "/v1/snapshot", "wrong-token");
  assert.equal(rejected.status, 401);
  await runtime.stop();
  assert.equal(fs.existsSync(credentialPath), false);
});
