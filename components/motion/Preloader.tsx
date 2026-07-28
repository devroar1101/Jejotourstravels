'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Brand-mark stroke-draw + corner percentage counter, closing with an ivory
 * curtain wipe upward. Capped under 1.8s. Reduced motion: a brief opacity
 * fade with no transform.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);
  const [wipe, setWipe] = useState(false);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Lock scroll while the curtain is up.
    document.body.style.overflow = 'hidden';

    const duration = reduced ? 300 : 1200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setWipe(true);
        window.setTimeout(() => {
          setDone(true);
          document.body.style.overflow = '';
        }, reduced ? 200 : 700);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, [reduced]);

  if (done) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] grid place-items-center bg-paper"
      style={{
        transform: wipe && !reduced ? 'translateY(-100%)' : 'translateY(0)',
        opacity: wipe && reduced ? 0 : 1,
        transition: reduced
          ? 'opacity 0.2s ease'
          : 'transform 0.7s cubic-bezier(0.76,0,0.24,1)',
      }}
    >
      {/* Ivory field revealed by the wipe. */}
      <div className="absolute inset-0 bg-paper" />
      <div className="relative flex flex-col items-center">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#14A3A0"
            strokeWidth="1"
            fill="none"
            strokeDasharray="339"
            strokeDashoffset={339 - (339 * pct) / 100}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
          <text
            x="60"
            y="72"
            textAnchor="middle"
            fill="#13294C"
            fontFamily="Fraunces, Georgia, serif"
            fontSize="34"
            letterSpacing="1"
          >
            J
          </text>
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 font-display text-navy-dim tabular-nums text-2xl">
        {pct.toString().padStart(3, '0')}%
      </div>
    </div>
  );
}
