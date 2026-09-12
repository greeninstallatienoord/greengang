import { business } from './business'
import { tokens } from './tokens'

export const site = {
  name: business.businessName,
  legalName: business.legalName,
  domain: business.domain,
  url: business.website,
  locale: 'nl_NL',
  language: 'nl',
  themeColor: '#1A8A34',
  description:
    'Green Installatie Noord in Oude Pekela installeert en onderhoudt cv-ketels, airconditioning en warmtepompen. Vraag een offerte aan of plan een afspraak.',
  shortDescription:
    'Installatie, service en onderhoud van cv-ketels, airconditioning en warmtepompen in Oude Pekela.',
  contact: {
    phone: business.phone,
    phoneHref: business.phoneHref,
    phoneInternational: business.phoneInternational,
    email: business.email,
    emailHref: business.emailHref,
    whatsapp: business.whatsapp || null,
    street: business.address.street,
    postalCode: business.address.postalCode,
    city: business.address.city,
    region: business.address.region,
    country: business.address.country,
    countryCode: business.address.countryCode,
    openingHours: business.openingHours || null,
    serviceAreaSummary: null as string | null,
  },
  social: {
    facebook: business.facebook || null,
    instagram: business.instagram || null,
    linkedin: business.linkedin || null,
    googleBusinessProfile: business.googleBusinessProfile || null,
  },
  copy: {
    eyebrow: 'Installatie, service & onderhoud',
    heroTitle: 'Comfort en techniek, vakkundig geregeld.',
    heroText:
      'Green Installatie Noord helpt met professionele oplossingen voor cv-ketels, airconditioning en warmtepompen — van installatie tot service en onderhoud.',
    ctaQuote: tokens.cta.primary,
    ctaAppointment: tokens.cta.secondary,
    ctaCall: tokens.cta.tertiary,
    ctaContact: 'Contact',
    ctaMore: 'Meer informatie',
    trust: [
      {
        title: 'Professioneel advies',
        text: 'Eerst luisteren, dan een voorstel dat past bij de woning en de vraag.',
      },
      {
        title: 'Vakkundige installatie',
        text: 'Zorgvuldige montage van cv-ketels, airco’s en warmtepompen.',
      },
      {
        title: 'Service & onderhoud',
        text: 'Onderhoud en service zodat installaties betrouwbaar blijven werken.',
      },
      {
        title: 'Persoonlijk contact',
        text: 'Korte lijnen: u weet waar u aan toe bent en wat de volgende stap is.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Aanvraag',
        text: 'Geef aan wat u nodig heeft: een offerte, een afspraak of een gerichte vraag.',
      },
      {
        step: '02',
        title: 'Persoonlijk advies',
        text: 'We bekijken de situatie en denken mee over de passende aanpak.',
      },
      {
        step: '03',
        title: 'Duidelijke offerte',
        text: 'U ontvangt een overzichtelijk voorstel, zodat u kunt vergelijken en beslissen.',
      },
      {
        step: '04',
        title: 'Installatie',
        text: 'Na akkoord plannen we de werkzaamheden en voeren we de installatie uit.',
      },
      {
        step: '05',
        title: 'Service & nazorg',
        text: 'Daarna blijven we beschikbaar voor onderhoud, service en vragen.',
      },
    ],
  },
} as const
