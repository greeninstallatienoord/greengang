import { Headphones, MapPin, ShieldCheck, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

const icons: LucideIcon[] = [Headphones, ShieldCheck, Wrench, MapPin]

export function WhyChoose() {
  return (
    <Section className="bg-paper">
      <Container>
        <Heading as="h2">Waarom {site.name}</Heading>
        <p className="lead mt-3">{site.copy.whyIntro}</p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {site.copy.trust.map((item, index) => {
            const Icon = icons[index] ?? Headphones
            return (
              <li key={item.title} className="grid grid-cols-[auto_1fr] gap-3.5 border-t border-line pt-4">
                <span className="icon-mark size-10 bg-surface">
                  <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
