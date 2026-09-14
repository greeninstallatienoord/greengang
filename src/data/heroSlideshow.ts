/**
 * Homepage hero photographic slideshow configuration.
 *
 * Legacy derivatives: /public/images/hero/ (from ./hero-afbeeldingen/)
 * Large-screen set:  /public/images/hero/large/ (from ./hero-groteschermen/)
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

/**
 * Homepage hero variant switch.
 * Switch to 'legacy' to restore the previous homepage hero.
 *
 * - 'new-large-screen' → five new images on viewports ≥1024px; legacy below that
 * - 'legacy' → exact previous hero behavior on all breakpoints
 *
 * If you switch to 'legacy', also restore the desktop LCP preloads in index.html
 * to media="(min-width: 768px)" for hero-airco-exterior-gevel-01-desktop.*
 */
export const HOMEPAGE_HERO_VARIANT: 'new-large-screen' | 'legacy' =
  'new-large-screen'

/** Breakpoint where the new large-screen slideshow replaces legacy desktop crops. */
export const HOMEPAGE_HERO_LARGE_MIN_WIDTH = 1024

const heroBase = '/images/hero'
const largeBase = `${heroBase}/large`

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

function largeVariant(
  id: string,
  width: number,
  height: number,
): HeroSlideVariant {
  const base = `${largeBase}/${id}`
  return {
    avif: `${base}.avif`,
    webp: `${base}.webp`,
    jpg: `${base}.jpg`,
    width,
    height,
  }
}

/**
 * Legacy rotator (mobile + tablet + legacy desktop).
 * Deliberate order: strong outdoor LCP first, then alternate indoor/outdoor.
 * Mobile uses all listed slides. Desktop only when a wide crop preserves the unit.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'hero-airco-exterior-gevel-01',
    label: 'Buitenunit aan bakstenen gevel',
    mobile: variant('hero-airco-exterior-gevel-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-exterior-gevel-01', 'desktop', 943, 629),
    // Unit + conduit sit low-right; keep full outdoor unit in frame on desktop.
    mobilePosition: '78% 82%',
    laptopPosition: '70% 76%',
    desktopPosition: '66% 78%',
    overlayStrength: 0.08,
  },
  {
    id: 'hero-airco-indoor-attic-01',
    label: 'Binnenunit op zolder',
    mobile: variant('hero-airco-indoor-attic-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-indoor-attic-01', 'desktop', 943, 629),
    // Indoor unit sits high; bias upward so the head unit stays readable.
    mobilePosition: '48% 28%',
    laptopPosition: '46% 34%',
    desktopPosition: '45% 36%',
    overlayStrength: 0.12,
  },
  {
    id: 'hero-airco-exterior-duo-01',
    label: 'Dubbele buitenunits aan gevel',
    mobile: variant('hero-airco-exterior-duo-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-exterior-duo-01', 'desktop', 943, 629),
    // Dual outdoor units at ground; keep both visible under hero overlay.
    mobilePosition: '48% 84%',
    laptopPosition: '50% 78%',
    desktopPosition: '50% 80%',
    overlayStrength: 0.06,
  },
  {
    id: 'hero-airco-exterior-nok-01',
    label: 'Buitenunit bij gevelnok',
    mobile: variant('hero-airco-exterior-nok-01', 'mobile', 900, 1200),
    desktop: variant('hero-airco-exterior-nok-01', 'desktop', 943, 629),
    // Unit sits mid-facade; avoid cropping to roof/sky on phones.
    mobilePosition: '38% 42%',
    laptopPosition: '36% 50%',
    desktopPosition: '35% 55%',
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

/**
 * New large-screen (≥1024px) slideshow — full-width compositions from hero-groteschermen/.
 * Equipment stays on the right; left negative space is for hero copy.
 */
