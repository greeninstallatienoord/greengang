import type { CSSProperties } from 'react'
import type { BlogCategorySlug, ServiceSlug } from '../types'
import aircoBinnen from '../assets/images/display/airco-binnen.jpg'
import aircoGevel from '../assets/images/display/airco-gevel.jpg'
import aircoOmkasting from '../assets/images/display/airco-omkasting.jpg'
import aircoOmkastingDubbel from '../assets/images/display/airco-omkasting-dubbel.jpg'
import aircoTerras from '../assets/images/display/airco-terras.jpg'
import aircoVloer from '../assets/images/display/airco-vloer.jpg'
import aircoZolder from '../assets/images/display/airco-zolder.jpg'
import aircoPraktijk from '../assets/images/display/airco-praktijk.jpg'
import aircoBeugel from '../assets/images/display/airco-beugel.jpg'
import aircoKaisai from '../assets/images/display/airco-kaisai.jpg'
import aircoNok from '../assets/images/display/airco-nok.jpg'
import aircoPlatdak from '../assets/images/display/airco-platdak.jpg'
import aircoMuur from '../assets/images/display/airco-muur.jpg'
import cvIntergas from '../assets/images/display/cv-intergas.jpg'
import cvOpstelling from '../assets/images/display/cv-opstelling.jpg'
import warmtepompIntergas from '../assets/images/display/warmtepomp-intergas.jpg'
import brl100Logo from '../assets/images/trust/brl100-logo.avif'
import covrijLogo from '../assets/images/trust/covrij-logo.avif'
import kiwaLogo from '../assets/images/trust/kiwa-logo.avif'
import stekLogo from '../assets/images/trust/stek-logo.avif'

export type MediaAsset = {
  src: string
  width: number
  height: number
  alt: string
  objectPosition?: string
  objectPositionMobile?: string
}

export type WorkCategory = 'airco' | 'cv-ketel' | 'warmtepomp'

export type WorkKind =
  | 'buitenunit'
  | 'binnenunit'
  | 'omkasting'
  | 'technische-installatie'

function photo(
  src: string,
  width: number,
  height: number,
  alt: string,
  objectPosition: string,
  objectPositionMobile?: string,
): MediaAsset {
  return { src, width, height, alt, objectPosition, objectPositionMobile }
}

export function mediaPositionStyle(
  asset: Pick<MediaAsset, 'objectPosition' | 'objectPositionMobile'>,
): CSSProperties {
  const desktop = asset.objectPosition ?? '50% 50%'
  return {
    '--media-pos': desktop,
    '--media-pos-mobile': asset.objectPositionMobile ?? desktop,
  } as CSSProperties
}

export const workPhotos = {
  aircoGevel: photo(
    aircoGevel,
    1350,
    1800,
    'Buitenunit aan een bakstenen gevel, met weggewerkt leidingwerk',
    '72% 72%',
    '78% 80%',
  ),
  aircoOmkasting: photo(
    aircoOmkasting,
    1350,
    1800,
    'Buitenunit in een antraciete omkasting bij de gevel',
    '62% 72%',
    '68% 80%',
  ),
  aircoOmkastingDubbel: photo(
    aircoOmkastingDubbel,
    1350,
    1800,
    'Twee buitenunits in een omkasting, met leidingen langs de gevel',
    '50% 80%',
    '50% 84%',
  ),
  aircoZolder: photo(
    aircoZolder,
    1350,
    1800,
    'Binnenunit op zolder, met weggewerkte leiding',
    '32% 22%',
    '28% 16%',
  ),
  aircoPraktijk: photo(
    aircoPraktijk,
    1800,
    1350,
    'Binnenunit in een behandelruimte',
    '22% 18%',
    '18% 14%',
  ),
  aircoVloer: photo(
    aircoVloer,
    1350,
    1800,
    'Vloerconsole voor airconditioning',
    '48% 42%',
    '46% 40%',
  ),
  aircoBinnen: photo(
    aircoBinnen,
    1013,
    1800,
    'Binnenunit boven een spiegel',
    '50% 16%',
    '50% 12%',
  ),
  aircoTerras: photo(
    aircoTerras,
    1800,
    1350,
    'Buitenunit op een plat dak bij een bakstenen gevel',
    '76% 58%',
    '80% 62%',
  ),
  aircoBeugel: photo(
    aircoBeugel,
    1350,
    1800,
    'Buitenunit aan de gevel op een beugel',
    '36% 48%',
    '32% 46%',
  ),
  aircoKaisai: photo(
    aircoKaisai,
    1350,
    1800,
    'Vloerconsole in een slaapkamer op zolder',
    '48% 48%',
    '50% 46%',
  ),
  aircoNok: photo(
    aircoNok,
    1013,
    1800,
    'Buitenunit hoog op de gevel, met leiding naar de nok',
    '18% 58%',
    '16% 62%',
  ),
  aircoPlatdak: photo(
    aircoPlatdak,
    1350,
    1800,
    'Buitenunit op trillingsdempers op een plat dak',
    '50% 48%',
    '50% 52%',
  ),
  aircoMuur: photo(
    aircoMuur,
    1350,
    1800,
    'Buitenunit tegen een bakstenen gevel',
    '32% 58%',
    '28% 62%',
  ),
  cvIntergas: photo(
    cvIntergas,
    1350,
    1800,
    'Intergas-ketel met nevenunit en leidingwerk in een technische ruimte',
    '38% 38%',
    '32% 36%',
  ),
  warmtepompIntergas: photo(
    warmtepompIntergas,
    1350,
    1800,
    'Intergas warmtepomp-buitenunit bij de woning',
    '42% 72%',
    '38% 76%',
  ),
  cvOpstelling: photo(
    cvOpstelling,
    1350,
    1800,
    'Hybride opstelling met Nefit-ketel, Remeha Elga Ace en leidingwerk',
    '52% 40%',
    '50% 38%',
  ),
} as const satisfies Record<string, MediaAsset>

