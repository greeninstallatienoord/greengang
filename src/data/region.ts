import { business, formatAddress } from './business'

export const serviceArea = {
  regionName: 'Noord-Nederland',
  headerLabel: 'Noord-Nederland',
  eyebrow: 'Installatiebedrijf voor Noord-Nederland',
  statement:
    'Green Installatie Noord is gevestigd in Oude Pekela en werkt door heel Noord-Nederland.',
  intro:
    'Vanuit Oude Pekela werken we voor klanten in Groningen, Drenthe en Friesland.',
  baseLine: 'Gevestigd in Oude Pekela, Groningen.',
  heroTitle: 'Installateur in Groningen, Drenthe en Friesland',
  heroText:
    'Green Installatie Noord is gevestigd in Oude Pekela en helpt klanten in Noord-Nederland met cv-ketels, airconditioning, warmtepompen, service en onderhoud.',
  mapIntro:
    'Vanuit Oude Pekela werken we in Groningen, Drenthe en Friesland. Twijfelt u over uw locatie? Neem gerust contact op.',
  housingIntro:
    'Welke installatie past, hangt af van de woning, de huidige opstelling, het gebruik en uw wensen. We kijken eerst mee voordat er een voorstel komt.',
  provinces: [
    {
      name: 'Groningen',
      featured: true,
      text: 'Onze thuisprovincie. Vanuit Oude Pekela werken we voor klanten in Groningen.',
    },
    {
      name: 'Drenthe',
      featured: false,
      text: 'Installatie, advies, service en onderhoud voor klanten in Drenthe.',
    },
    {
      name: 'Friesland',
      featured: false,
      text: 'Ook actief in Friesland voor klimaatinstallaties en onderhoud.',
    },
  ],
} as const

/**
 * Vestiging Oude Pekela — geocoded from Burgemeester van Weringstraat 23, 9665 GN
 * via OpenStreetMap Nominatim (house node). Stored statically; do not invent coords.
 */
export const serviceAreaMap = {
  lat: 53.1062074,
  lng: 7.0126299,
  /** Soft pad around northern provinces for initial view. */
  maxBounds: {
    southWest: [52.62, 4.72] as [number, number],
    northEast: [53.62, 7.45] as [number, number],
  },
  minZoom: 7,
  maxZoom: 16,
  /** Approximate label anchors (WGS84) — for visual orientation only. */
  provinceLabels: [
    { name: 'Groningen', lat: 53.24, lng: 6.62 },
    { name: 'Drenthe', lat: 52.9, lng: 6.62 },
    { name: 'Friesland', lat: 53.14, lng: 5.78 },
  ] as const,
} as const

export function mapsDirectionsUrl(): string {
  const query = encodeURIComponent(formatAddress())
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

export function googleBusinessOrMapsUrl(): string {
  return business.googleBusinessProfile || mapsDirectionsUrl()
}

export function openStreetMapPlaceUrl(): string {
  const { lat, lng } = serviceAreaMap
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=12/${lat}/${lng}`
}
