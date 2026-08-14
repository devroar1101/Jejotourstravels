'use client';

import { Reveal } from '@/components/motion/Reveal';
import PackageCard from '@/components/PackageCard';
import { tourPackages } from '@/content/tourPackages';

export default function Destinations() {
  return (
    <section
      id="destinations"
      className="relative bg-paper px-6 py-28 md:px-12 md:py-40"
      aria-label="Places we know well"
    >
      <div className="mx-auto max-w-editorial">
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">Places we know well</p>
            <h2 className="font-display text-display-sm leading-none text-navy">
              Our tour packages
            </h2>
          </div>
          <p className="max-w-sm font-body text-navy-dim">
            Starting-from fares per person. Every route is planned around your
            dates and your group — tell us what you have in mind.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-7 lg:grid-cols-4">
          {tourPackages.map((p, i) => (
            <Reveal as="div" key={p.slug} delay={(i % 4) * 0.05}>
              <PackageCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
