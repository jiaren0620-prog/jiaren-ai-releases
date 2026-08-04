"use strict";

const fs = require("node:fs");

const [oldPath, newPath] = process.argv.slice(2);
if (!oldPath || !newPath) {
  throw new Error("Usage: node compare-binary-regions.cjs <old-file> <new-file>");
}

const oldSize = fs.statSync(oldPath).size;
const newSize = fs.statSync(newPath).size;
const maximumComparable = Math.min(oldSize, newSize);
const chunkSize = 1024 * 1024;
const oldBuffer = Buffer.allocUnsafe(chunkSize);
const newBuffer = Buffer.allocUnsafe(chunkSize);
const oldHandle = fs.openSync(oldPath, "r");
const newHandle = fs.openSync(newPath, "r");

let commonPrefix = 0;
let commonSuffix = 0;
try {
  while (commonPrefix < maximumComparable) {
    const size = Math.min(chunkSize, maximumComparable - commonPrefix);
    fs.readSync(oldHandle, oldBuffer, 0, size, commonPrefix);
    fs.readSync(newHandle, newBuffer, 0, size, commonPrefix);
    let index = 0;
    while (index < size && oldBuffer[index] === newBuffer[index]) index += 1;
    commonPrefix += index;
    if (index < size) break;
  }

  while (commonSuffix < maximumComparable - commonPrefix) {
    const size = Math.min(chunkSize, maximumComparable - commonPrefix - commonSuffix);
    const oldOffset = oldSize - commonSuffix - size;
    const newOffset = newSize - commonSuffix - size;
    fs.readSync(oldHandle, oldBuffer, 0, size, oldOffset);
    fs.readSync(newHandle, newBuffer, 0, size, newOffset);
    let index = size - 1;
    while (index >= 0 && oldBuffer[index] === newBuffer[index]) index -= 1;
    commonSuffix += size - 1 - index;
    if (index >= 0) break;
  }
} finally {
  fs.closeSync(oldHandle);
  fs.closeSync(newHandle);
}

console.log(JSON.stringify({
  oldSize,
  newSize,
  commonPrefix,
  commonSuffix,
  oldMiddle: oldSize - commonPrefix - commonSuffix,
  newMiddle: newSize - commonPrefix - commonSuffix,
}, null, 2));
