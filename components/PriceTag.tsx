import { inr } from '@/content/packages';

/**
 * Flyer-style price sticker overlaid on a destination image.
 * Green pill with "Starting from" + the per-person price; a quiet paper pill
 * when the trip is quoted on request. Non-interactive so it never blocks the
 * card link beneath it.
 */
export default function PriceTag({
  price,
  className = '',
}: {
  price?: number;
  className?: string;
}) {
  const shadow = '0 10px 26px -10px rgba(10,14,24,0.55)';
  return (
    <div
      className={`pointer-events-none absolute right-3 top-3 z-20 ${className}`}
    >
      {price ? (
        <div
          className="rounded-lg px-3 py-1.5"
          style={{ background: '#A3D45F', boxShadow: shadow }}
        >
          <span className="block font-body text-[0.5rem] font-semibold uppercase leading-none tracking-[0.16em] text-navy/70">
            Starting from
          </span>
          <span className="mt-0.5 block font-display text-[1.05rem] font-semibold leading-none text-navy">
            {inr(price)}
            <span className="ml-0.5 font-body text-[0.62em] font-medium">
              /pp
            </span>
          </span>
        </div>
      ) : (
        <div
          className="rounded-lg bg-paper/90 px-3 py-1.5 backdrop-blur-sm"
          style={{ boxShadow: shadow }}
        >
          <span className="block font-body text-[0.6rem] font-semibold uppercase leading-none tracking-[0.14em] text-navy">
            On request
          </span>
        </div>
      )}
    </div>
  );
}
