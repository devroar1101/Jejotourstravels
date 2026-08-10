export type ServiceIcon =
  | 'passport'
  | 'visa'
  | 'flight'
  | 'hotel'
  | 'package'
  | 'transit'
  | 'insurance'
  | 'currency'
  | 'sim'
  | 'attestation'
  | 'cab';

export interface Service {
  title: string;
  /** A short supporting line, shown on the card. */
  line: string;
  icon: ServiceIcon;
  /** Basename under /public/videos for the card image (e.g. "passport" -> /videos/passport.jpg). */
  image: string;
}

export const services: Service[] = [
  { title: 'Passport Services', line: 'New applications, renewals and corrections.', icon: 'passport', image: 'passport' },
  { title: 'International Visa', line: 'Documentation and appointments handled end to end.', icon: 'visa', image: 'visa' },
  { title: 'Flight Ticket Booking', line: 'Domestic and international, held at the fare you approve.', icon: 'flight', image: 'flight' },
  { title: 'Hotel Booking', line: 'Rooms matched to the route, not to a commission.', icon: 'hotel', image: 'hotel' },
  { title: 'Domestic & International Tour Packages', line: 'Planned around your dates and your group.', icon: 'package', image: 'packages' },
  { title: 'Train & Bus Ticket Booking', line: 'The connecting legs, confirmed and shared.', icon: 'transit', image: 'train-bus' },
  { title: 'Cab Booking', line: 'Airport transfers and local cabs, arranged in advance.', icon: 'cab', image: 'cab' },
  { title: 'Travel Insurance', line: 'Cover appropriate to the destination.', icon: 'insurance', image: 'insurance' },
  { title: 'Currency Exchange', line: 'Foreign currency arranged before you fly.', icon: 'currency', image: 'currency' },
  { title: 'International SIM Cards', line: 'Connected the moment you land.', icon: 'sim', image: 'sim' },
  { title: 'Certificate Attestation', line: 'Attestation and apostille for use abroad.', icon: 'attestation', image: 'attestation' },
];
