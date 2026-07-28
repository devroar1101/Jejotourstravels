export interface Destination {
  name: string;
  /** The single line revealed on hover / in-view. */
  line: string;
  /** Poster + loop basename under /public/videos. */
  media: string;
  /** Masonry weight — controls column span / row span for asymmetry. */
  span: 'tall' | 'wide' | 'std';
}

export const destinations: Destination[] = [
  {
    name: 'Maldives',
    line: 'Water villas and the long, slow light of the Indian Ocean.',
    media: 'maldives-mauritius',
    span: 'tall',
  },
  {
    name: 'Angkor',
    line: 'Stone galleries at first light, before the heat arrives.',
    media: 'vietnam-cambodia',
    span: 'wide',
  },
  {
    name: 'Langkawi',
    line: 'An island coast between two mainland cities.',
    media: 'malaysia',
    span: 'std',
  },
  {
    name: 'Marina Bay',
    line: 'A waterfront city built to be walked after dark.',
    media: 'singapore',
    span: 'std',
  },
  {
    name: 'The Dunes',
    line: 'Height by day, desert by dusk, all within one skyline.',
    media: 'dubai-uae',
    span: 'tall',
  },
  {
    name: 'Tea Country',
    line: 'Hill estates and the southern coast, an hour apart.',
    media: 'sri-lanka',
    span: 'wide',
  },
];
