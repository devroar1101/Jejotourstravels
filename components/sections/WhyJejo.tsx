'use client';

import { Reveal } from '@/components/motion/Reveal';

const REASONS: string[] = [
  'Personalised travel planning',
  'Domestic & international tour packages',
  'Family and group tours',
  'Customised holiday packages',
  'Pilgrimage and spiritual tours',
  'Hotel and accommodation assistance',
  'Flight and travel assistance',
  'Hassle-free trip planning',
  'Friendly customer support',
  'Competitive and transparent pricing',
];

function Check() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="mt-0.5 shrink-0"
    >
      <path
        d="M20 6 9 17l-5-5"
        stroke="var(--teal)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WhyJejo() {
  return (
    <section
      id="why-jejo"
      className="relative bg-paper-3 px-6 py-28 md:px-12 md:py-40"
      aria-label="Why choose JEJO"
    >
      <div className="mx-auto max-w-editorial">
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">Why choose JEJO</p>
            <h2 className="font-display text-display-sm leading-none text-navy">
              Planned with care,
              <br className="hidden md:block" /> priced with honesty.
            </h2>
          </div>
          <p className="max-w-sm font-body text-navy-dim">
            One team for the whole trip — from the first idea to the day you
            return home.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
          {REASONS.map((r, i) => (
            <Reveal as="div" key={r} delay={i * 0.05}>
              <div className="flex items-start gap-4 border-t border-navy-faint py-5">
                <Check />
                <span className="font-body text-lg text-navy">{r}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
