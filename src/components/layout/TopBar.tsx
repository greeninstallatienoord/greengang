import { Clock3, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { Container } from '../Container'

export function TopBar() {
  const { phone, phoneHref, openingHours } = site.contact

  return (
    <>
      <div className="flex min-h-11 items-center justify-between gap-3 bg-brand-deep px-4 text-[0.75rem] text-white sm:px-5 lg:hidden">
        <a
          href={phoneHref}
          className="inline-flex min-h-11 items-center gap-1.5 font-semibold"
        >
          <Phone size={13} strokeWidth={1.8} aria-hidden="true" />
          {phone}
        </a>
        <span className="inline-flex min-h-11 items-center gap-1.5 truncate text-white/78">
          <Clock3 size={13} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{openingHours}</span>
        </span>
      </div>
      <div className="hidden border-b border-white/10 bg-brand-deep text-[0.78rem] text-white lg:block">
        <Container className="flex min-h-10 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a href={phoneHref} className="inline-flex items-center gap-2 hover:text-white/80">
              <Phone size={13} strokeWidth={1.75} aria-hidden="true" />
              {phone}
            </a>
            <span className="inline-flex items-center gap-2 text-white/78">
              <Clock3 size={13} strokeWidth={1.75} aria-hidden="true" />
              {openingHours}
            </span>
          </div>
          <Link to="/werkgebied" className="inline-flex items-center gap-2 text-white/78 hover:text-white">
            <MapPin size={13} strokeWidth={1.75} aria-hidden="true" />
            {serviceArea.headerLabel}
          </Link>
        </Container>
      </div>
    </>
  )
}
