'use client';

import { useEnquiry } from './EnquiryContext';
import Magnetic from '@/components/motion/Magnetic';

/**
 * The only conversion control on the page. Opens the drawer — never a page
 * navigation. `tone` adapts the styling to a light section or a dark media
 * panel so contrast stays correct on both.
 */
export default function EnquiryCTA({
  slug,
  children,
  variant = 'solid',
  tone = 'onLight',
  className = '',
}: {
  slug?: string;
  children: React.ReactNode;
  variant?: 'solid' | 'ghost' | 'text';
  tone?: 'onLight' | 'onDark';
  className?: string;
}) {
  const { openEnquiry } = useEnquiry();

  const base =
    'inline-flex items-center gap-3 font-body text-sm uppercase tracking-wide transition-colors';

  let styles = '';
  if (variant === 'solid') {
    styles =
      tone === 'onDark'
        ? 'bg-paper px-8 py-4 text-navy hover:bg-teal hover:text-paper'
        : 'bg-navy px-8 py-4 text-paper hover:bg-teal';
  } else if (variant === 'ghost') {
    styles =
      tone === 'onDark'
        ? 'border border-paper-faint px-8 py-4 text-paper hover:border-teal hover:text-teal'
        : 'border border-navy-faint px-8 py-4 text-navy hover:border-teal hover:text-teal';
  } else {
    styles = 'text-teal link-underline';
  }

  return (
    <Magnetic strength={0.25}>
      <button
        onClick={() => openEnquiry(slug)}
        data-cursor="PLAN"
        className={`${base} ${styles} ${className}`}
      >
        {children}
      </button>
    </Magnetic>
  );
}
