'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinematicVideo from '@/components/CinematicVideo';
import EnquiryCTA from '@/components/enquiry/EnquiryCTA';
import { domestic } from '@/content/domestic';
import { useIsTouch, useReducedMotion } from '@/lib/hooks';
import { posterPath } from '@/lib/media';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Slots that ship with real footage. The rest are poster-only, so we never
// mount a <video> for them (which would 404 on a missing .mp4).
const WITH_VIDEO = new Set(['kerala', 'kashmir', 'goa', 'andaman']);

export default function Domestic() {
  const reduced = useReducedMotion();
  const touch = useIsTouch();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  // Never more than two videos decoding at once.
  const [active, setActive] = useState<string[]>([]);

  const activate = useCallback((name: string) => {
    setActive((cur) => (cur.includes(name) ? cur : [name, ...cur].slice(0, 2)));
  }, []);
  const deactivate = useCallback((name: string) => {
    setActive((cur) => cur.filter((n) => n !== name));
  }, []);

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
        {domestic.map((d) => (
          <DomesticCard
            key={d.slug}
            slug={d.slug}
            name={d.name}
            line={d.line}
            media={d.media}
            touch={touch}
            active={active.includes(d.media)}
            onActivate={activate}
            onDeactivate={deactivate}
          />
        ))}

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

function DomesticCard({
  slug,
  name,
  line,
  media,
  touch,
  active,
  onActivate,
  onDeactivate,
}: {
  slug: string;
  name: string;
  line: string;
  media: string;
  touch: boolean;
  active: boolean;
  onActivate: (n: string) => void;
  onDeactivate: (n: string) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const hasVideo = WITH_VIDEO.has(media);

  // Mobile: play the film when the card is 60% in view (no hover on touch).
  useEffect(() => {
    if (!touch || !hasVideo) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onActivate(media);
        else onDeactivate(media);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [touch, hasVideo, media, onActivate, onDeactivate]);

  return (
    <Link
      href={`/destinations/${slug}/`}
      ref={ref}
      onMouseEnter={touch ? undefined : () => onActivate(media)}
      onMouseLeave={touch ? undefined : () => onDeactivate(media)}
      data-cursor="VIEW"
      aria-label={`${name} — view details`}
      className="group relative block h-[62vh] w-[74vw] shrink-0 snap-center overflow-hidden sm:w-[52vw] md:w-[34vw] lg:w-[26vw]"
    >
      <div
        className="absolute inset-0 transition-transform duration-[1200ms] ease-editorial will-change-transform"
        style={{ transform: active ? 'scale(1.06)' : 'scale(1)' }}
      >
        {hasVideo ? (
          <CinematicVideo
            name={media}
            label={`${name} — a domestic journey JEJO arranges within India`}
            width={1000}
            height={1333}
            mode="hover"
            active={active}
            scrim={0.35}
            className="absolute inset-0 h-full"
          />
        ) : (
          // No footage yet — poster only, so no <video> and no 404.
          <img
            src={posterPath(media)}
            alt={`${name} — a domestic journey JEJO arranges within India`}
            width={1000}
            height={1333}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      {/* Bottom gradient for legibility. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(10,14,24,0.85) 0%, rgba(10,14,24,0.15) 55%, rgba(10,14,24,0) 100%)',
        }}
      />
      {/* Teal ring on activate. */}
      <div
        className="pointer-events-none absolute inset-0 transition-shadow duration-500"
        style={{
          boxShadow: active
            ? 'inset 0 0 0 2px rgba(30,111,214,0.7)'
            : 'inset 0 0 0 0 transparent',
        }}
      />
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
        <span className="eyebrow mb-1" style={{ color: 'var(--teal)' }}>
          India
        </span>
        <h3
          className="font-display text-3xl text-paper md:text-4xl"
          style={{ textShadow: '0 2px 20px rgba(10,14,24,0.7)' }}
        >
          {name}
        </h3>
        <p className="mt-2 max-w-xs font-body text-sm text-paper-dim">{line}</p>
      </div>
    </Link>
  );
}
