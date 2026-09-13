import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from 'react'
import { ArrowRight, ClipboardCheck, Headphones, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { site } from '../../data/site'
import { cn } from '../../lib/cn'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

const icons: LucideIcon[] = [ClipboardCheck, Wrench, Headphones]

type ProcessStepsProps = {
  /** Kept for callers; step numbers are always shown in the refined layout. */
  numbered?: boolean
  className?: string
}

function ProcessStepBody({
  step,
  title,
  text,
  Icon,
  compact = false,
}: {
  step: string
  title: string
  text: string
  Icon: LucideIcon
  compact?: boolean
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <p
          className="font-display text-[1.35rem] leading-none tracking-[-0.02em] text-brand-dark/75"
          aria-hidden="true"
        >
          {step}
        </p>
        <span className="icon-mark size-9 bg-surface sm:size-10">
          <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
        </span>
      </div>
      <h3
        className={cn(
          'font-semibold tracking-[-0.015em]',
          compact ? 'mt-3 text-[1.02rem]' : 'mt-4 text-[1.05rem] sm:text-[1.1rem]',
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          'leading-relaxed text-ink-muted',
          compact ? 'mt-1.5 text-sm' : 'mt-2 max-w-[22rem] text-sm sm:text-[0.9375rem]',
        )}
      >
        {text}
      </p>
    </>
  )
}

function MobileProcessSteps() {
  const steps = site.copy.process
  const [active, setActive] = useState(0)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const reactId = useId()
  const panelId = `${reactId}-panel`
  const tablistId = `${reactId}-tabs`
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const select = (index: number, focusTab = false) => {
    const next = Math.max(0, Math.min(steps.length - 1, index))
    setActive(next)
    if (focusTab) tabRefs.current[next]?.focus()
  }

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, steps.length)
  }, [steps.length])

  const onTabListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      select(active + 1, true)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      select(active - 1, true)
    }
    if (event.key === 'Home') {
      event.preventDefault()
      select(0, true)
    }
    if (event.key === 'End') {
      event.preventDefault()
      select(steps.length - 1, true)
    }
  }

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0]
    if (!touch) return
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current
    const touch = event.changedTouches[0]
    touchStart.current = null
    if (!start || !touch) return
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    // Prefer vertical page scroll when the gesture is mostly vertical.
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.25) return
    if (dx < 0) select(active + 1)
    else select(active - 1)
  }

  const current = steps[active]
  const Icon = icons[active] ?? ClipboardCheck

  return (
    <div className="mt-5 lg:hidden">
      <div
        id={tablistId}
        role="tablist"
        aria-label="Stappen in het proces"
        className="grid grid-cols-3 gap-1 border border-line bg-paper p-1"
        onKeyDown={onTabListKeyDown}
      >
        {steps.map((item, index) => {
          const selected = index === active
          return (
            <button
              key={item.title}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`${tablistId}-${index}`}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={cn(
                'min-h-12 touch-manipulation rounded-sm px-1 py-1.5 text-center transition-[background-color,color] duration-[var(--duration-fast)] min-[390px]:min-h-14 min-[390px]:px-1.5 min-[390px]:py-2',
                selected
                  ? 'bg-brand-deep text-white'
                  : 'bg-transparent text-ink-muted hover:bg-stone/70 hover:text-ink',
              )}
              onClick={() => select(index)}
            >
              <span
                className={cn(
                  'block text-[0.62rem] font-semibold tracking-[0.12em] min-[390px]:text-[0.65rem]',
                  selected ? 'text-white/70' : 'text-ink-muted',
                )}
              >
                {item.step}
              </span>
              <span className="mt-0.5 block text-[0.78rem] font-semibold tracking-[-0.01em] min-[390px]:text-[0.85rem]">
                {item.title}
              </span>
            </button>
          )
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${tablistId}-${active}`}
        className="mt-3 min-h-[9.5rem] border border-line bg-paper p-4 min-[390px]:min-h-[10rem] min-[390px]:px-[1.125rem] min-[390px]:py-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {current ? (
          <ProcessStepBody
            step={current.step}
            title={current.title}
            text={current.text}
            Icon={Icon}
            compact
          />
        ) : null}
      </div>
    </div>
  )
}

function DesktopProcessSteps() {
  const steps = site.copy.process

  return (
    <ol className="mt-7 hidden items-start gap-x-3 lg:flex xl:gap-x-5">
      {steps.map((item, index) => {
        const Icon = icons[index] ?? ClipboardCheck
        const isLast = index === steps.length - 1
        return (
          <li key={item.title} className="flex min-w-0 flex-1 items-start gap-x-3 xl:gap-x-5">
            <div className="min-w-0 flex-1 border-t border-line pt-5">
              <ProcessStepBody
                step={item.step}
                title={item.title}
                text={item.text}
                Icon={Icon}
              />
            </div>
            {!isLast ? (
              <div
                className="mt-8 shrink-0 text-brand-dark/45"
                aria-hidden="true"
              >
                <ArrowRight size={18} strokeWidth={1.6} />
              </div>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

export function ProcessSteps({ className }: ProcessStepsProps) {
  const headingId = useId()

  return (
    <Section className={className} aria-labelledby={headingId}>
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">Werkwijze</p>
          <Heading as="h2" id={headingId} className="mt-2.5 sm:mt-3">
            Zo werkt het
          </Heading>
          <p className="lead mt-3 sm:mt-4">{site.copy.processIntro}</p>
        </div>

        <MobileProcessSteps />
        <DesktopProcessSteps />
      </Container>
    </Section>
  )
}
