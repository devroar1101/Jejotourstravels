'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinematicVideo from '@/components/CinematicVideo';
import { useReducedMotion } from '@/lib/hooks';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Travel the World" band — a mosaic of every destination that opens on scroll
 * via an animated clip-path, with a serif title set over it. The background is
 * the all-destinations collage (media="masked").
 */
export default function MaskedBand({
  eyebrow = 'Domestic & International Tour Packages',
  media = 'masked',
}: {
  eyebrow?: string;
  media?: string;
}) {
  const reduced = useReducedMotion();
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = bandRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(42% 8% 42% 8%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'bottom 60%',
            scrub: 1,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      className="relative bg-paper py-10"
      aria-label="Travel the World — our tour packages"
    >
      <div
        ref={bandRef}
        className="relative h-[52vh] w-full overflow-hidden md:h-[70vh]"
        style={reduced ? undefined : { clipPath: 'inset(42% 8% 42% 8%)' }}
      >
        <CinematicVideo
          name={media}
          label="A mosaic of the destinations JEJO arranges"
          width={1600}
          height={720}
          mode="masked"
          scrim={0.4}
          className="h-full"
        />
        {/* Legibility wash so the title reads over the mosaic. */}
        <div className="pointer-events-none absolute inset-0 bg-navy/45" />

        {/* Title */}
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <div>
            <p className="eyebrow mb-4" style={{ color: 'var(--paper)' }}>
              {eyebrow}
            </p>
            <h2
              className="font-display leading-[0.92] text-paper"
              style={{
                fontSize: 'clamp(2.6rem, 7vw, 7rem)',
                textShadow: '0 4px 40px rgba(10,14,24,0.6)',
              }}
            >
              Travel
              <br />
              the World
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
