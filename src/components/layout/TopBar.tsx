import { Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { Container } from '../Container'

export function TopBar() {
  const { phone, phoneHref, openingHours } = site.contact

  return (
    <>
      <div className="flex h-9 items-center justify-between gap-3 bg-brand-deep px-3.5 text-[0.72rem] text-white min-[375px]:px-4 sm:px-5 lg:hidden">
        <a
          href={phoneHref}
          className="inline-flex h-9 items-center gap-1.5 font-semibold tracking-[-0.01em]"
        >
          <Phone size={12} strokeWidth={1.9} aria-hidden="true" />
          {phone}
        </a>
        <Link
          to="/werkgebied"
          className="inline-flex h-9 max-w-[45%] items-center truncate text-white/78 hover:text-white"
        >
          <span className="truncate">{serviceArea.headerLabel}</span>
        </Link>
      </div>
      <div className="hidden border-b border-white/10 bg-brand-deep text-[0.78rem] text-white lg:block">
        <Container className="flex min-h-10 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a href={phoneHref} className="inline-flex items-center gap-2 hover:text-white/80">
              <Phone size={13} strokeWidth={1.75} aria-hidden="true" />
              {phone}
            </a>
            <span className="inline-flex items-center gap-2 text-white/78">
              {openingHours}
            </span>
          </div>
          <Link to="/werkgebied" className="inline-flex items-center gap-2 text-white/78 hover:text-white">
            {serviceArea.headerLabel}
          </Link>
        </Container>
      </div>
    </>
  )
}
