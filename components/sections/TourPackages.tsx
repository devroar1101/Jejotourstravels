'use client';

import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { inr } from '@/content/packages';
import { posterPath } from '@/lib/media';

interface FlyerPackage {
  name: string;
  /** Detail-page slug. */
  slug: string;
  /** Poster basename under /public/videos. */
  media: string;
  price: number;
}

// The eight headline packages, matching the tour flyer (combined routes point
// to their closest detail page).
const flyer: FlyerPackage[] = [
  { name: 'Ooty · Kodaikanal · Coorg', slug: 'ooty-kodaikanal', media: 'ooty-kodaikanal', price: 10999 },
  { name: 'Kerala', slug: 'kerala', media: 'kerala', price: 12999 },
  { name: 'Andaman Island', slug: 'andaman-lakshadweep', media: 'andaman', price: 14999 },
  { name: 'Delhi · Shimla · Kullu Manali · Darjeeling', slug: 'golden-triangle', media: 'darjeeling', price: 12999 },
  { name: 'Malaysia', slug: 'malaysia', media: 'malaysia', price: 10999 },
  { name: 'Singapore', slug: 'singapore', media: 'singapore', price: 19999 },
  { name: 'Dubai', slug: 'dubai-uae', media: 'dubai-uae', price: 18999 },
  { name: 'Thailand', slug: 'thailand', media: 'thailand', price: 13999 },
];

export default function TourPackages() {
  return (
    <section
      id="packages"
      className="relative px-6 py-24 md:px-12 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, #E6EFFA 0%, #EEF2F8 55%, #F6F7F9 100%)',
      }}
      aria-label="Domestic and international tour packages"
    >
      <div className="mx-auto max-w-editorial">
        <div className="mb-14 text-center md:mb-20">
          <p className="eyebrow mb-4">Starting-from fares</p>
          <h2 className="font-display text-display-sm leading-none text-navy">
            Domestic &amp; International
            <br className="hidden sm:block" /> Tour Packages
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
          {flyer.map((p, i) => (
            <Reveal as="div" key={p.name} delay={(i % 4) * 0.05}>
              <Link
                href={`/destinations/${p.slug}/`}
                data-cursor="VIEW"
                aria-label={`${p.name} — from ${inr(p.price)} per person`}
                className="group block"
              >
                <div className="relative">
                  <div className="overflow-hidden rounded-2xl shadow-[0_18px_44px_-20px_rgba(10,14,24,0.5)] ring-1 ring-white/60">
                    <img
                      src={posterPath(p.media)}
                      alt={p.name}
                      width={1000}
                      height={1250}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                    />
                  </div>
                  {/* Green price tag, overlapping the base of the card. */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div
                      className="rounded-lg px-3.5 py-1.5 text-center"
                      style={{
                        background: '#A3D45F',
                        boxShadow: '0 10px 24px -8px rgba(10,14,24,0.5)',
                      }}
                    >
                      <span className="block font-body text-[0.5rem] font-semibold uppercase leading-none tracking-[0.16em] text-navy/70">
                        Starting from
                      </span>
                      <span className="mt-0.5 block font-display text-base font-semibold leading-none text-navy">
                        {inr(p.price)}
                        <span className="ml-0.5 font-body text-[0.62em] font-medium">
                          /pp
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="mt-9 text-center font-display text-lg leading-tight text-navy transition-colors group-hover:text-teal">
                  {p.name}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
