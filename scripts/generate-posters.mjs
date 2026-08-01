#!/usr/bin/env node
/**
 * Pure-Node poster + OG generator. No ffmpeg, no npm dependencies.
 *
 * Coastal Editorial palette — brand navy, teal and warm paper. Instead of flat
 * gradients these compose an atmospheric "scene": a graded sky, a lit horizon,
 * a sun/atmosphere glow, water reflection and haze bands, with light grain and
 * a vignette. Still abstract and on-brand, but reads photographic. They are the
 * committed placeholders so the repo previews and builds green before real
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
const NAVY2 = [10, 20, 40];
const TEAL = [20, 163, 160];
const TEAL_DEEP = [12, 110, 108];
const PAPER = [247, 245, 240];
const BRIGHT = [206, 232, 226]; // pale teal-paper, the lit horizon

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => [
  lerp(c1[0], c2[0], t),
  lerp(c1[1], c2[1], t),
  lerp(c1[2], c2[2], t),
];
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
const smooth = (t) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

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
/**
 * Median-cut colour quantisation to <=256 colours. The scene gamut is a narrow
 * navy->teal->paper ramp, so an indexed palette reproduces it cleanly and
 * compresses several times smaller than truecolour.
 */
function medianCut(pixels, maxColors) {
  if (pixels.length === 0) return [[0, 0, 0]];
  let boxes = [pixels];
  while (boxes.length < maxColors) {
    let bi = -1;
    let brange = -1;
    let bchan = 0;
    for (let i = 0; i < boxes.length; i++) {
      const bx = boxes[i];
      if (bx.length < 2) continue;
      const mn = [255, 255, 255];
      const mx = [0, 0, 0];
      for (const p of bx)
        for (let c = 0; c < 3; c++) {
          if (p[c] < mn[c]) mn[c] = p[c];
          if (p[c] > mx[c]) mx[c] = p[c];
        }
      const rng = [mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]];
      const m = Math.max(rng[0], rng[1], rng[2]);
      if (m > brange) {
        brange = m;
        bi = i;
        bchan = rng.indexOf(m);
      }
    }
    if (bi < 0) break;
    const bx = boxes[bi];
    bx.sort((a, b) => a[bchan] - b[bchan]);
    const mid = bx.length >> 1;
    boxes.splice(bi, 1, bx.slice(0, mid), bx.slice(mid));
  }
  return boxes.map((bx) => {
    const s = [0, 0, 0];
    for (const p of bx) for (let c = 0; c < 3; c++) s[c] += p[c];
    const n = bx.length || 1;
    return [s[0] / n, s[1] / n, s[2] / n];
  });
}

