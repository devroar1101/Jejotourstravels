'use client';

import { useEffect, useRef, useState } from 'react';
import CinematicVideo from '@/components/CinematicVideo';

const LINES = [
  'From the first idea',
  'to the paperwork,',
  'to the day you land —',
  'we hold every detail.',
];

/**
 * "The way we work" — a full-height statement over an ambient loop. No pin and
 * no frame-scrubbing: the page scrolls straight through, so it never feels
 * stuck. The four lines rise in with a gentle stagger the first time the
 * section enters view.
 */
export default function ScrubMoment() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-navy"
      aria-label="The way we work"
    >
      {/* Ambient loop background */}
      <CinematicVideo
        name="scrub"
        label=""
        width={1280}
        height={720}
        mode="ambient"
        position="center"
        scrim={0.55}
        className="absolute inset-0 h-full w-full"
      />
      {/* Deepen the footage so the type stays legible. */}
      <div className="pointer-events-none absolute inset-0 bg-navy/55" />

      <div className="relative z-10 px-6 text-center">
        <p
          className="eyebrow mb-8"
          style={{
            color: 'var(--paper)',
            opacity: shown ? 0.9 : 0,
            transform: shown ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          The way we work
        </p>
        <h2 className="font-display text-display-sm leading-[1.05] text-paper md:text-display">
          {LINES.map((text, i) => (
            <span
              key={text}
              className="block"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0)' : 'translateY(26px)',
                transition: `opacity 0.9s ease ${0.15 + i * 0.16}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.16}s`,
              }}
            >
              {text}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
