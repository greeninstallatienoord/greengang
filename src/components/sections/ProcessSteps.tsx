import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

export function ProcessSteps() {
  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">Proces</p>
          <Heading as="h2" className="mt-3">
            Zo werkt het
          </Heading>
          <p className="lead mt-4">
            Van eerste vraag tot installatie en service. Geen beloftes over
            reactietijden of prijzen die hier niet vastliggen.
          </p>
        </div>
        <ol className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-5 lg:gap-6">
          {site.copy.process.map((item) => (
            <li key={item.step}>
              <p className="font-display text-2xl text-brand-dark">{item.step}</p>
              <h3 className="mt-3 font-semibold tracking-[-0.015em]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
