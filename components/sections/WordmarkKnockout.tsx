'use client';

/**
 * Treatment 4 (variant) — a large serif wordmark with the footage knocked out
 * of it via background-clip: text. Uses the poster as the fill so it reads even
 * before real video arrives and under reduced motion. Purely decorative.
 */
export default function WordmarkKnockout({
  word = 'JEJO',
  media = 'masked',
  className = '',
}: {
  word?: string;
  media?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden bg-paper px-6 py-16 md:py-24 ${className}`}
    >
      <div className="mx-auto max-w-editorial">
        <span
          className="video-knockout block text-center font-display font-semibold leading-[0.82]"
          style={{ backgroundImage: `url(/videos/${media}.png)` }}
        >
          {word}
        </span>
      </div>
    </div>
  );
}
