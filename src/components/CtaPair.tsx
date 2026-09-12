import { site } from '../data/site'
import { cn } from '../lib/cn'
import type { ButtonSize } from '../types'
import { ButtonLink } from './ButtonLink'

type CtaPairProps = {
  quoteTo?: string
  appointmentTo?: string
  compact?: boolean
  size?: ButtonSize
  className?: string
  showCall?: boolean
  onDark?: boolean
}

export function CtaPair({
  quoteTo = '/offerte-aanvragen',
  appointmentTo = '/afspraak-maken',
  compact = false,
  size,
  className,
  showCall = false,
  onDark = false,
}: CtaPairProps) {
  const phoneHref = site.contact.phoneHref
  const resolvedSize = size ?? (compact ? 'sm' : 'md')

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <ButtonLink
        to={quoteTo}
        size={resolvedSize}
        className={onDark ? 'bg-white text-brand-deep hover:bg-brand-soft' : undefined}
      >
        {site.copy.ctaQuote}
      </ButtonLink>
      <ButtonLink
        to={appointmentTo}
        variant="secondary"
        size={resolvedSize}
        className={
          onDark
            ? 'border-white/50 bg-transparent text-white hover:bg-white/10'
            : undefined
        }
      >
        {site.copy.ctaAppointment}
      </ButtonLink>
      {showCall ? (
        <ButtonLink
          to={phoneHref ?? '/contact'}
          variant="ghost"
          size={resolvedSize}
          external={Boolean(phoneHref)}
          className={onDark ? 'text-white hover:bg-white/10' : undefined}
        >
          {site.copy.ctaCall}
        </ButtonLink>
      ) : null}
    </div>
  )
}
