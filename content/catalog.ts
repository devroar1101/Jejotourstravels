import { packages } from './packages';
import { domestic } from './domestic';

/**
 * One unified view over every place we run — domestic rails and international
 * packages alike — so the detail route (/destinations/<slug>/) and the enquiry
 * prefill can resolve any card by a single slug.
 */
export type TripCategory = 'domestic' | 'international';

export interface Trip {
  slug: string;
  name: string;
  category: TripCategory;
  region: string;
  summary: string;
  highlights: string[];
  media: string;
  /** True when a real .mp4 loop ships for this slot. */
  hasVideo: boolean;
  /** Per person, INR. Undefined = quoted on request. */
  price?: number;
  duration?: string;
  note?: string;
}

// Slots that ship with real footage (a .mp4 under /public/videos).
const VIDEO_SLOTS = new Set([
  'kerala',
  'kashmir',
  'goa',
  'andaman',
  'dubai-uae',
]);

const domesticTrips: Trip[] = domestic.map((d) => ({
  slug: d.slug,
  name: d.name,
  category: 'domestic',
  region: d.region,
  summary: d.summary,
  highlights: d.highlights,
  media: d.media,
  hasVideo: VIDEO_SLOTS.has(d.media),
  duration: d.duration,
}));

const internationalTrips: Trip[] = packages.map((p) => ({
  slug: p.slug,
  name: p.name,
  category: 'international',
  region: p.region,
  summary: p.summary,
  highlights: p.highlights,
  media: p.media,
  hasVideo: VIDEO_SLOTS.has(p.media),
  price: p.price,
  duration: p.duration,
  note: p.note,
}));

export const trips: Trip[] = [...domesticTrips, ...internationalTrips];

export const tripBySlug = (slug: string): Trip | undefined =>
  trips.find((t) => t.slug === slug);

export const tripsByCategory = (category: TripCategory): Trip[] =>
  trips.filter((t) => t.category === category);
