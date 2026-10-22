const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function lerpColor(c1, c2, t) {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

// Deep Dark Navy Palette for rich premium dark header
// Top-Left: #071324
const C_TOP_LEFT = [7, 19, 36];
// Top-Right: #102A43
const C_TOP_RIGHT = [16, 42, 67];
// Bottom-Left: #0B1E36
const C_BOT_LEFT = [11, 30, 54];
// Bottom-Right: #16365C
const C_BOT_RIGHT = [22, 54, 92];

function sampleDarkSpread(u, v) {
  const top = lerpColor(C_TOP_LEFT, C_TOP_RIGHT, u);
  const bottom = lerpColor(C_BOT_LEFT, C_BOT_RIGHT, u);
  return lerpColor(top, bottom, v);
}

function generateDarkHeaderPng(width, height, filename) {
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte: none
    const v = y / (height - 1);

    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const [r, g, b] = sampleDarkSpread(u, v);

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = 255;
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  const targetPath = path.join(__dirname, '..', 'assets', 'images', filename);
  fs.writeFileSync(targetPath, pngBuffer);
  console.log(`Generated dark header gradient: ${filename} (${pngBuffer.length} bytes)`);
}

generateDarkHeaderPng(900, 320, 'header-gradient.png');
generateDarkHeaderPng(900, 420, 'hero-gradient.png');
