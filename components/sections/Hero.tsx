'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import CinematicVideo from '@/components/CinematicVideo';
import EnquiryCTA from '@/components/enquiry/EnquiryCTA';
import { useReducedMotion } from '@/lib/hooks';
import { site } from '@/content/site';

const HEADLINE = ['The', 'Art', 'of', 'the', 'Journey'];

export default function Hero() {
  const reduced = useReducedMotion();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [started, setStarted] = useState(false);

  // Reveal headline on the video's canplay — with a fallback timer so the
  // poster-only path (reduced motion / constrained network) still animates.
  useEffect(() => {
    const fallback = window.setTimeout(() => setStarted(true), 1200);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (!started) return;
    const el = headlineRef.current;
    if (!el) return;
    const words = el.querySelectorAll('.word-inner');
    // Reveal the headline container (starts opacity:0 via .split-hide).
    gsap.set(el, { autoAlpha: 1 });
    if (reduced) {
      gsap.set(words, { yPercent: 0 });
      return;
    }
    gsap.fromTo(
      words,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.08 },
    );
  }, [started, reduced]);

  return (
    <section
      className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden"
      aria-label="Introduction"
    >
      {/* Full-bleed cinematic loop */}
      <div className="absolute inset-0 grain">
        <div className={reduced ? '' : 'hero-drift h-full w-full'}>
          <CinematicVideo
            name="hero"
            clips={['hero-burj', 'hero-kerala', 'hero-maldives']}
            label="Cinematic footage of the destinations JEJO arranges"
            width={1600}
            height={900}
            mode="hero"
            scrim={0.85}
            position="center"
            className="h-full"
            onCanPlay={() => setStarted(true)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 pb-16 md:px-12 md:pb-24">
        <div className="mx-auto max-w-editorial">
          <p className="eyebrow mb-6">
            International Travel · Tamil Nadu, India
          </p>
          <h1
            ref={headlineRef}
            className="split-hide font-display text-display leading-[0.92] text-paper"
          >
            {HEADLINE.map((word, i) => (
              <span key={i} className="word-mask mr-[0.22em]">
                <span className="word-inner">{word}</span>
              </span>
            ))}
          </h1>
          <div className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
            <p className="max-w-md font-body text-lg text-paper-dim">
              {site.name} arranges considered international journeys from
              Madurai, Trichy and Chennai. Small groups. Careful planning.
            </p>
            <EnquiryCTA tone="onDark">Plan your journey</EnquiryCTA>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <span className="eyebrow" style={{ color: 'var(--paper)' }}>
          Scroll
        </span>
      </div>
    </section>
  );
}
