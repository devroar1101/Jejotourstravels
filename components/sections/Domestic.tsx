'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EnquiryCTA from '@/components/enquiry/EnquiryCTA';
import { domestic } from '@/content/domestic';
import { useReducedMotion } from '@/lib/hooks';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Domestic() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  // Same pinned horizontal scroll as the Signature Journeys rail.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScroll = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScroll()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });
      return () => {
        tween.kill();
      };
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="domestic"
      className="relative overflow-hidden bg-paper"
      aria-label="Within India"
    >
      {/* Heading rail */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 w-full px-6 pt-10 md:px-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow mb-3">Within India</p>
            <h2 className="font-display text-display-sm leading-none text-navy">
              Closer to home
            </h2>
          </div>
          <div className="hidden w-40 md:block">
            <div className="h-px w-full bg-navy-faint">
              <div
                className="h-px bg-teal"
                style={{
                  transform: `scaleX(${reduced ? 1 : progress})`,
                  transformOrigin: 'left',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Track — pinned horizontal on desktop, native scroll otherwise */}
      <div
        ref={trackRef}
        className={`flex ${
          reduced ? 'snap-x snap-mandatory overflow-x-auto no-scrollbar' : ''
        } h-[100svh] items-center gap-6 px-6 pt-40 md:gap-10 md:px-12`}
      >
        {domestic.map((d) => {
          const on = hovered === d.media;
          return (
            <article
              key={d.media}
              onMouseEnter={() => setHovered(d.media)}
              onMouseLeave={() => setHovered(null)}
              data-cursor="VIEW"
              className="group relative h-[62vh] w-[74vw] shrink-0 snap-center overflow-hidden sm:w-[52vw] md:w-[34vw] lg:w-[26vw]"
            >
              <img
                src={`/videos/${d.media}.png`}
                alt={d.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial"
                style={{ transform: on ? 'scale(1.06)' : 'scale(1)' }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(11,22,42,0.85) 0%, rgba(11,22,42,0.15) 55%, rgba(11,22,42,0) 100%)',
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 transition-shadow duration-500"
                style={{
                  boxShadow: on
                    ? 'inset 0 0 0 2px rgba(20,163,160,0.7)'
                    : 'inset 0 0 0 0 transparent',
                }}
              />
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                <span className="eyebrow mb-1" style={{ color: 'var(--teal)' }}>
                  India
                </span>
                <h3
                  className="font-display text-3xl text-paper md:text-4xl"
                  style={{ textShadow: '0 2px 20px rgba(11,22,42,0.7)' }}
                >
                  {d.name}
                </h3>
                <p className="mt-2 max-w-xs font-body text-sm text-paper-dim">
                  {d.line}
                </p>
              </div>
            </article>
          );
        })}

        {/* Tail card */}
        <div className="flex h-[62vh] w-[70vw] shrink-0 snap-center flex-col justify-center px-4 md:w-[30vw]">
          <p className="font-display text-3xl leading-tight text-navy">
            Planning within India?
          </p>
          <p className="mt-4 font-body text-navy-dim">
            Tell us the dates and the places. We arrange the rest.
          </p>
          <div className="mt-8">
            <EnquiryCTA variant="ghost">Plan a domestic trip</EnquiryCTA>
          </div>
        </div>
      </div>
    </section>
  );
}
