export const site = {
  name: 'JEJO Tours & Travels',
  shortName: 'JEJO',
  tagline: 'The Art of the Journey',
  description:
    'A full-service travel company in Tamil Nadu offering complete travel support under one roof — passports, international visas, flights, hotels, tour packages, insurance and more — planned with care, honesty and attention to detail.',
  email: 'jejo.tourism10@gmail.com',
  // Displayed number.
  phoneDisplay: '+91 86105 80975',
  // wa.me / tel: format, no spaces, country code, no plus.
  phoneRaw: '918610580975',
  languages: ['Tamil', 'English', 'Hindi'],
  groupSize: '5–6',
  regions: ['Madurai', 'Trichy', 'Chennai'],
  // Set at deploy time; used for canonical + JSON-LD + sitemap.
  url: 'https://jejotoursandtravels.pages.dev',
} as const;

export type Site = typeof site;
