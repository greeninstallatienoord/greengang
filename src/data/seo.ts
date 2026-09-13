import { business } from './business'
import { site } from './site'
import type { SeoRecord, ServiceSlug } from '../types'

export const pageSeo = {
  home: {
    title: 'Green Installatie Noord | CV-ketel, airco en warmtepomp in Noord-Nederland',
    description: site.description,
    path: '/',
  },
  cvKetel: {
    title: 'CV-ketel installeren of vervangen',
    description:
      'CV-ketel laten installeren of vervangen in Groningen en de rest van Noord-Nederland. Advies en offerte door Green Installatie Noord.',
    path: '/cv-ketel',
  },
  airco: {
    title: 'Airconditioning laten installeren',
    description:
      'Airco laten installeren van merken als Mitsubishi, Kaisai, LG, Haier en Daikin. Green Installatie Noord bekijkt de ruimte voordat er een voorstel komt.',
    path: '/airco',
  },
  warmtepomp: {
    title: 'Warmtepomp Groningen, Drenthe en Friesland',
    description:
      'Hybride of all-electric warmtepomp laten adviseren en installeren. Indicatie van besparing en ISDE-subsidie, daarna beoordeling van uw woning door Green Installatie Noord.',
    path: '/warmtepomp',
  },
  onderhoud: {
    title: 'Service, onderhoud en 24/7 storingsdienst',
    description:
      'Onderhoudsabonnementen vanaf €7,99 per maand en 24/7 storingsdienst voor cv-ketels en klimaatinstallaties in Noord-Nederland.',
    path: '/service-onderhoud',
  },
  about: {
    title: 'Over Green Installatie Noord',
    description:
      'Green Installatie Noord is een installatiebedrijf voor Noord-Nederland, gevestigd in Oude Pekela. Cv-ketel, airco, warmtepomp en onderhoud.',
    path: '/over-ons',
  },
  work: {
    title: 'Werk uit de praktijk',
    description:
      'Foto’s van cv-ketel-, airco- en warmtepompinstallaties door Green Installatie Noord. Gevestigd in Oude Pekela, actief in Noord-Nederland.',
    path: '/werk',
  },
  areas: {
    title: 'Werkgebied Noord-Nederland',
    description:
      'Green Installatie Noord werkt in Noord-Nederland: Groningen, Drenthe en Friesland. Gevestigd in Oude Pekela.',
    path: '/werkgebied',
  },
  blog: {
    title: 'Kennisbank over cv-ketel, airco en warmtepomp',
    description:
      'Artikelen over cv-ketel, airconditioning, warmtepomp en onderhoud. Praktische uitleg voor woningeigenaren in Noord-Nederland.',
    path: '/blog',
  },
  contact: {
    title: 'Contact met Green Installatie Noord',
    description:
      `Neem contact op met ${business.businessName}. Gevestigd in ${business.address.city}, werkzaam in Noord-Nederland. Bel ${business.phone} of mail ${business.email}.`,
    path: '/contact',
  },
  quote: {
    title: 'Offerte aanvragen voor installatie of onderhoud',
    description:
      'Vraag een offerte aan voor cv-ketel, airconditioning, warmtepomp of onderhoud. Vier stappen, optioneel een foto van de situatie.',
    path: '/offerte-aanvragen',
  },
  appointment: {
    title: 'Afspraak aanvragen bij Green Installatie Noord',
    description:
      'Vraag een afspraak aan voor cv-ketel, airco, warmtepomp of cv-ketel service en onderhoud. Kies een datum en vrij tijdstip. Bevestiging volgt later.',
    path: '/afspraak-maken',
  },
  faq: {
    title: 'Vragen over cv-ketel, airco, warmtepomp en onderhoud',
    description:
      'Antwoorden over installatie, onderhoud, offertes en afspraken bij Green Installatie Noord.',
    path: '/veelgestelde-vragen',
  },
} as const satisfies Record<string, SeoRecord>

export const serviceSeo: Record<ServiceSlug, SeoRecord> = {
  'cv-ketel': pageSeo.cvKetel,
  airco: pageSeo.airco,
  warmtepomp: pageSeo.warmtepomp,
  'service-onderhoud': pageSeo.onderhoud,
}

export const blogCategorySeo: Record<
  string,
  { title: string; description: string; intro: string }
> = {
  'cv-ketel': {
    title: 'Artikelen over cv-ketels',
    description:
      'Artikelen over beoordelen, vervangen en onderhouden van een cv-ketel.',
    intro:
      'Stukken over de cv-ketel: wanneer beoordeling zinvol is, wat onderhoud inhoudt, en hoe u een gesprek voorbereidt.',
  },
  airco: {
    title: 'Artikelen over airconditioning',
    description:
      'Artikelen over airconditioning in huis: koelen, soms verwarmen, en vragen vóór installatie.',
    intro:
      'Korte stukken over airconditioning per ruimte en de vragen die het advies scherp maken.',
  },
  warmtepomp: {
    title: 'Artikelen over warmtepompen',
    description:
      'Artikelen over het overwegen van een warmtepomp en wat u vooraf kunt voorbereiden.',
    intro:
      'Oriëntatie op de warmtepomp: wat u kunt verzamelen en waarom de woning eerst beoordeeld moet worden.',
  },
  onderhoud: {
    title: 'Artikelen over onderhoud en service',
    description:
      'Artikelen over onderhoud van cv-ketels en klimaatinstallaties.',
    intro:
      'Praktische uitleg over onderhoud en hoe u een servicebezoek kunt voorbereiden.',
  },
  'energie-comfort': {
    title: 'Artikelen over energie en comfort',
    description:
      'Artikelen over comfort in huis: verwarmen, koelen en de keuze tussen systemen.',
    intro:
      'Korte stukken over comfort en energiegebruik, gericht op vragen die u kunt stellen.',
  },
  'praktische-tips': {
    title: 'Praktische tips voor installatiewerk',
    description:
      'Praktische tips om een offerte of afspraak voor te bereiden bij cv-ketel, airco of warmtepomp.',
    intro:
      'Handvatten voor het gesprek: wat u kunt noteren, fotograferen of beslissen voordat er een voorstel komt.',
  },
}
