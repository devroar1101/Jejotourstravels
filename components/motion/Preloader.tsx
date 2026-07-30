'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Splash screen — the aircraft/globe clip plays full-bleed on a deep-navy
 * field with the brand wordmark, then an ivory curtain wipes upward to reveal
 * the site. Ends when the clip finishes or a safety cap (whichever first).
 * Reduced motion: no video, a brief opacity fade.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [wipe, setWipe] = useState(false);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Lock scroll while the splash is up.
    document.body.style.overflow = 'hidden';

    const close = () => {
      setWipe(true);
      window.setTimeout(() => {
        setDone(true);
        document.body.style.overflow = '';
      }, reduced ? 200 : 700);
    };

    // Reduced motion: short, no video.
    if (reduced) {
      const t = window.setTimeout(close, 500);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = '';
      };
    }

    // Play the splash, close when it ends. Min 1.2s so it never flashes,
    // max 4.5s so a slow/failed video never blocks entry.
    const v = videoRef.current;
    const startedAt = performance.now();
    const finish = () => {
      const elapsed = performance.now() - startedAt;
      window.setTimeout(close, Math.max(0, 1200 - elapsed));
    };
    v?.play().catch(() => undefined);
    v?.addEventListener('ended', finish, { once: true });
    v?.addEventListener('error', finish, { once: true });
    const cap = window.setTimeout(finish, 4500);

    return () => {
      window.clearTimeout(cap);
      v?.removeEventListener('ended', finish);
      v?.removeEventListener('error', finish);
      document.body.style.overflow = '';
    };
  }, [reduced]);

  if (done) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] overflow-hidden bg-navy-2"
      style={{
        transform: wipe && !reduced ? 'translateY(-100%)' : 'translateY(0)',
        opacity: wipe && reduced ? 0 : 1,
        transition: reduced
          ? 'opacity 0.2s ease'
          : 'transform 0.7s cubic-bezier(0.76,0,0.24,1)',
      }}
    >
      {/* Splash video */}
      {!reduced && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src="/videos/splash.mp4" type="video/mp4" />
        </video>
      )}

      {/* Ink scrim for wordmark legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, rgba(14,31,58,0.25) 0%, rgba(14,31,58,0.7) 100%)',
        }}
      />

      {/* Brand */}
      <div className="relative grid h-full place-items-center">
        <div className="text-center">
          <span
            className="block font-display font-semibold leading-none text-paper"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 6rem)', letterSpacing: '-0.02em' }}
          >
            JEJO
          </span>
          <span
            className="mt-4 block font-body text-paper-dim"
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
            }}
          >
            Tours &amp; Travels
          </span>
        </div>
      </div>
    </div>
  );
}
