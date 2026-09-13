import type { BlogCategorySlug, BlogPost } from '../types'
import { officialResource } from './citations'
import { featuredGuideSlugs, guidePosts } from './guides'

export { featuredGuideSlugs }

export const blogCategoryServiceHref: Partial<Record<BlogCategorySlug, string>> = {
  'cv-ketel': '/cv-ketel',
  airco: '/airco',
  warmtepomp: '/warmtepomp',
  onderhoud: '/service-onderhoud',
}

export const blogCategoryLabels: Record<BlogCategorySlug, string> = {
  'cv-ketel': 'CV-ketel',
  airco: 'Airco',
  warmtepomp: 'Warmtepomp',
  onderhoud: 'Onderhoud',
  'energie-comfort': 'Energie & comfort',
  'praktische-tips': 'Praktische tips',
}

export const blogCategoryOrder: BlogCategorySlug[] = [
  'cv-ketel',
  'airco',
  'warmtepomp',
  'onderhoud',
  'energie-comfort',
  'praktische-tips',
]

const corePosts: BlogPost[] = [
  {
    slug: 'wanneer-cv-ketel-vervangen',
    title: 'Wanneer is het tijd om een cv-ketel te laten beoordelen?',
    excerpt:
      'Signalen die aangeven dat een gesprek over vervanging zinvol kan zijn.',
    intro:
      'Een vast aantal jaren als “einde levensduur” is te grof. De staat van de ketel, storingen en wat u van de woning verwacht zeggen meer. Dit artikel helpt om te bepalen of een beoordeling zinvol is, niet om zelf een vervanging te forceren.',
    category: 'cv-ketel',
    tags: ['cv-ketel', 'vervanging', 'beoordeling'],
    publishedAt: '2026-09-01',
    updatedAt: '2026-09-12',
    imageAlt: 'Opstelling van een cv-ketel in een technische ruimte, ter illustratie',
    relatedServiceSlugs: ['cv-ketel', 'service-onderhoud'],
    relatedArticleSlugs: ['gids-cv-ketel', 'onderhoud-cv-ketel', 'offerte-voorbereiden'],
    faqIds: ['cv-wanneer-vervangen', 'cv-offerte'],
    sections: [
      {
        id: 'signalen',
        heading: 'Kijk naar de situatie, niet naar een standaardleeftijd',
        paragraphs: [
          'Op internet circuleert vaak een vast aantal jaren als einde van de levensduur. Dat is een vuistregel, geen diagnose. Onderhoudsverleden, storingen en hoe de ketel in de woning hangt wegen zwaarder.',
          'Laat de ketel beoordelen bij terugkerende storingen, twijfel over veiligheid, of als u toch al nadenkt over een andere manier van verwarmen. Dat gesprek kan uitkomen op onderhoud, reparatie of vervanging.',
        ],
      },
      {
        id: 'voorbereiden',
        heading: 'Wat u kunt voorbereiden',
        paragraphs: [
          'Noteer wat u merkt: geluid, drukverlies, wisselend warm water of een foutcode. Een foto van de opstelling helpt bij een eerste inschatting, maar is niet verplicht.',
          'Via een offerteaanvraag voor cv-ketelinstallatie of een afspraak kan Green Installatie Noord de situatie met u doornemen.',
        ],
        links: [
          { label: 'Gids: cv-ketel beoordelen', href: '/blog/gids-cv-ketel' },
          { label: 'Dienst: cv-ketel', href: '/cv-ketel' },
          { label: 'Offerte aanvragen', href: '/offerte-aanvragen?dienst=cv-ketel' },
        ],
      },
    ],
    resources: [
      officialResource('rijksoverheidCo'),
      officialResource('techniekNederland'),
    ],
  },
  {
    slug: 'onderhoud-cv-ketel',
    title: 'Wat gebeurt er bij onderhoud van een cv-ketel?',
    excerpt:
      'Wat er tijdens onderhoud gebeurt en hoe u het bezoek kunt voorbereiden.',
    intro:
      'Tijdens onderhoud wordt de installatie gecontroleerd en waar nodig schoongemaakt. Wat er precies gebeurt, hangt af van het toestel. Dit stuk beschrijft het doel van het bezoek, niet een vaste checklist die voor elk merk geldt.',
    category: 'onderhoud',
    tags: ['onderhoud', 'cv-ketel', 'service'],
    publishedAt: '2026-09-01',
    updatedAt: '2026-09-12',
    imageAlt: 'Controle van een cv-installatie tijdens onderhoud, ter illustratie',
    relatedServiceSlugs: ['service-onderhoud', 'cv-ketel'],
    relatedArticleSlugs: ['gids-cv-ketel', 'checklist-onderhoud', 'onderhoudsinterval'],
    faqIds: ['onderhoud-waarom', 'onderhoud-interval'],
    sections: [
      {
        id: 'doel',
        heading: 'Het doel van onderhoud',
        paragraphs: [
          'De monteur let op werking, veiligheidsaandachtspunten en onderdelen die slijtage vertonen. De exacte handelingen hangen af van het toestel. Vraag gerust wat er is nagekeken; een korte uitleg hoort bij het bezoek.',
        ],
      },
      {
        id: 'storing',
        heading: 'Onderhoud versus storing',
        paragraphs: [
          'Onderhoud is planbaar. Een storing vraagt om service: eerst de oorzaak, daarna de oplossing. Soms blijkt tijdens onderhoud dat reparatie of vervanging logischer is. Dat hoort u dan duidelijk, zonder omwegen.',
        ],
        links: [
          { label: 'Checklist voor een onderhoudsbezoek', href: '/blog/checklist-onderhoud' },
          { label: 'Dienst: service en onderhoud', href: '/service-onderhoud' },
          { label: 'Afspraak maken', href: '/afspraak-maken?dienst=service-onderhoud' },
        ],
      },
    ],
    resources: [officialResource('techniekNederland')],
  },
  {
    slug: 'airco-koelen-en-verwarmen',
    title: 'Airconditioning: koelen, en soms ook verwarmen',
    excerpt:
      'Wat airconditioning kan betekenen in huis, en welke vragen u kunt stellen vóór installatie.',
    intro:
      'Airconditioning is vooral een oplossing per ruimte. Veel systemen kunnen koelen en, afhankelijk van het toestel, ook bijverwarmen. Dat maakt ze niet automatisch tot vervanger van de hele cv-installatie.',
    category: 'airco',
    tags: ['airco', 'koelen', 'installatie'],
    publishedAt: '2026-09-01',
    updatedAt: '2026-09-12',
    imageAlt: 'Binnenunit van een airconditioner aan een muur, ter illustratie',
    relatedServiceSlugs: ['airco'],
    relatedArticleSlugs: ['gids-airco-onderhoud', 'comfort-in-huis', 'kiezen-tussen-systemen'],
    faqIds: ['airco-verwarmen', 'airco-plaatsing'],
    sections: [
      {
        id: 'gebruik',
        heading: 'Meer dan alleen koelen',
        paragraphs: [
          'Voor één slaapkamer of een warme zolder kan airconditioning gericht comfort geven. Of verwarmen in het tussenseizoen zinvol is, hangt af van het systeem en hoe de rest van de woning wordt verwarmd.',
        ],
      },
      {
        id: 'vragen',
        heading: 'Vragen vóór installatie',
        paragraphs: [
          'Welke ruimte wilt u aanpakken? Waar kan de buitenunit staan? Is er een logische leidingweg? En wilt u vooral koelen, of ook bijverwarmen?',
          'Green Installatie Noord installeert airconditioning en helpt die vragen vertalen naar een voorstel. Plaatsing is maatwerk; daarom eerst de ruimte, dan de offerte.',
        ],
        links: [
          { label: 'Dienst: airconditioning', href: '/airco' },
          { label: 'Gids: airco onderhouden', href: '/blog/gids-airco-onderhoud' },
          { label: 'Offerte aanvragen', href: '/offerte-aanvragen?dienst=airco' },
        ],
      },
    ],
    resources: [officialResource('iltFgassen')],
  },
  {
    slug: 'warmtepomp-waar-op-letten',
    title: 'Waar let u op als u een warmtepomp overweegt?',
    excerpt:
      'Een warmtepomp is maatwerk. Deze vragen helpen om het gesprek inhoudelijk te beginnen.',
    intro:
      'Of een warmtepomp past, hangt af van isolatie, afgifte, ruimte buiten en de huidige ketel. Dit artikel helpt u om het adviesgesprek voor te bereiden.',
    category: 'warmtepomp',
    tags: ['warmtepomp', 'advies', 'woning'],
    publishedAt: '2026-09-01',
    updatedAt: '2026-09-12',
    imageAlt: 'Buitenunit van een warmtepomp bij een woning, ter illustratie',
    relatedServiceSlugs: ['warmtepomp', 'cv-ketel'],
    relatedArticleSlugs: ['gids-warmtepomp', 'kiezen-tussen-systemen', 'comfort-in-huis'],
    faqIds: ['wp-past-woning', 'wp-of-cv'],
    sections: [
      {
        id: 'woning',
        heading: 'Niet elke woning is hetzelfde',
        paragraphs: [
          'Radiatoren of vloerverwarming, beschikbare buitenruimte en of u een combinatie met de cv-ketel overweegt, bepalen mede de aanpak. Een algemene “dat kan altijd”-boodschap is niet serieus.',
        ],
      },
      {
        id: 'verzamelen',
        heading: 'Wat u nu al kunt verzamelen',
        paragraphs: [
          'Bouwjaar of isolatiestappen, type afgifte, en of u volledig van het gas af wilt of een hybride stap overweegt. Hoe meer context, hoe gerichter het advies.',
          'Geschiktheid en type systeem volgen pas na beoordeling, niet vanaf deze pagina. Start bij warmtepompinstallatie of een afspraak voor advies.',
        ],
        links: [
          { label: 'Gids: warmtepomp overwegen', href: '/blog/gids-warmtepomp' },
          { label: 'Dienst: warmtepomp', href: '/warmtepomp' },
          { label: 'ISDE-subsidie (RVO)', href: 'https://www.rvo.nl/subsidies-financiering/isde', external: true },
        ],
      },
    ],
    resources: [
      officialResource('milieuCentraalWp'),
      officialResource('rvoIsde'),
    ],
  },
  {
    slug: 'onderhoudsinterval',
    title: 'Onderhoudsinterval: waarom een vast jaartal te kort door de bocht is',
    excerpt:
      'Fabrikanten, gebruik en toesteltype bepalen het ritme. Zo voorkomt u schijnzekerheid.',
    intro:
      'Sommige handleidingen noemen een interval. Dat is een startpunt, geen universele wet. Intensief gebruik of eerdere storingen kunnen een eerder bezoek rechtvaardigen.',
    category: 'onderhoud',
    tags: ['onderhoud', 'planning'],
    publishedAt: '2026-09-01',
    updatedAt: '2026-09-12',
    imageAlt: 'Onderhoudssticker of logboek bij een installatie, ter illustratie',
    relatedServiceSlugs: ['service-onderhoud'],
    relatedArticleSlugs: ['checklist-onderhoud', 'onderhoud-cv-ketel'],
    faqIds: ['onderhoud-interval', 'onderhoud-waarom'],
    sections: [
      {
        id: 'kalender',
        heading: 'Volg het toestel, niet alleen de kalender',
        paragraphs: [
          'Het toestel, het gebruik en de voorschriften van de fabrikant horen bij elkaar. Daarom geven we geen vaste termijn die voor iedereen zou gelden.',
        ],
      },
      {
        id: 'aanvraag',
        heading: 'Wat u van een onderhoudsaanvraag kunt verwachten',
        paragraphs: [
          'Bij een aanvraag voor service en onderhoud kijken we naar het toestel en, als die er is, de voorgeschiedenis. Het bezoek zelf is de plek voor een concreet advies.',
        ],
        links: [
          { label: 'Dienst: service en onderhoud', href: '/service-onderhoud' },
          { label: 'Checklist onderhoud', href: '/blog/checklist-onderhoud' },
          { label: 'Veelgestelde vragen', href: '/veelgestelde-vragen' },
        ],
      },
    ],
    resources: [officialResource('techniekNederland')],
  },
  {
    slug: 'kiezen-tussen-systemen',
    title: 'CV-ketel, airco of warmtepomp: hoe begint u de keuze?',
    excerpt:
      'Drie verschillende vragen. Een korte leidraad om de juiste dienst te openen.',
    intro:
      'Begin bij de vraag, niet bij het product. Vervanging van verwarming, koelen van één ruimte of een andere manier van verwarmen van de woning zijn drie verschillende startpunten.',
    category: 'praktische-tips',
    tags: ['advies', 'cv-ketel', 'airco', 'warmtepomp'],
    publishedAt: '2026-09-01',
    updatedAt: '2026-09-12',
    imageAlt: 'Schematische vergelijking van verwarmings- en klimaatopties, ter illustratie',
    relatedServiceSlugs: ['cv-ketel', 'airco', 'warmtepomp'],
    relatedArticleSlugs: [
      'wanneer-cv-ketel-vervangen',
      'airco-koelen-en-verwarmen',
      'warmtepomp-waar-op-letten',
    ],
    faqIds: ['algemeen-diensten', 'offerte-wat-nodig'],
    sections: [
      {
        id: 'start',
        heading: 'Kies het startpunt dat bij de vraag past',
        paragraphs: [
          'Wilt u de bestaande verwarming vervangen of herstellen? Begin bij cv-ketelinstallatie of onderhoud. Wilt u een ruimte koelen? Dan is airconditioning het logische begin. Overweegt u een andere manier van verwarmen van de hele woning? Dan hoort een warmtepompgesprek daarbij.',
        ],
      },
      {
        id: 'twijfel',
        heading: 'Als u nog twijfelt',
        paragraphs: [
          'Kies in het offerteformulier “Ik weet het nog niet” of stel de vraag via contact. Wij helpen de vraag scherp te krijgen voordat er een systeem wordt voorgesteld.',
        ],
        links: [
          { label: 'CV-ketel', href: '/cv-ketel' },
          { label: 'Airconditioning', href: '/airco' },
          { label: 'Warmtepomp', href: '/warmtepomp' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
  },
  {
    slug: 'comfort-in-huis',
    title: 'Comfort in huis: verwarmen, koelen of allebei?',
    excerpt:
      'Comfort is meer dan één apparaat. Dit helpt om de vraag scherp te krijgen.',
    intro:
      'Een woning die ’s winters koud is, vraagt iets anders dan een zolder die in augustus onbruikbaar is. Energiegebruik hangt af van isolatie, gedrag en het systeem. Dat meten we hier niet; we helpen wél de vraag te ordenen.',
    category: 'energie-comfort',
    tags: ['comfort', 'verwarmen', 'koelen'],
    publishedAt: '2026-09-12',
    updatedAt: '2026-09-12',
    imageAlt: 'Woonkamer met aandacht voor binnenklimaat, ter illustratie',
    relatedServiceSlugs: ['cv-ketel', 'airco', 'warmtepomp'],
    relatedArticleSlugs: ['kiezen-tussen-systemen', 'airco-koelen-en-verwarmen'],
    faqIds: ['algemeen-diensten', 'airco-verwarmen'],
    sections: [
      {
        id: 'vraag',
        heading: 'Benoem het probleem, niet het product',
        paragraphs: [
          'Te koud, te warm, of beide in verschillende seizoenen: dat zijn verschillende routes. Eén airconditioner lost niet automatisch het hele huis op. Een nieuwe ketel lost geen zomerse oververhitting op.',
        ],
      },
      {
        id: 'volgende-stap',
        heading: 'De volgende stap zonder overdrijven',
        paragraphs: [
          'Als het om de hele woning en de winter gaat, start u bij de cv-ketel of een warmtepompgesprek. Gaat het om één ruimte in de zomer, dan is airconditioning meestal het gesprek. Twijfelt u, gebruik dan de kennisbank of het contactformulier.',
        ],
        links: [
          { label: 'Kiezen tussen systemen', href: '/blog/kiezen-tussen-systemen' },
          { label: 'Isolatie (Milieu Centraal)', href: 'https://www.milieucentraal.nl/energie-besparen/isolatie/', external: true },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    resources: [officialResource('milieuCentraalIsolatie')],
  },
  {
    slug: 'offerte-voorbereiden',
    title: 'Zo bereidt u een offerteaanvraag voor installatiewerk voor',
    excerpt:
      'Een paar feiten over de woning maken het voorstel gerichter. Foto’s helpen, maar zijn niet verplicht.',
    intro:
      'Installatiewerk is afhankelijk van de situatie. Hoe meer u van tevoren kunt aanduiden, hoe rustiger het gesprek verloopt.',
    category: 'praktische-tips',
    tags: ['offerte', 'voorbereiding'],
    publishedAt: '2026-09-12',
    updatedAt: '2026-09-12',
    imageAlt: 'Notities en een foto van een installatie ter voorbereiding, illustratie',
    relatedServiceSlugs: ['cv-ketel', 'airco', 'warmtepomp', 'service-onderhoud'],
    relatedArticleSlugs: ['wanneer-cv-ketel-vervangen', 'kiezen-tussen-systemen'],
    faqIds: ['offerte-wat-nodig', 'offerte-prijs'],
    sections: [
      {
        id: 'noteren',
        heading: 'Wat u kunt noteren',
        paragraphs: [
          'Welke dienst het betreft, of het om nieuw, vervanging, onderhoud of een storing gaat, en wat u wilt bereiken. Type woning en of er al een ketel, airco of warmtepomp hangt, is vaak genoeg om te starten.',
        ],
      },
      {
        id: 'foto',
        heading: 'Foto’s zijn optioneel',
        paragraphs: [
          'Een foto van de bestaande ketel, de plek voor een buitenunit of de technische ruimte helpt. Zonder foto kunnen we nog steeds verder. In het offerteformulier kunt u optioneel bestanden toevoegen.',
        ],
        links: [
          { label: 'Checklist voor de installatiedag', href: '/blog/checklist-installatie' },
          { label: 'Offerte aanvragen', href: '/offerte-aanvragen' },
          { label: 'Afspraak maken', href: '/afspraak-maken' },
        ],
      },
    ],
  },
]

export const blogPosts: BlogPost[] = [...guidePosts, ...corePosts]

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getPostsByCategory(category: BlogCategorySlug): BlogPost[] {
  return blogPosts.filter((post) => post.category === category)
}

export function isBlogCategory(value: string): value is BlogCategorySlug {
  return blogCategoryOrder.includes(value as BlogCategorySlug)
}
