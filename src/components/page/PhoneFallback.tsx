import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Section } from '../Section'

type PhoneFallbackProps = {
  text?: string
}

export function PhoneFallback({
  text = 'Liever direct overleg? Bel ons of stuur een bericht via contact.',
}: PhoneFallbackProps) {
  return (
    <Section>
      <Container className="max-w-3xl">
        <p className="text-ink-muted">{text}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink to={site.contact.phoneHref} external>
            {site.copy.ctaCall}
          </ButtonLink>
          <ButtonLink to="/contact" variant="secondary">
            {site.copy.ctaContact}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
