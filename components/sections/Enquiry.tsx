'use client';

import CinematicVideo from '@/components/CinematicVideo';
import EnquiryCTA from '@/components/enquiry/EnquiryCTA';
import { StaggerLines } from '@/components/motion/Reveal';
import { site } from '@/content/site';
import { telHref } from '@/lib/enquiry';

export default function Enquiry() {
  return (
    <section
      id="enquiry"
      className="relative overflow-hidden bg-paper-2 px-6 py-32 md:px-12 md:py-48"
      aria-label="Plan your journey"
    >
      {/* Ambient background video (treatment 5) continues here. */}
      <div className="absolute inset-0 grain">
        <CinematicVideo
          name="ambient"
          label=""
          width={1280}
          height={720}
          mode="ambient"
          className="h-full scale-110 opacity-25 blur-2xl"
        />
        <div className="absolute inset-0 bg-paper/75" />
      </div>

      <div className="relative z-10 mx-auto max-w-editorial">
        <p className="eyebrow mb-8">Start here</p>
        <StaggerLines
          lines={['Tell us where', 'you want to go.']}
          className="font-display text-display leading-[0.94] text-navy"
        />
        <p className="mt-10 max-w-lg font-body text-lg text-navy-dim">
          A few short questions, then your enquiry opens straight in WhatsApp.
          No forms, no email capture, nothing stored on a server.
        </p>

        <div className="mt-12 flex flex-col items-start gap-8 md:flex-row md:items-center">
          <EnquiryCTA>Plan your journey</EnquiryCTA>
          <div className="font-body text-navy-dim">
            <p>
              Or reach us directly on{' '}
              <a href={telHref} className="link-underline text-navy">
                {site.phoneDisplay}
              </a>
            </p>
            <p className="mt-1">
              <a
                href={`mailto:${site.email}`}
                className="link-underline text-navy"
              >
                {site.email}
              </a>
            </p>
          </div>
        </div>

        <p className="mt-10 font-body text-sm text-navy-faint">
          We speak {site.languages.join(', ')}. Groups of {site.groupSize} are
          typical.
        </p>
      </div>
    </section>
  );
}
