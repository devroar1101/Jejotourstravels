'use client';

import { Reveal, StaggerLines } from '@/components/motion/Reveal';

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative bg-paper px-6 py-28 md:px-12 md:py-40"
      aria-label="Philosophy"
    >
      <div className="mx-auto max-w-editorial">
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-12">
          {/* Left — eyebrow + heading, offset */}
          <div className="md:col-span-5">
            <p className="eyebrow mb-8">The Art of the Journey</p>
            <StaggerLines
              lines={['A journey is', 'planned once,', 'and remembered', 'for years.']}
              className="font-display text-display-sm leading-[1.02] text-navy"
              lineClassName="pb-1"
            />
          </div>

          {/* Right — body + pull quote, lower */}
          <div className="md:col-span-6 md:col-start-7 md:pt-24">
            <Reveal as="div" className="space-y-6 font-body text-lg text-navy-dim">
              <p>
                We are a small team in Tamil Nadu. We work in Tamil, English and
                Hindi, usually with groups of five or six. That scale is
                deliberate. It lets us hold every detail ourselves, from the
                first visa form to the last transfer home.
              </p>
              <p>
                We do not sell a catalogue. We plan a route around your dates,
                your budget and the way you like to travel, then we stay
                reachable while you are away.
              </p>
            </Reveal>

            <Reveal as="blockquote" className="mt-14 border-l border-teal pl-8">
              <p className="font-display text-pull italic text-navy">
                “Everything arranged as promised. That is the whole of it.”
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
