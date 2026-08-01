'use client';

import { Reveal } from '@/components/motion/Reveal';
import { testimonials } from '@/content/testimonials';

export default function Testimonials() {
  return (
    <section
      className="relative bg-paper-3 px-6 py-28 md:px-12 md:py-40"
      aria-label="What clients say"
    >
      <div className="mx-auto max-w-editorial">
        <div className="mb-14 md:mb-20">
          <p className="eyebrow mb-4">In their words</p>
          <h2 className="font-display text-display-sm leading-none text-navy">
            What our travellers say
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal as="div" key={t.name} delay={(i % 2) * 0.06}>
              <figure className="group relative flex h-full flex-col overflow-hidden border border-navy-faint bg-paper p-8 transition-all duration-500 ease-editorial hover:-translate-y-1 hover:border-teal hover:shadow-[0_20px_50px_-24px_rgba(19,41,76,0.35)]">
                {/* Animated teal highlight. */}
                <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-teal transition-transform duration-500 ease-editorial group-hover:scale-x-100" />

                <span
                  className="font-display leading-none text-teal/40"
                  style={{ fontSize: '3.5rem' }}
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote className="-mt-4 font-display text-xl leading-snug text-navy md:text-2xl">
                  {t.quote}
                </blockquote>

                <figcaption className="mt-8 flex flex-wrap items-baseline justify-between gap-2 border-t border-navy-faint pt-5">
                  <span className="font-display text-lg text-navy">
                    {t.name}
                    {t.location ? `, ${t.location}` : ''}
                  </span>
                  <span className="font-body text-xs uppercase tracking-wide text-teal">
                    {t.reference}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
