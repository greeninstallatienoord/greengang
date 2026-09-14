import { useId, useState } from 'react'
import {
  ClipboardCheck,
  Headphones,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { site } from '../../data/site'
import { cn } from '../../lib/cn'
import { Container } from '../Container'
import { GreenFlowSection } from '../greenflow/TechnicalBackdrop'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
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
        'flex h-full flex-col border border-line bg-surface/90 p-5 transition-[border-color,transform,box-shadow] duration-[var(--duration-fast)]',
        'motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-ink/20 motion-safe:hover:shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <span className="icon-mark size-10 bg-paper">
        <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-[1.02rem] font-semibold tracking-[-0.015em] text-balance">
        {title}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">{text}</p>
    </article>
  )
}

function WhyBenefitAccordion() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <ul className="home-why-accordion lg:hidden" aria-label="Voordelen">
      {site.copy.trust.map((item, index) => {
        const Icon = icons[index] ?? Headphones
        const open = openIndex === index
        const panelId = `${baseId}-panel-${index}`
        const buttonId = `${baseId}-btn-${index}`

        return (
          <li key={item.title} className="home-why-accordion__item">
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                className="home-why-accordion__trigger"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                <span className="home-why-accordion__icon" aria-hidden="true">
                  <Icon size={17} strokeWidth={1.7} />
                </span>
                <span className="home-why-accordion__title">{item.title}</span>
                <span className="home-why-accordion__toggle" aria-hidden="true">
                  {open ? <Minus size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn('home-why-accordion__panel', open && 'is-open')}
              inert={!open ? true : undefined}
            >
              <p>{item.text}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function WhyHome() {
  return (
    <GreenFlowSection
      variant="airflow"
      ambient
      mask="left"
      intensity="strong"
      className="bg-paper"
    >
      <Section className="!bg-transparent">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
            <Reveal className="lg:col-span-5">
              <div className="max-w-xl">
                <p className="eyebrow">Waarom wij</p>
                <Heading
                  as="h2"
                  className="mt-2.5 text-balance text-[clamp(1.35rem,5.2vw,2.15rem)] sm:mt-3 sm:text-[clamp(1.4rem,2.8vw,2.15rem)]"
                >
                  Waarom Green Installatie Noord
                </Heading>
                <p className="lead mt-3 sm:mt-4">{site.copy.whyIntro}</p>
              </div>
            </Reveal>

            <div className="mt-6 min-[390px]:mt-7 lg:col-span-7 lg:mt-0">
              <WhyBenefitAccordion />
              <ul className="hidden gap-3.5 lg:grid lg:grid-cols-2">
                {site.copy.trust.map((item, index) => {
                  const Icon = icons[index] ?? Headphones
                  return (
                    <li key={item.title}>
                      <BenefitCard title={item.title} text={item.text} Icon={Icon} />
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </GreenFlowSection>
  )
}
