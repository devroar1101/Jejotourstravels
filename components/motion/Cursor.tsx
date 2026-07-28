'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsTouch, useReducedMotion } from '@/lib/hooks';

/**
 * Custom cursor dot that morphs to a labelled disc (VIEW / PLAY) over
 * elements carrying data-cursor. Desktop only; hidden on touch and under
 * reduced motion.
 */
export default function Cursor() {
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [variant, setVariant] = useState<'dot' | 'label'>('dot');

  useEffect(() => {
    if (touch || reduced) return;
    const dot = dotRef.current;
    if (!dot) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = (e.target as HTMLElement)?.closest('[data-cursor]');
      if (target) {
        setVariant('label');
        setLabel(target.getAttribute('data-cursor') || 'VIEW');
      } else {
        setVariant('dot');
        setLabel('');
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [touch, reduced]);

  if (touch || reduced) return null;

  return (
    <div ref={dotRef} className="cursor-dot" data-variant={variant} aria-hidden>
      <span className="cursor-label">{label}</span>
    </div>
  );
}
