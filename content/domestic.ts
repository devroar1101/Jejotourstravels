export interface DomesticPlace {
  /** URL slug for the detail page: /destinations/<slug>/ */
  slug: string;
  name: string;
  /** The single line shown on the card. */
  line: string;
  /** Poster + loop basename under /public/videos. */
  media: string;
  /** State / area, shown on the detail page. */
  region: string;
  duration: string;
  /** Detail-page intro. Short sentences. */
  summary: string;
  /** Itinerary highlights. */
  highlights: string[];
}

export const domestic: DomesticPlace[] = [
  {
    slug: 'kerala',
    name: 'Kerala',
    line: 'Backwaters, houseboats and cool hill stations.',
    media: 'kerala',
    region: 'Kerala',
    duration: '5D / 4N',
    summary:
      'Alleppey backwaters by houseboat, tea and spice in the hills, and a calm stretch of the Arabian Sea coast.',
    highlights: [
      'Alleppey houseboat night',
      'Munnar tea country',
      'Thekkady spice trails',
      'Kochi old town and coast',
    ],
  },
  {
    slug: 'kashmir',
    name: 'Kashmir',
    line: 'Dal Lake, high meadows and early snow.',
    media: 'kashmir',
    region: 'Jammu & Kashmir',
    duration: '5D / 4N',
    summary:
      'Shikara mornings on Dal Lake, meadows at Gulmarg and Sonamarg, and the gardens of Srinagar.',
    highlights: [
      'Dal Lake shikara and houseboat',
      'Gulmarg gondola',
      'Sonamarg valley',
      'Pahalgam and the Betaab valley',
    ],
  },
  {
    slug: 'goa',
    name: 'Goa',
    line: 'Beaches, old quarters and the coast road.',
    media: 'goa',
    region: 'Goa',
    duration: '4D / 3N',
    summary:
      'North and South Goa across a few easy days — beaches, Latin quarters and the church trail.',
    highlights: [
      'North Goa beaches',
      'Old Goa churches',
      'Panjim Latin quarter',
      'South Goa quiet sands',
    ],
  },
  {
    slug: 'rajasthan',
    name: 'Rajasthan',
    line: 'Forts, palaces and the desert at dusk.',
    media: 'rajasthan',
    region: 'Rajasthan',
    duration: '6D / 5N',
    summary:
      'Jaipur, Udaipur and the desert at Jaisalmer — forts, lake palaces and a night under the dunes.',
    highlights: [
      'Amber Fort, Jaipur',
      'Udaipur lake palaces',
      'Jaisalmer desert camp',
      'Jodhpur blue city',
    ],
  },
  {
    slug: 'andaman-lakshadweep',
    name: 'Andaman & Lakshadweep',
    line: 'Islands, reefs and quiet white sand.',
    media: 'andaman',
    region: 'Island territories',
    duration: '5D / 4N',
    summary:
      'Reef snorkelling, ferry hops and long white beaches across the Andaman and Lakshadweep islands.',
    highlights: [
      'Havelock (Swaraj Dweep)',
      'Radhanagar Beach',
      'Neil Island reefs',
      'Lakshadweep lagoons',
    ],
  },
  {
    slug: 'himachal',
    name: 'Himachal',
    line: 'Mountain valleys, pine and river towns.',
    media: 'himachal',
    region: 'Himachal Pradesh',
    duration: '6D / 5N',
    summary:
      'Shimla, Manali and the Kullu valley — pine ridges, river towns and high mountain passes.',
    highlights: [
      'Shimla ridge',
      'Manali and Solang',
      'Kullu valley',
      'Atal Tunnel and Sissu',
    ],
  },
  {
    slug: 'golden-triangle',
    name: 'Golden Triangle',
    line: 'Delhi, Agra and Jaipur in one classic loop.',
    media: 'golden-triangle',
    region: 'Delhi · Agra · Jaipur',
    duration: '5D / 4N',
    summary:
      "India's most travelled route — Old and New Delhi, the Taj Mahal at Agra, and the forts of Jaipur.",
    highlights: [
      'Taj Mahal, Agra',
      'Agra Fort',
      'Amber Fort, Jaipur',
      'Old and New Delhi',
    ],
  },
  {
    slug: 'uttarakhand',
    name: 'Uttarakhand',
    line: 'Ganga towns, ridgelines and forest reserves.',
    media: 'uttarakhand',
    region: 'Uttarakhand',
    duration: '6D / 5N',
    summary:
      'Rishikesh and Haridwar on the Ganga, the ridges of Mussoorie and Nainital, and Jim Corbett forest.',
    highlights: [
      'Rishikesh and the Ganga Aarti',
      'Mussoorie ridge',
      'Nainital lake',
      'Jim Corbett safari',
    ],
  },
  {
    slug: 'darjeeling',
    name: 'Darjeeling',
    line: 'Tea gardens, toy train and Kanchenjunga.',
    media: 'darjeeling',
    region: 'West Bengal',
    duration: '5D / 4N',
    summary:
      'Sunrise over Kanchenjunga from Tiger Hill, the toy train, tea estates and a run up to Gangtok.',
    highlights: [
      'Tiger Hill sunrise',
      'Darjeeling Himalayan toy train',
      'Tea estate walk',
      'Gangtok add-on',
    ],
  },
  {
    slug: 'ooty-kodaikanal',
    name: 'Ooty & Kodaikanal',
    line: 'Nilgiri hill stations and mountain railways.',
    media: 'ooty-kodaikanal',
    region: 'Tamil Nadu',
    duration: '5D / 4N',
    summary:
      'Two Nilgiri hill stations — botanical gardens, the Nilgiri mountain railway and quiet lake towns.',
    highlights: [
      'Nilgiri mountain railway',
      'Ooty botanical gardens',
      'Kodaikanal lake',
      'Coonoor tea slopes',
    ],
  },
  {
    slug: 'mysore-coorg',
    name: 'Mysore & Coorg',
    line: 'Palace city and the coffee hills.',
    media: 'mysore-coorg',
    region: 'Karnataka',
    duration: '4D / 3N',
    summary:
      'The palace city of Mysore paired with the coffee estates, waterfalls and cool air of Coorg.',
    highlights: [
      'Mysore Palace',
      'Coorg coffee estates',
      'Abbey Falls',
      'Dubare elephant camp',
    ],
  },
];

export const domesticBySlug = (slug: string): DomesticPlace | undefined =>
  domestic.find((d) => d.slug === slug);
