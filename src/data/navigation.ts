import { services } from './services'

export const mainNav = [
  { label: 'Home', href: '/' },
  ...services.map((service) => ({
    label: service.navLabel,
    href: service.href,
  })),
  { label: 'Over ons', href: '/over-ons' },
  { label: 'Werkgebied', href: '/werkgebied' },
  { label: 'Kennisbank', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const

const formPaths = ['/offerte-aanvragen', '/afspraak-maken', '/contact'] as const

export function isFormPath(pathname: string): boolean {
  return formPaths.some((path) => pathname.startsWith(path))
}

export const footerNav = {
  services: services.map((service) => ({
    label: service.name,
    href: service.href,
  })),
  company: [
    { label: 'Over ons', href: '/over-ons' },
    { label: 'Werkgebied', href: '/werkgebied' },
    { label: 'Kennisbank', href: '/blog' },
    { label: 'Veelgestelde vragen', href: '/veelgestelde-vragen' },
    { label: 'Contact', href: '/contact' },
    { label: 'Offerte aanvragen', href: '/offerte-aanvragen' },
    { label: 'Afspraak maken', href: '/afspraak-maken' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'Algemene voorwaarden', href: '/algemene-voorwaarden' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
} as const
