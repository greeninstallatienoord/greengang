import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  HOMEPAGE_HERO_LARGE_MIN_WIDTH,
  HOMEPAGE_HERO_VARIANT,
  resolveHomepageHeroSlides,
  type HeroSlide,
  type HeroSlideVariant,
} from '../../data/heroSlideshow'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/cn'

function sourcesFor(
  slide: HeroSlide,
  mode: 'mobile' | 'legacy-desktop' | 'large-desktop',
): HeroSlideVariant {
  if (mode !== 'mobile' && slide.desktop) return slide.desktop
  return slide.mobile
}

function preloadImage(href: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    const done = () => resolve()
    img.onload = done
    img.onerror = done
    img.src = href
    if (img.complete) done()
  })
}

async function warmSlide(
  slide: HeroSlide | undefined,
  mode: 'mobile' | 'legacy-desktop' | 'large-desktop',
  cache: Set<string>,
) {
  if (!slide) return
  const sources = sourcesFor(slide, mode)
  const hrefs = [sources.jpg, sources.webp, sources.avif]
  await Promise.all(
    hrefs.map(async (href) => {
      if (cache.has(href)) return
      cache.add(href)
      await preloadImage(href)
    }),
  )
}

type LayerProps = {
  slide: HeroSlide
  mode: 'mobile' | 'legacy-desktop' | 'large-desktop'
  pictureMinWidth: number | null
  active: boolean
  eager: boolean
}

function SlidePicture({
  slide,
  mode,
  pictureMinWidth,
  active,
  eager,
}: LayerProps) {
  const sources = sourcesFor(slide, mode)
  const positionStyle = {
    '--hero-pos-mobile': slide.mobilePosition,
    '--hero-pos-laptop': slide.laptopPosition,
    '--hero-pos-desktop': slide.desktopPosition,
  } as CSSProperties

  const desktopSources =
    mode !== 'mobile' && slide.desktop ? slide.desktop : null

  return (
    <div
      className={cn('hero-slide absolute inset-0', active && 'is-active')}
      aria-hidden="true"
    >
      <picture className="absolute inset-0">
        {desktopSources && pictureMinWidth != null ? (
          <>
            <source
              media={`(min-width: ${pictureMinWidth}px)`}
              type="image/avif"
              srcSet={desktopSources.avif}
            />
            <source
              media={`(min-width: ${pictureMinWidth}px)`}
              type="image/webp"
              srcSet={desktopSources.webp}
            />
          </>
        ) : null}
        {mode === 'mobile' || mode === 'legacy-desktop' ? (
          <>
            <source
              media="(max-width: 767px)"
              type="image/avif"
              srcSet={slide.mobile.avif}
            />
            <source
              media="(max-width: 767px)"
              type="image/webp"
              srcSet={slide.mobile.webp}
            />
          </>
        ) : null}
        <source type="image/avif" srcSet={sources.avif} />
        <source type="image/webp" srcSet={sources.webp} />
        <img
          src={sources.jpg}
          alt=""
          width={sources.width}
          height={sources.height}
          decoding={eager ? 'sync' : 'async'}
          fetchPriority={eager ? 'high' : 'low'}
          loading={eager ? 'eager' : 'lazy'}
          draggable={false}
          className="hero-slide-photo absolute inset-0 size-full max-w-none object-cover"
          style={positionStyle}
        />
      </picture>
      <div
        className="absolute inset-0 bg-brand-deep"
        style={{ opacity: slide.overlayStrength }}
      />
    </div>
  )
}

type Timing = { displayMs: number; transitionMs: number }

type RotatorProps = {
  slides: HeroSlide[]
  mode: 'mobile' | 'legacy-desktop' | 'large-desktop'
  pictureMinWidth: number | null
  timing: Timing
  reducedMotion: boolean
  lockedIndex: number | null
}

