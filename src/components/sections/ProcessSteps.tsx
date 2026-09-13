import { ClipboardCheck, Headphones, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

const icons: LucideIcon[] = [ClipboardCheck, Wrench, Headphones]

export function ProcessSteps() {
  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">Werkwijze</p>
          <Heading as="h2" className="mt-2.5 sm:mt-3">
            Zo werkt het
          </Heading>
          <p className="lead mt-3 sm:mt-4">{site.copy.processIntro}</p>
        </div>

        <ul className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {site.copy.process.map((item, index) => {
            const Icon = icons[index] ?? ClipboardCheck
            return (
              <li key={item.title} className="min-w-0 border-t border-line pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0 first:lg:border-l-0 first:lg:pl-0">
                <span className="icon-mark size-10 bg-paper">
                  <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-semibold tracking-[-0.015em]">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {item.text}
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
