import { useEffect, useId, useRef } from 'react'
import { ClipboardCheck, Headphones, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'
import { GreenFlowSection } from '../greenflow/TechnicalBackdrop'

const icons: LucideIcon[] = [ClipboardCheck, Wrench, Headphones]

type ProcessStepsProps = {
  /** Kept for callers; step numbers are always shown. */
  numbered?: boolean
  className?: string
}

function ProcessStepBody({
  step,
  title,
  text,
  Icon,
}: {
  step: string
  title: string
  text: string
  Icon: LucideIcon
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
        <span className="icon-mark size-9 bg-white sm:size-10">
          <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
        </span>
      </div>
      <h3 className="mt-3.5 text-[1.05rem] font-semibold tracking-[-0.015em] sm:mt-4 sm:text-[1.1rem]">
        {title}
      </h3>
      <p className="mt-1.5 max-w-[22rem] text-sm leading-relaxed text-ink-muted sm:mt-2 sm:text-[0.9375rem]">
        {text}
      </p>
    </>
  )
}

function MobileProcessSteps() {
  const steps = site.copy.process

  return (
    <ol className="process-rail process-rail--vertical mt-6 lg:hidden">
      {steps.map((item, index) => {
        const Icon = icons[index] ?? ClipboardCheck
        return (
          <li key={item.title} className="process-rail__item">
            <div className="process-rail__marker" aria-hidden="true">
              <span className="process-rail__dot" />
            </div>
            <Reveal delay={index * 80} className="min-w-0 pt-0.5 pb-7">
              <ProcessStepBody
                step={item.step}
                title={item.title}
                text={item.text}
                Icon={Icon}
              />
            </Reveal>
          </li>
        )
      })}
    </ol>
  )
}

function DesktopProcessSteps() {
  const steps = site.copy.process
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = railRef.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-visible')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="mt-8 hidden lg:block">
      <div
        ref={railRef}
        className="process-rail process-rail--horizontal"
        aria-hidden="true"
      >
        <div className="process-rail__track">
          <div className="process-rail__progress" />
        </div>
        <div className="process-rail__nodes">
          {steps.map((item) => (
            <span key={item.step} className="process-rail__node">
              {item.step}
            </span>
          ))}
        </div>
      </div>

      <ol className="mt-5 grid grid-cols-3 gap-x-6 xl:gap-x-8">
        {steps.map((item, index) => {
          const Icon = icons[index] ?? ClipboardCheck
          return (
            <li key={item.title} className="min-w-0">
              <Reveal delay={120 + index * 90}>
                <ProcessStepBody
                  step={item.step}
                  title={item.title}
                  text={item.text}
                  Icon={Icon}
                />
              </Reveal>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function ProcessSteps({ className }: ProcessStepsProps) {
  const headingId = useId()

  return (
    <GreenFlowSection variant="service" mask="right" className={className}>
      <Section className="!bg-transparent" aria-labelledby={headingId}>
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">Werkwijze</p>
              <Heading as="h2" id={headingId} className="mt-2.5 sm:mt-3">
                Zo werkt het
              </Heading>
              <p className="lead mt-3 sm:mt-4">{site.copy.processIntro}</p>
            </div>
          </Reveal>

          <MobileProcessSteps />
          <DesktopProcessSteps />
        </Container>
      </Section>
    </GreenFlowSection>
  )
}
