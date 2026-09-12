import { site } from '../../data/site'
import { Container } from '../Container'
import { CtaPair } from '../CtaPair'
import { Heading } from '../Heading'
import { Section } from '../Section'

export function ProcessSteps() {
  return (
    <Section>
      <Container>
        <Heading as="h2">Zo werkt het</Heading>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Een voorspelbaar traject: van vraag tot installatie en nazorg. Geen
          beloftes over reactietijden totdat die vastliggen.
        </p>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {site.copy.process.map((item) => (
            <li
              key={item.step}
              className="rounded-lg border border-line bg-paper p-4 shadow-card"
            >
              <p className="text-sm font-semibold text-brand">{item.step}</p>
              <h3 className="mt-2 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{item.text}</p>
            </li>
          ))}
        </ol>
        <CtaPair className="mt-8" />
      </Container>
    </Section>
  )
}
