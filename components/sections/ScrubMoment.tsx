'use client';

import { useEffect, useRef, useState } from 'react';
import CinematicVideo from '@/components/CinematicVideo';
import EnquiryCTA from '@/components/enquiry/EnquiryCTA';

/**
 * Welcome band — a full-height statement over an ambient loop that introduces
 * JEJO Tours & Travels. No pin and no frame-scrubbing, so the page scrolls
 * straight through. The lines rise in with a stagger on first view.
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
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rise = (i: number) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.9s ease ${0.1 + i * 0.12}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.12}s`,
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-navy py-28"
      aria-label="Welcome to JEJO Tours & Travels"
    >
      {/* Ambient loop background */}
      <div className="absolute inset-0">
        <CinematicVideo
          name="scrub"
          label=""
          width={1280}
          height={720}
          mode="ambient"
          position="center"
          scrim={0.55}
          className="h-full w-full"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-navy/70" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="eyebrow mb-6" style={{ color: 'var(--teal)', ...rise(0) }}>
          Welcome to JEJO Tours &amp; Travels
        </p>

        <h2
          className="font-display text-display-sm leading-[1.05] text-paper md:text-display"
          style={rise(1)}
        >
          Your Journey. Our Responsibility.
        </h2>

        <p
          className="mt-6 font-display text-xl text-teal md:text-2xl"
          style={rise(2)}
        >
          Explore More. Travel Better. Create Memories.
        </p>

        <p
          className="mx-auto mt-10 max-w-2xl font-body text-base leading-relaxed text-paper-dim md:text-lg"
          style={rise(3)}
        >
          Your trusted travel partner for memorable journeys across India and
          around the world. From relaxing family holidays and exciting
          international vacations to pilgrimage tours and customised travel
          packages, we make your travel planning simple, comfortable and
          hassle-free.
        </p>

        <p
          className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-paper-dim md:text-lg"
          style={rise(4)}
        >
          Whether you&rsquo;re planning a weekend getaway, a family vacation, a
          group tour or your dream international holiday, our team is here to
          help you plan every step of your journey.
        </p>

        <div
          className="mt-10 flex justify-center"
          style={rise(5)}
        >
          <EnquiryCTA tone="onDark" variant="solid">
            Start planning
          </EnquiryCTA>
        </div>
      </div>
    </section>
  );
}
