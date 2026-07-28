'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/hooks';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LINES = [
  { at: 0.0, text: 'From the first idea' },
  { at: 0.25, text: 'to the paperwork' },
  { at: 0.55, text: 'to the day you land' },
  { at: 0.85, text: 'we hold the details' },
];

// iOS Safari stutters on currentTime scrubbing — branch to a poster/sprite.
const isIOS = (): boolean =>
  typeof navigator !== 'undefined' &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

export default function ScrubMoment() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState(0);
  const [ios, setIos] = useState(false);

  useEffect(() => setIos(isIOS()), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Reduced motion: no pin, no scrub — poster and first line only.
    if (reduced) return;

    const video = videoRef.current;
    const sprite = spriteRef.current;
    // Sprite frame count when using the WebP fallback.
    const SPRITE_FRAMES = 48;

    if (video && !ios) {
      video.preload = 'auto';
      video.load();
    }

    const state = { progress: 0 };

    const ctx = gsap.context(() => {
      gsap.to(state, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            // Copy swaps.
            let idx = 0;
            for (let i = 0; i < LINES.length; i++) if (p >= LINES[i].at) idx = i;
            setLine(idx);
            // Scrub media.
            if (video && !ios && video.duration) {
              video.currentTime = p * video.duration;
            } else if (sprite && ios) {
              const frame = Math.min(
                SPRITE_FRAMES - 1,
                Math.floor(p * SPRITE_FRAMES),
              );
              // Sprite sheet is a horizontal strip of SPRITE_FRAMES frames.
              sprite.style.backgroundPosition = `-${frame * 100}% 0`;
            }
          },
        },
      });
    }, section);
    return () => ctx.revert();
  }, [reduced, ios]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-navy-2"
      aria-label="How we work"
    >
      {/* Video (desktop / non-iOS) */}
      {!ios && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: reduced ? 0 : 1 }}
          muted
          playsInline
          preload="none"
          poster="/videos/scrub.jpg"
          aria-label="A journey coming together, scene by scene"
        >
          <source src="/videos/scrub.webm" type="video/webm" />
          <source src="/videos/scrub.mp4" type="video/mp4" />
        </video>
      )}

      {/* Sprite fallback (iOS) — falls back to the poster if the sprite is absent */}
      {ios && (
        <div
          ref={spriteRef}
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              'image-set(url(/videos/scrub-sprite.webp) 1x), url(/videos/scrub.jpg)',
            backgroundSize: '4800% 100%',
          }}
          aria-hidden
        />
      )}

      {/* Poster underlay for reduced motion */}
      {reduced && (
        <img
          src="/videos/scrub.jpg"
          alt="A journey coming together"
          className="absolute inset-0 h-full w-full object-cover"
          width={1280}
          height={720}
        />
      )}

      {/* Scrim + copy */}
      <div className="absolute inset-0 bg-navy/55" />
      <div className="relative z-10 grid h-full place-items-center px-6 text-center">
        <div>
          <p className="eyebrow mb-6">The way we work</p>
          <h2 className="font-display text-display leading-[0.95] text-paper">
            {LINES[line].text}
          </h2>
        </div>
      </div>
    </section>
  );
}
