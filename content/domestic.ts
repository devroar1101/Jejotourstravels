export interface DomesticPlace {
  name: string;
  line: string;
  /** Poster basename under /public/videos. */
  media: string;
}

export const domestic: DomesticPlace[] = [
  { name: 'Kerala', line: 'Backwaters, houseboats and cool hill stations.', media: 'kerala' },
  { name: 'Kashmir', line: 'Dal Lake, high meadows and early snow.', media: 'kashmir' },
  { name: 'Goa', line: 'Beaches, old quarters and the coast road.', media: 'goa' },
  { name: 'Rajasthan', line: 'Forts, palaces and the desert at dusk.', media: 'rajasthan' },
  { name: 'Andaman', line: 'Islands, reefs and quiet white sand.', media: 'andaman' },
  { name: 'Himachal', line: 'Mountain valleys, pine and river towns.', media: 'himachal' },
];
