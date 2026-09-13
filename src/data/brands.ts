/**
 * Verified brands Green Installatie Noord installs.
 * Do not invent warranties, “best brand” claims or model lists here.
 */

import weheatLogo from '../assets/images/brands/weheat.svg'
import vaillantLogo from '../assets/images/brands/vaillant.svg'
import remehaLogo from '../assets/images/brands/remeha.svg'
import intergasLogo from '../assets/images/brands/intergas.svg'

export type InstallBrand = {
  id: string
  name: string
  category: 'airco' | 'warmtepomp'
  /** Local logo asset (SVG/PNG). Prefer official manufacturer mark. */
  logoSrc?: string
  logoWidth?: number
  logoHeight?: number
}

export const aircoBrands: InstallBrand[] = [
  { id: 'mitsubishi', name: 'Mitsubishi', category: 'airco' },
  { id: 'kaisai', name: 'Kaisai', category: 'airco' },
  { id: 'lg-airco', name: 'LG', category: 'airco' },
  { id: 'haier', name: 'Haier', category: 'airco' },
  { id: 'daikin', name: 'Daikin', category: 'airco' },
]

export const heatPumpBrands: InstallBrand[] = [
  {
    id: 'weheat',
    name: 'Weheat',
    category: 'warmtepomp',
    logoSrc: weheatLogo,
    logoWidth: 198,
    logoHeight: 30,
  },
  {
    id: 'vaillant',
    name: 'Vaillant',
    category: 'warmtepomp',
    logoSrc: vaillantLogo,
    logoWidth: 136,
    logoHeight: 36,
  },
  {
    id: 'remeha',
    name: 'Remeha',
    category: 'warmtepomp',
    logoSrc: remehaLogo,
    logoWidth: 126,
    logoHeight: 30,
  },
  {
    id: 'intergas',
    name: 'Intergas',
    category: 'warmtepomp',
    logoSrc: intergasLogo,
    logoWidth: 280,
    logoHeight: 20,
  },
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
    text: 'We werken met verschillende systemen van Weheat, Vaillant, Remeha en Intergas. Welke warmtepomp passend is, bepalen we op basis van de woning, het benodigde vermogen en de gewenste installatie.',
  },
} as const
