import { Link } from 'react-router-dom'
import { formatAddress } from '../../data/business'
import { footerNav } from '../../data/navigation'
import { site } from '../../data/site'
import { Container } from '../Container'
import { CtaPair } from '../CtaPair'
import { SocialLinks } from '../SocialLinks'
import { openPreferences } from '../../lib/consentManager'
import { BrandLogo } from '../media/BrandLogo'

export function Footer() {
  const year = new Date().getFullYear()
  const { phone, phoneHref, email, emailHref } = site.contact

  return (
    <footer className="border-t border-line bg-brand-deep text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="rounded-md bg-white px-3 py-2">
            <BrandLogo />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            {site.shortDescription}
          </p>
          <CtaPair className="mt-5" compact onDark />
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Diensten
          </h2>
          <ul className="mt-3 grid gap-2 text-sm">
            {footerNav.services.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Bedrijf
          </h2>
          <ul className="mt-3 grid gap-2 text-sm">
            {footerNav.company.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Contact
          </h2>
          <div className="mt-3 grid gap-2 text-sm text-white/85">
            <p>
              <a href={phoneHref} className="hover:underline">
                {phone}
              </a>
            </p>
            <p>
              <a href={emailHref} className="hover:underline">
                {email}
              </a>
            </p>
            <p>{formatAddress()}</p>
            <SocialLinks className="mt-2" tone="onDark" />
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Alle rechten voorbehouden.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="underline underline-offset-2 hover:text-white"
                onClick={() => openPreferences()}
              >
                Cookie-instellingen
              </button>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  )
}
