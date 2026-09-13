/**
 * Homepage hero photographic slideshow configuration.
 * Derivatives live in /public/images/hero/ (built from ./hero-afbeeldingen/).
 *
 * Only include photographs that remain readable when cropped as a hero.
 * Bedroom/clutter shots belong on /werk, not in the rotator.
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
  /** object-position for phones (portrait crop). */
  mobilePosition: string
  /** object-position for tablets / laptops (~768–1279px). */
  laptopPosition: string
  /** object-position for wide desktop (≥1280px). */
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
 * Mobile uses all listed slides. Desktop only when a wide crop preserves the unit.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'hero-airco-exterior-gevel-01',
    label: 'Buitenunit aan bakstenen gevel',
    mobile: variant('hero-airco-exterior-gevel-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-exterior-gevel-01', 'desktop', 1273, 716),
    // Unit + conduit sit low-right; keep ground unit in frame under text.
    mobilePosition: '78% 82%',
    laptopPosition: '72% 78%',
    desktopPosition: '70% 80%',
    overlayStrength: 0.08,
  },
  {
    id: 'hero-airco-indoor-attic-01',
    label: 'Binnenunit op zolder',
    mobile: variant('hero-airco-indoor-attic-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-indoor-attic-01', 'desktop', 1273, 716),
    // Indoor unit sits high; bias upward so the head unit stays readable.
    mobilePosition: '48% 28%',
    laptopPosition: '44% 34%',
    desktopPosition: '40% 38%',
    overlayStrength: 0.12,
  },
  {
    id: 'hero-airco-exterior-duo-01',
    label: 'Dubbele buitenunits aan gevel',
    mobile: variant('hero-airco-exterior-duo-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-exterior-duo-01', 'desktop', 1273, 716),
    // Dual outdoor units at ground; keep both visible under hero overlay.
    mobilePosition: '48% 84%',
    laptopPosition: '50% 80%',
    desktopPosition: '52% 82%',
    overlayStrength: 0.06,
  },
  {
    id: 'hero-airco-exterior-nok-01',
    label: 'Buitenunit bij gevelnok',
    mobile: variant('hero-airco-exterior-nok-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-exterior-nok-01', 'desktop', 1273, 716),
    // Unit sits mid-facade; avoid cropping to roof/sky on phones.
    mobilePosition: '38% 42%',
    laptopPosition: '34% 48%',
    desktopPosition: '32% 52%',
    overlayStrength: 0.05,
  },
  {
    id: 'hero-warmtepomp-indoor-remeha-01',
    label: 'Remeha hybride binnenopstelling',
    mobile: variant('hero-warmtepomp-indoor-remeha-01', 'mobile', 900, 1200),
    desktop: null,
    mobilePosition: '50% 34%',
    laptopPosition: '48% 38%',
    desktopPosition: '46% 40%',
    overlayStrength: 0.14,
  },
  // hero-airco-indoor-praktijk-01 stays in /public/images/hero but is omitted:
  // desk clutter reads poorly behind hero copy at common crops.
]

export const heroSlideshowTiming = {
  /** Time each slide stays fully visible before crossfade starts. */
  displayMs: 8000,
  /** Crossfade duration (matches CSS transition). */
  transitionMs: 1600,
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
