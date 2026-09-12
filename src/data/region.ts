export const serviceArea = {
  regionName: 'Noord-Nederland',
  headerLabel: 'Noord-Nederland',
  eyebrow: 'Installatiebedrijf voor Noord-Nederland',
  statement:
    'Green Installatie Noord is gevestigd in Oude Pekela en werkt door heel Noord-Nederland.',
  intro:
    'Vanuit Oude Pekela werken we voor klanten in Groningen, Drenthe en Friesland.',
  baseLine: 'Gevestigd in Oude Pekela, Groningen.',
  provinces: [
    {
      name: 'Groningen',
      featured: true,
      text: 'Thuisprovincie. Hier is het bedrijf gevestigd.',
    },
    {
      name: 'Drenthe',
      featured: false,
      text: 'Onderdeel van het werkgebied in het noorden.',
    },
    {
      name: 'Friesland',
      featured: false,
      text: 'Onderdeel van het werkgebied in het noorden.',
    },
  ],
} as const
