'use client';

import Link from 'next/link';
import { inr } from '@/content/packages';
import { posterPath } from '@/lib/media';

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

const LEFT = PACKAGES.slice(0, 4);
const RIGHT = PACKAGES.slice(4, 8);

function PackageCard({ p, onDark = false }: { p: Pkg; onDark?: boolean }) {
  return (
    <Link
      href={`/destinations/${p.slug}/`}
      data-cursor="VIEW"
      aria-label={`${p.name} — from ${inr(p.price)} per person`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl shadow-[0_16px_40px_-18px_rgba(10,14,24,0.7)] ring-1 ring-white/40 transition-transform duration-500 ease-editorial group-hover:-translate-y-1">
        <img
          src={posterPath(p.media)}
          alt=""
          width={400}
          height={500}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
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
      <h3
        className={`mt-3 text-center font-display text-sm leading-tight transition-colors group-hover:text-teal ${
          onDark ? 'text-paper' : 'text-navy'
        }`}
      >
        {p.name}
      </h3>
    </Link>
  );
}

function Title({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="text-center">
      <p className="eyebrow mb-4" style={{ color: 'var(--paper)' }}>
        {eyebrow}
      </p>
      <h2
        className="font-display leading-[0.95] text-paper"
        style={{
          fontSize: 'clamp(2.4rem, 5vw, 5.5rem)',
          textShadow: '0 4px 40px rgba(10,14,24,0.6)',
        }}
      >
        Travel
        <br />
        the World
      </h2>
    </div>
  );
}

/**
 * "Travel the World" — a static feature over the all-destinations mosaic: the
 * serif title in the centre with the eight headline packages ringed around it
 * (four each side on desktop). Cards link to their detail pages. On phones the
 * title sits above a two-column grid of all eight.
 */
export default function MaskedBand({
  eyebrow = 'Domestic & International Tour Packages',
  media = 'masked',
}: {
  eyebrow?: string;
  media?: string;
}) {
  return (
    <section
      className="relative overflow-hidden bg-navy"
      aria-label="Travel the World — our tour packages"
    >
      {/* Static mosaic background */}
      <img
        src={posterPath(media)}
        alt="A mosaic of the destinations JEJO arranges"
        className="absolute inset-0 h-full w-full object-cover"
        width={1600}
        height={1200}
      />
      <div className="absolute inset-0 bg-navy/55" />

      {/* Desktop — cards ringing the title */}
      <div className="relative z-10 mx-auto hidden max-w-editorial items-stretch justify-between gap-8 px-6 py-24 md:flex md:px-12">
        <div className="flex w-32 flex-col justify-center gap-8 lg:w-40">
          {LEFT.map((p) => (
            <PackageCard key={p.slug} p={p} onDark />
          ))}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Title eyebrow={eyebrow} />
        </div>
        <div className="flex w-32 flex-col justify-center gap-8 lg:w-40">
          {RIGHT.map((p) => (
            <PackageCard key={p.slug} p={p} onDark />
          ))}
        </div>
      </div>

      {/* Mobile — title then a grid of all eight */}
      <div className="relative z-10 px-6 py-16 md:hidden">
        <Title eyebrow={eyebrow} />
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9">
          {PACKAGES.map((p) => (
            <PackageCard key={p.slug} p={p} onDark />
          ))}
        </div>
      </div>
    </section>
  );
}
