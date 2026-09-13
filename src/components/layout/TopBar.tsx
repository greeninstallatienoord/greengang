import { Headphones, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { business } from '../../data/business'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { Container } from '../Container'

export function TopBar() {
  const { phone, phoneHref, openingHours } = site.contact
  const emergency = business.emergencyService

  return (
    <>
      {/* Mobile: phone + 24/7 storing only — hours live in the menu */}
      <div className="flex h-10 items-center justify-between gap-2 bg-brand-deep px-3.5 text-[0.72rem] text-white min-[375px]:px-4 sm:px-5 lg:hidden">
        <a
          href={phoneHref}
          className="inline-flex min-h-10 items-center gap-1.5 font-semibold tracking-[-0.01em]"
          aria-label={`Bel ${phone}`}
        >
          <Phone size={13} strokeWidth={1.9} aria-hidden="true" />
          {phone}
        </a>
        {emergency.available ? (
          <a
            href={emergency.phoneHref}
            className="inline-flex min-h-10 max-w-[48%] items-center gap-1.5 truncate font-semibold text-white/90 underline-offset-2 hover:text-white hover:underline"
            aria-label={`${emergency.label}: bel ${emergency.phone}`}
          >
            <Headphones size={13} strokeWidth={1.9} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{emergency.shortLabel}</span>
          </a>
        ) : (
          <Link
            to="/werkgebied"
            className="inline-flex min-h-10 max-w-[45%] items-center truncate text-white/78 hover:text-white"
          >
            <span className="truncate">{serviceArea.headerLabel}</span>
          </Link>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden border-b border-white/10 bg-brand-deep text-[0.78rem] text-white lg:block">
        <Container className="flex min-h-10 items-center justify-between gap-6">
          <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href={phoneHref}
              className="inline-flex min-h-10 items-center gap-2 font-semibold hover:text-white/85"
              aria-label={`Bel ${phone}`}
            >
              <Phone size={13} strokeWidth={1.75} aria-hidden="true" />
              {phone}
            </a>
            <span className="inline-flex min-h-10 items-center text-white/70">
              <span className="sr-only">Reguliere openingstijden: </span>
              {openingHours.replace(/-/g, '–')}
            </span>
            {emergency.available ? (
              <a
                href={emergency.phoneHref}
                className="inline-flex min-h-10 items-center gap-2 font-semibold text-white/92 underline-offset-2 hover:text-white hover:underline"
                aria-label={`${emergency.label}: bel ${emergency.phone}`}
              >
                <Headphones size={13} strokeWidth={1.75} aria-hidden="true" />
                {emergency.label}
              </a>
            ) : null}
          </div>
          <Link
            to="/werkgebied"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 text-white/78 hover:text-white"
          >
            {serviceArea.headerLabel}
          </Link>
        </Container>
      </div>
    </>
  )
}
