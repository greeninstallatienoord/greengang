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
    regionCode: business.address.regionCode,
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
    heroTitle: 'WARMTEPOMP, CV‑KETEL EN AIRCO.',
    heroTitleLead: 'CV-ketel, airco',
    heroTitleLeadRest: 'en warmtepomp.',
    heroTitleSupport: '',
    heroTitleSupportRest: '',
    heroText:
      'Installatie en onderhoud voor woningen in Noord-Nederland. Gevestigd in Oude Pekela.',
    heroTrust: 'Ervaring met cv-ketels, airco en warmtepompen.',
    introTitle: 'Installaties in woningen door heel Noord-Nederland',
    introText:
      'Van cv-ketel tot airconditioning en warmtepomp: we beoordelen eerst wat bij de woning en situatie past.',
    workTitle: 'Werk uit de praktijk',
    workText:
      'Een selectie van recente installaties. Meer projecten vindt u op onze werkpagina.',
    localTitle: 'Actief in Noord-Nederland',
    localText: serviceArea.intro,
    ctaTitle: 'Een installatievraag?',
    ctaText:
      'Vertel ons wat u wilt laten uitvoeren. We denken graag mee over een passende oplossing.',
    ctaQuote: tokens.cta.primary,
    ctaAppointment: tokens.cta.secondary,
    ctaCall: tokens.cta.tertiary,
    ctaContact: 'Contact',
    ctaMore: 'Meer informatie',
    whyIntro:
      'Persoonlijk advies, nette montage en service na oplevering — zonder omwegen.',
    trust: [
      {
        title: 'Persoonlijk advies',
        text: 'U hoort wat technisch past en wat niet. Geen standaardpakket.',
      },
      {
        title: 'Zorgvuldige installatie',
        text: 'Nette montage en een oplevering die u kunt volgen.',
      },
      {
        title: '24/7 storingsdienst',
        text: 'Ook buiten reguliere openingstijden bereikbaar bij storingen.',
      },
      {
        title: 'Regionaal bereikbaar',
        text: 'Werk vanuit Oude Pekela voor klanten in Noord-Nederland.',
      },
    ],
    processIntro:
      'Van advies tot installatie en service: duidelijk en zonder onnodige stappen.',
    process: [
      {
        step: '01',
        title: 'Advies',
        text: 'We bekijken uw situatie, woning en wensen en bespreken wat technisch passend is.',
      },
      {
        step: '02',
        title: 'Installatie',
        text: 'Na een duidelijk voorstel plannen we de werkzaamheden en voeren we de installatie netjes uit.',
      },
      {
        step: '03',
        title: 'Service',
        text: 'Na plaatsing kunt u bij ons terecht voor onderhoud en vragen. Bij storingen is de 24/7 storingsdienst bereikbaar.',
      },
    ],
  },
} as const
