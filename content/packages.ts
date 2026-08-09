export interface Package {
  slug: string;
  name: string;
  region: string;
  /**
   * Price per person in INR, presented as "from". Never invent prices — leave
   * undefined for routes we quote on request.
   */
  price?: number;
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
  {
    slug: 'thailand',
    name: 'Thailand',
    region: 'Southeast Asia',
    duration: '5D / 4N',
    summary:
      'Bangkok temples and markets, then the islands and beaches of the Andaman coast.',
    highlights: [
      'Bangkok Grand Palace',
      'Pattaya and Coral Island',
      'Phuket beaches',
      'Phi Phi and Krabi',
    ],
    media: 'thailand',
  },
  {
    slug: 'indonesia',
    name: 'Indonesia · Bali',
    region: 'Southeast Asia',
    duration: '6D / 5N',
    summary:
      'Bali across a single route — Ubud rice terraces, temple headlands and the southern beaches.',
    highlights: [
      'Ubud and the rice terraces',
      'Uluwatu temple',
      'Nusa Penida day trip',
      'Seminyak and Kuta',
    ],
    media: 'indonesia',
  },
  {
    slug: 'almaty',
    name: 'Almaty',
    region: 'Kazakhstan',
    duration: '5D / 4N',
    summary:
      'Central Asia at the foot of the Tien Shan — cable cars, alpine lakes and canyon country.',
    highlights: [
      'Shymbulak and Medeu',
      'Big Almaty Lake',
      'Charyn Canyon',
      'Kok Tobe hill',
    ],
    media: 'almaty',
  },
  {
    slug: 'baku',
    name: 'Baku',
    region: 'Azerbaijan',
    duration: '5D / 4N',
    summary:
      'Where the Caspian meets old and new — a walled old city, modern towers and desert petroglyphs.',
    highlights: [
      'Icherisheher old city',
      'Flame Towers',
      'Gobustan petroglyphs',
      'Absheron mud volcanoes',
    ],
    media: 'baku',
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
