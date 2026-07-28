'use client';

import { useEffect, useRef } from 'react';
import { useIsTouch, useReducedMotion } from '@/lib/hooks';

/**
 * Magnetic hover — the child drifts toward the pointer and springs back.
 * No-op on touch and under reduced motion.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const touch = useIsTouch();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (touch || reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
    };
    const onLeave = () => {
      el.style.transform = 'translate(0, 0)';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [touch, reduced, strength]);

  return (
    <span
      ref={ref}
      className={`inline-block will-change-transform ${className}`}
      style={{ transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}
    >
      {children}
    </span>
  );
}
