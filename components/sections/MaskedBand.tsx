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
 * Treatment 4 — masked reveal. A horizontal band of video expands open on
 * scroll via an animated clip-path, with a serif wordmark knocked out of the
 * footage using background-clip: text.
 */
export default function MaskedBand({
  word = 'JEJO',
  media = 'masked',
}: {
  word?: string;
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
    <section className="relative bg-paper py-10" aria-hidden>
      <div
        ref={bandRef}
        className="relative h-[46vh] w-full overflow-hidden md:h-[64vh]"
        style={reduced ? undefined : { clipPath: 'inset(42% 8% 42% 8%)' }}
      >
        <CinematicVideo
          name={media}
          label={`${word} — motion divider`}
          width={1600}
          height={720}
          mode="masked"
          scrim={0.4}
          className="h-full"
        />
        {/* Quiet caption over the expanding band. */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="eyebrow" style={{ color: 'var(--paper)' }}>
            {word}
          </span>
        </div>
      </div>
    </section>
  );
}
