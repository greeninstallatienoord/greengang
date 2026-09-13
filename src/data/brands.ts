/**
 * Verified brands Green Installatie Noord installs.
 * Do not invent warranties, “best brand” claims or model lists here.
 */

export type InstallBrand = {
  id: string
  name: string
  category: 'airco' | 'warmtepomp'
}

export const aircoBrands: InstallBrand[] = [
  { id: 'mitsubishi', name: 'Mitsubishi', category: 'airco' },
  { id: 'kaisai', name: 'Kaisai', category: 'airco' },
  { id: 'lg-airco', name: 'LG', category: 'airco' },
  { id: 'haier', name: 'Haier', category: 'airco' },
  { id: 'daikin', name: 'Daikin', category: 'airco' },
]

export const heatPumpBrands: InstallBrand[] = [
  { id: 'weheat', name: 'Weheat', category: 'warmtepomp' },
  { id: 'vaillant', name: 'Vaillant', category: 'warmtepomp' },
  { id: 'remeha', name: 'Remeha', category: 'warmtepomp' },
  { id: 'lg-wp', name: 'LG', category: 'warmtepomp' },
]

export const brandCopy = {
  airco: {
    eyebrow: 'Merken',
    title: 'Airco’s van bekende fabrikanten',
    text: 'We werken met verschillende merken en adviseren welk systeem past bij de ruimte, het gebruik en uw wensen.',
  },
  warmtepomp: {
    eyebrow: 'Merken',
    title: 'Warmtepompen die wij installeren',
    text: 'We werken met verschillende systemen van Weheat, Vaillant, Remeha en LG. Welke warmtepomp passend is, bepalen we op basis van de woning, het benodigde vermogen en de gewenste installatie.',
  },
} as const
