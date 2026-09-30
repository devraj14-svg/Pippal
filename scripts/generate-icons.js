// Pure Node.js PNG generator with no external dependencies
import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(2, 9); // Color type 2 (Truecolor RGB)
  ihdrData.writeUInt8(0, 10); // Compression method
  ihdrData.writeUInt8(0, 11); // Filter method
  ihdrData.writeUInt8(0, 12); // Interlace method

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data with scanline filter byte 0
  const rowSize = width * 3 + 1;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      // Draw rounded card effect
      const dx = Math.abs(x - width / 2);
      const dy = Math.abs(y - height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Safe zone background (emerald green)
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(8 + length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4, 4, 'ascii');
  data.copy(buffer, 8);

  const crc = crc32(buffer.subarray(4, 8 + length));
  buffer.writeUInt32BE(crc, 8 + length);
  return buffer;
}

// CRC32 implementation
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

// Emerald theme color: R=16, G=185, B=129 (#10b981)
fs.writeFileSync('./public/pwa-192x192.png', createPNG(192, 192, 16, 185, 129));
fs.writeFileSync('./public/pwa-512x512.png', createPNG(512, 512, 16, 185, 129));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPNG(512, 512, 16, 185, 129));
fs.writeFileSync('./public/apple-touch-icon.png', createPNG(180, 180, 16, 185, 129));
fs.writeFileSync('./public/favicon.ico', createPNG(32, 32, 16, 185, 129));

console.log('Successfully generated PWA PNG icons in ./public');
