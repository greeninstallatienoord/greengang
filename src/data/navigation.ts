import { services } from './services'

export const serviceNav = services.map((service) => ({
  label: service.navLabel,
  href: service.href,
  summary: service.summary,
}))

export const headerNav = [
  { label: 'Werk', href: '/werk' },
  { label: 'Over ons', href: '/over-ons' },
  { label: 'Advies & kennis', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const

export const mobileExtraNav = [
  { label: 'Werkgebied', href: '/werkgebied' },
  { label: 'Veelgestelde vragen', href: '/veelgestelde-vragen' },
] as const

export const mainNav = [
  { label: 'Home', href: '/' },
  ...serviceNav,
  ...headerNav,
  ...mobileExtraNav,
] as const

const formPaths = ['/offerte-aanvragen', '/afspraak-maken', '/contact'] as const
const legalPaths = [
  '/privacy',
  '/cookies',
  '/algemene-voorwaarden',
  '/voorwaarden',
  '/disclaimer',
] as const

export function isFormPath(pathname: string): boolean {
  return formPaths.some((path) => pathname.startsWith(path))
}

export function isLegalPath(pathname: string): boolean {
  return legalPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export const footerNav = {
  services: services.map((service) => ({
    label: service.name,
    href: service.href,
  })),
  company: [
    { label: 'Over ons', href: '/over-ons' },
    { label: 'Werk', href: '/werk' },
    { label: 'Werkgebied', href: '/werkgebied' },
    { label: 'Advies & kennis', href: '/blog' },
    { label: 'Veelgestelde vragen', href: '/veelgestelde-vragen' },
    { label: 'Contact', href: '/contact' },
    { label: 'Afspraak aanvragen', href: '/afspraak-maken' },
    { label: 'Offerte aanvragen', href: '/offerte-aanvragen' },
  ],
  legal: [
    { label: 'Privacyverklaring', href: '/privacy' },
    { label: 'Cookiebeleid', href: '/cookies' },
    { label: 'Algemene voorwaarden', href: '/algemene-voorwaarden' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
} as const
