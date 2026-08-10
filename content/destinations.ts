export interface Destination {
  name: string;
  /** The single line revealed on hover / in-view. */
  line: string;
  /** Poster + loop basename under /public/videos (also the detail-page slug). */
  media: string;
  /** Masonry weight — controls column span / row span for asymmetry. */
  span: 'tall' | 'wide' | 'std';
}

export const destinations: Destination[] = [
  {
    name: 'Malaysia',
    line: 'City towers, island coast and highland tea.',
    media: 'malaysia',
    span: 'tall',
  },
  {
    name: 'Singapore',
    line: 'A waterfront city built to be walked after dark.',
    media: 'singapore',
    span: 'std',
  },
  {
    name: 'Vietnam',
    line: 'Halong Bay harbours and old-town lanterns.',
    media: 'vietnam-cambodia',
    span: 'wide',
  },
  {
    name: 'Cambodia',
    line: 'Stone galleries at first light, before the heat.',
    media: 'vietnam-cambodia',
    span: 'std',
  },
  {
    name: 'Indonesia',
    line: 'Bali rice terraces and temple headlands.',
    media: 'indonesia',
    span: 'std',
  },
  {
    name: 'Sri Lanka',
    line: 'Hill estates and the southern coast, an hour apart.',
    media: 'sri-lanka',
    span: 'tall',
  },
  {
    name: 'Thailand',
    line: 'Bangkok temples and the Andaman islands.',
    media: 'thailand',
    span: 'std',
  },
  {
    name: 'Dubai',
    line: 'Height by day, desert by dusk, one skyline.',
    media: 'dubai-uae',
    span: 'wide',
  },
  {
    name: 'Maldives',
    line: 'Water villas and the long, slow ocean light.',
    media: 'maldives-mauritius',
    span: 'std',
  },
];
