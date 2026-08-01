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
}

export const services: Service[] = [
  { title: 'Passport Services', line: 'New applications, renewals and corrections.', icon: 'passport' },
  { title: 'International Visa', line: 'Documentation and appointments handled end to end.', icon: 'visa' },
  { title: 'Flight Ticket Booking', line: 'Domestic and international, held at the fare you approve.', icon: 'flight' },
  { title: 'Hotel Booking', line: 'Rooms matched to the route, not to a commission.', icon: 'hotel' },
  { title: 'Domestic & International Tour Packages', line: 'Planned around your dates and your group.', icon: 'package' },
  { title: 'Train & Bus Ticket Booking', line: 'The connecting legs, confirmed and shared.', icon: 'transit' },
  { title: 'Cab Booking', line: 'Airport transfers and local cabs, arranged in advance.', icon: 'cab' },
  { title: 'Travel Insurance', line: 'Cover appropriate to the destination.', icon: 'insurance' },
  { title: 'Currency Exchange', line: 'Foreign currency arranged before you fly.', icon: 'currency' },
  { title: 'International SIM Cards', line: 'Connected the moment you land.', icon: 'sim' },
  { title: 'Certificate Attestation', line: 'Attestation and apostille for use abroad.', icon: 'attestation' },
];
