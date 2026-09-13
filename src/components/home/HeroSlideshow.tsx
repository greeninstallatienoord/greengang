import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  heroSlides,
  heroSlideshowTiming,
  type HeroSlide,
  type HeroSlideVariant,
} from '../../data/heroSlideshow'
import { cn } from '../../lib/cn'

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}

function sourcesFor(slide: HeroSlide, desktop: boolean): HeroSlideVariant {
  if (desktop && slide.desktop) return slide.desktop
  return slide.mobile
}

function preloadImage(href: string) {
  if (typeof window === 'undefined') return
  const img = new Image()
  img.decoding = 'async'
  img.src = href
}

type LayerProps = {
  slide: HeroSlide
  desktop: boolean
  active: boolean
  eager: boolean
}

function SlidePicture({ slide, desktop, active, eager }: LayerProps) {
  const sources = sourcesFor(slide, desktop)
  const position = desktop ? slide.desktopPosition : slide.mobilePosition

  return (
    <div
      className={cn('hero-slide absolute inset-0', active && 'is-active')}
      aria-hidden="true"
    >
      <picture className="absolute inset-0">
        {desktop && slide.desktop ? (
          <>
            <source
              media="(min-width: 768px)"
              type="image/avif"
              srcSet={slide.desktop.avif}
            />
            <source
              media="(min-width: 768px)"
              type="image/webp"
              srcSet={slide.desktop.webp}
            />
          </>
        ) : null}
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
          className="absolute inset-0 size-full max-w-none object-cover"
          style={{ objectPosition: position } as CSSProperties}
        />
      </picture>
      <div
        className="absolute inset-0 bg-brand-deep"
        style={{ opacity: slide.overlayStrength }}
      />
    </div>
  )
}

type RotatorProps = {
  slides: HeroSlide[]
  desktop: boolean
  reducedMotion: boolean
  lockedIndex: number | null
}

function HeroRotator({ slides, desktop, reducedMotion, lockedIndex }: RotatorProps) {
  const [active, setActive] = useState(0)
  const [outgoing, setOutgoing] = useState<number | null>(null)
  const activeRef = useRef(0)
  const preloaded = useRef(new Set<string>())

  const shownActive = lockedIndex ?? active

  useEffect(() => {
    const first = slides[0]
    if (!first) return
    const sources = sourcesFor(first, desktop)
    for (const href of [sources.jpg, sources.webp, sources.avif]) {
      if (preloaded.current.has(href)) continue
      preloaded.current.add(href)
      preloadImage(href)
    }
  }, [slides, desktop])

  useEffect(() => {
    if (reducedMotion || lockedIndex != null || slides.length < 2) return

    let cancelled = false
    let timeoutId = 0
    let pruneId = 0
    let resumeAt = 0
    let remaining: number = heroSlideshowTiming.displayMs

    const warm = (index: number) => {
      const slide = slides[index % slides.length]
      if (!slide) return
      const sources = sourcesFor(slide, desktop)
      for (const href of [sources.jpg, sources.webp, sources.avif]) {
        if (preloaded.current.has(href)) continue
        preloaded.current.add(href)
        preloadImage(href)
      }
    }

    const schedule = (delay: number) => {
      window.clearTimeout(timeoutId)
      resumeAt = Date.now() + delay
      timeoutId = window.setTimeout(() => {
        if (cancelled || document.hidden) return
        const next = (activeRef.current + 1) % slides.length
        setOutgoing(activeRef.current)
        activeRef.current = next
        setActive(next)
        warm(next + 1)
        window.clearTimeout(pruneId)
        pruneId = window.setTimeout(() => {
          if (!cancelled) setOutgoing(null)
        }, heroSlideshowTiming.transitionMs + 80)
        remaining = heroSlideshowTiming.displayMs
        schedule(heroSlideshowTiming.displayMs)
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
      warm(1)
      schedule(heroSlideshowTiming.displayMs)
    }, 900)

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
      window.clearTimeout(pruneId)
      window.clearTimeout(startId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reducedMotion, lockedIndex, slides, desktop])

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
            desktop={desktop}
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
 */
export function HeroSlideshow() {
  const reducedMotion = usePrefersReducedMotion()
  const [desktop, setDesktop] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(min-width: 768px)').matches
  })
  const [params] = useSearchParams()

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const onChange = () => setDesktop(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const slides = useMemo(() => {
    return desktop
      ? heroSlides.filter((slide) => slide.desktop != null)
      : heroSlides
  }, [desktop])

  const lockedIndex = useMemo(() => {
    const raw = params.get('hero')
    if (raw == null || raw === '') return null
    const asNumber = Number(raw)
    if (Number.isInteger(asNumber) && asNumber >= 0 && asNumber < slides.length) {
      return asNumber
    }
    const byId = slides.findIndex(
      (slide) => slide.id === raw || slide.id.includes(raw),
    )
    return byId >= 0 ? byId : null
  }, [params, slides])

  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-deep" aria-hidden="true">
      <HeroRotator
        key={desktop ? 'desktop' : 'mobile'}
        slides={slides}
        desktop={desktop}
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
          background: `linear-gradient(90deg,
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
            'linear-gradient(180deg, rgba(16,36,24,0.2) 0%, transparent 42%, rgba(16,36,24,0.4) 100%)',
        }}
      />
    </div>
  )
}
