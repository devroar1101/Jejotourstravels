'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnquiry } from './EnquiryContext';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Floating enquiry trigger. Enters at 40% scroll with scale + fade, and a
 * gold ring pulses every 6 seconds (not continuously). Opens the drawer —
 * never a page navigation.
 */
export default function WhatsAppButton() {
  const { openEnquiry, open } = useEnquiry();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setShown(scrolled > 0.4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pulse every 6s, not continuous.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setPulse(true);
      window.setTimeout(() => setPulse(false), 1400);
    }, 6000);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <AnimatePresence>
      {shown && !open && (
        <motion.button
          onClick={() => openEnquiry()}
          aria-label="Plan your journey — open enquiry"
          data-cursor="PLAN"
          className="fixed bottom-6 right-6 z-[80] grid h-16 w-16 place-items-center rounded-full bg-teal text-paper shadow-xl md:bottom-8 md:right-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Gold ring pulse */}
          {pulse && !reduced && (
            <motion.span
              className="absolute inset-0 rounded-full border border-teal"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          )}
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.16c-.24.68-1.42 1.32-1.95 1.36-.5.04-.96.23-3.24-.68-2.74-1.08-4.47-3.87-4.6-4.05-.14-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.28.24-.27.53-.34.71-.34.18 0 .36.002.51.01.16.007.39-.06.6.46.24.58.82 2 .89 2.14.07.14.12.31.02.49-.09.18-.14.29-.28.45-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.27.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.18-.21.69-.8.87-1.08.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.87.27.14.45.2.51.31.07.12.07.66-.17 1.34Z" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
