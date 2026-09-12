import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

export function WhyHome() {
  return (
    <Section className="bg-surface">
      <Container className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">Werkwijze</p>
          <Heading as="h2" className="mt-3">
            Waarom Green Installatie Noord
          </Heading>
          <p className="lead mt-4">
            Korte lijnen, een duidelijk adres, en geen scores of merkenlijst
            die we hier niet kunnen onderbouwen. Eerst de vraag, dan een
            voorstel.
          </p>
        </div>
        <ol className="grid gap-6 lg:col-span-7 lg:gap-8">
          {site.copy.trust.map((item, index) => (
            <li key={item.title} className="grid grid-cols-[auto_1fr] gap-5">
              <span className="font-display text-2xl text-brand-dark">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-semibold tracking-[-0.015em]">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
