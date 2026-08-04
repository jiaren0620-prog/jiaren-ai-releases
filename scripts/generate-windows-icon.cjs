"use strict";

const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(projectRoot, "build", "jiaren-logo-source.png");
const previewPath = path.join(projectRoot, "build", "jiaren-icon-preview.png");
const iconPath = path.join(projectRoot, "build", "icon.ico");
const iconSizes = [16, 20, 24, 32, 40, 48, 64, 128, 256];

function buildIco(images) {
  const directorySize = 6 + images.length * 16;
  const header = Buffer.alloc(directorySize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = directorySize;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entry);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

async function main() {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing Jiaren logo source: ${sourcePath}`);
  }

  const trimmed = await sharp(sourcePath)
    .trim({ background: "#ffffff", threshold: 12 })
    .png()
    .toBuffer();
  const outputSize = 1024;
  const radius = Math.round(outputSize * 0.13);
  const mask = Buffer.from(
    `<svg width="${outputSize}" height="${outputSize}"><rect width="100%" height="100%" rx="${radius}" ry="${radius}" fill="white"/></svg>`,
  );

  const master = await sharp(trimmed)
    .resize(outputSize, outputSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .composite([{ input: mask, blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(previewPath, master);
  const images = [];
  for (const size of iconSizes) {
    const data = await sharp(master)
      .resize(size, size, { kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 9 })
      .toBuffer();
    images.push({ size, data });
  }
  fs.writeFileSync(iconPath, buildIco(images));
  console.log(`Generated ${iconPath} from ${sourcePath}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
