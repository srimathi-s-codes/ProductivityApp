// run: node generate-icons.mjs
import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

function crc32(buf) {
  let c = 0xffffffff;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let v = i;
    for (let j = 0; j < 8; j++) v = v & 1 ? 0xedb88320 ^ (v >>> 1) : v >>> 1;
    table[i] = v;
  }
  for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n);
  return b;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const d = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const crc = crc32(Buffer.concat([t, d]));
  return Buffer.concat([u32(d.length), t, d, u32(crc)]);
}

function makePNG(size) {
  // Build RGBA pixel data with pink→purple gradient + rounded corners
  const pixels = Buffer.alloc(size * size * 4);
  const r = size * 0.22; // corner radius

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const t = x / size;
      // gradient: #FF62BB → #B331F1
      const pr = Math.round(0xFF + t * (0xB3 - 0xFF));
      const pg = Math.round(0x62 + t * (0x31 - 0x62));
      const pb = Math.round(0xBB + t * (0xF1 - 0xBB));

      // rounded corner mask
      let alpha = 255;
      const cx = Math.min(x, size - 1 - x);
      const cy = Math.min(y, size - 1 - y);
      if (cx < r && cy < r) {
        const dx = r - cx, dy = r - cy;
        if (Math.sqrt(dx * dx + dy * dy) > r) alpha = 0;
      }

      pixels[idx] = pr;
      pixels[idx + 1] = pg;
      pixels[idx + 2] = pb;
      pixels[idx + 3] = alpha;
    }
  }

  // Build PNG scanlines (filter byte 0 per row)
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0; // filter none
    pixels.copy(row, 1, y * size * 4, (y + 1) * size * 4);
    rows.push(row);
  }
  const raw = deflateSync(Buffer.concat(rows), { level: 6 });

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.concat([u32(size), u32(size), Buffer.from([8, 6, 0, 0, 0])]);

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', raw), chunk('IEND', Buffer.alloc(0))]);
}

writeFileSync('public/pwa-192x192.png', makePNG(192));
writeFileSync('public/pwa-512x512.png', makePNG(512));
writeFileSync('public/apple-touch-icon.png', makePNG(180));
console.log('✅ Icons generated in public/');
