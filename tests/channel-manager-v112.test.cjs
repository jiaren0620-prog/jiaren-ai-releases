"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const assetsRoot = path.join(projectRoot, "dist", "assets");
const canvasBundle = path.join(
  assetsRoot,
  fs.readdirSync(assetsRoot).find((name) => /^jiaren-canvas-.*\.js$/i.test(name)),
);
const managerScript = path.join(assetsRoot, "jiaren-channel-manager-v112.js");
const darkTheme = path.join(assetsRoot, "jiaren-dark-lime-20260728.css");

test("custom channel models survive provider catalog refresh", () => {
  const source = fs.readFileSync(canvasBundle, "utf8");
  assert.match(source, /String\(U\.providerSource \|\| ""\)\.startsWith\("jiaren-channel:"\)/);
  assert.match(source, /U\.id\.startsWith\("provider-channel-"\)/);
});

test("custom channel models survive startup hydration without alias rewriting", () => {
  const source = fs.readFileSync(canvasBundle, "utf8");
  assert.match(source, /String\(r\.providerSource \|\| ""\)\.startsWith\("jiaren-channel:"\)/);
  assert.match(source, /const g = c \? r : ji\(r\)/);
});

test("channel manager installs models through the shared preferences catalog", () => {
  const source = fs.readFileSync(managerScript, "utf8");
  assert.match(source, /window\.jiaren\.system\.loadPreferences\(\)/);
  assert.match(source, /window\.jiaren\.system\.savePreferences\(/);
  assert.match(source, /providerSource: source/);
  assert.match(source, /category: categoryForCapability\(model\.capability\)/);
});

test("two-level canvas menus are not clipped by the parent menu", () => {
  const source = fs.readFileSync(darkTheme, "utf8");
  assert.match(
    source,
    /#root \.canvas-app-shell \.canvas-context-menu\.jiaren-context-menu-v2 \{[\s\S]*?overflow: visible !important;/,
  );
});
