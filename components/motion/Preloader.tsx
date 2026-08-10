'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Splash — the aircraft/globe clip plays full-bleed on a deep-navy field, then
 * an ivory curtain wipes upward to reveal the site. Ends when the clip finishes
 * or a safety cap (whichever first), so a slow/failed video never blocks entry.
 * Reduced motion: no video, a brief fade.
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

    document.body.style.overflow = 'hidden';

    const close = () => {
      setWipe(true);
      window.setTimeout(
        () => {
          setDone(true);
          document.body.style.overflow = '';
        },
        reduced ? 200 : 750,
      );
    };

    if (reduced) {
      const t = window.setTimeout(close, 500);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = '';
      };
    }

    // Play the splash; close when it ends. Min ~1.2s so it never flashes,
    // max 6s so a slow/failed clip never blocks entry.
    const v = videoRef.current;
    const startedAt = performance.now();
    const finish = () => {
      const elapsed = performance.now() - startedAt;
      window.setTimeout(close, Math.max(0, 1200 - elapsed));
    };
    v?.play().catch(() => undefined);
    v?.addEventListener('ended', finish, { once: true });
    v?.addEventListener('error', finish, { once: true });
    // Safety cap sits just past the clip length so it plays through but a
    // stalled/failed clip still releases the page.
    const cap = window.setTimeout(finish, 5000);

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
          : 'transform 0.75s cubic-bezier(0.76,0,0.24,1)',
      }}
    >
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
    </div>
  );
}
