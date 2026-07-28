import type { Config } from 'tailwindcss';

/**
 * Coastal Editorial — a light theme drawn from the JEJO brand mark.
 * Warm paper, deep brand navy for content, brand teal as the single accent.
 * The default Tailwind palette is disabled; these tokens are the whole system.
 *
 *   paper  #F7F5F0  warm off-white surface (page background, text on dark media)
 *   navy   #13294C  brand navy (headings, body text, dark media, primary button)
 *   teal   #14A3A0  brand teal (accent: eyebrows, rules, CTAs, prices)
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
        DEFAULT: '#F7F5F0',
        2: '#EFEAE0', // warm tint band
        3: '#E5EEEC', // cool teal wash band
        // muted paper for text sitting ON dark media
        dim: 'rgba(247, 245, 240, 0.74)',
        faint: 'rgba(247, 245, 240, 0.42)',
      },
      navy: {
        DEFAULT: '#13294C',
        2: '#0E1F3A', // deeper navy for media scrims / dark panels
        dim: 'rgba(19, 41, 76, 0.66)',
        faint: 'rgba(19, 41, 76, 0.14)',
        soft: 'rgba(19, 41, 76, 0.06)',
      },
      teal: {
        DEFAULT: '#14A3A0',
        deep: '#0C6E6C',
        dim: 'rgba(20, 163, 160, 0.5)',
        wash: 'rgba(20, 163, 160, 0.08)',
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