export const largeScreenHeroSlides: HeroSlide[] = [
  {
    id: 'hero-large-warmtepomp-patio-01',
    label: 'Warmtepomp op patio bij bakstenen gevel',
    mobile: largeVariant('hero-large-warmtepomp-patio-01', 1672, 941),
    desktop: largeVariant('hero-large-warmtepomp-patio-01', 1672, 941),
    mobilePosition: '72% 48%',
    laptopPosition: '72% 48%',
    desktopPosition: '74% 48%',
    overlayStrength: 0.07,
  },
  {
    id: 'hero-large-warmtepomp-tuin-01',
    label: 'Warmtepomp in tuin bij moderne woning',
    mobile: largeVariant('hero-large-warmtepomp-tuin-01', 1672, 941),
    desktop: largeVariant('hero-large-warmtepomp-tuin-01', 1672, 941),
    mobilePosition: '70% 54%',
    laptopPosition: '70% 54%',
    desktopPosition: '72% 52%',
    overlayStrength: 0.08,
  },
  {
    id: 'hero-large-cv-ketel-binnen-01',
    label: 'CV-ketel met leidingwerk binnenshuis',
    mobile: largeVariant('hero-large-cv-ketel-binnen-01', 1672, 941),
    desktop: largeVariant('hero-large-cv-ketel-binnen-01', 1672, 941),
    mobilePosition: '78% 46%',
    laptopPosition: '78% 46%',
    desktopPosition: '80% 45%',
    overlayStrength: 0.11,
  },
  {
    id: 'hero-large-service-buitenunit-01',
    label: 'Monteur bij buitenunit in avondlicht',
    mobile: largeVariant('hero-large-service-buitenunit-01', 1672, 941),
    desktop: largeVariant('hero-large-service-buitenunit-01', 1672, 941),
    mobilePosition: '80% 52%',
    laptopPosition: '80% 52%',
    desktopPosition: '82% 50%',
    overlayStrength: 0.06,
  },
  {
    id: 'hero-large-warmtepomp-mitsubishi-01',
    label: 'Mitsubishi warmtepomp in tuin',
    mobile: largeVariant('hero-large-warmtepomp-mitsubishi-01', 1672, 941),
    desktop: largeVariant('hero-large-warmtepomp-mitsubishi-01', 1672, 941),
    mobilePosition: '82% 50%',
    laptopPosition: '82% 50%',
    desktopPosition: '84% 48%',
    overlayStrength: 0.07,
  },
]

/** Legacy timing — keep unchanged for rollback fidelity. */
export const heroSlideshowTiming = {
  /** Time each slide stays fully visible before crossfade starts. */
  displayMs: 8000,
  /** Crossfade duration (matches CSS transition). */
  transitionMs: 1600,
} as const

/** Calm premium timing for the new large-screen set. */
export const largeScreenHeroTiming = {
  displayMs: 7000,
  transitionMs: 1200,
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

export function resolveHomepageHeroSlides(viewportWidth: number): {
  slides: HeroSlide[]
  mode: 'mobile' | 'legacy-desktop' | 'large-desktop'
  timing: typeof heroSlideshowTiming | typeof largeScreenHeroTiming
  pictureMinWidth: number | null
} {
  if (HOMEPAGE_HERO_VARIANT === 'legacy') {
    if (viewportWidth >= 768) {
      return {
        slides: desktopHeroSlides(),
        mode: 'legacy-desktop',
        timing: heroSlideshowTiming,
        pictureMinWidth: 768,
      }
    }
    return {
      slides: mobileHeroSlides(),
      mode: 'mobile',
      timing: heroSlideshowTiming,
      pictureMinWidth: null,
    }
  }

  // new-large-screen
  if (viewportWidth >= HOMEPAGE_HERO_LARGE_MIN_WIDTH) {
    return {
      slides: largeScreenHeroSlides,
      mode: 'large-desktop',
      timing: largeScreenHeroTiming,
      pictureMinWidth: HOMEPAGE_HERO_LARGE_MIN_WIDTH,
    }
  }
  if (viewportWidth >= 768) {
    return {
      slides: desktopHeroSlides(),
      mode: 'legacy-desktop',
      timing: heroSlideshowTiming,
      pictureMinWidth: 768,
    }
  }
  return {
    slides: mobileHeroSlides(),
    mode: 'mobile',
    timing: heroSlideshowTiming,
    pictureMinWidth: null,
  }
}
