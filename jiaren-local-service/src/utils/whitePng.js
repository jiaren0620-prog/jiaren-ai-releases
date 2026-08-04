/**
 * 生成纯白 PNG 占位图
 * 主项目 gpt-image-2-web 在文生图模式下,/v1/images/edits 强制需要 image 字段,
 * 故构造一张同尺寸的纯白图作为占位输入,完全对齐主项目行为(line 2861)
 */
const zlib = require('zlib');

// CRC32 表
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([length, typeBuf, data, crc]);
}

/**
 * 生成 width x height 纯白 PNG Buffer (RGB, 8-bit)
 */
function createWhitePng(width = 1024, height = 1024) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT - 每行 1 字节 filter (0 = None) + width*3 字节 RGB(255,255,255)
  const rowLen = width * 3 + 1;
  const raw = Buffer.alloc(rowLen * height, 0xff);
  for (let y = 0; y < height; y++) {
    raw[y * rowLen] = 0; // filter type
  }
  const compressed = zlib.deflateSync(raw);

  // IEND
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', iend),
  ]);
}

// 缓存生成结果(每个尺寸生成一次)
const cache = new Map();
function getWhitePng(width = 1024, height = 1024) {
  const key = `${width}x${height}`;
  if (!cache.has(key)) cache.set(key, createWhitePng(width, height));
  return cache.get(key);
}

module.exports = { createWhitePng, getWhitePng };
