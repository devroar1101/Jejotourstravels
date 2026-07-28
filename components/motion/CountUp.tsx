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
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(eased * value));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {new Intl.NumberFormat('en-IN').format(display)}
    </span>
  );
}
