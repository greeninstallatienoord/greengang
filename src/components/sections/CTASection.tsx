import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

type CTASectionProps = {
  title?: string
  text?: string
  quoteTo?: string
  appointmentTo?: string
}

export function CTASection({
  title = 'Klaar voor de volgende stap?',
  text = 'Vraag een offerte aan of plan een afspraak. We denken mee over cv-ketel, airco, warmtepomp of onderhoud.',
  quoteTo = '/offerte-aanvragen',
  appointmentTo = '/afspraak-maken',
}: CTASectionProps) {
  const phoneHref = site.contact.phoneHref

  return (
    <Section className="bg-brand-deep text-white">
      <Container className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <Heading as="h2" className="text-white">
            {title}
          </Heading>
          <p className="mt-3 text-white/80">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink
            to={quoteTo}
            className="bg-white text-brand-deep hover:bg-brand-soft"
          >
            {site.copy.ctaQuote}
          </ButtonLink>
          <ButtonLink
            to={appointmentTo}
            variant="secondary"
            className="border-white/50 bg-transparent text-white hover:bg-white/10"
          >
            {site.copy.ctaAppointment}
          </ButtonLink>
          <ButtonLink
            to={phoneHref ?? '/contact'}
            variant="ghost"
            className="text-white hover:bg-white/10"
            external={Boolean(phoneHref)}
          >
            {site.copy.ctaCall}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
