import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { business, formatAddress, formatDayHours } from '../data/business'
import { site } from '../data/site'

type ContactDetailsProps = {
  showHours?: boolean
}

export function ContactDetails({ showHours = true }: ContactDetailsProps) {
  const { phone, phoneHref, email, emailHref } = site.contact

  return (
    <dl className="grid gap-3.5 text-sm">
      <div className="flex items-start gap-2.5">
        <Phone size={16} strokeWidth={1.7} className="mt-0.5 shrink-0 text-brand-dark" aria-hidden="true" />
        <div>
          <dt className="text-ink-muted">Telefoon</dt>
          <dd>
            <a href={phoneHref} className="font-medium underline underline-offset-2">
              {phone}
            </a>
          </dd>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <Mail size={16} strokeWidth={1.7} className="mt-0.5 shrink-0 text-brand-dark" aria-hidden="true" />
        <div>
          <dt className="text-ink-muted">E-mail</dt>
          <dd>
            <a href={emailHref} className="font-medium underline underline-offset-2">
              {email}
            </a>
          </dd>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <MapPin size={16} strokeWidth={1.7} className="mt-0.5 shrink-0 text-brand-dark" aria-hidden="true" />
        <div>
          <dt className="text-ink-muted">Adres</dt>
          <dd>{formatAddress()}</dd>
        </div>
      </div>
      {showHours ? (
        <div className="flex items-start gap-2.5">
          <Clock3 size={16} strokeWidth={1.7} className="mt-0.5 shrink-0 text-brand-dark" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <dt className="text-ink-muted">Openingstijden</dt>
            <dd>
              <ul className="mt-1 grid gap-1">
                {business.openingHours.days.map((day) => (
                  <li key={day.day} className="flex justify-between gap-4">
                    <span>{day.label}</span>
                    <span>{formatDayHours(day)}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </div>
      ) : null}
    </dl>
  )
}
