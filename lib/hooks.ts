'use client';

import { useEffect, useState } from 'react';

/** True when the user asks for reduced motion. SSR-safe (false first paint). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** True on touch / coarse pointers — used to disable the custom cursor. */
export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const on = () => setTouch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return touch;
}

interface Connection {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * True when the network signals a constrained connection: Save-Data is set,
 * or the effective type is slower than 4g. Drives poster-only video on mobile.
 */
export function useConstrainedNetwork(): boolean {
  const [constrained, setConstrained] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: Connection };
    const c = nav.connection;
    if (!c) return;
    const evaluate = () => {
      const slow = c.effectiveType
        ? ['slow-2g', '2g', '3g'].includes(c.effectiveType)
        : false;
      setConstrained(Boolean(c.saveData) || slow);
    };
    evaluate();
    const target = c as unknown as EventTarget & {
      addEventListener?: EventTarget['addEventListener'];
      removeEventListener?: EventTarget['removeEventListener'];
    };
    target.addEventListener?.('change', evaluate);
    return () => target.removeEventListener?.('change', evaluate);
  }, []);
  return constrained;
}
