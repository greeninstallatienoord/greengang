import { Container } from '../Container'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'
import { CertificationMarks } from '../trust/CertificationMarks'

export function TrustMarks() {
  return (
    <Section className="bg-surface">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Kaders</p>
            <Heading as="h2" className="mt-3">
              Merken uit de installatiebranche
            </Heading>
            <p className="lead mx-auto mt-4">
              Deze logo’s horen bij herkenbare kaders in het vak. We tonen ze
              zonder erkenningsclaim. De actuele situatie voor uw opdracht
              bevestigen we op verzoek.
            </p>
          </div>
        </Reveal>
        <Reveal className="mx-auto mt-8 max-w-4xl sm:mt-10">
          <CertificationMarks labeled />
        </Reveal>
      </Container>
    </Section>
  )
}
