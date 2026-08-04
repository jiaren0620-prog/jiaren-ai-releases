"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const agentSource = fs.readFileSync(
  path.join(projectRoot, "dist", "assets", "jiaren-codex-app-server-v112.js"),
  "utf8",
);
const channelSource = fs.readFileSync(
  path.join(projectRoot, "dist", "assets", "jiaren-channel-manager-v112.js"),
  "utf8",
);

test("Jiaren Agent exposes software API chat and local Codex as separate modes", () => {
  assert.match(agentSource, /\["api", "API 对话", "使用软件中用户填写的 API"\]/);
  assert.match(agentSource, /\["local", "本地 Codex", "连接本机 Codex CLI"\]/);
  assert.match(agentSource, /workspace\.hidden = mode === "api"/);
  assert.match(agentSource, /const request = state\.mode === "remote"[\s\S]*: \{ mode: "local" \}/);
});

test("The custom channel manager no longer mounts inside Jiaren Agent", () => {
  assert.match(channelSource, /panel\.dataset\.channelManagerV112 = "disabled"/);
  assert.match(channelSource, /querySelectorAll\("\.jiaren-channel-entry"\).*entry\.remove/);
  assert.doesNotMatch(channelSource, /header\.appendChild\(entry\)/);
});
