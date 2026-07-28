#!/usr/bin/env node
/**
 * Pure-Node poster + OG generator. No ffmpeg, no npm dependencies.
 *
 * Coastal Editorial palette — brand navy and teal on warm paper. Media posters
 * are rich navy fields with a teal glow (dark enough for paper-white captions);
 * the ambient poster is a soft light teal wash for the light sections. These are
 * the committed placeholders so the repo previews and builds green before real
 * footage arrives. Run: `npm run posters`.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VIDEOS = join(__dirname, '..', 'public', 'videos');
const OG = join(__dirname, '..', 'public', 'og');
mkdirSync(VIDEOS, { recursive: true });
mkdirSync(OG, { recursive: true });

// ---- Brand palette ---------------------------------------------------------
const NAVY = [19, 41, 76];
const NAVY2 = [10, 22, 42];
const TEAL = [20, 163, 160];
const TEAL_DEEP = [12, 110, 108];
const PAPER = [247, 245, 240];

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => [
  lerp(c1[0], c2[0], t),
  lerp(c1[1], c2[1], t),
  lerp(c1[2], c2[2], t),
];
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- Minimal PNG (truecolour, 8-bit) --------------------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgb) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Paint a poster. `glow` warms a directional radial; `vignette` darkens or
 * lightens the edges toward `edge`.
 */
function paint(width, height, v = {}) {
  const {
    seed = 1,
    top = NAVY,
    base = NAVY2,
    glow = TEAL,
    glowX = 0.7,
    glowY = 0.3,
    glowStrength = 0.6,
    glowMix = 0.55,
    edge = NAVY2,
    edgeStrength = 0.9,
    wash = null,
    washAmount = 0,
    grain = 0,
  } = v;
  const rng = mulberry32(seed);
  const buf = Buffer.alloc(width * height * 3);
  const cx = glowX * width;
  const cy = glowY * height;
  const maxD = Math.hypot(width, height);
  for (let y = 0; y < height; y++) {
    const vy = y / height;
    for (let x = 0; x < width; x++) {
      const vx = x / width;
      let col = mix(top, base, Math.pow(vy, 1.1));
      const d = Math.hypot(x - cx, y - cy) / maxD;
      const g = Math.max(0, 1 - d * 2.1) * glowStrength;
      col = mix(col, glow, g * glowMix);
      if (wash && washAmount > 0) col = mix(col, wash, g * washAmount);
      const vig = Math.max(0, Math.hypot(vx - 0.5, vy - 0.5) - 0.28) * edgeStrength;
      col = mix(col, edge, vig);
      const n = grain > 0 ? (rng() - 0.5) * grain : 0;
      const i = (y * width + x) * 3;
      buf[i] = clamp(col[0] + n);
      buf[i + 1] = clamp(col[1] + n);
      buf[i + 2] = clamp(col[2] + n);
    }
  }
  return encodePNG(width, height, buf);
}

// Rich navy media field with a teal glow — dark enough for paper captions.
const media = (extra = {}) => ({
  top: NAVY,
  base: NAVY2,
  glow: TEAL,
  glowStrength: 0.62,
  glowMix: 0.6,
  edge: NAVY2,
  edgeStrength: 1.0,
  wash: TEAL,
  washAmount: 0.14,
  ...extra,
});

// ---- Poster set ------------------------------------------------------------
const posters = [
  { name: 'hero', w: 1600, h: 900, v: media({ seed: 7, glowX: 0.72, glowY: 0.34 }) },
  { name: 'scrub', w: 1280, h: 720, v: media({ seed: 21, glowX: 0.3, glowY: 0.62, glowStrength: 0.5 }) },
  { name: 'masked', w: 1600, h: 720, v: media({ seed: 33, glowX: 0.5, glowY: 0.5, glowStrength: 0.8, washAmount: 0.2 }) },
  // Dark ambient for the enquiry panel.
  { name: 'ambient-deep', w: 1280, h: 720, v: media({ seed: 44, glowX: 0.4, glowY: 0.4, glowStrength: 0.45, glow: TEAL_DEEP }) },
  // Light ambient wash for the (light) testimonials section.
  {
    name: 'ambient',
    w: 1280,
    h: 720,
    v: {
      seed: 55,
      top: PAPER,
      base: [233, 240, 238],
      glow: TEAL,
      glowX: 0.5,
      glowY: 0.4,
      glowStrength: 0.45,
      glowMix: 0.28,
      edge: [223, 232, 230],
      edgeStrength: 0.5,
    },
  },
  // Destinations / packages — navy fields, distinct teal glow signatures.
  { name: 'maldives-mauritius', w: 1200, h: 1500, v: media({ seed: 101, glowX: 0.6, glowY: 0.7, washAmount: 0.22 }) },
  { name: 'vietnam-cambodia', w: 1500, h: 1000, v: media({ seed: 102, glowX: 0.75, glowY: 0.3 }) },
  { name: 'malaysia', w: 1200, h: 1200, v: media({ seed: 103, glowX: 0.32, glowY: 0.42, glow: TEAL_DEEP }) },
  { name: 'singapore', w: 1200, h: 1200, v: media({ seed: 104, glowX: 0.7, glowY: 0.55 }) },
  { name: 'dubai-uae', w: 1200, h: 1500, v: media({ seed: 105, glowX: 0.5, glowY: 0.26, glowStrength: 0.72, washAmount: 0.2 }) },
  { name: 'sri-lanka', w: 1500, h: 1000, v: media({ seed: 106, glowX: 0.3, glowY: 0.66, glow: TEAL_DEEP }) },
];

for (const p of posters) {
  const png = paint(p.w, p.h, p.v);
  writeFileSync(join(VIDEOS, `${p.name}.png`), png);
  console.log(`poster  ${p.name}.png  ${p.w}x${p.h}  ${(png.length / 1024).toFixed(1)}KB`);
}

// ---- OG cards (1200x630) — premium dark brand cards ------------------------
const ogNames = [
  'default',
  'maldives-mauritius',
  'vietnam-cambodia',
  'malaysia',
  'singapore',
  'dubai-uae',
  'sri-lanka',
];
ogNames.forEach((name, idx) => {
  const png = paint(1200, 630, media({ seed: 200 + idx, glowX: 0.78, glowY: 0.34, glowStrength: 0.55 }));
  writeFileSync(join(OG, `${name}.png`), png);
  console.log(`og      ${name}.png  1200x630  ${(png.length / 1024).toFixed(1)}KB`);
});

console.log('\nDone. Posters in public/videos, OG cards in public/og.');
