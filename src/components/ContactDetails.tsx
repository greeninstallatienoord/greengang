import { Clock3, Headphones, Mail, MapPin, Phone } from 'lucide-react'
import { business, formatAddress } from '../data/business'
import { site } from '../data/site'
import { OpeningHours } from './OpeningHours'
import { SocialLinks } from './SocialLinks'

type ContactDetailsProps = {
  showHours?: boolean
  showSocial?: boolean
  className?: string
}

export function ContactDetails({
  showHours = true,
  showSocial = false,
  className,
}: ContactDetailsProps) {
  const { phone, phoneHref, email, emailHref } = site.contact
  const emergency = business.emergencyService

  return (
    <div className={className}>
      <dl className="grid gap-4 text-sm">
        <div className="flex items-start gap-3">
          <Phone
            size={16}
            strokeWidth={1.7}
            className="mt-0.5 shrink-0 text-brand-dark"
            aria-hidden="true"
          />
          <div>
            <dt className="text-ink-muted">Telefoon</dt>
            <dd>
              <a
                href={phoneHref}
                className="font-semibold text-ink underline-offset-2 hover:underline"
              >
                {phone}
              </a>
            </dd>
          </div>
        </div>
        {emergency.available ? (
          <div className="flex items-start gap-3">
            <Headphones
              size={16}
              strokeWidth={1.7}
              className="mt-0.5 shrink-0 text-brand-dark"
              aria-hidden="true"
            />
            <div>
              <dt className="text-ink-muted">{emergency.label}</dt>
              <dd>
                <a
                  href={emergency.phoneHref}
                  className="font-semibold text-ink underline-offset-2 hover:underline"
                  aria-label={`${emergency.label}: bel ${emergency.phone}`}
                >
                  Bel {emergency.phone}
                </a>
                <p className="mt-1 text-ink-muted">{emergency.summary}</p>
              </dd>
            </div>
          </div>
        ) : null}
        <div className="flex items-start gap-3">
          <Mail
            size={16}
            strokeWidth={1.7}
            className="mt-0.5 shrink-0 text-brand-dark"
            aria-hidden="true"
          />
          <div>
            <dt className="text-ink-muted">E-mail</dt>
            <dd>
              <a
                href={emailHref}
                className="font-semibold break-all text-ink underline-offset-2 hover:underline"
              >
                {email}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin
            size={16}
            strokeWidth={1.7}
            className="mt-0.5 shrink-0 text-brand-dark"
            aria-hidden="true"
          />
          <div>
            <dt className="text-ink-muted">Adres</dt>
            <dd>
              <p className="font-medium text-ink">{business.address.street}</p>
              <p className="text-ink">
                {business.address.postalCode} {business.address.city}
              </p>
              <span className="sr-only">{formatAddress()}</span>
              {business.googleBusinessProfile ? (
                <p className="mt-1.5">
                  <a
                    href={business.googleBusinessProfile}
                    className="font-semibold text-ink underline underline-offset-2"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Route bekijken
                  </a>
                </p>
              ) : null}
            </dd>
          </div>
        </div>
        <div className="border-t border-line pt-4">
          <dt className="text-ink-muted">KVK</dt>
          <dd className="mt-0.5 font-medium text-ink">{business.kvk}</dd>
        </div>
      </dl>

      {showHours ? (
        <div className="mt-5 border-t border-line pt-5">
          <div className="mb-3 flex items-center gap-2">
            <Clock3
              size={16}
              strokeWidth={1.7}
              className="shrink-0 text-brand-dark"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold tracking-[-0.01em]">Reguliere openingstijden</p>
          </div>
          <OpeningHours compact />
        </div>
      ) : null}

      {showSocial ? (
        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold tracking-[-0.01em]">Volg ons</p>
          <SocialLinks />
        </div>
      ) : null}
    </div>
  )
}
