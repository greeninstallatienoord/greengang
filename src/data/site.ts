import { business } from './business'
import { serviceArea } from './region'
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
    'Installatiebedrijf voor Noord-Nederland. Green Installatie Noord installeert en onderhoudt cv-ketels, airconditioning en warmtepompen in Groningen, Drenthe en Friesland. Gevestigd in Oude Pekela.',
  shortDescription:
    'Installatie, service en onderhoud van cv-ketels, airconditioning en warmtepompen in Noord-Nederland.',
  baseLine: serviceArea.baseLine,
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
    openingHours: business.openingHours.summary,
    serviceAreaSummary: serviceArea.regionName,
  },
  social: {
    facebook: business.facebook || null,
    instagram: business.instagram || null,
    linkedin: business.linkedin || null,
    tiktok: business.tiktok || null,
    googleBusinessProfile: business.googleBusinessProfile || null,
  },
  copy: {
    eyebrow: serviceArea.eyebrow,
    heroTitle: 'CV-ketel, airco en warmtepomp.',
    heroTitleLead: 'CV-ketel, airco',
    heroTitleLeadRest: 'en warmtepomp.',
    heroTitleSupport: '',
    heroTitleSupportRest: '',
    heroText:
      'Een passende installatie voor uw woning, vakkundig uitgevoerd. Actief in Noord-Nederland, gevestigd in Oude Pekela.',
    heroTrust: 'Ervaring met cv-ketels, airco en warmtepompen.',
    introTitle: 'Ervaring uit de praktijk',
    introText:
      'Verschillende woningtypen, nette technische uitvoering. Eerst de woning, daarna een voorstel.',
    workTitle: 'Werk uit de praktijk',
    workText: 'Een selectie van recente plaatsingen. Meer foto’s staan op de werkpagina.',
    localTitle: 'Actief in Noord-Nederland',
    localText: serviceArea.intro,
    ctaTitle: 'Een installatievraag?',
    ctaText:
      'Vraag een offerte aan of plan een afspraak. We denken mee over cv-ketel, airco, warmtepomp of onderhoud.',
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
        title: 'Situatie begrijpen',
        text: 'U vertelt wat er speelt. Wij luisteren eerst, voordat er een voorstel komt.',
      },
      {
        step: '02',
        title: 'Duidelijk advies',
        text: 'We kijken naar de woning en de wens, en zeggen wat wel en niet zinvol is.',
      },
      {
        step: '03',
        title: 'Voorstel',
        text: 'U krijgt een overzichtelijk voorstel. Dat is nog geen opdracht.',
      },
      {
        step: '04',
        title: 'Nette installatie',
        text: 'Na akkoord plannen we het werk en ronden we het netjes af, met uitleg.',
      },
      {
        step: '05',
        title: 'Service wanneer nodig',
        text: 'Voor onderhoud of een vraag blijft u ons gewoon bellen of mailen.',
      },
    ],
  },
} as const
