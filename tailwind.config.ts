import type { Config } from 'tailwindcss';

/**
 * Azure Premium — a light theme drawn from the JEJO brand mark.
 * Crisp cool paper, near-black ink for content, royal blue as the single accent.
 * The default Tailwind palette is disabled; these tokens are the whole system.
 * (Token names paper/navy/teal are kept for stability; only the values changed.)
 *
 *   paper  #F6F7F9  cool off-white surface (page background, text on dark media)
 *   navy   #121826  near-black ink (headings, body text, dark media, primary button)
 *   teal   #1E6FD6  royal blue (accent: eyebrows, rules, CTAs, prices)
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      paper: {
        DEFAULT: '#F6F7F9',
        2: '#EDF0F5', // cool tint band
        3: '#E6EDF8', // blue wash band
        // muted paper for text sitting ON dark media
        dim: 'rgba(246, 247, 249, 0.74)',
        faint: 'rgba(246, 247, 249, 0.42)',
      },
      navy: {
        DEFAULT: '#121826',
        2: '#0A0E18', // deeper ink for media scrims / dark panels
        dim: 'rgba(18, 24, 38, 0.66)',
        faint: 'rgba(18, 24, 38, 0.14)',
        soft: 'rgba(18, 24, 38, 0.06)',
      },
      teal: {
        DEFAULT: '#1E6FD6',
        deep: '#1553A6',
        dim: 'rgba(30, 111, 214, 0.5)',
        wash: 'rgba(30, 111, 214, 0.08)',
      },
    },
    fontFamily: {
      display: ['var(--font-display)', 'Georgia', 'serif'],
      body: ['var(--font-body)', 'system-ui', 'sans-serif'],
    },
    extend: {
      fontSize: {
        eyebrow: ['0.72rem', { lineHeight: '1', letterSpacing: '0.28em' }],
        display: [
          'clamp(3rem, 8vw, 9rem)',
          { lineHeight: '0.94', letterSpacing: '-0.02em' },
        ],
        'display-sm': [
          'clamp(2.2rem, 5vw, 4.5rem)',
          { lineHeight: '1.0', letterSpacing: '-0.015em' },
        ],
        pull: [
          'clamp(1.6rem, 3.2vw, 3rem)',
          { lineHeight: '1.25', letterSpacing: '-0.01em' },
        ],
      },
      letterSpacing: {
        eyebrow: '0.28em',
        wide: '0.08em',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        editorial: '78rem',
      },
      screens: {
        'reduce-safe': { raw: '(prefers-reduced-motion: no-preference)' },
      },
    },
  },
  plugins: [],
};

export default config;
