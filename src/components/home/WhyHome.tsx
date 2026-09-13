import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import {
  ClipboardCheck,
  Headphones,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { site } from '../../data/site'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/cn'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

const icons: LucideIcon[] = [ClipboardCheck, ShieldCheck, Headphones, MapPin]

function BenefitCard({
  title,
  text,
  Icon,
  className,
}: {
  title: string
  text: string
  Icon: LucideIcon
  className?: string
}) {
  return (
    <article
      className={cn(
        'flex h-full min-h-[11.25rem] flex-col border border-line bg-paper p-4 transition-[border-color,transform,box-shadow] duration-[var(--duration-fast)] min-[390px]:min-h-[11.75rem] min-[390px]:px-[1.125rem] min-[390px]:py-4 sm:min-h-0 sm:p-5',
        'motion-safe:lg:hover:-translate-y-0.5 motion-safe:lg:hover:border-ink/20 motion-safe:lg:hover:shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <span className="icon-mark size-9 bg-surface sm:size-10">
        <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <h3 className="mt-3.5 text-[0.98rem] font-semibold tracking-[-0.015em] text-balance sm:mt-4 sm:text-[1.02rem]">
        {title}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">{text}</p>
    </article>
  )
}

function WhyBenefitCarousel() {
  const items = site.copy.trust
  const scrollerRef = useRef<HTMLUListElement>(null)
  const hinted = useRef(false)
  const hintTimers = useRef<number[]>([])
  const rafId = useRef(0)
  const [active, setActive] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const labelId = useId()

  const syncActive = useCallback(() => {
    const root = scrollerRef.current
    if (!root) return
    const children = Array.from(root.children) as HTMLElement[]
    if (children.length === 0) return

    const anchor = root.scrollLeft + root.clientWidth * 0.28
    let best = 0
    let bestDist = Number.POSITIVE_INFINITY
    children.forEach((child, index) => {
      const center = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(center - anchor)
      if (dist < bestDist) {
        bestDist = dist
        best = index
      }
    })
    setActive((current) => (current === best ? current : best))
  }, [])

  const onScroll = useCallback(() => {
    if (rafId.current) return
    rafId.current = window.requestAnimationFrame(() => {
      rafId.current = 0
      syncActive()
    })
  }, [syncActive])

  const cancelHint = useCallback(() => {
    hinted.current = true
    for (const id of hintTimers.current) window.clearTimeout(id)
    hintTimers.current = []
  }, [])

  useEffect(() => {
    const root = scrollerRef.current
    if (!root) return
    syncActive()
    root.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', syncActive)
    return () => {
      root.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', syncActive)
      if (rafId.current) window.cancelAnimationFrame(rafId.current)
    }
  }, [onScroll, syncActive])

  useEffect(() => {
    if (reducedMotion || hinted.current) return
    const root = scrollerRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hinted.current) return
        hinted.current = true
        observer.disconnect()
        const max = Math.min(36, root.scrollWidth - root.clientWidth)
        if (max <= 0) return
        root.scrollTo({ left: max, behavior: 'smooth' })
        const backId = window.setTimeout(() => {
          root.scrollTo({ left: 0, behavior: 'smooth' })
        }, 480)
        hintTimers.current.push(backId)
      },
      { threshold: 0.45 },
    )
    observer.observe(root)
    return () => {
      observer.disconnect()
      cancelHint()
    }
  }, [cancelHint, reducedMotion])

  const goTo = (index: number) => {
    cancelHint()
    const root = scrollerRef.current
    const child = root?.children[index] as HTMLElement | undefined
    if (!root || !child) return
    root.scrollTo({
      left: child.offsetLeft,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
    setActive(index)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(Math.min(items.length - 1, active + 1))
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(Math.max(0, active - 1))
    }
    if (event.key === 'Home') {
      event.preventDefault()
      goTo(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      goTo(items.length - 1)
    }
  }

  return (
    <div
      className="lg:hidden"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <p id={labelId} className="sr-only">
        Voordelen van Green Installatie Noord. Gebruik pijltjestoetsen of veeg
        horizontaal.
      </p>
      <ul
        ref={scrollerRef}
        className="-mx-3.5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-3.5 pb-1 min-[375px]:-mx-4 min-[375px]:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={cancelHint}
        onTouchStart={cancelHint}
      >
        {items.map((item, index) => {
          const Icon = icons[index] ?? Headphones
          return (
            <li
              key={item.title}
              className="w-[86%] shrink-0 snap-start min-[390px]:w-[85%] sm:w-[82%]"
            >
              <BenefitCard title={item.title} text={item.text} Icon={Icon} />
            </li>
          )
        })}
      </ul>
      <div className="mt-3 flex items-center justify-center gap-0.5">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className="inline-flex size-11 items-center justify-center touch-manipulation"
            aria-label={`Ga naar ${item.title}`}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => goTo(index)}
          >
            <span
              className={cn(
                'size-2 rounded-full transition-[background-color,transform] duration-[var(--duration-fast)]',
                index === active ? 'scale-110 bg-brand-dark' : 'bg-line',
              )}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Kaart {active + 1} van {items.length}: {items[active]?.title}
      </p>
    </div>
  )
}

export function WhyHome() {
  return (
    <Section className="bg-paper">
      <Container className="grid gap-5 sm:gap-6 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
        <div className="lg:col-span-5">
          <div className="max-w-xl">
            <p className="eyebrow">Waarom wij</p>
            <Heading as="h2" className="mt-2.5 text-balance sm:mt-3">
              Waarom Green Installatie Noord
            </Heading>
            <p className="lead mt-3 sm:mt-4">{site.copy.whyIntro}</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <WhyBenefitCarousel />
          <ul className="hidden gap-3 lg:grid lg:grid-cols-2 lg:gap-3.5">
            {site.copy.trust.map((item, index) => {
              const Icon = icons[index] ?? Headphones
              return (
                <li key={item.title} className="min-h-0">
                  <BenefitCard
                    title={item.title}
                    text={item.text}
                    Icon={Icon}
                    className="bg-surface"
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
