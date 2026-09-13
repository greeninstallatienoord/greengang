import { approvedCertifications } from '../../data/trust'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'
import { CertificationMarks } from '../trust/CertificationMarks'

/**
 * Only renders when certifications are approved in trust data.
 * Unverified scheme logos must not appear on the public website.
 */
export function TrustMarks() {
  if (approvedCertifications().length === 0) return null

  return (
    <Section className="bg-surface">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Certificering</p>
            <Heading as="h2" className="mt-3">
              Certificering en vakbekwaamheid
            </Heading>
            <p className="lead mx-auto mt-4">
              Aantoonbare kaders voor veilig en vakkundig installatiewerk.
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
