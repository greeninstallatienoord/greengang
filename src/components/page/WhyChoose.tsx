import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

export function WhyChoose() {
  return (
    <Section className="bg-paper">
      <Container>
        <Heading as="h2">Waarom {site.name}</Heading>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {site.copy.trust.map((item) => (
            <li key={item.title} className="rounded-lg border border-line bg-paper p-4 shadow-card">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
