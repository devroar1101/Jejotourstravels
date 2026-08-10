'use client';

import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { inr } from '@/content/packages';
import { posterPath } from '@/lib/media';

interface Pkg {
  name: string;
  slug: string;
  media: string;
  price: number;
}

// The headline packages (combined routes point to their closest detail page).
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

function PackageCard({ p }: { p: Pkg }) {
  return (
    <Link
      href={`/destinations/${p.slug}/`}
      data-cursor="VIEW"
      aria-label={`${p.name} — from ${inr(p.price)} per person`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl shadow-[0_16px_40px_-20px_rgba(10,14,24,0.55)] ring-1 ring-navy-faint transition-transform duration-500 ease-editorial group-hover:-translate-y-1">
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
          className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-3 py-1 text-center"
          style={{
            background: '#A3D45F',
            boxShadow: '0 8px 20px -8px rgba(10,14,24,0.6)',
          }}
        >
          <span className="block font-body text-[0.5rem] font-semibold uppercase leading-none tracking-[0.14em] text-navy/70">
            Starting from
          </span>
          <span className="mt-0.5 block font-display text-sm font-semibold leading-none text-navy">
            {inr(p.price)}
            <span className="ml-0.5 font-body text-[0.62em] font-medium">/pp</span>
          </span>
        </div>
      </div>
      <h3 className="mt-4 text-center font-display text-sm leading-tight text-navy transition-colors group-hover:text-teal md:text-base">
        {p.name}
      </h3>
    </Link>
  );
}

/**
 * "Travel the World" — a two-pane band: the serif title over the all-
 * destinations mosaic on the left, and a clean, clickable grid of the headline
 * tour packages (with price tags) on the right. Stacks on mobile.
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
      className="relative bg-paper"
      aria-label="Travel the World — our tour packages"
    >
      <div className="grid md:grid-cols-2">
        {/* Left — title over the mosaic */}
        <div className="relative min-h-[42vh] overflow-hidden md:min-h-full">
          <img
            src={posterPath(media)}
            alt="A mosaic of the destinations JEJO arranges"
            className="absolute inset-0 h-full w-full object-cover"
            width={1600}
            height={1200}
          />
          <div className="absolute inset-0 bg-navy/55" />
          <div className="absolute inset-0 md:sticky md:top-0 md:h-screen">
            <div className="flex h-full flex-col justify-center px-8 py-16 text-center md:px-12">
              <p className="eyebrow mb-4" style={{ color: 'var(--paper)' }}>
                {eyebrow}
              </p>
              <h2
                className="font-display leading-[0.95] text-paper"
                style={{
                  fontSize: 'clamp(2.6rem, 6vw, 6rem)',
                  textShadow: '0 4px 40px rgba(10,14,24,0.6)',
                }}
              >
                Travel
                <br />
                the World
              </h2>
            </div>
          </div>
        </div>

        {/* Right — package grid */}
        <div className="bg-paper px-6 py-16 md:px-12 md:py-24">
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7">
            {PACKAGES.map((p, i) => (
              <Reveal as="div" key={p.slug} delay={(i % 2) * 0.05}>
                <PackageCard p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
