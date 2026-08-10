'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinematicVideo from '@/components/CinematicVideo';
import EnquiryCTA from '@/components/enquiry/EnquiryCTA';
import { packages } from '@/content/packages';
import { useReducedMotion } from '@/lib/hooks';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SignatureJourneys() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

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
      id="journeys"
      className="relative overflow-hidden bg-paper-2"
      aria-label="Signature Journeys"
    >
      {/* Heading rail */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 w-full px-6 pt-10 md:px-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow mb-3">Six Signature Journeys</p>
            <h2 className="font-display text-display-sm leading-none text-navy">
              Where to next
            </h2>
          </div>
          {/* Progress indicator */}
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
        {packages.map((p, i) => (
          <article
            key={p.slug}
            onMouseEnter={() => setHovered(p.slug)}
            onMouseLeave={() => setHovered(null)}
            className="group relative flex h-[62vh] w-[82vw] shrink-0 snap-center flex-col justify-end overflow-hidden md:w-[42vw] lg:w-[34vw]"
          >
            <div
              className="absolute inset-0 transition-transform duration-[1200ms] ease-editorial will-change-transform"
              style={{ transform: hovered === p.slug ? 'scale(1.06)' : 'scale(1)' }}
            >
              <CinematicVideo
                name={p.media}
                label={`Scenes from the ${p.name} journey`}
                width={1200}
                height={1400}
                mode="hover"
                active={hovered === p.slug}
                scrim={0.7}
                className="absolute inset-0 h-full"
              />
            </div>
            {/* Teal inset ring on hover. */}
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-500"
              style={{
                boxShadow:
                  hovered === p.slug
                    ? 'inset 0 0 0 2px rgba(30,111,214,0.7)'
                    : 'inset 0 0 0 0 transparent',
              }}
            />
            {/* Whole card opens the trip summary. */}
            <Link
              href={`/destinations/${p.slug}/`}
              aria-label={`${p.name} — view trip summary`}
              data-cursor="VIEW"
              className="absolute inset-0 z-[1]"
            />
            <div className="pointer-events-none relative z-10 p-7">
              <div className="mb-4 flex items-center justify-between">
                <span className="eyebrow" style={{ color: 'var(--paper)' }}>{`0${i + 1}`}</span>
                <span className="font-body text-sm text-paper-dim">
                  {p.region} · {p.duration}
                </span>
              </div>
              <h3 className="font-display text-4xl leading-none text-paper md:text-5xl">
                {p.name}
              </h3>
              <p className="mt-4 max-w-sm font-body text-paper-dim">
                {p.summary}
              </p>
              <div className="mt-6 flex items-center justify-end">
                <div className="pointer-events-auto flex items-center gap-5">
                  <Link
                    href={`/destinations/${p.slug}/`}
                    className="link-underline font-body text-sm text-paper-dim hover:text-paper"
                    data-cursor="VIEW"
                  >
                    Summary
                  </Link>
                  <EnquiryCTA slug={p.slug} variant="text">
                    Enquire
                  </EnquiryCTA>
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Tail card */}
        <div className="flex h-[62vh] w-[70vw] shrink-0 snap-center flex-col justify-center px-4 md:w-[30vw]">
          <p className="font-display text-3xl leading-tight text-navy">
            Somewhere not on the list?
          </p>
          <p className="mt-4 font-body text-navy-dim">
            Tell us where you have in mind. We plan custom routes too.
          </p>
          <div className="mt-8">
            <EnquiryCTA variant="ghost">Start a custom plan</EnquiryCTA>
          </div>
        </div>
      </div>
    </section>
  );
}