function HeroRotator({
  slides,
  mode,
  pictureMinWidth,
  timing,
  reducedMotion,
  lockedIndex,
}: RotatorProps) {
  const [active, setActive] = useState(0)
  const [outgoing, setOutgoing] = useState<number | null>(null)
  const activeRef = useRef(0)
  const preloaded = useRef(new Set<string>())

  const shownActive = lockedIndex ?? active

  useEffect(() => {
    void warmSlide(slides[0], mode, preloaded.current)
  }, [slides, mode])

  useEffect(() => {
    if (reducedMotion || lockedIndex != null || slides.length < 2) return

    let cancelled = false
    let timeoutId = 0
    let pruneId = 0
    let resumeAt = 0
    let remaining: number = timing.displayMs

    const schedule = (delay: number) => {
      window.clearTimeout(timeoutId)
      resumeAt = Date.now() + delay
      timeoutId = window.setTimeout(() => {
        void (async () => {
          if (cancelled || document.hidden) return
          const next = (activeRef.current + 1) % slides.length
          await warmSlide(slides[next], mode, preloaded.current)
          if (cancelled || document.hidden) return
          setOutgoing(activeRef.current)
          activeRef.current = next
          setActive(next)
          void warmSlide(slides[(next + 1) % slides.length], mode, preloaded.current)
          window.clearTimeout(pruneId)
          pruneId = window.setTimeout(() => {
            if (!cancelled) setOutgoing(null)
          }, timing.transitionMs + 80)
          remaining = timing.displayMs
          schedule(timing.displayMs)
        })()
      }, delay)
    }

    const onVisibility = () => {
      if (document.hidden) {
        remaining = Math.max(800, resumeAt - Date.now())
        window.clearTimeout(timeoutId)
        return
      }
      schedule(remaining)
    }

    const startId = window.setTimeout(() => {
      if (cancelled) return
      void warmSlide(slides[1], mode, preloaded.current)
      schedule(timing.displayMs)
    }, 900)

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
      window.clearTimeout(pruneId)
      window.clearTimeout(startId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reducedMotion, lockedIndex, slides, mode, timing])

  if (!slides[0]) return null

  const mountedIndexes = reducedMotion
    ? [0]
    : Array.from(
        new Set(
          [0, shownActive, outgoing].filter(
            (value): value is number => value != null,
          ),
        ),
      )

  return (
    <>
      {mountedIndexes.map((index) => {
        const slide = slides[index]
        if (!slide) return null
        return (
          <SlidePicture
            key={slide.id}
            slide={slide}
            mode={mode}
            pictureMinWidth={pictureMinWidth}
            active={index === shownActive}
            eager={index === 0}
          />
        )
      })}
    </>
  )
}

/**
 * Calm photographic crossfade for the homepage hero.
 * Slideshow state stays local so unrelated homepage updates do not reset it.
 *
 * Variant switch: see HOMEPAGE_HERO_VARIANT in src/data/heroSlideshow.ts
 */
export function HeroSlideshow() {
  const reducedMotion = usePrefersReducedMotion()
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === 'undefined') return 390
    return window.innerWidth
  })
  const [params] = useSearchParams()

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    // Also track the large-screen media query for cleaner flips near 1024.
    const media = window.matchMedia(
      `(min-width: ${HOMEPAGE_HERO_LARGE_MIN_WIDTH}px)`,
    )
    const onMedia = () => setViewportWidth(window.innerWidth)
    media.addEventListener('change', onMedia)
    const legacy = window.matchMedia('(min-width: 768px)')
    legacy.addEventListener('change', onMedia)
    return () => {
      window.removeEventListener('resize', onResize)
      media.removeEventListener('change', onMedia)
      legacy.removeEventListener('change', onMedia)
    }
  }, [])

  const resolved = useMemo(
    () => resolveHomepageHeroSlides(viewportWidth),
    [viewportWidth],
  )

  const lockedIndex = useMemo(() => {
    const raw = params.get('hero')
    if (raw == null || raw === '') return null
    const asNumber = Number(raw)
    if (
      Number.isInteger(asNumber) &&
      asNumber >= 0 &&
      asNumber < resolved.slides.length
    ) {
      return asNumber
    }
    const byId = resolved.slides.findIndex(
      (slide) => slide.id === raw || slide.id.includes(raw),
    )
    return byId >= 0 ? byId : null
  }, [params, resolved.slides])

  const fadeSeconds = `${resolved.timing.transitionMs / 1000}s`

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-brand-deep"
      aria-hidden="true"
      style={{ ['--hero-fade-ms' as string]: fadeSeconds }}
      data-hero-variant={HOMEPAGE_HERO_VARIANT}
      data-hero-mode={resolved.mode}
    >
      <HeroRotator
        key={resolved.mode}
        slides={resolved.slides}
        mode={resolved.mode}
        pictureMinWidth={resolved.pictureMinWidth}
        timing={resolved.timing}
        reducedMotion={reducedMotion}
        lockedIndex={lockedIndex}
      />

      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background: `linear-gradient(180deg,
            rgba(16,36,24,0.52) 0%,
            rgba(16,36,24,0.3) 34%,
            rgba(16,36,24,0.58) 70%,
            rgba(16,36,24,0.86) 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            resolved.mode === 'large-desktop'
              ? `linear-gradient(90deg,
            rgba(16,36,24,0.9) 0%,
            rgba(16,36,24,0.72) 34%,
            rgba(16,36,24,0.34) 68%,
            rgba(16,36,24,0.16) 100%)`
              : `linear-gradient(90deg,
            rgba(16,36,24,0.92) 0%,
            rgba(16,36,24,0.76) 36%,
            rgba(16,36,24,0.4) 70%,
            rgba(16,36,24,0.24) 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            'linear-gradient(180deg, rgba(16,36,24,0.18) 0%, transparent 42%, rgba(16,36,24,0.36) 100%)',
        }}
      />
    </div>
  )
}
