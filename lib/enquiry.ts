import { site } from '@/content/site';
import { inr } from '@/content/packages';
import { tripBySlug } from '@/content/catalog';

/**
 * The entire enquiry payload as one typed object. The UI reads and writes
 * only this shape; a real backend can be wired in later by consuming it
 * without touching a single component.
 */
export interface EnquiryDraft {
  destination: string;
  /** Slug when a package chip was chosen; null for "Somewhere else". */
  slug: string | null;
  /** "from" price string for the chosen package, or empty. */
  price: string;
  month: string;
  adults: number;
  children: number;
  infants: number;
  budget: string;
  name: string;
  /** 10-digit Indian mobile, digits only. */
  phone: string;
}

export const emptyDraft: EnquiryDraft = {
  destination: '',
  slug: null,
  price: '',
  month: '',
  adults: 2,
  children: 0,
  infants: 0,
  budget: '',
  name: '',
  phone: '',
};

export const budgetBands = [
  'Under ₹40k',
  '₹40k – ₹75k',
  '₹75k – ₹1.5L',
  '₹1.5L+',
] as const;

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/** Indian mobile: 10 digits, leading 6–9. */
export const isValidIndianMobile = (raw: string): boolean =>
  /^[6-9]\d{9}$/.test(raw.replace(/\D/g, ''));

export const draftFromSlug = (slug: string): Partial<EnquiryDraft> => {
  const trip = tripBySlug(slug);
  if (!trip) return {};
  return {
    destination: trip.name,
    slug: trip.slug,
    price: trip.price ? `${inr(trip.price)} onwards` : '',
  };
};

/** Exact message template from the brief. */
export const buildMessage = (d: EnquiryDraft): string => {
  const pricePart = d.price ? ` (${d.price})` : '';
  return [
    `Hello ${site.name}, I'd like to plan a journey.`,
    `Package: ${d.destination || 'Somewhere else'}${pricePart}`,
    `Month: ${d.month || '—'} | Travellers: ${d.adults} adults, ${d.children} children, ${d.infants} infants`,
    `Budget: ${d.budget || '—'}`,
    `Name: ${d.name || '—'} | Phone: ${d.phone || '—'}`,
  ].join('\n');
};

export const whatsappHref = (message: string): string =>
  `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(message)}`;

export const telHref = `tel:+${site.phoneRaw}`;

export const STORAGE_KEY = 'jejo:enquiry-draft:v1';
