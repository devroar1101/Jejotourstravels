export interface Testimonial {
  quote: string;
  name: string;
  location?: string;
  reference: string;
}

/**
 * Real clients. Names, cities and referenced packages preserved;
 * the voice is tightened, not invented.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      'Singapore and Malaysia ran exactly as they set it out. Every arrangement held. I will plan the next trip with them.',
    name: 'Imran Hameed',
    location: 'Madurai',
    reference: 'Singapore & Malaysia',
  },
  {
    quote:
      'They handled the international flights and the visa, and stayed reachable the whole way through. That is what I remember.',
    name: 'Shivanya Ramesh',
    location: 'Trichy',
    reference: 'Flights & Visa',
  },
  {
    quote:
      'Comfortable hotels and an itinerary that made sense for a family. The support was there when we needed it.',
    name: 'Priya',
    location: 'Chennai',
    reference: 'Kerala Family Package',
  },
  {
    quote:
      'Resort, flights and transfers were coordinated to the hour. Our honeymoon simply worked.',
    name: 'Mani & Harini',
    reference: 'Maldives Honeymoon',
  },
];
