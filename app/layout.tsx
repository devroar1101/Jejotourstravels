import type { Metadata, Viewport } from 'next';
import './globals.css';
import { site } from '@/content/site';
import { buildJsonLd } from '@/lib/jsonld';
import { EnquiryProvider } from '@/components/enquiry/EnquiryContext';
import EnquiryDrawer from '@/components/enquiry/EnquiryDrawer';
import WhatsAppButton from '@/components/enquiry/WhatsAppButton';
import Cursor from '@/components/motion/Cursor';
import Preloader from '@/components/motion/Preloader';
import SmoothScroll from '@/components/motion/SmoothScroll';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'JEJO Tours',
    'Tamil Nadu tour operator',
    'Madurai travel agency',
    'international tour packages',
    'Maldives',
    'Dubai',
    'Singapore',
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: 'en_IN',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ['/og/default.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#F7F5F0',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = buildJsonLd();
  return (
    <html lang="en">
      <head>
        {/* Mark JS-capable before paint so pre-animation hidden states apply
            only when JS can animate them back in. No-JS stays fully readable. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        {/* Preload the display face used above the fold. */}
        <link
          rel="preload"
          href="/fonts/fraunces-display.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/hanken-grotesk.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <EnquiryProvider>
          <Preloader />
          <Cursor />
          <SmoothScroll>
            <a
              href="#philosophy"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-navy focus:px-4 focus:py-2 focus:text-paper"
            >
              Skip to content
            </a>
            {children}
          </SmoothScroll>
          <WhatsAppButton />
          <EnquiryDrawer />
        </EnquiryProvider>
      </body>
    </html>
  );
}
