#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

function fail(message, code = 1) {
  process.stderr.write(`${message}\n`);
  process.exit(code);
}

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch { return null; }
}

function candidateDataRoots() {
  const roots = [];
  const explicit = process.env.JIAREN_DATA_ROOT;
  if (explicit) roots.push(path.resolve(explicit));
  let current = path.resolve(__dirname);
  for (let index = 0; index < 8; index += 1) {
    roots.push(path.join(current, ".jiaren"));
    current = path.dirname(current);
  }
  if (process.env.PORTABLE_EXECUTABLE_DIR) roots.push(path.join(process.env.PORTABLE_EXECUTABLE_DIR, ".jiaren"));
  roots.push(path.join(process.cwd(), ".jiaren"));
  if (process.env.APPDATA) roots.push(path.join(process.env.APPDATA, "jiaren-ai-canvas", ".jiaren"));
  roots.push(path.join(process.env.LOCALAPPDATA || os.homedir(), "JiarenAI", ".jiaren"));
  return [...new Set(roots)];
}

function resolveConnection() {
  for (const root of candidateDataRoots()) {
    const connectionPath = path.join(root, "agent-control.json");
    const connection = readJson(connectionPath);
    if (connection?.host === "127.0.0.1" && Number.isInteger(connection.port) && connection.port > 0) {
      return { ...connection, dataRoot: root };
    }
  }
  fail("没有找到正在运行的 Jiaren Canvas Control。请先启动 Jiaren AI。", 2);
}

function configPath(connection) {
  return path.join(connection.dataRoot, "agent-control-cli.json");
}

function request(connection, method, requestPath, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? null : Buffer.from(JSON.stringify(body));
    const req = http.request({
      host: "127.0.0.1",
      port: connection.port,
      path: requestPath,
      method,
      headers: {
        Accept: "application/json",
        "User-Agent": "Jiaren-Canvas-CLI/1.0",
        ...(payload ? { "Content-Type": "application/json", "Content-Length": payload.length } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      timeout: 10000,
    }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => {
        let result;
        try { result = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { result = { ok: false, error: "Jiaren 返回了无效 JSON。" }; }
        if (response.statusCode >= 400 || result.ok === false) reject(new Error(result.error || `HTTP ${response.statusCode}`));
        else resolve(result);
      });
    });
    req.once("timeout", () => req.destroy(new Error("连接 Jiaren 超时。")));
    req.once("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function authToken(connection) {
  const config = readJson(configPath(connection));
  return typeof config?.token === "string" ? config.token : "";
}

function print(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

async function main() {
  const [command = "help", argument] = process.argv.slice(2);
  if (command === "help" || command === "--help" || command === "-h") {
    process.stdout.write("Jiaren Canvas CLI\n\nstatus\npair <code>\ncapabilities\nsnapshot\nsubmit-plan <json-file|json>\nplans [status]\nreceipts\n");
    return;
  }
  const connection = resolveConnection();
  if (command === "status") {
    print(await request(connection, "GET", "/v1/status"));
    return;
  }
  if (command === "pair") {
    if (!/^\d{6}$/.test(String(argument || ""))) fail("请输入 Jiaren Agent 显示的 6 位配对码。", 2);
    const result = await request(connection, "POST", "/v1/pair", { code: argument });
    fs.writeFileSync(configPath(connection), JSON.stringify({ token: result.token, scopes: result.scopes, pairedAt: new Date().toISOString() }, null, 2), { encoding: "utf8", mode: 0o600 });
    print({ ok: true, message: "配对成功。", scopes: result.scopes });
    return;
  }
  const token = authToken(connection);
  if (!token) fail("尚未配对。请先在 Jiaren Agent 获取配对码，再执行 pair。", 2);
  if (command === "capabilities") {
    print(await request(connection, "GET", "/v1/capabilities", undefined, token));
  } else if (command === "snapshot") {
    print(await request(connection, "GET", "/v1/snapshot", undefined, token));
  } else if (command === "submit-plan") {
    if (!argument) fail("请提供计划 JSON 文件路径或 JSON 字符串。", 2);
    const source = fs.existsSync(argument) ? fs.readFileSync(argument, "utf8") : argument;
    let plan;
    try { plan = JSON.parse(source); } catch { fail("计划 JSON 无效。", 2); }
    print(await request(connection, "POST", "/v1/plans", plan, token));
  } else if (command === "plans") {
    const query = argument ? `?status=${encodeURIComponent(argument)}` : "";
    print(await request(connection, "GET", `/v1/plans${query}`, undefined, token));
  } else if (command === "receipts") {
    print(await request(connection, "GET", "/v1/receipts", undefined, token));
  } else {
    fail(`未知命令：${command}`, 2);
  }
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
