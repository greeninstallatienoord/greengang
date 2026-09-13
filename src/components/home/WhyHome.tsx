import { Headphones, MapPin, ShieldCheck, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

const icons: LucideIcon[] = [Headphones, ShieldCheck, Wrench, MapPin]

export function WhyHome() {
  return (
    <Section className="bg-surface">
      <Container className="grid gap-5 sm:gap-6 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Waarom wij</p>
          <Heading as="h2" className="mt-2.5 sm:mt-3">
            Waarom Green Installatie Noord
          </Heading>
          <p className="lead mt-3 sm:mt-4">{site.copy.whyIntro}</p>
        </div>
        <ul className="grid gap-3.5 sm:gap-4 lg:col-span-7">
          {site.copy.trust.map((item, index) => {
            const Icon = icons[index] ?? Headphones
            return (
              <li
                key={item.title}
                className="grid grid-cols-[auto_1fr] gap-3.5 border-b border-line pb-3.5 last:border-b-0 last:pb-0 sm:gap-4 sm:pb-4"
              >
                <span className="icon-mark size-10 bg-paper">
                  <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-semibold tracking-[-0.015em]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {item.text}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
