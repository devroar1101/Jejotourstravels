import { site } from '@/content/site';
import { packages } from '@/content/packages';

/**
 * JSON-LD graph: one TravelAgency plus a Product per package carrying the real
 * "from" price. Emitted as a single <script> in the document head.
 */
export function buildJsonLd() {
  const agency = {
    '@type': 'TravelAgency',
    '@id': `${site.url}/#agency`,
    name: site.name,
    description: site.description,
    email: site.email,
    telephone: `+${site.phoneRaw}`,
    url: site.url,
    areaServed: 'Worldwide',
    knowsLanguage: site.languages,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
  };

  const products = packages.map((p) => ({
    '@type': 'Product',
    '@id': `${site.url}/#${p.slug}`,
    name: `${p.name} — ${p.duration}`,
    description: p.summary,
    brand: { '@type': 'Brand', name: site.name },
    image: `${site.url}/og/${p.slug}.png`,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2027-12-31',
      url: `${site.url}/?enquire=${p.slug}`,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [agency, ...products],
  };
}
