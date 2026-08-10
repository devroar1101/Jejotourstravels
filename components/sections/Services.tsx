'use client';

import { useState } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import ServiceIcon from '@/components/ServiceIcon';
import { services, type Service } from '@/content/services';

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
              <ServiceCard service={s} index={i} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  // The image fades in once it loads; until then (or if it 404s because the
  // photo hasn't been uploaded yet) the icon-on-tint header stands in, so a
  // missing image never shows as a broken card.
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const num = (index + 1).toString().padStart(2, '0');

  return (
    <div className="group relative flex h-full flex-col overflow-hidden border border-navy-faint bg-paper transition-all duration-500 ease-editorial hover:-translate-y-1 hover:border-teal hover:shadow-[0_20px_50px_-24px_rgba(19,41,76,0.35)]">
      {/* Animated teal highlight bar. */}
      <span className="absolute inset-x-0 top-0 z-20 h-[3px] origin-left scale-x-0 bg-teal transition-transform duration-500 ease-editorial group-hover:scale-x-100" />

      {/* Image / icon header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-3">
        {/* Fallback: icon centred on a soft tint. */}
        <span className="absolute inset-0 grid place-items-center text-navy/35">
          <ServiceIcon name={service.icon} className="h-12 w-12" />
        </span>

        {!failed && (
          <img
            src={`/videos/${service.image}.jpg`}
            alt={service.title}
            className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-editorial group-hover:scale-105"
            style={{ opacity: loaded ? 1 : 0 }}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}

        {/* Number badge. */}
        <span className="absolute right-3 top-3 z-10 rounded bg-navy/70 px-2 py-0.5 font-body text-xs tabular-nums text-paper backdrop-blur-sm">
          {num}
        </span>
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-xl leading-snug text-navy transition-colors duration-300 group-hover:text-teal md:text-2xl">
          {service.title}
        </h3>
        <p className="mt-3 font-body text-sm leading-relaxed text-navy-dim">
          {service.line}
        </p>
      </div>
    </div>
  );
}
