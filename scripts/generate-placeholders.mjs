#!/usr/bin/env node
/**
 * ffmpeg placeholder VIDEO generator (optional).
 *
 * Bakes small, brand-palette animated loops as .webm (VP9) + .mp4 (H.264
 * baseline) for every media slot, so the site previews with real motion
 * before production footage arrives. Cloudflare Pages never runs this — the
 * committed .png posters already keep the build green. Run locally with
 * ffmpeg installed: `npm run placeholders`.
 *
 * When real footage arrives, replace the files in /public/videos with the
 * same basenames and the specs documented in README.md.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'videos');
mkdirSync(OUT, { recursive: true });

function hasFfmpeg() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (!hasFfmpeg()) {
  console.error(
    'ffmpeg not found. Install ffmpeg to generate placeholder videos, or\n' +
      'ship real footage into /public/videos. The committed .png posters keep\n' +
      'the build green in the meantime — this step is optional.',
  );
  process.exit(0);
}

// Brand palette — navy #13294C, deep navy #0E1F3A, teal #14A3A0, paper #F7F5F0.
const clips = [
  { name: 'hero', w: 1280, h: 720, dur: 16, c0: '0x0E1F3A', c1: '0x14A3A0', speed: 0.06 },
  { name: 'scrub', w: 1280, h: 720, dur: 12, c0: '0x13294C', c1: '0x14A3A0', speed: 0.12 },
  { name: 'masked', w: 1280, h: 576, dur: 10, c0: '0x0E1F3A', c1: '0x14A3A0', speed: 0.08 },
  { name: 'ambient', w: 960, h: 540, dur: 8, c0: '0xF7F5F0', c1: '0xE5EEEC', speed: 0.05 },
  { name: 'ambient-deep', w: 960, h: 540, dur: 8, c0: '0x0E1F3A', c1: '0x0C6E6C', speed: 0.05 },
  { name: 'maldives-mauritius', w: 720, h: 900, dur: 6, c0: '0x0E1F3A', c1: '0x14A3A0', speed: 0.1 },
  { name: 'vietnam-cambodia', w: 960, h: 640, dur: 6, c0: '0x13294C', c1: '0x14A3A0', speed: 0.1 },
  { name: 'malaysia', w: 800, h: 800, dur: 6, c0: '0x0E1F3A', c1: '0x0C6E6C', speed: 0.1 },
  { name: 'singapore', w: 800, h: 800, dur: 6, c0: '0x13294C', c1: '0x14A3A0', speed: 0.1 },
  { name: 'dubai-uae', w: 720, h: 900, dur: 6, c0: '0x0E1F3A', c1: '0x14A3A0', speed: 0.1 },
  { name: 'sri-lanka', w: 960, h: 640, dur: 6, c0: '0x0E1F3A', c1: '0x0C6E6C', speed: 0.1 },
];

const src = (c) =>
  `gradients=s=${c.w}x${c.h}:c0=${c.c0}:c1=${c.c1}:x0=0:y0=0:` +
  `x1=${c.w}:y1=${c.h}:speed=${c.speed}:duration=${c.dur}:type=radial,` +
  `format=yuv420p,vignette=PI/4`;

for (const c of clips) {
  const webm = join(OUT, `${c.name}.webm`);
  const mp4 = join(OUT, `${c.name}.mp4`);
  console.log(`encoding ${c.name} (${c.w}x${c.h}, ${c.dur}s)…`);
  // VP9 webm
  execFileSync(
    'ffmpeg',
    ['-y', '-f', 'lavfi', '-i', src(c), '-c:v', 'libvpx-vp9', '-b:v', '0',
     '-crf', '40', '-an', '-t', String(c.dur), webm],
    { stdio: 'ignore' },
  );
  // H.264 baseline mp4
  execFileSync(
    'ffmpeg',
    ['-y', '-f', 'lavfi', '-i', src(c), '-c:v', 'libx264', '-profile:v', 'baseline',
     '-pix_fmt', 'yuv420p', '-crf', '30', '-movflags', '+faststart', '-an',
     '-t', String(c.dur), mp4],
    { stdio: 'ignore' },
  );
}

console.log('\nPlaceholder videos written to public/videos.');