function encodePNG(width, height, rgb) {
  // Build a palette from a subsample of the image.
  const N = width * height;
  const step = Math.max(1, Math.floor(N / 24000));
  const sample = [];
  for (let i = 0; i < N; i += step)
    sample.push([rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]]);
  const palette = medianCut(sample, 256);

  // 32^3 nearest-colour LUT for fast mapping.
  const lut = new Uint8Array(32768);
  for (let r = 0; r < 32; r++)
    for (let g = 0; g < 32; g++)
      for (let b = 0; b < 32; b++) {
        const R = r * 8 + 4;
        const G = g * 8 + 4;
        const B = b * 8 + 4;
        let best = 0;
        let bd = 1e9;
        for (let p = 0; p < palette.length; p++) {
          const dr = R - palette[p][0];
          const dg = G - palette[p][1];
          const db = B - palette[p][2];
          const d = dr * dr + dg * dg + db * db;
          if (d < bd) {
            bd = d;
            best = p;
          }
        }
        lut[(r << 10) | (g << 5) | b] = best;
      }

  // 8x8 Bayer matrix — ordered dithering breaks up quantisation banding
  // without the random noise that would wreck compression.
  const BAYER = [
    0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
    14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
    51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
    61, 29, 53, 21,
  ];
  const AMP = 14; // dither amplitude in 0-255
  const cl = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
  const raw = Buffer.alloc((width + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width + 1)] = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      const d = (BAYER[(y & 7) * 8 + (x & 7)] / 64 - 0.5) * AMP;
      const r = cl(rgb[i] + d);
      const g = cl(rgb[i + 1] + d);
      const b = cl(rgb[i + 2] + d);
      raw[y * (width + 1) + 1 + x] =
        lut[((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3)];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 3; // indexed colour
  const plte = Buffer.alloc(palette.length * 3);
  palette.forEach((c, i) => {
    plte[i * 3] = clamp(c[0]);
    plte[i * 3 + 1] = clamp(c[1]);
    plte[i * 3 + 2] = clamp(c[2]);
  });
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('PLTE', plte),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Compose an atmospheric scene within the brand palette.
 */
function scene(width, height, v = {}) {
  const {
    seed = 1,
    horizon = 0.62,
    sunX = 0.7,
    sunStrength = 0.9,
    sunColor = BRIGHT,
    skyTop = NAVY,
    skyHorizon = TEAL,
    ground = NAVY,
    groundBottom = NAVY2,
    haze = 0.6,
    reflection = 0.6,
    // Grain stays 0 so smooth gradients compress to KB scale — the film grain
    // is a CSS overlay at runtime.
    grain = 0,
    vignette = 0.85,
  } = v;
  const rng = mulberry32(seed);
  const buf = Buffer.alloc(width * height * 3);
  const sunPx = sunX * width;
  const horPx = horizon * height;
  const sigma = width * 0.26;

  // A shared shoreline colour keeps the sky/water join seamless.
  const horizonColor = mix(skyHorizon, BRIGHT, 0.5 + haze * 0.2);

  for (let y = 0; y < height; y++) {
    const vy = y / height;
    for (let x = 0; x < width; x++) {
      const vx = x / width;
      let col;
      if (vy < horizon) {
        // sky: dark up top, easing continuously into the shoreline colour
        col = mix(skyTop, horizonColor, smooth(vy / horizon));
      } else {
        // water/land: shoreline colour fading to a dark foreground
        const t = smooth((vy - horizon) / (1 - horizon));
        col = mix(horizonColor, groundBottom, t);
        // sun reflection column with a slow ripple
        const rx = Math.abs(vx - sunX);
        const ripple = 0.7 + 0.3 * Math.sin(vy * height * 0.045);
        const refl =
          Math.max(0, 1 - rx / 0.16) *
          Math.max(0, 1 - t * 1.1) *
          reflection *
          ripple;
        col = mix(col, sunColor, Math.min(0.7, refl));
      }
      // sun / atmosphere glow at the horizon
      const dx = x - sunPx;
      const dy = y - horPx;
      const glow = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma)) * sunStrength;
      col = mix(col, sunColor, Math.min(0.85, glow));
      // vignette
      const vig = Math.max(0, Math.hypot(vx - 0.5, vy - 0.5) - 0.34) * vignette;
      col = mix(col, NAVY2, vig);
      // optional light grain (off by default — CSS overlay handles texture)
      const g = grain > 0 ? (rng() - 0.5) * grain : 0;
      const i = (y * width + x) * 3;
      buf[i] = clamp(col[0] + g);
      buf[i + 1] = clamp(col[1] + g);
      buf[i + 2] = clamp(col[2] + g);
    }
  }
  return encodePNG(width, height, buf);
}

