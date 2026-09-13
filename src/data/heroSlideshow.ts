/**
 * Homepage hero photographic slideshow configuration.
 * Derivatives live in /public/images/hero/ (built from ./hero-afbeeldingen/).
 */

export type HeroSlideVariant = {
  avif: string
  webp: string
  jpg: string
  width: number
  height: number
}

export type HeroSlide = {
  id: string
  /** Concise description for internal/SEO use; decorative in the rotator. */
  label: string
  mobile: HeroSlideVariant
  desktop: HeroSlideVariant | null
  mobilePosition: string
  desktopPosition: string
  /** Extra overlay darkness 0–1 (subtle). */
  overlayStrength: number
}

const heroBase = '/images/hero'

function variant(
  id: string,
  kind: 'mobile' | 'desktop',
  width: number,
  height: number,
): HeroSlideVariant {
  const base = `${heroBase}/${id}-${kind}`
  return {
    avif: `${base}.avif`,
    webp: `${base}.webp`,
    jpg: `${base}.jpg`,
    width,
    height,
  }
}

/**
 * Deliberate order: strong outdoor LCP first, then alternate indoor/outdoor.
 * Mobile uses all 7. Desktop only when a wide crop preserves the installation.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'hero-airco-exterior-gevel-01',
    label: 'Buitenunit aan bakstenen gevel',
    mobile: variant('hero-airco-exterior-gevel-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-exterior-gevel-01', 'desktop', 1273, 716),
    mobilePosition: '58% 62%',
    desktopPosition: '68% 70%',
    overlayStrength: 0.08,
  },
  {
    id: 'hero-airco-indoor-attic-01',
    label: 'Binnenunit op zolder',
    mobile: variant('hero-airco-indoor-attic-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-indoor-attic-01', 'desktop', 1273, 716),
    mobilePosition: '48% 28%',
    desktopPosition: '42% 40%',
    overlayStrength: 0.12,
  },
  {
    id: 'hero-airco-exterior-duo-01',
    label: 'Dubbele buitenunits aan gevel',
    mobile: variant('hero-airco-exterior-duo-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-exterior-duo-01', 'desktop', 1273, 716),
    mobilePosition: '52% 72%',
    desktopPosition: '55% 78%',
    overlayStrength: 0.06,
  },
  {
    id: 'hero-airco-indoor-kaisai-01',
    label: 'Kaisai binnenunit in slaapkamer',
    mobile: variant('hero-airco-indoor-kaisai-01', 'mobile', 900, 1200),
    desktop: null,
    mobilePosition: '52% 40%',
    desktopPosition: '50% 50%',
    overlayStrength: 0.1,
  },
  {
    id: 'hero-airco-exterior-nok-01',
    label: 'Buitenunit bij gevelnok',
    mobile: variant('hero-airco-exterior-nok-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-exterior-nok-01', 'desktop', 1273, 716),
    mobilePosition: '38% 55%',
    desktopPosition: '32% 72%',
    overlayStrength: 0.05,
  },
  {
    id: 'hero-warmtepomp-indoor-remeha-01',
    label: 'Remeha hybride binnenopstelling',
    mobile: variant('hero-warmtepomp-indoor-remeha-01', 'mobile', 900, 1200),
    desktop: null,
    mobilePosition: '55% 38%',
    desktopPosition: '50% 50%',
    overlayStrength: 0.14,
  },
  {
    id: 'hero-airco-indoor-praktijk-01',
    label: 'Binnenunit in praktijkruimte',
    mobile: variant('hero-airco-indoor-praktijk-01', 'mobile', 900, 1200),
    desktop: null,
    mobilePosition: '42% 26%',
    desktopPosition: '50% 50%',
    overlayStrength: 0.1,
  },
]

export const heroSlideshowTiming = {
  /** Time each slide stays fully visible before crossfade starts. */
  displayMs: 7000,
  /** Crossfade duration (matches CSS transition). */
  transitionMs: 1500,
} as const

export const heroSlideshowCopy = {
  practiceLabel: 'Werk uit de praktijk',
} as const

export function desktopHeroSlides(): HeroSlide[] {
  return heroSlides.filter((slide) => slide.desktop != null)
}

export function mobileHeroSlides(): HeroSlide[] {
  return heroSlides
}
