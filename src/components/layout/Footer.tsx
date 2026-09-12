import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { business } from '../../data/business'
import { footerNav } from '../../data/navigation'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { openPreferences } from '../../lib/consentManager'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { BrandLogo } from '../media/BrandLogo'
import { SocialLinks } from '../SocialLinks'
import { CertificationMarks } from '../trust/CertificationMarks'

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-11 items-center text-[0.92rem] text-white/78 transition-colors hover:text-white"
    >
      {children}
    </Link>
  )
}

function FooterHeading({ children }: { children: string }) {
  return (
    <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">
      {children}
    </h2>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  const { phone, phoneHref, email, emailHref, street, postalCode, city, openingHours } = site.contact

  return (
    <footer className="bg-brand-deep text-white">
      <Container className="grid gap-7 py-8 sm:gap-8 sm:py-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10 lg:py-12">
        <div className="lg:col-span-4">
          <BrandLogo className="bg-paper px-2.5 py-1.5" />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/78">
            {site.shortDescription}
          </p>
          <p className="mt-2 text-sm text-white/70">KVK {business.kvk}</p>
          <div className="mt-4 hidden sm:block">
            <ButtonLink to="/offerte-aanvragen" size="sm">
              {site.copy.ctaQuote}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-3">
          <FooterHeading>Contact</FooterHeading>
          <a
            href={phoneHref}
            className="mt-2 inline-flex min-h-11 items-center gap-2 font-display text-[1.35rem] leading-none tracking-[-0.02em] text-white transition-colors hover:text-brand-soft sm:text-[1.45rem]"
          >
            <Phone size={18} strokeWidth={1.7} className="shrink-0 text-white/70" aria-hidden="true" />
            {phone}
          </a>
          <ul className="mt-1 grid text-sm text-white/78">
            <li>
              <a href={emailHref} className="inline-flex min-h-11 items-center gap-2 hover:text-white">
                <Mail size={15} strokeWidth={1.7} className="shrink-0 text-white/70" aria-hidden="true" />
                {email}
              </a>
            </li>
            <li className="flex min-h-11 items-start gap-2 py-1.5">
              <MapPin size={15} strokeWidth={1.7} className="mt-0.5 shrink-0 text-white/70" aria-hidden="true" />
              <span>
                {street}
                <br />
                {postalCode} {city}
              </span>
            </li>
            <li className="flex min-h-11 items-center gap-2">
              <Clock3 size={15} strokeWidth={1.7} className="shrink-0 text-white/70" aria-hidden="true" />
              {openingHours}
            </li>
          </ul>
        </div>

        <nav className="grid grid-cols-2 gap-6 lg:col-span-5 lg:grid-cols-2" aria-label="Footer">
          <div>
            <FooterHeading>Navigatie</FooterHeading>
            <ul className="mt-1 grid">
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <FooterLink to={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <FooterHeading>Diensten</FooterHeading>
            <ul className="mt-1 grid">
              {footerNav.services.map((item) => (
                <li key={item.href}>
                  <FooterLink to={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-white/78">{serviceArea.regionName}</p>
          </div>
        </nav>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <div className="min-w-0">
            <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">
              Kaders
            </p>
            <div className="bg-paper px-3 py-3 sm:px-5">
              <CertificationMarks compact />
            </div>
          </div>
          <SocialLinks className="shrink-0" tone="onDark" />
        </Container>
      </div>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-3 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.businessName}
          </p>
          <ul className="flex flex-wrap items-center gap-x-1">
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="inline-flex min-h-11 items-center px-1.5 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="inline-flex min-h-11 items-center px-1.5 hover:text-white"
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
