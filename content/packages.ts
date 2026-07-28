export interface Package {
  slug: string;
  name: string;
  region: string;
  /** Price per person in INR, presented as "from". Never invent prices. */
  price: number;
  duration: string;
  /** One editorial line. Short sentences. */
  summary: string;
  /** Itinerary highlights, verbatim from brief. */
  highlights: string[];
  /** Positioning note, shown sparingly. */
  note?: string;
  /** Poster + video basenames under /public/videos and /public/og. */
  media: string;
}

export const packages: Package[] = [
  {
    slug: 'maldives-mauritius',
    name: 'Maldives & Mauritius',
    region: 'Indian Ocean',
    price: 64900,
    duration: '4D / 3N',
    summary:
      'Two islands of water and light, arranged for couples who want the day to slow down.',
    highlights: [
      'Private villas',
      'Water sports',
      'Snorkelling and diving',
      'Sunset cruises',
    ],
    note: 'Shaped for honeymooners and couples.',
    media: 'maldives-mauritius',
  },
  {
    slug: 'vietnam-cambodia',
    name: 'Vietnam & Cambodia',
    region: 'Southeast Asia',
    price: 42400,
    duration: '5D / 4N',
    summary:
      'From the harbours of Halong Bay to the stone galleries of Angkor, an arc across two histories.',
    highlights: [
      'Hanoi',
      'Ho Chi Minh City',
      'Halong Bay cruise',
      'Hoi An',
      'Angkor Wat',
    ],
    media: 'vietnam-cambodia',
  },
  {
    slug: 'malaysia',
    name: 'Malaysia',
    region: 'Southeast Asia',
    price: 39999,
    duration: '4D / 3N',
    summary:
      'City towers, island coast and cool highland tea gardens across a single, easy route.',
    highlights: [
      'Petronas Twin Towers',
      'Langkawi',
      'Penang',
      'Genting and Cameron Highlands',
    ],
    media: 'malaysia',
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    region: 'Southeast Asia',
    price: 39999,
    duration: '4D / 3N',
    summary:
      'A precise, walkable city of gardens and waterfronts, well suited to first journeys abroad.',
    highlights: [
      'Marina Bay Sands',
      'Gardens by the Bay',
      'Sentosa',
      'Universal Studios',
    ],
    media: 'singapore',
  },
  {
    slug: 'dubai-uae',
    name: 'Dubai, UAE',
    region: 'The Gulf',
    price: 36500,
    duration: '4D / 3N',
    summary:
      'Height, water and desert in a few short days, from the Burj Khalifa to the dunes at dusk.',
    highlights: [
      'Burj Khalifa',
      'Palm Jumeirah',
      'Dubai Marina',
      'Desert safari',
    ],
    media: 'dubai-uae',
  },
  {
    slug: 'sri-lanka',
    name: 'Sri Lanka',
    region: 'Indian Ocean',
    price: 35900,
    duration: '4D / 3N',
    summary:
      'Hill country, tea estates and the southern coast, close to home and quietly varied.',
    highlights: [
      'Kandy',
      'Nuwara Eliya tea country',
      'Bentota beaches',
      'Yala National Park',
    ],
    media: 'sri-lanka',
  },
];

export const inr = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export const packageBySlug = (slug: string): Package | undefined =>
  packages.find((p) => p.slug === slug);
