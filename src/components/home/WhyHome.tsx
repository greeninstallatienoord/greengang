import {
  ClipboardCheck,
  Headphones,
  MapPin,
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

function WhyBenefitList() {
  return (
    <ul className="home-usp-list lg:hidden" aria-label="Voordelen">
      {site.copy.trust.map((item, index) => {
        const Icon = icons[index] ?? Headphones
        return (
          <li key={item.title}>
            <Reveal delay={index * 70}>
              <div className="home-usp-list__row">
                <span className="home-usp-list__icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.65} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[0.98rem] font-semibold tracking-[-0.015em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                </div>
              </div>
            </Reveal>
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

            <div className="mt-7 min-[390px]:mt-8 lg:col-span-7 lg:mt-0">
              <WhyBenefitList />
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
