/**
 * Resolves the poster image path for a media slot.
 *
 * Real placeholder photos are committed as .jpg for these slots; the remaining
 * slots (ambient washes) use the generated .png. When you drop your own final
 * photography in, keep the same basename + extension and this keeps resolving.
 */
const JPG_SLOTS = new Set([
  'hero',
  'scrub',
  'masked',
  'maldives-mauritius',
  'vietnam-cambodia',
  'malaysia',
  'singapore',
  'dubai-uae',
  'sri-lanka',
]);

export function posterPath(name: string): string {
  return `/videos/${name}.${JPG_SLOTS.has(name) ? 'jpg' : 'png'}`;
}
