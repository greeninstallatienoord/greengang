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
    title: 'Service en onderhoud | 24/7 storingsdienst',
    description:
      'Onderhoudsabonnementen vanaf €7,99 per maand en 24/7 storingsdienst voor cv-ketels en klimaatinstallaties in Noord-Nederland.',
    path: '/service-onderhoud',
  },
  about: {
    title: 'Specialist in installatietechniek in Noord-Nederland',
    description:
      'Green Installatie Noord: betrouwbare installatie en onderhoud van cv-ketels, airco en warmtepompen in Noord-Nederland. Eerlijk advies, snelle opvolging. Gevestigd in Oude Pekela.',
    path: '/over-ons',
  },
  work: {
    title: 'Werk uit de praktijk',
    description:
      'Foto’s van cv-ketel-, airco- en warmtepompinstallaties door Green Installatie Noord. Gevestigd in Oude Pekela, actief in Noord-Nederland.',
    path: '/werk',
  },
  areas: {
    title: 'Werkgebied | Installateur Groningen, Drenthe & Friesland | Green Installatie Noord',
    description:
      'Green Installatie Noord is gevestigd in Oude Pekela en werkt in Groningen, Drenthe en Friesland. Cv-ketel, airco, warmtepomp, service en onderhoud. Bel 050 569 0997.',
    path: '/werkgebied',
  },
  blog: {
    title: 'Advies & kennis over cv-ketel, airco en warmtepomp',
    description:
      'Praktische informatie over cv-ketels, airconditioning, warmtepompen, onderhoud en energiezuinig wonen. Voor woningeigenaren in Noord-Nederland.',
    path: '/blog',
  },
  contact: {
    title: 'Contact',
    description:
      `Neem contact op met ${business.businessName} in ${business.address.city}. Reguliere bereikbaarheid ma–vr 07:00–17:00. Bij storingen is de 24/7 storingsdienst bereikbaar via ${business.phone}.`,
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
    title: 'Veelgestelde vragen | CV-ketel, airco, warmtepomp en onderhoud',
    description:
      'Antwoorden over cv-ketels, airconditioning, warmtepompen, onderhoud, offertes en afspraken bij Green Installatie Noord. Zoek snel of bel 050 569 0997.',
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
      'Artikelen over airconditioning in huis: koelen, soms verwarmen, onderhoud en vragen vóór installatie.',
    intro:
      'Praktische stukken over airconditioning: gebruik, onderhoud en de vragen die het advies scherp maken.',
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
      'Praktische uitleg over onderhoud, storingen en het goed laten functioneren van uw installatie.',
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
