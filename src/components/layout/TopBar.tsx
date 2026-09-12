import { Clock3, Mail, Phone } from 'lucide-react'
import { site } from '../../data/site'
import { Container } from '../Container'

export function TopBar() {
  const { phone, phoneHref, email, emailHref, openingHours } = site.contact

  return (
    <div className="hidden border-b border-brand-deep/20 bg-brand-deep text-sm text-white lg:block">
      <Container className="flex min-h-10 items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a href={phoneHref} className="inline-flex items-center gap-2 hover:underline">
            <Phone size={14} aria-hidden="true" />
            {phone}
          </a>
          <a href={emailHref} className="inline-flex items-center gap-2 hover:underline">
            <Mail size={14} aria-hidden="true" />
            {email}
          </a>
          <span className="inline-flex items-center gap-2 text-white/80">
            <Clock3 size={14} aria-hidden="true" />
            {openingHours ?? 'Openingstijden volgen'}
          </span>
        </div>
        <a
          href={phoneHref}
          className="inline-flex min-h-8 items-center rounded-md bg-white/10 px-3 font-semibold hover:bg-white/15"
        >
          Bellen
        </a>
      </Container>
    </div>
  )
}