// ---- Poster set — each evokes its destination through light + horizon ------
const posters = [
  { name: 'hero', w: 1440, h: 810, v: { seed: 7, horizon: 0.6, sunX: 0.72, sunStrength: 0.95, reflection: 0.7 } },
  { name: 'scrub', w: 1280, h: 720, v: { seed: 21, horizon: 0.55, sunX: 0.32, sunStrength: 0.8 } },
  { name: 'masked', w: 1440, h: 648, v: { seed: 33, horizon: 0.5, sunX: 0.5, sunStrength: 1.0, haze: 0.8 } },
  // Maldives — low horizon, wide lagoon, bright reflection.
  { name: 'maldives-mauritius', w: 1200, h: 1500, v: { seed: 101, horizon: 0.64, sunX: 0.6, sunStrength: 0.95, reflection: 0.85 } },
  // Halong / Angkor — misty, layered haze.
  { name: 'vietnam-cambodia', w: 1500, h: 1000, v: { seed: 102, horizon: 0.62, sunX: 0.76, haze: 0.9, skyHorizon: TEAL_DEEP } },
  // Malaysia — cooler, deep teal.
  { name: 'malaysia', w: 1200, h: 1200, v: { seed: 103, horizon: 0.58, sunX: 0.38, skyHorizon: TEAL_DEEP, sunStrength: 0.75 } },
  // Singapore — brighter city glow.
  { name: 'singapore', w: 1200, h: 1200, v: { seed: 104, horizon: 0.62, sunX: 0.7, sunStrength: 1.0 } },
  // Dubai — high sky, warm bright dusk.
  { name: 'dubai-uae', w: 1200, h: 1500, v: { seed: 105, horizon: 0.5, sunX: 0.5, sunStrength: 1.0, sunColor: [230, 240, 232], haze: 0.7 } },
  // Sri Lanka — tea hills, deep teal, soft haze.
  { name: 'sri-lanka', w: 1500, h: 1000, v: { seed: 106, horizon: 0.66, sunX: 0.3, skyHorizon: TEAL_DEEP, haze: 0.85 } },
  // Domestic (India) — portrait cards, varied glow signatures.
  { name: 'kerala', w: 1000, h: 1333, v: { seed: 301, horizon: 0.64, sunX: 0.4, skyHorizon: TEAL_DEEP, haze: 0.85 } },
  { name: 'kashmir', w: 1000, h: 1333, v: { seed: 302, horizon: 0.52, sunX: 0.6, sunColor: [225, 236, 232] } },
  { name: 'goa', w: 1000, h: 1333, v: { seed: 303, horizon: 0.66, sunX: 0.72, sunStrength: 1.0 } },
  { name: 'rajasthan', w: 1000, h: 1333, v: { seed: 304, horizon: 0.5, sunX: 0.5, sunStrength: 1.0, sunColor: [232, 240, 230], haze: 0.7 } },
  { name: 'andaman', w: 1000, h: 1333, v: { seed: 305, horizon: 0.66, sunX: 0.58, reflection: 0.85 } },
  { name: 'himachal', w: 1000, h: 1333, v: { seed: 306, horizon: 0.5, sunX: 0.3, skyHorizon: TEAL_DEEP, haze: 0.9 } },
];

for (const p of posters) {
  const png = scene(p.w, p.h, p.v);
  writeFileSync(join(VIDEOS, `${p.name}.png`), png);
  console.log(`poster  ${p.name}.png  ${p.w}x${p.h}  ${(png.length / 1024).toFixed(1)}KB`);
}

// Ambient (light section) — a pale high-key wash, barely-there.
{
  const png = scene(1280, 720, {
    seed: 55,
    horizon: 0.55,
    sunX: 0.5,
    sunStrength: 0.5,
    sunColor: PAPER,
    skyTop: [225, 233, 230],
    skyHorizon: BRIGHT,
    ground: BRIGHT,
    groundBottom: [223, 232, 229],
    haze: 0.3,
    reflection: 0.2,
    vignette: 0.4,
  });
  writeFileSync(join(VIDEOS, 'ambient.png'), png);
  console.log(`poster  ambient.png  1280x720  ${(png.length / 1024).toFixed(1)}KB`);
}
// Ambient (dark variant) — optional.
{
  const png = scene(1280, 720, { seed: 66, horizon: 0.5, sunX: 0.4, sunStrength: 0.55, skyHorizon: TEAL_DEEP, reflection: 0.4 });
  writeFileSync(join(VIDEOS, 'ambient-deep.png'), png);
  console.log(`poster  ambient-deep.png  1280x720  ${(png.length / 1024).toFixed(1)}KB`);
}

// ---- OG cards (1200x630) — hero-like scene ---------------------------------
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
  const png = scene(1200, 630, { seed: 200 + idx, horizon: 0.6, sunX: 0.74, sunStrength: 0.9, reflection: 0.6 });
  writeFileSync(join(OG, `${name}.png`), png);
  console.log(`og      ${name}.png  1200x630  ${(png.length / 1024).toFixed(1)}KB`);
});

console.log('\nDone. Posters in public/videos, OG cards in public/og.');
