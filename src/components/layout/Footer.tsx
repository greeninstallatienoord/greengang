import { Clock3, Headphones, Mail, MapPin, Phone } from 'lucide-react'
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
      <Container className="grid gap-8 py-9 sm:gap-10 sm:py-11 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10 lg:py-14">
        <div className="lg:col-span-4">
          <BrandLogo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/78">
            {site.shortDescription}
          </p>
          <div className="mt-5 hidden sm:block">
            <ButtonLink to="/offerte-aanvragen" size="sm">
              {site.copy.ctaQuote}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-3">
          <FooterHeading>Contact</FooterHeading>
          <a
            href={phoneHref}
            className="mt-3 inline-flex min-h-11 items-center gap-2 font-display text-[1.35rem] leading-none tracking-[-0.02em] text-white transition-colors hover:text-brand-soft sm:text-[1.45rem]"
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
            {business.emergencyService.available ? (
              <li>
                <a
                  href={business.emergencyService.phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-white hover:text-brand-soft"
                  aria-label={`${business.emergencyService.label}: bel ${business.emergencyService.phone}`}
                >
                  <Headphones
                    size={15}
                    strokeWidth={1.7}
                    className="shrink-0 text-white/70"
                    aria-hidden="true"
                  />
                  <span>
                    {business.emergencyService.label}
                    <span className="mt-0.5 block text-xs font-normal text-white/65">
                      Bel bij een storing →
                    </span>
                  </span>
                </a>
              </li>
            ) : null}
            <li className="flex min-h-11 items-start gap-2 py-1.5">
              <MapPin size={15} strokeWidth={1.7} className="mt-0.5 shrink-0 text-white/70" aria-hidden="true" />
              <span className="break-words">
                {street}
                <br />
                {postalCode} {city}
              </span>
            </li>
            <li className="flex min-h-11 items-center gap-2">
              <Clock3 size={15} strokeWidth={1.7} className="shrink-0 text-white/70" aria-hidden="true" />
              <span>
                <span className="text-white/55">Regulier </span>
                {openingHours.replace(/-/g, '–')}
              </span>
            </li>
            <li className="flex min-h-11 items-center text-white/78">
              <span>
                <span className="text-white/55">KVK</span> {business.kvk}
              </span>
            </li>
          </ul>
        </div>

        <nav className="grid grid-cols-2 gap-6 lg:col-span-5 lg:grid-cols-2" aria-label="Footer">
          <div>
            <FooterHeading>Navigatie</FooterHeading>
            <ul className="mt-2 grid">
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <FooterLink to={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <FooterHeading>Diensten</FooterHeading>
            <ul className="mt-2 grid">
              {footerNav.services.map((item) => (
                <li key={item.href}>
                  <FooterLink to={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-white/78">{serviceArea.regionName}</p>
          </div>
        </nav>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <SocialLinks className="shrink-0" tone="onDark" />
          <p className="text-sm text-white/70 sm:text-right">
            {street}, {postalCode} {city}
          </p>
        </Container>
      </div>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-4 text-xs text-white/70 sm:py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {business.businessName}
              <span className="mx-2 text-white/35" aria-hidden="true">
                ·
              </span>
              KVK {business.kvk}
            </p>
            <p className="text-white/55 sm:text-right">Privacy &amp; voorwaarden</p>
          </div>
          <ul className="grid grid-cols-1 gap-0 min-[380px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-1">
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="inline-flex min-h-11 items-center px-1.5 hover:text-white sm:px-1.5"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="min-[380px]:col-span-2 sm:col-auto">
              <button
                type="button"
                className="inline-flex min-h-11 items-center px-1.5 hover:text-white"
                onClick={(event) => openPreferences(event.currentTarget)}
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
