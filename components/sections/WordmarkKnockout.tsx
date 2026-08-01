'use client';

import { posterPath } from '@/lib/media';

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
          className="video-knockout block py-[0.05em] text-center font-display font-semibold leading-[1]"
          style={{ backgroundImage: `url(${posterPath(media)})` }}
        >
          {word}
        </span>
      </div>
    </div>
  );
}
