'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Brand splash — no video. On a deep-navy field the white JEJO logo settles in,
 * a teal line draws beneath it and the tagline fades up; then an ivory curtain
 * wipes upward to reveal the site. Reduced motion: a brief static hold.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [enter, setEnter] = useState(false);
  const [wipe, setWipe] = useState(false);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    document.body.style.overflow = 'hidden';

    // Trigger the entrance transitions on the next frame.
    const raf = requestAnimationFrame(() => setEnter(true));

    const HOLD = reduced ? 500 : 2000;
    const t1 = window.setTimeout(() => setWipe(true), HOLD);
    const t2 = window.setTimeout(
      () => {
        setDone(true);
        document.body.style.overflow = '';
      },
      HOLD + (reduced ? 200 : 750),
    );

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.body.style.overflow = '';
    };
  }, [reduced]);

  if (done) return null;

  const ease = 'cubic-bezier(0.16,1,0.3,1)';

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 35%, #143257 0%, #0d1f3a 55%, #0a1428 100%)',
        transform: wipe && !reduced ? 'translateY(-100%)' : 'translateY(0)',
        opacity: wipe && reduced ? 0 : 1,
        transition: reduced
          ? 'opacity 0.2s ease'
          : `transform 0.75s ${ease}`,
      }}
    >
      <div className="flex flex-col items-center px-8">
        {/* White JEJO logo */}
        <img
          src="/logo-light.png"
          alt=""
          className="w-40 max-w-[45vw] md:w-52"
          style={{
            opacity: enter ? 1 : 0,
            transform: enter ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.94)',
            filter: enter ? 'blur(0)' : 'blur(6px)',
            transition: `opacity 0.9s ${ease}, transform 1.1s ${ease}, filter 0.9s ${ease}`,
          }}
        />

        {/* Teal line draws out */}
        <span
          className="mt-7 block h-px w-40 origin-center md:w-52"
          style={{
            background: 'var(--teal)',
            transform: enter ? 'scaleX(1)' : 'scaleX(0)',
            transition: `transform 0.9s ${ease} 0.35s`,
          }}
        />

        {/* Tagline */}
        <p
          className="mt-6 text-center font-body text-[0.6rem] uppercase tracking-[0.34em] text-paper-dim md:text-xs"
          style={{
            opacity: enter ? 0.9 : 0,
            transform: enter ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 0.9s ${ease} 0.55s, transform 0.9s ${ease} 0.55s`,
          }}
        >
          Your Journey &middot; Our Responsibility
        </p>
      </div>
    </div>
  );
}
