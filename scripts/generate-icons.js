import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Function to generate a raw RGBA PNG buffer without external dependencies
function createPngBuffer(width, height, isMaskable = false) {
  // We will draw a warm amber background with green pasture arc and white/pink cow shape
  const buffer = Buffer.alloc(width * height * 4);

  const cx = width / 2;
  const cy = height / 2;
  const r = (width / 2) * (isMaskable ? 0.72 : 0.88);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background amber
      let rCol = 245;
      let gCol = 158;
      let bCol = 11;
      let aCol = 255;

      // Outer squircle or circle
      if (!isMaskable) {
        const cornerDist = Math.max(Math.abs(dx) - width * 0.35, Math.abs(dy) - height * 0.35, 0);
        if (cornerDist > width * 0.14) {
          aCol = 0;
        }
      }

      // Pasture green at bottom
      if (y > height * 0.68) {
        rCol = 16;
        gCol = 185;
        bCol = 129;
      }

      // Cow head circle in center
      const headDist = Math.sqrt(dx * dx + (dy + height * 0.04) * (dy + height * 0.04));
      if (headDist < r * 0.55) {
        // Cow body white
        rCol = 255;
        gCol = 255;
        bCol = 255;

        // Snout pink
        const snoutDist = Math.sqrt(dx * dx + (dy - height * 0.12) * (dy - height * 0.12));
        if (snoutDist < r * 0.26) {
          rCol = 244;
          gCol = 114;
          bCol = 182;

          // Nostrils
          if (Math.abs(dy - height * 0.1) < r * 0.05 && Math.abs(Math.abs(dx) - r * 0.1) < r * 0.04) {
            rCol = 157;
            gCol = 74;
            bCol = 99;
          }
        } else {
          // Eyes
          if (Math.abs(dy + height * 0.04) < r * 0.07 && Math.abs(Math.abs(dx) - r * 0.18) < r * 0.06) {
            rCol = 24;
            gCol = 24;
            bCol = 27;
          }
        }

        // Kurdish hat red on top
        if (dy < -height * 0.12 && Math.abs(dx) < r * 0.32) {
          rCol = 153;
          gCol = 27;
          bCol = 27;
        }
      }

      // Horns
      const hornLeftDist = Math.sqrt((dx + r * 0.38) * (dx + r * 0.38) + (dy + r * 0.3) * (dy + r * 0.3));
      const hornRightDist = Math.sqrt((dx - r * 0.38) * (dx - r * 0.38) + (dy + r * 0.3) * (dy + r * 0.3));
      if (hornLeftDist < r * 0.14 || hornRightDist < r * 0.14) {
        rCol = 253;
        gCol = 224;
        bCol = 71;
      }

      buffer[idx] = rCol;
      buffer[idx + 1] = gCol;
      buffer[idx + 2] = bCol;
      buffer[idx + 3] = aCol;
    }
  }

  return encodePng(width, height, buffer);
}

// Minimal standard PNG encoder (IHDR, IDAT with zlib, IEND)
function encodePng(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with scanline filter byte 0 (None)
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    rawData[y * scanlineLength] = 0; // Filter None
    rgbaBuffer.copy(rawData, y * scanlineLength + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeInt32BE(crc, 8 + len);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ -1;
}

// Generate the required files
console.log('Generating PWA compliant PNG icons...');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPngBuffer(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPngBuffer(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPngBuffer(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPngBuffer(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPngBuffer(64, 64, false));
console.log('PWA icons created successfully in public/ !');
