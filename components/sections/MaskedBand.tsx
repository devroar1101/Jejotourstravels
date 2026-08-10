'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinematicVideo from '@/components/CinematicVideo';
import { inr } from '@/content/packages';
import { posterPath } from '@/lib/media';
import { useReducedMotion } from '@/lib/hooks';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Small clickable cards that float over the mosaic (desktop only), each a
// rounded photo with a price sticker linking to its detail page.
const FLOATS = [
  { slug: 'maldives-mauritius', media: 'maldives-mauritius', price: 64900, pos: 'left-[3%] top-[9%]' },
  { slug: 'dubai-uae', media: 'dubai-uae', price: 18999, pos: 'right-[3%] top-[7%]' },
  { slug: 'kerala', media: 'kerala', price: 12999, pos: 'left-[6%] bottom-[9%]' },
  { slug: 'thailand', media: 'thailand', price: 13999, pos: 'right-[5%] bottom-[8%]' },
];

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
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center">
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

        {/* Floating clickable package cards (desktop). */}
        {FLOATS.map((f) => (
          <Link
            key={f.slug}
            href={`/destinations/${f.slug}/`}
            data-cursor="VIEW"
            aria-label={`${f.slug} — from ${inr(f.price)} per person`}
            className={`group absolute z-20 hidden w-32 md:block lg:w-40 ${f.pos}`}
          >
            <div className="relative overflow-hidden rounded-xl shadow-[0_18px_44px_-18px_rgba(10,14,24,0.8)] ring-1 ring-white/40 transition-transform duration-500 ease-editorial group-hover:-translate-y-1">
              <img
                src={posterPath(f.media)}
                alt=""
                width={400}
                height={533}
                loading="lazy"
                decoding="async"
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
              />
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1"
                style={{
                  background: '#A3D45F',
                  boxShadow: '0 8px 20px -8px rgba(10,14,24,0.6)',
                }}
              >
                <span className="block font-display text-xs font-semibold leading-none text-navy">
                  {inr(f.price)}
                  <span className="ml-0.5 font-body text-[0.62em] font-medium">
                    /pp
                  </span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
