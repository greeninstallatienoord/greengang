import { schemeMarks } from '../../data/media'
import { Container } from '../Container'
import { Section } from '../Section'
import { CertificationMarks } from '../trust/CertificationMarks'

/**
 * Compact certification strip — logos are the trust evidence.
 * No extra marketing claims beyond the eyebrow.
 */
export function TrustMarks() {
  if (schemeMarks.length === 0) return null

  return (
    <Section
      className="!py-5 border-b border-line bg-paper sm:!py-6 lg:!py-7"
      aria-labelledby="home-certifications-heading"
    >
      <Container>
        <div className="mx-auto max-w-5xl">
          <h2
            id="home-certifications-heading"
            className="text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-dark min-[390px]:text-[0.7rem]"
          >
            Erkend & gecertificeerd
          </h2>
          <CertificationMarks framed className="mt-4 sm:mt-5" />
        </div>
      </Container>
    </Section>
  )
}
