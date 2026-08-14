import { posterPath } from '@/lib/media';

/**
 * "Travel the World" — a compact banner: the serif title centred over the all-
 * destinations mosaic. The tour-package cards live in the "Places we know well"
 * section.
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
      aria-label="Travel the World"
    >
      <img
        src={posterPath(media)}
        alt="A mosaic of the destinations JEJO arranges"
        className="absolute inset-0 h-full w-full object-cover"
        width={1600}
        height={720}
      />
      <div className="absolute inset-0 bg-navy/55" />
      <div className="relative z-10 flex h-[34vh] min-h-[260px] items-center justify-center px-6 text-center md:h-[46vh]">
        <div>
          <p className="eyebrow mb-4" style={{ color: 'var(--paper)' }}>
            {eyebrow}
          </p>
          <h2
            className="font-display leading-[0.95] text-paper"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 6rem)',
              textShadow: '0 4px 40px rgba(10,14,24,0.6)',
            }}
          >
            Travel the World
          </h2>
        </div>
      </div>
    </section>
  );
}
