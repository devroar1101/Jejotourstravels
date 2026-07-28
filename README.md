# JEJO Tours & Travels

A flagship, editorial website for JEJO Tours & Travels — an international tour
operator based in Tamil Nadu (Madurai / Trichy / Chennai). Built for a static
deploy on Cloudflare Pages, video-forward, WhatsApp as the only conversion path.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind (custom tokens) ·
  GSAP + ScrollTrigger · Lenis · Framer Motion
- **Output:** fully static export (`output: 'export'` → `/out`). No server code,
  no API routes, no middleware.
- **Theme:** *Coastal Editorial* — brand navy `#13294C` and teal `#14A3A0` on
  warm paper `#F7F5F0`.

---

## Cloudflare Pages — dashboard settings

Create a Pages project from this repository and set:

| Setting | Value |
| --- | --- |
| Framework preset | **None** (do not pick “Next.js”; this is a static export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | `/` |
| Node version | set env var `NODE_VERSION` = `20` |

**Environment variables** (Settings → Environment variables):

```
NODE_VERSION = 20
```

The repo also ships `.nvmrc` (`20`) so local `nvm use` matches the deploy.

That is all that is required. The build produces `/out` with `index.html`,
`404.html`, `sitemap.xml`, `robots.txt`, `_headers`, `_redirects`, hashed
`_next/static`, self-hosted fonts, posters and OG cards. It is designed to build
green on the very first push.

### Why it stays static (do not add these)

`output: 'export'` breaks silently if any of the following are introduced:

- an `app/api/` directory, or a `functions/` directory (Pages Functions)
- `middleware.ts`
- ISR / `revalidate`, or server components doing runtime `fetch`
- `next/font` remote fetching at build time (fonts are self-hosted in
  `/public/fonts`)
- `next/image` optimization — `images.unoptimized` is **on**; the Pages export
  does not run the optimizer.

---

## Local development

```bash
nvm use            # Node 20
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
```

Preview the static export with any static server pointed at `./out`.

---

## Media / video asset spec sheet

Video is the core of this build. One reusable `<CinematicVideo />` component
drives five treatments. It is **poster-first**: the poster paints immediately
(declared dimensions → zero layout shift) and the `<video>` is only mounted when
in view and motion is allowed. Missing video files degrade silently to the
poster, so the site looks intentional before real footage arrives.

### What ships in the repo now (placeholders)

- **Posters** — committed `public/videos/*.png` and `public/og/*.png`, generated
  by a pure-Node script (no ffmpeg, no dependencies):

  ```bash
  npm run posters
  ```

- **Placeholder videos (optional)** — if you have `ffmpeg` installed you can bake
  small brand-coloured loops so the site previews with motion:

  ```bash
  npm run placeholders
  ```

  Cloudflare Pages never runs ffmpeg; the committed posters keep the build green.

### Real footage to supply

Drop real files into `public/videos/` using these **exact basenames**. Each slot
needs `.webm` (VP9) **and** `.mp4` (H.264 baseline) **and** a matching poster
(replace the `.png`; production posters should be `.avif` at the same basename
and dimensions).

| Basename | Treatment | Suggested spec |
| --- | --- | --- |
| `hero` | 1 — full-bleed hero loop | 12–18s silent aerial, downscaled 4K, < 3 MB above-the-fold budget. Mobile: 720p vertical < 2 MB |
| `scrub` | 2 — scroll-scrubbed | 10–14s, even keyframes for smooth `currentTime` scrubbing |
| `scrub-sprite.webp` | 2 — iOS fallback | horizontal 48-frame WebP sprite strip (iOS Safari stutters on scrubbing) |
| `masked` | 4 — masked reveal band | 8–12s, works cropped to a wide band |
| `ambient` | 5 — ambient (light sections) | 8s soft loop; rendered blurred at 0.25 opacity |
| `ambient-deep` | 5 — ambient (dark variant) | optional dark alternative |
| `maldives-mauritius` | 3 — destination hover / card | 6s loop, portrait-friendly |
| `vietnam-cambodia` | 3 | 6s loop |
| `malaysia` | 3 | 6s loop |
| `singapore` | 3 | 6s loop |
| `dubai-uae` | 3 | 6s loop |
| `sri-lanka` | 3 | 6s loop |

### Hard performance rules (enforced by the component + build)

- Every video ships `.webm` (VP9) **and** `.mp4` (H.264 baseline).
- Every video has a matching poster with declared width/height — zero layout
  shift.
- Above-the-fold video weight under 3 MB total.
- Nothing autoplays with audio (all `muted playsInline`).
- `prefers-reduced-motion`: all videos become posters, all scrubbing turns off,
  every transform is disabled (opacity fades only).
- Videos live in `/public/videos` with immutable cache headers (`public/_headers`).
- Mobile hero is poster-only on `Save-Data` or an effective connection slower
  than 4g.

---

## Conversion — WhatsApp only

There is no contact form, no email capture, and no network calls. Every CTA
opens a multi-step drawer (destination → month → travellers → budget → name +
Indian mobile), persists the draft to `sessionStorage`, and on submit opens:

```
https://wa.me/918610580975?text=<encoded message>
```

with a fallback chain (visible “Open WhatsApp” link → “Copy enquiry” →
`tel:+918610580975`) for in-app browsers that block pop-ups. Deep link
`/?enquire=<slug>` opens the drawer pre-filled at the month step. The whole
payload is a single typed object (`lib/enquiry.ts`) so a backend can be wired in
later without touching the UI.

---

## Content

All content lives in typed files under `/content` (no CMS): `packages.ts`,
`services.ts`, `testimonials.ts`, `destinations.ts`, `site.ts`. Prices are real
and presented as “from”, per person, in INR.

## SEO

- JSON-LD `TravelAgency` + a `Product` per package (real prices) in the document
  head.
- `sitemap.xml` and `robots.txt` emitted into `/out` at build.
- Per-package OG images in `/public/og`.
- No cookies, no analytics, no third-party embeds.

## Brand

- **Email:** jejo.tourism10@gmail.com
- **Phone / WhatsApp:** +91 86105 80975
- **Languages:** Tamil, English, Hindi
