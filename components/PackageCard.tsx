import Link from 'next/link';
import { inr } from '@/content/packages';
import { posterPath } from '@/lib/media';
import type { TourPackage } from '@/content/tourPackages';

/**
 * A tour-package card: rounded photo with a green "Starting from …/pp" sticker
 * and the name below. Links to the package detail page. `onDark` switches the
 * name to paper for use over a dark background.
 */
export default function PackageCard({
  p,
  onDark = false,
}: {
  p: TourPackage;
  onDark?: boolean;
}) {
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
      <h3
        className={`mt-4 text-center font-display text-sm leading-tight transition-colors group-hover:text-teal md:text-base ${
          onDark ? 'text-paper' : 'text-navy'
        }`}
      >
        {p.name}
      </h3>
    </Link>
  );
}
