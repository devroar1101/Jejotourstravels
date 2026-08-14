'use client';

import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { inr } from '@/content/packages';
import { posterPath } from '@/lib/media';

interface Tile {
  name: string;
  slug: string;
  media: string;
  span: 'tall' | 'wide' | 'std';
  price?: number;
}

// Existing destinations + the tour packages, mixed into one random masonry.
const TILES: Tile[] = [
  { name: 'Ooty · Kodaikanal · Coorg', slug: 'ooty-kodaikanal', media: 'ooty-kodaikanal', span: 'tall', price: 10999 },
  { name: 'Kerala', slug: 'kerala', media: 'kerala', span: 'std', price: 12999 },
  { name: 'Maldives & Mauritius', slug: 'maldives-mauritius', media: 'maldives-mauritius', span: 'wide', price: 64900 },
  { name: 'Andaman Island', slug: 'andaman-lakshadweep', media: 'andaman', span: 'std', price: 14999 },
  { name: 'Delhi · Shimla · Kullu Manali · Darjeeling', slug: 'golden-triangle', media: 'darjeeling', span: 'tall', price: 12999 },
  { name: 'Malaysia', slug: 'malaysia', media: 'malaysia', span: 'std', price: 10999 },
  { name: 'Vietnam & Cambodia', slug: 'vietnam-cambodia', media: 'vietnam-cambodia', span: 'wide', price: 42400 },
  { name: 'Singapore', slug: 'singapore', media: 'singapore', span: 'std', price: 19999 },
  { name: 'Dubai', slug: 'dubai-uae', media: 'dubai-uae', span: 'std', price: 18999 },
  { name: 'Thailand', slug: 'thailand', media: 'thailand', span: 'tall', price: 13999 },
  { name: 'Sri Lanka', slug: 'sri-lanka', media: 'sri-lanka', span: 'std', price: 19999 },
  { name: 'Indonesia · Bali', slug: 'indonesia', media: 'indonesia', span: 'std' },
];

const spanClass: Record<Tile['span'], string> = {
  tall: 'md:row-span-2',
  wide: 'md:col-span-2',
  std: '',
};

export default function Destinations() {
  return (
    <section
      id="destinations"
      className="relative bg-paper px-6 py-28 md:px-12 md:py-40"
      aria-label="Places we know well"
    >
      <div className="mx-auto max-w-editorial">
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">Places we know well</p>
            <h2 className="font-display text-display-sm leading-none text-navy">
              Where our travellers go
            </h2>
          </div>
          <p className="max-w-sm font-body text-navy-dim">
            Domestic and international routes, with starting-from fares per
            person. Tap any place to see the trip.
          </p>
        </div>

        <div className="grid auto-rows-[32vh] grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {TILES.map((t) => (
            <Reveal
              as="div"
              key={t.name}
              className={`group relative overflow-hidden ${spanClass[t.span]}`}
            >
              <Link
                href={`/destinations/${t.slug}/`}
                data-cursor="VIEW"
                aria-label={
                  t.price
                    ? `${t.name} — from ${inr(t.price)} per person`
                    : `${t.name} — view details`
                }
                className="block h-full w-full"
              >
                <img
                  src={posterPath(t.media)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                {/* Bottom gradient for legibility. */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,14,24,0.9) 0%, rgba(10,14,24,0.4) 40%, rgba(10,14,24,0) 100%)',
                  }}
                />
                {/* Teal ring on hover. */}
                <div
                  className="pointer-events-none absolute inset-0 transition-shadow duration-500 group-hover:shadow-[inset_0_0_0_2px_rgba(30,111,214,0.7)]"
                />

                {/* Price sticker */}
                {t.price ? (
                  <div
                    className="absolute right-3 top-3 rounded-md px-2.5 py-1 text-center"
                    style={{
                      background: '#A3D45F',
                      boxShadow: '0 8px 20px -8px rgba(10,14,24,0.6)',
                    }}
                  >
                    <span className="block font-body text-[0.45rem] font-semibold uppercase leading-none tracking-[0.14em] text-navy/70">
                      Starting from
                    </span>
                    <span className="mt-0.5 block font-display text-sm font-semibold leading-none text-navy">
                      {inr(t.price)}
                      <span className="ml-0.5 font-body text-[0.62em] font-medium">
                        /pp
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="absolute right-3 top-3 rounded-md bg-paper/90 px-2.5 py-1 backdrop-blur-sm">
                    <span className="block font-body text-[0.55rem] font-semibold uppercase leading-none tracking-[0.12em] text-navy">
                      On request
                    </span>
                  </div>
                )}

                {/* Name */}
                <h3
                  className="absolute inset-x-0 bottom-0 z-10 p-5 font-display text-2xl leading-tight text-paper md:text-3xl"
                  style={{ textShadow: '0 2px 20px rgba(10,14,24,0.7)' }}
                >
                  {t.name}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
