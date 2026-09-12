import { CalendarDays, Phone } from 'lucide-react'
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
  equal?: boolean
}

export function CtaPair({
  quoteTo = '/offerte-aanvragen',
  appointmentTo = '/afspraak-maken',
  compact = false,
  size,
  className,
  showCall = false,
  onDark = false,
  equal = false,
}: CtaPairProps) {
  const phoneHref = site.contact.phoneHref
  const resolvedSize = size ?? (compact ? 'sm' : 'md')

  return (
    <div
      className={cn(
        equal
          ? 'grid grid-cols-2 gap-2'
          : 'flex flex-col items-stretch gap-2.5 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center',
        className,
      )}
    >
      <ButtonLink
        to={quoteTo}
        size={resolvedSize}
        className={equal ? 'w-full px-2 text-center text-[0.8125rem] leading-tight sm:text-[0.9rem]' : undefined}
      >
        {site.copy.ctaQuote}
      </ButtonLink>
      <ButtonLink
        to={appointmentTo}
        variant="secondary"
        size={resolvedSize}
        className={
          cn(
            equal && 'w-full px-2 text-center text-[0.8125rem] leading-tight sm:text-[0.9rem]',
            onDark
              ? 'border-white/80 bg-white/12 text-white hover:border-white hover:bg-white/22'
              : undefined,
          )
        }
      >
        {equal ? null : <CalendarDays size={16} strokeWidth={1.75} aria-hidden="true" />}
        {site.copy.ctaAppointment}
      </ButtonLink>
      {showCall ? (
        <ButtonLink
          to={phoneHref ?? '/contact'}
          variant="ghost"
          size={resolvedSize}
          external={Boolean(phoneHref)}
          className={onDark ? 'justify-center text-white hover:bg-white/10' : undefined}
        >
          <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
          {site.contact.phone}
        </ButtonLink>
      ) : null}
    </div>
  )
}
