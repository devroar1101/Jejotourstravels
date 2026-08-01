import type { ServiceIcon as Key } from '@/content/services';

/**
 * Minimal line icons for the services grid. Stroke uses currentColor so the
 * card can recolour them on hover.
 */
const paths: Record<Key, React.ReactNode> = {
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="11" r="3" />
      <path d="M9.5 18h5" />
    </>
  ),
  visa: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h5M8 13h8M8 17h4" />
      <circle cx="16.5" cy="9" r="1.6" />
    </>
  ),
  flight: <path d="M21 15.5 3 11l4-1 5 2 4.5-6 2 0.5-2.5 7 3.5 1.5-.5 2-3-1.5-1 3.5-1.5.5.5-4z" />,
  hotel: (
    <>
      <path d="M3 20V9l9-5 9 5v11" />
      <path d="M3 20h18" />
      <path d="M9 20v-5h6v5" />
    </>
  ),
  package: (
    <>
      <path d="m3 8 9-5 9 5-9 5-9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="m12 13v8" />
    </>
  ),
  transit: (
    <>
      <rect x="6" y="3" width="12" height="14" rx="2" />
      <path d="M6 11h12" />
      <path d="M9 21l1.5-4M15 21l-1.5-4" />
      <circle cx="9.5" cy="14" r="0.6" />
      <circle cx="14.5" cy="14" r="0.6" />
    </>
  ),
  cab: (
    <>
      <path d="M5 16v-3l2-5h10l2 5v3" />
      <path d="M4 16h16v3h-2v-1H6v1H4z" />
      <path d="M7 8h10" />
      <circle cx="8" cy="16.5" r="0.6" />
      <circle cx="16" cy="16.5" r="0.6" />
    </>
  ),
  insurance: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" />
      <path d="m9.5 12 2 2 3.5-4" />
    </>
  ),
  currency: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9.5c-.7-1-1.9-1.5-3-1.5-1.7 0-3 1-3 2.2 0 2.9 6 1.4 6 4.3 0 1.3-1.4 2.2-3 2.2-1.2 0-2.4-.5-3-1.5" />
      <path d="M12 6.5v11" />
    </>
  ),
  sim: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <rect x="10" y="12" width="6" height="6" rx="1" />
      <path d="M13 12v6M10 15h6" />
    </>
  ),
  attestation: (
    <>
      <rect x="4" y="3" width="16" height="13" rx="2" />
      <path d="M7 7h10M7 10h6" />
      <circle cx="12" cy="18.5" r="2.5" />
      <path d="M10.5 20.5 9.5 23l2.5-1.2L14.5 23l-1-2.5" />
    </>
  ),
};

export default function ServiceIcon({
  name,
  className = '',
}: {
  name: Key;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
