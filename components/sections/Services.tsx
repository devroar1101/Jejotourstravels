'use client';

import { Reveal } from '@/components/motion/Reveal';
import ServiceIcon from '@/components/ServiceIcon';
import { services } from '@/content/services';

export default function Services() {
  return (
    <section
      id="services"
      className="relative bg-paper-2 px-6 py-28 md:px-12 md:py-40"
      aria-label="Services"
    >
      <div className="mx-auto max-w-editorial">
        <div className="mb-16 grid grid-cols-1 gap-6 md:mb-20 md:grid-cols-12">
          <p className="eyebrow md:col-span-3">Services</p>
          <h2 className="font-display text-display-sm leading-none text-navy md:col-span-9">
            Everything the trip needs, handled in one place.
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} delay={(i % 3) * 0.05}>
              <div className="group relative h-full overflow-hidden border border-navy-faint bg-paper p-7 transition-all duration-500 ease-editorial hover:-translate-y-1 hover:border-teal hover:shadow-[0_20px_50px_-24px_rgba(19,41,76,0.35)]">
                {/* Animated teal highlight bar. */}
                <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-teal transition-transform duration-500 ease-editorial group-hover:scale-x-100" />

                <div className="mb-6 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-navy-faint text-navy transition-all duration-500 group-hover:border-teal group-hover:bg-teal/10 group-hover:text-teal group-hover:scale-110">
                    <ServiceIcon name={s.icon} className="h-6 w-6" />
                  </span>
                  <span className="font-body text-sm tabular-nums text-teal">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-display text-xl leading-snug text-navy transition-colors duration-300 group-hover:text-teal md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-navy-dim">
                  {s.line}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
