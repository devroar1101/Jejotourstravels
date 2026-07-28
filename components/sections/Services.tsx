'use client';

import { useState } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { services } from '@/content/services';

export default function Services() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="relative bg-paper-2 px-6 py-28 md:px-12 md:py-40"
      aria-label="Services"
    >
      <div className="mx-auto max-w-editorial">
        <div className="mb-16 grid grid-cols-1 gap-6 md:mb-24 md:grid-cols-12">
          <p className="eyebrow md:col-span-3">Services</p>
          <h2 className="font-display text-display-sm leading-none text-navy md:col-span-9">
            Everything the trip needs, handled in one place.
          </h2>
        </div>

        <ul className="border-t border-navy-faint">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.02}>
              <button
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(open === i ? null : i)}
                className="group flex w-full items-baseline justify-between gap-6 border-b border-navy-faint py-6 text-left md:py-8"
                aria-expanded={open === i}
              >
                <span className="flex items-baseline gap-6">
                  <span className="font-body text-sm text-teal tabular-nums">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="font-display text-3xl text-navy transition-colors group-hover:text-teal md:text-5xl">
                    {s.title}
                  </span>
                </span>
                <span
                  className="hidden max-w-xs shrink-0 text-right font-body text-sm text-navy-dim transition-opacity duration-500 md:block md:opacity-0 md:group-hover:opacity-100"
                >
                  {s.line}
                </span>
              </button>
              {/* Mobile: reveal the supporting line inline. */}
              <p
                className={`overflow-hidden font-body text-sm text-navy-dim transition-all duration-500 md:hidden ${
                  open === i ? 'max-h-20 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {s.line}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
