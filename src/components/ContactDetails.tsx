import { formatAddress } from '../data/business'
import { site } from '../data/site'

type ContactDetailsProps = {
  showHours?: boolean
}

export function ContactDetails({ showHours = true }: ContactDetailsProps) {
  const { phone, phoneHref, email, emailHref, openingHours } = site.contact

  return (
    <dl className="grid gap-3 text-sm">
      <div>
        <dt className="text-ink-muted">Telefoon</dt>
        <dd>
          <a href={phoneHref} className="font-medium underline">
            {phone}
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-ink-muted">E-mail</dt>
        <dd>
          <a href={emailHref} className="font-medium underline">
            {email}
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-ink-muted">Adres</dt>
        <dd>{formatAddress()}</dd>
      </div>
      {showHours ? (
        <div>
          <dt className="text-ink-muted">Openingstijden</dt>
          <dd>{openingHours ?? 'Volgen'}</dd>
        </div>
      ) : null}
    </dl>
  )
}
