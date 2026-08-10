'use client';

import { useEffect, useState } from 'react';
import Magnetic from '@/components/motion/Magnetic';
import EnquiryCTA from '@/components/enquiry/EnquiryCTA';

const LINKS = [
  ['About', '#philosophy'],
  ['Journeys', '#journeys'],
  ['Destinations', '#destinations'],
  ['Services', '#services'],
];

export default function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-500 ${
        solid ? 'bg-paper/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-editorial items-center justify-between px-6 py-5 md:px-12">
        <a
          href="#top"
          className="flex items-center gap-3"
          aria-label="JEJO Tours and Travels — home"
        >
          {/* Brand mark — colour on the solid bar, white over the hero. */}
          <span className="relative inline-flex h-9 items-center">
            <img
              src="/logo-mark.png"
              alt="JEJO Tours &amp; Travels"
              className="h-9 w-auto transition-opacity duration-500"
              style={{ opacity: solid ? 1 : 0 }}
            />
            <img
              src="/logo-mark-light.png"
              alt=""
              aria-hidden
              className="absolute left-0 top-0 h-9 w-auto transition-opacity duration-500"
              style={{ opacity: solid ? 0 : 1 }}
            />
          </span>
          <span
            className={`flex flex-col leading-none transition-colors ${
              solid ? 'text-navy' : 'text-paper'
            }`}
          >
            <span className="font-display text-xl font-semibold leading-none tracking-tight">
              JEJO
            </span>
            <span className="mt-1 font-body text-[0.55rem] uppercase leading-none tracking-[0.28em] opacity-80">
              Tours &amp; Travels
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <Magnetic key={href} strength={0.2}>
              <a
                href={href}
                className={`link-underline font-body text-sm transition-colors ${
                  solid
                    ? 'text-navy-dim hover:text-navy'
                    : 'text-paper-dim hover:text-paper'
                }`}
              >
                {label}
              </a>
            </Magnetic>
          ))}
        </nav>

        <EnquiryCTA variant="text" className="text-sm">
          Enquire
        </EnquiryCTA>
      </div>
    </header>
  );
}
