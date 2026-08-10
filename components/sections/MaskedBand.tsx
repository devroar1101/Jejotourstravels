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

interface Pkg {
  name: string;
  slug: string;
  media: string;
  price: number;
}

// The eight headline packages (combined routes point to their closest page).
const PACKAGES: Pkg[] = [
  { name: 'Ooty · Kodaikanal · Coorg', slug: 'ooty-kodaikanal', media: 'ooty-kodaikanal', price: 10999 },
  { name: 'Kerala', slug: 'kerala', media: 'kerala', price: 12999 },
  { name: 'Andaman Island', slug: 'andaman-lakshadweep', media: 'andaman', price: 14999 },
  { name: 'Delhi · Shimla · Kullu Manali · Darjeeling', slug: 'golden-triangle', media: 'darjeeling', price: 12999 },
  { name: 'Malaysia', slug: 'malaysia', media: 'malaysia', price: 10999 },
  { name: 'Singapore', slug: 'singapore', media: 'singapore', price: 19999 },
  { name: 'Dubai', slug: 'dubai-uae', media: 'dubai-uae', price: 18999 },
  { name: 'Thailand', slug: 'thailand', media: 'thailand', price: 13999 },
];

// Desktop float positions ringing the centred title.
const POS = [
  'left-[2%] top-[5%]',
  'left-[2%] top-[39%]',
  'left-[2%] bottom-[7%]',
  'left-1/2 -translate-x-1/2 top-[3%]',
  'left-1/2 -translate-x-1/2 bottom-[5%]',
  'right-[2%] top-[5%]',
  'right-[2%] top-[39%]',
  'right-[2%] bottom-[7%]',
];

function PackageCard({
  p,
  showName = false,
  onDark = false,
}: {
  p: Pkg;
  showName?: boolean;
  onDark?: boolean;
}) {
  return (
    <Link
      href={`/destinations/${p.slug}/`}
      data-cursor="VIEW"
      aria-label={`${p.name} — from ${inr(p.price)} per person`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl shadow-[0_18px_44px_-18px_rgba(10,14,24,0.8)] ring-1 ring-white/40 transition-transform duration-500 ease-editorial group-hover:-translate-y-1">
        <img
          src={posterPath(p.media)}
          alt=""
          width={400}
          height={533}
          loading="lazy"
          decoding="async"
          className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
        />
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-center"
          style={{
            background: '#A3D45F',
            boxShadow: '0 8px 20px -8px rgba(10,14,24,0.6)',
          }}
        >
          <span className="block font-body text-[0.45rem] font-semibold uppercase leading-none tracking-[0.14em] text-navy/70">
            Starting from
          </span>
          <span className="mt-0.5 block font-display text-sm font-semibold leading-none text-navy">
            {inr(p.price)}
            <span className="ml-0.5 font-body text-[0.62em] font-medium">/pp</span>
          </span>
        </div>
      </div>
      {showName && (
        <h3
          className={`mt-3 text-center font-display text-sm leading-tight transition-colors group-hover:text-teal ${
            onDark ? 'text-paper' : 'text-navy'
          }`}
        >
          {p.name}
        </h3>
      )}
    </Link>
  );
}

/**
 * "Travel the World" — a mosaic of every destination with a serif title, ringed
 * by the eight headline package cards (each links to its detail page). On
 * desktop the cards float around the title; on phones they stack in a grid
 * below the band.
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
        { clipPath: 'inset(34% 6% 34% 6%)' },
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
        className="relative h-[56vh] w-full overflow-hidden md:h-[88vh]"
        style={reduced ? undefined : { clipPath: 'inset(34% 6% 34% 6%)' }}
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
                fontSize: 'clamp(2.4rem, 6.5vw, 6.5rem)',
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
        {PACKAGES.map((p, i) => (
          <div
            key={p.slug}
            className={`absolute z-20 hidden w-24 md:block lg:w-28 xl:w-32 ${POS[i]}`}
          >
            <PackageCard p={p} />
          </div>
        ))}
      </div>

      {/* Mobile: the same packages as a grid below the band. */}
      <div className="mx-auto mt-10 max-w-editorial px-6 md:hidden">
        <div className="grid grid-cols-2 gap-x-4 gap-y-9">
          {PACKAGES.map((p) => (
            <PackageCard key={p.slug} p={p} showName />
          ))}
        </div>
      </div>
    </section>
  );
}
