'use client';

import { Reveal, StaggerLines } from '@/components/motion/Reveal';

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative bg-paper px-6 py-28 md:px-12 md:py-40"
      aria-label="About JEJO Tours and Travels"
    >
      <div className="mx-auto max-w-editorial">
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-12">
          {/* Left — eyebrow + heading, offset */}
          <div className="md:col-span-5">
            <p className="eyebrow mb-8">Our Story</p>
            <StaggerLines
              lines={['Founded on care,', 'honesty, and a', 'love of travel.']}
              className="font-display text-display-sm leading-[1.02] text-navy"
              lineClassName="pb-1"
            />
          </div>

          {/* Right — about + founding story, lower */}
          <div className="md:col-span-6 md:col-start-7 md:pt-24">
            <Reveal as="div" className="space-y-6 font-body text-lg text-navy-dim">
              <p>
                JEJO Tours &amp; Travels offers complete travel support under one
                roof — passports, international visas, flight tickets, hotels,
                domestic and international tour packages, travel insurance,
                currency exchange, international SIM cards, train and bus tickets,
                and certificate attestation.
              </p>
              <p>
                We work with professionalism, transparency and attention to
                detail — for a family holiday, a business trip, an overseas
                education journey or an international move. Customer satisfaction
                sits at the centre of everything we do, and we build lasting
                relationships on trust and reliability.
              </p>
            </Reveal>

            <Reveal
              as="blockquote"
              className="mt-14 border-l border-teal pl-8 font-body text-navy-dim"
            >
              <p className="font-display text-pull italic leading-[1.25] text-navy">
                “Founded out of a love for God, the memory of our father, and a
                passion for travel.”
              </p>
              <p className="mt-6 text-base">
                What began as a vision has grown into a promise: to serve
                travellers with care, honesty and excellence. Every trip is
                planned with the same attention we would give our own family.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
