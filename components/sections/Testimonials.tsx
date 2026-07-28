'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CinematicVideo from '@/components/CinematicVideo';
import { testimonials } from '@/content/testimonials';
import { useReducedMotion } from '@/lib/hooks';

export default function Testimonials() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  // Slow auto-advance; pauses when the tab is hidden.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % testimonials.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  const t = testimonials[i];

  return (
    <section
      className="relative overflow-hidden bg-paper-3 px-6 py-32 md:px-12 md:py-48"
      aria-label="What clients say"
    >
      {/* Ambient background video (treatment 5) — blurred, darkened, 0.25 */}
      <div className="absolute inset-0 grain">
        <CinematicVideo
          name="ambient"
          label=""
          width={1280}
          height={720}
          mode="ambient"
          className="h-full scale-110 opacity-25 blur-2xl"
        />
        <div className="absolute inset-0 bg-paper/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-editorial text-center">
        <p className="eyebrow mb-12">In their words</p>
        <div className="relative mx-auto min-h-[280px] max-w-4xl md:min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -12 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-display text-pull leading-[1.15] text-navy">
                “{t.quote}”
              </p>
              <footer className="mt-10">
                <span className="font-display text-xl text-teal">{t.name}</span>
                <span className="mx-3 text-navy-faint">·</span>
                <span className="font-body text-sm text-navy-dim">
                  {t.location ? `${t.location} · ` : ''}
                  {t.reference}
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-12 flex justify-center gap-3">
          {testimonials.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Show testimonial ${n + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                n === i ? 'w-8 bg-teal' : 'w-1.5 bg-navy-faint'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
