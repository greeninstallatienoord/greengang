import { Phone } from 'lucide-react'
import { business } from '../../data/business'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

type EmergencyServiceBannerProps = {
  className?: string
  compact?: boolean
}

export function EmergencyServiceBanner({
  compact = false,
}: EmergencyServiceBannerProps) {
  const emergency = business.emergencyService
  if (!emergency.available) return null

  if (compact) {
    return (
      <a
        href={emergency.phoneHref}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-dark"
        aria-label={`${emergency.label}: bel ${emergency.phone}`}
      >
        <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
        {emergency.label}: {emergency.phone}
      </a>
    )
  }

  return (
    <Section className="bg-brand-deep text-white">
      <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-white/70 uppercase">
            Storing melden
          </p>
          <Heading as="h2" className="mt-2 text-white">
            {emergency.label}
          </Heading>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-white/82">
            {emergency.detail}
          </p>
          <p className="mt-2 text-sm text-white/60">{emergency.hoursDistinction}</p>
        </div>
        <ButtonLink
          to={emergency.phoneHref}
          external
          className="min-h-12 shrink-0 self-start sm:self-center"
          aria-label={`${emergency.label}: bel ${emergency.phone}`}
        >
          Bel {emergency.phone}
        </ButtonLink>
      </Container>
    </Section>
  )
}
