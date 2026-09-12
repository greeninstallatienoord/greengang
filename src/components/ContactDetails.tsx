import { Mail, MapPin, Phone } from 'lucide-react'
import { business, formatAddress } from '../data/business'
import { site } from '../data/site'
import { OpeningHours } from './OpeningHours'

type ContactDetailsProps = {
  showHours?: boolean
}

export function ContactDetails({ showHours = true }: ContactDetailsProps) {
  const { phone, phoneHref, email, emailHref } = site.contact

  return (
    <div className="grid gap-5">
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
            <dd>
              <p>{formatAddress()}</p>
              {business.googleBusinessProfile ? (
                <p className="mt-1">
                  <a
                    href={business.googleBusinessProfile}
                    className="font-medium underline underline-offset-2"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Locatie op Google
                  </a>
                </p>
              ) : null}
            </dd>
          </div>
        </div>
        <div>
          <dt className="text-ink-muted">KVK</dt>
          <dd className="font-medium">{business.kvk}</dd>
        </div>
      </dl>
      {showHours ? (
        <div>
          <p className="text-sm text-ink-muted">Openingstijden</p>
          <OpeningHours className="mt-1" />
        </div>
      ) : null}
    </div>
  )
}
