'use client';

import { Reveal } from '@/components/motion/Reveal';
import EnquiryCTA from '@/components/enquiry/EnquiryCTA';
import { domestic } from '@/content/domestic';

export default function Domestic() {
  return (
    <section
      id="domestic"
      className="relative bg-paper px-6 py-24 md:px-12 md:py-32"
      aria-label="Within India"
    >
      <div className="mx-auto max-w-editorial">
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">Within India</p>
            <h2 className="font-display text-display-sm leading-none text-navy">
              Closer to home
            </h2>
          </div>
          <p className="max-w-sm font-body text-navy-dim">
            Domestic journeys across India, planned with the same care as the
            international routes.
          </p>
        </div>
      </div>

      {/* Horizontal strip. */}
      <div className="mx-auto flex max-w-editorial snap-x snap-mandatory gap-4 overflow-x-auto pb-4 no-scrollbar md:gap-6">
        {domestic.map((d, i) => (
          <Reveal
            as="article"
            key={d.media}
            delay={(i % 4) * 0.04}
            className="group relative aspect-[3/4] w-[68vw] shrink-0 snap-start overflow-hidden sm:w-[44vw] md:w-[30vw] lg:w-[22vw]"
          >
            <img
              src={`/videos/${d.media}.png`}
              alt={d.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-105"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(11,22,42,0.85) 0%, rgba(11,22,42,0.15) 55%, rgba(11,22,42,0) 100%)',
              }}
            />
            <div className="pointer-events-none absolute inset-0 transition-shadow duration-500 group-hover:shadow-[inset_0_0_0_2px_rgba(20,163,160,0.7)]" />
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
              <span
                className="eyebrow mb-1 transition-all duration-500"
                style={{ color: 'var(--teal)' }}
              >
                India
              </span>
              <h3
                className="font-display text-2xl text-paper md:text-3xl"
                style={{ textShadow: '0 2px 20px rgba(11,22,42,0.7)' }}
              >
                {d.name}
              </h3>
              <p className="mt-1 max-w-[16rem] font-body text-sm text-paper-dim">
                {d.line}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-editorial">
        <EnquiryCTA variant="ghost">Plan a domestic trip</EnquiryCTA>
      </div>
    </section>
  );
}
