'use client';

import Magnetic from '@/components/motion/Magnetic';
import { site } from '@/content/site';
import { whatsappHref, buildMessage, emptyDraft } from '@/lib/enquiry';

export default function Footer() {
  const year = new Date().getFullYear();
  const genericWa = whatsappHref(
    buildMessage({ ...emptyDraft, destination: 'Somewhere else', price: '' }),
  );

  return (
    <footer className="relative overflow-hidden bg-paper px-6 pb-12 pt-24 md:px-12">
      <div className="mx-auto max-w-editorial">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow mb-6">{site.tagline}</p>
            <p className="max-w-sm font-body text-navy-dim">
              {site.description}
            </p>
          </div>

          <nav
            className="md:col-span-3 md:col-start-7"
            aria-label="Sections"
          >
            <ul className="space-y-3 font-body text-navy-dim">
              {[
                ['About', '#philosophy'],
                ['Journeys', '#journeys'],
                ['Destinations', '#destinations'],
                ['Services', '#services'],
                ['Enquiry', '#enquiry'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="link-underline hover:text-navy">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <ul className="space-y-3 font-body text-navy-dim">
              <li>
                <a
                  href={genericWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-navy"
                >
                  WhatsApp {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline hover:text-navy"
                >
                  {site.email}
                </a>
              </li>
              <li className="text-navy-faint">
                {site.regions.join(' · ')}
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="mt-20 overflow-visible md:mt-32">
          <Magnetic strength={0.08}>
            <h2 className="select-none py-[0.08em] font-display font-semibold leading-[1.05] tracking-tight text-navy">
              <span className="block text-[20vw] leading-[1.05] md:text-[18vw]">
                JEJO
              </span>
            </h2>
          </Magnetic>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-navy-faint pt-8 font-body text-xs text-navy-faint md:flex-row">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span>{site.languages.join(' · ')}</span>
        </div>
      </div>
    </footer>
  );
}