export const pageImages = {
  homeHero: workPhotos.aircoTerras,
  homeTrustPhoto: workPhotos.aircoZolder,
  homeProjectFeatured: workPhotos.aircoGevel,
  homeProjectSecondary: workPhotos.aircoZolder,
  homeProjectWp: workPhotos.warmtepompIntergas,
  aboutHero: workPhotos.aircoOmkasting,
  aboutHouse: workPhotos.aircoBeugel,
  aboutCraft: workPhotos.aircoMuur,
  cvHero: workPhotos.cvIntergas,
  aircoHero: workPhotos.aircoZolder,
  aircoOutdoor: workPhotos.aircoGevel,
  warmtepompHero: workPhotos.warmtepompIntergas,
  serviceHero: workPhotos.cvOpstelling,
} as const

export const serviceImages: Record<ServiceSlug, MediaAsset> = {
  'cv-ketel': pageImages.cvHero,
  airco: pageImages.aircoHero,
  warmtepomp: pageImages.warmtepompHero,
  'service-onderhoud': pageImages.serviceHero,
}

export const blogImages: Record<BlogCategorySlug, MediaAsset> = {
  'cv-ketel': workPhotos.cvIntergas,
  airco: workPhotos.aircoBinnen,
  warmtepomp: workPhotos.warmtepompIntergas,
  onderhoud: workPhotos.cvOpstelling,
  'energie-comfort': workPhotos.aircoPraktijk,
  'praktische-tips': workPhotos.aircoVloer,
}

export function serviceImage(slug: ServiceSlug): MediaAsset {
  return serviceImages[slug]
}

export function blogImage(category: BlogCategorySlug): MediaAsset {
  return blogImages[category]
}

/** Prefer the article’s own photo; fall back to the category default. */
export function postImage(post: {
  category: BlogCategorySlug
  imageKey?: keyof typeof workPhotos
}): MediaAsset {
  if (post.imageKey && post.imageKey in workPhotos) {
    return workPhotos[post.imageKey]
  }
  return blogImage(post.category)
}

export type WorkShot = {
  id: string
  asset: MediaAsset
  title: string
  caption: string
  category: WorkCategory
  kind?: WorkKind
  href?: string
  featured?: boolean
}

/**
 * Featured homepage project photographs.
 * Labels are based on visual inspection of the assets + existing catalog.
 * Prefer accuracy over forcing one card per service category.
 */
export const homeProjectShots: WorkShot[] = [
  {
    id: 'gevel-mitsubishi',
    asset: pageImages.homeProjectFeatured,
    title: 'Mitsubishi airco-buitenunit',
    caption: 'Mitsubishi Electric buitenunit met net leidingwerk langs de gevel.',
    category: 'airco',
    kind: 'buitenunit',
    href: '/airco',
    featured: true,
  },
  {
    id: 'cv-intergas',
    asset: pageImages.cvHero,
    title: 'Intergas cv-ketel',
    caption: 'Intergas-ketel met nevenunit en leidingwerk in een technische ruimte.',
    category: 'cv-ketel',
    kind: 'binnenunit',
    href: '/cv-ketel',
  },
  {
    id: 'warmtepomp-intergas',
    asset: pageImages.homeProjectWp,
    title: 'Intergas warmtepomp-buitenunit',
    caption: 'Intergas warmtepomp-buitenunit op dempers bij de woning.',
    category: 'warmtepomp',
    kind: 'buitenunit',
    href: '/warmtepomp',
  },
]

export type SchemeMark = {
  id: string
  name: string
  src: string
  width: number
  height: number
  alt: string
  /** Extra class to balance apparent logo size inside equal containers. */
  fitClass?: string
}

/** Homepage / trust strip order: Kiwa · STEK · BRL 100 · CO-vrij */
export const schemeMarks: SchemeMark[] = [
  {
    id: 'kiwa',
    name: 'Kiwa',
    src: kiwaLogo,
    width: 64,
    height: 23,
    alt: 'Kiwa',
    fitClass: 'max-h-7 w-auto max-w-[7.25rem] sm:max-h-8 sm:max-w-[8rem]',
  },
  {
    id: 'stek',
    name: 'STEK',
    src: stekLogo,
    width: 96,
    height: 46,
    alt: 'STEK',
    fitClass: 'max-h-9 w-auto max-w-[7.5rem] sm:max-h-10 sm:max-w-[8.25rem]',
  },
  {
    id: 'brl-100',
    name: 'BRL 100',
    src: brl100Logo,
    width: 96,
    height: 93,
    alt: 'BRL 100 / SGS',
    fitClass: 'max-h-11 w-auto max-w-[4.75rem] sm:max-h-12 sm:max-w-[5.25rem]',
  },
  {
    id: 'co-vrij',
    name: 'CO-vrij',
    src: covrijLogo,
    width: 64,
    height: 80,
    alt: 'CO-vrij',
    fitClass: 'max-h-11 w-auto max-w-[3.5rem] sm:max-h-12 sm:max-w-[3.75rem]',
  },
]

export const workCategoryLabels: Record<WorkCategory, string> = {
  airco: 'Airco',
  'cv-ketel': 'CV-ketel',
  warmtepomp: 'Warmtepomp',
}

export const workKindLabels: Record<WorkKind, string> = {
  buitenunit: 'Buitenunit',
  binnenunit: 'Binnenunit',
  omkasting: 'Omkasting',
  'technische-installatie': 'Technische installatie',
}
