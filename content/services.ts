export interface Service {
  title: string;
  /** A short supporting line for the typographic list. */
  line: string;
}

export const services: Service[] = [
  { title: 'Passport Services', line: 'New applications, renewals and corrections.' },
  { title: 'International Visa', line: 'Documentation and appointments handled end to end.' },
  { title: 'Flight Ticket Booking', line: 'Domestic and international, held at the fare you approve.' },
  { title: 'Hotel Booking', line: 'Rooms matched to the route, not to a commission.' },
  { title: 'Domestic & International Tour Packages', line: 'Planned around your dates and your group.' },
  { title: 'Train & Bus Ticket Booking', line: 'The connecting legs, confirmed and shared.' },
  { title: 'Travel Insurance', line: 'Cover appropriate to the destination.' },
  { title: 'Currency Exchange', line: 'Foreign currency arranged before you fly.' },
  { title: 'International SIM Cards', line: 'Connected the moment you land.' },
  { title: 'Certificate Attestation', line: 'Attestation and apostille for use abroad.' },
];
