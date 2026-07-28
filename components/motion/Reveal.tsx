'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/hooks';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Clip-path mask reveal on scroll. Under reduced motion this becomes a plain
 * opacity fade with no transform (kept via CSS/inline fallback).
 */
export function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { autoAlpha: 1, clipPath: 'none' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          clipPath: 'inset(0 0 100% 0)',
          autoAlpha: 0,
          y: 24,
        },
        {
          clipPath: 'inset(0 0 0% 0)',
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          delay,
          scrollTrigger: { trigger: el, start: 'top 82%' },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, delay]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any;
  return (
    <Component ref={ref} className={`reveal-mask ${className}`}>
      {children}
    </Component>
  );
}

/**
 * Split lines that mask-slide up in sequence on scroll. Pass explicit lines —
 * no runtime measurement, so it is deterministic and SSR-friendly.
 */
export function StaggerLines({
  lines,
  className = '',
  lineClassName = '',
  stagger = 0.08,
  start = 'top 85%',
  trigger = true,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
  start?: string;
  trigger?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inners = el.querySelectorAll<HTMLElement>('.line-inner');

    // Reveal the container (it starts opacity:0 via .split-hide to avoid FOUC).
    gsap.set(el, { autoAlpha: 1 });

    if (reduced) {
      gsap.set(inners, { yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 110 });
      gsap.to(inners, {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
        stagger,
        scrollTrigger: trigger ? { trigger: el, start } : undefined,
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, stagger, start, trigger]);

  return (
    <div ref={ref} className={`split-hide ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span className={`line-inner ${lineClassName}`}>{line}</span>
        </span>
      ))}
    </div>
  );
}
