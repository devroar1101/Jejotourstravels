'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Counts a figure up to its value the first time it enters view. Renders with
 * Indian digit grouping. Reduced motion shows the final value immediately.
 */
export default function CountUp({
  value,
  prefix = '₹',
  className = '',
  duration = 1200,
}: {
  value: number;
  prefix?: string;
  className?: string;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(reduced ? value : 0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(eased * value));
        if (t < 1) requestAnimationFrame(step);
        else setDisplay(value); // land exactly on the value
      };
      requestAnimationFrame(step);
    };

    // Poll the element's visual box — reliable even inside the GSAP-pinned,
    // transformed Signature Journeys rail where IntersectionObserver misfires.
    const id = window.setInterval(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.width > 0 && r.top < vh * 0.9 && r.bottom > vh * 0.08) {
        run();
        window.clearInterval(id);
      }
    }, 120);
    // Safety net: never leave the figure stuck at 0.
    const fb = window.setTimeout(() => {
      if (!startedRef.current) {
        startedRef.current = true;
        setDisplay(value);
      }
      window.clearInterval(id);
    }, 6000);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(fb);
    };
  }, [reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {new Intl.NumberFormat('en-IN').format(display)}
    </span>
  );
}
