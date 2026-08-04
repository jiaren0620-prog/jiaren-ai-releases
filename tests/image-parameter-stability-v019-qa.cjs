"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const source = fs.readFileSync(
  path.join(projectRoot, "dist", "assets", "MainCanvasFlow-BbsMxxcM.js"),
  "utf8",
);

assert.match(source, /Jiaren v0\.1\.9 image parameter stability/);
assert.doesNotMatch(source, /\}, \[x, \$e, oe, N, ve, S\]\),/);
assert.match(source, /resolution: M,[\s\S]{0,120}sizeLabel:/);
assert.match(source, /aspectRatio: M,[\s\S]{0,120}sizeLabel:/);
assert.match(source, /ze\(M\), S\(Me\.id, \{ quality: M \}\)/);

console.log("Image parameter stability static checks passed.");
