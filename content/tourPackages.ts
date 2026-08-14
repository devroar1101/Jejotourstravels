export interface TourPackage {
  name: string;
  /** Detail-page slug. */
  slug: string;
  /** Poster basename under /public/videos. */
  media: string;
  price: number;
}

// The eight headline packages, matching the flyer (combined routes point to
// their closest detail page).
export const tourPackages: TourPackage[] = [
  { name: 'Ooty · Kodaikanal · Coorg', slug: 'ooty-kodaikanal', media: 'ooty-kodaikanal', price: 10999 },
  { name: 'Kerala', slug: 'kerala', media: 'kerala', price: 12999 },
  { name: 'Andaman Island', slug: 'andaman-lakshadweep', media: 'andaman', price: 14999 },
  { name: 'Delhi · Shimla · Kullu Manali · Darjeeling', slug: 'golden-triangle', media: 'darjeeling', price: 12999 },
  { name: 'Malaysia', slug: 'malaysia', media: 'malaysia', price: 10999 },
  { name: 'Singapore', slug: 'singapore', media: 'singapore', price: 19999 },
  { name: 'Dubai', slug: 'dubai-uae', media: 'dubai-uae', price: 18999 },
  { name: 'Thailand', slug: 'thailand', media: 'thailand', price: 13999 },
];
