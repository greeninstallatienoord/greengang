import type { ServiceRecord, ServiceSlug } from '../types'

export const services: ServiceRecord[] = [
  {
    slug: 'cv-ketel',
    name: 'CV-ketel',
    shortName: 'CV-ketel',
    navLabel: 'CV-ketel',
    href: '/cv-ketel',
    summary:
      'Nieuwe cv-ketel of vervanging van een bestaande ketel, inclusief advies over de juiste opstelling.',
    benefit: 'Betrouwbare warmte en warm water, vakkundig geïnstalleerd.',
    heroEyebrow: 'Centrale verwarming',
    heroTitle: 'CV-ketel installatie',
    heroText:
      'Van vervanging tot nieuwe installatie: Green Installatie Noord plaatst cv-ketels en denkt mee over wat bij uw woning past.',
    explanation: [
      'Een cv-ketel verzorgt verwarming en vaak ook warm tapwater. Of het om vervanging of een nieuwe situatie gaat: de installatie moet goed aansluiten op uw woning.',
      'Hier leest u wat wij doen en hoe het traject verloopt. Merk, type en planning bespreken we in het persoonlijke advies.',
    ],
    benefits: [
      {
        title: 'Duidelijk advies',
        text: 'We bekijken de huidige ketel of situatie en wat u nodig heeft.',
      },
      {
        title: 'Nette installatie',
        text: 'De ketel wordt zorgvuldig geplaatst en aangesloten, met aandacht voor veiligheid en afwerking.',
      },
      {
        title: 'Vervolgbaar onderhoud',
        text: 'Na plaatsing kunt u terecht voor service en onderhoud van de installatie.',
      },
    ],
    suitableFor: [
      'Woningeigenaren met een bestaande ketel die vervangen moet worden',
      'Situaties waarin de huidige ketel storingen geeft of het einde van de levensduur nadert',
      'Wie eerst advies wil voordat er een keuze wordt gemaakt',
    ],
    process: [
      {
        title: 'Aanvraag',
        text: 'U geeft aan of het om vervanging, een nieuwe installatie of een vraag gaat.',
      },
      {
        title: 'Beoordeling',
        text: 'We bespreken de situatie en wat daarvoor nodig is.',
      },
      {
        title: 'Offerte',
        text: 'U ontvangt een voorstel dat u rustig kunt bekijken.',
      },
      {
        title: 'Plaatsing',
        text: 'Na akkoord plannen we de installatie.',
      },
    ],
    helpItems: [
      'Advies over vervanging of nieuwe plaatsing',
      'Installatie van de cv-ketel',
      'Aansluiting op de bestaande situatie waar dat mogelijk is',
      'Uitleg over gebruik en vervolgstappen',
    ],
    technicalNotes: [
      'Het vermogen en de opstelling hangen af van uw woning en de bestaande leidingen.',
      'Merk en type kiezen we samen in het advies.',
      'Rookgasafvoer, condensafvoer en ventilatie moeten bij de situatie passen.',
    ],
    relatedSlugs: ['service-onderhoud', 'warmtepomp', 'airco'],
    faqIds: ['cv-wanneer-vervangen', 'cv-offerte', 'co-veiligheid'],
    blogSlugs: ['gids-cv-ketel', 'wanneer-cv-ketel-vervangen', 'checklist-installatie'],
  },
  {
    slug: 'airco',
    name: 'Airconditioning',
    shortName: 'Airco',
    navLabel: 'Airco',
    href: '/airco',
    summary:
      'Airconditioning voor koelen en, waar dat past, bijverwarmen in huis of op kantoor.',
    benefit: 'Een aangenamer binnenklimaat in de ruimte die u wilt verbeteren.',
    heroEyebrow: 'Klimaat in huis',
    heroTitle: 'Airconditioning installatie',
    heroText:
      'Green Installatie Noord installeert airconditioning. We kijken naar de ruimte, het gebruik en een nette plaatsing binnen en buiten.',
    explanation: [
      'Airconditioning kan een woning of werkruimte koelen en, afhankelijk van het systeem, ook verwarmen. Belangrijk is dat het toestel past bij de ruimte en dat binnen- en buitenunit zorgvuldig worden geplaatst.',
      'Welk type het beste past, hangt af van uw situatie. Dat bespreken we in het voortraject, voordat er een voorstel komt.',
    ],
    benefits: [
      {
        title: 'Gericht op de ruimte',
        text: 'We kijken naar de ruimte en het gewenste gebruik voordat we een voorstel doen.',
      },
      {
        title: 'Zorgvuldige plaatsing',
        text: 'Binnen- en buitenunit worden netjes geplaatst, met aandacht voor leidingwerk en afwerking.',
      },
      {
        title: 'Koelen én verwarmen',
        text: 'Veel systemen kunnen beide. Of dat in uw geval zinvol is, bespreken we per situatie.',
      },
    ],
    suitableFor: [
      'Woningen of ruimtes die in de zomer te warm worden',
      'Wie één of meerdere ruimtes gericht wil koelen of bijverwarmen',
      'Wie eerst wil weten wat er technisch mogelijk is',
    ],
    process: [
      {
        title: 'Aanvraag',
        text: 'U beschrijft de ruimte en wat u wilt bereiken.',
      },
      {
        title: 'Advies',
        text: 'We kijken naar plaatsing, mogelijkheden en aandachtspunten.',
      },
      {
        title: 'Offerte',
        text: 'U krijgt een overzichtelijk voorstel voor de installatie.',
      },
      {
        title: 'Montage',
        text: 'Na akkoord plannen we de werkzaamheden.',
      },
    ],
    helpItems: [
      'Advies over airconditioning per ruimte',
      'Installatie van binnen- en buitenunit',
      'Net leidingwerk en afwerking',
      'Uitleg over bediening na plaatsing',
    ],
    technicalNotes: [
      'Binnenunit, buitenunit, leidingweg en condensafvoer bepalen of plaatsing netjes mogelijk is.',
      'Het vermogen volgt de ruimte en het gebruik.',
      'Koelen en verwarmen zijn niet in elke situatie even zinvol; dat bespreken we vooraf.',
    ],
    relatedSlugs: ['warmtepomp', 'cv-ketel', 'service-onderhoud'],
    faqIds: ['airco-verwarmen', 'airco-plaatsing', 'airco-onderhoud'],
    blogSlugs: ['gids-airco-onderhoud', 'airco-koelen-en-verwarmen', 'checklist-installatie'],
  },
  {
    slug: 'warmtepomp',
    name: 'Warmtepomp',
    shortName: 'Warmtepomp',
    navLabel: 'Warmtepomp',
    href: '/warmtepomp',
    summary:
      'Advies en installatie van een warmtepomp, na beoordeling van woning en huidige installatie.',
    benefit: 'Een doordachte stap naar een andere manier van verwarmen.',
    heroEyebrow: 'Duurzame verwarming',
    heroTitle: 'Warmtepomp installatie',
    heroText:
      'Een warmtepomp vraagt om een goede beoordeling van de woning. Green Installatie Noord helpt met advies en, als het past, met de installatie.',
    explanation: [
      'Een warmtepomp haalt warmte uit lucht, bodem of water en kan een woning (deels) verwarmen. Of een warmtepomp past, hangt af van isolatie, afgifte, ruimte en uw wensen.',
      'Op deze pagina vindt u wat wij kunnen betekenen. Type systeem en investering volgen na een persoonlijke beoordeling.',
    ],
    benefits: [
      {
        title: 'Eerst beoordelen',
        text: 'We kijken of een warmtepomp logisch is voordat er een keuze wordt gemaakt.',
      },
      {
        title: 'Heldere uitleg',
        text: 'U hoort wat er bij komt kijken, inclusief aandachtspunten.',
      },
      {
        title: 'Installatie na akkoord',
        text: 'Als het past, verzorgen wij de installatie volgens het afgesproken voorstel.',
      },
    ],
    suitableFor: [
      'Woningeigenaren die een warmtepomp overwegen',
      'Situaties naast of in plaats van een bestaande cv-ketel',
      'Wie eerst wil toetsen of de woning daarvoor geschikt is',
    ],
    process: [
      {
        title: 'Aanvraag',
        text: 'U geeft aan wat u overweegt en wat de huidige situatie is.',
      },
      {
        title: 'Beoordeling',
        text: 'We bekijken uw woning en de mogelijke aanpak.',
      },
      {
        title: 'Voorstel',
        text: 'U ontvangt een offerte of een advies over de vervolgstap.',
      },
      {
        title: 'Installatie',
        text: 'Na akkoord plannen we de werkzaamheden.',
      },
    ],
    helpItems: [
      'Advies of een warmtepomp past bij de situatie',
      'Installatie van het afgesproken systeem',
      'Afstemming op de bestaande installatie waar mogelijk',
      'Uitleg over gebruik en onderhoud',
    ],
    technicalNotes: [
      'Isolatie, afgiftesysteem en beschikbare ruimte bepalen of een warmtepomp past.',
      'Geschiktheid beoordelen we per woning, niet met een algemene regel.',
      'Combinatie met een bestaande cv-ketel is alleen aan de orde na beoordeling.',
    ],
    relatedSlugs: ['cv-ketel', 'service-onderhoud', 'airco'],
    faqIds: [
      'wp-past-woning',
      'wp-hybride-all-electric',
      'wp-of-cv',
      'wp-stroomverbruik',
      'wp-subsidie',
      'wp-vermogen',
      'wp-vorst',
      'wp-radiatoren',
      'wp-installatieduur',
      'wp-onderhoud',
    ],
    blogSlugs: ['gids-warmtepomp', 'warmtepomp-waar-op-letten', 'checklist-installatie'],
  },
  {
    slug: 'service-onderhoud',
    name: 'Service & onderhoud',
    shortName: 'Onderhoud',
    navLabel: 'Service & Onderhoud',
    href: '/service-onderhoud',
    summary:
      'Onderhoud, service en 24/7 storingsdienst voor klimaatinstallaties.',
    benefit: 'Tijdig onderhoud helpt storingen voorkomen en houdt de installatie in beeld.',
    heroEyebrow: 'Service & onderhoud',
    heroTitle: 'Service en onderhoud',
    heroText:
      'Periodiek onderhoud duidelijk geregeld. Kies een pakket en bepaal zelf of u onderhoud eens per twee jaar of jaarlijks wilt.',
    explanation: [
      'Met een onderhoudspakket blijft periodiek onderhoud overzichtelijk. Standaard plannen we onderhoud eens per twee jaar. Liever ieder jaar? Dat kan voor €4,50 per maand extra.',
      'De exacte dekking per pakket bespreken we bij de aanvraag. Bij storing is onze storingsdienst 24/7 bereikbaar.',
    ],
    benefits: [
      {
        title: 'Planbaar onderhoud',
        text: 'U kunt onderhoud aanvragen wanneer het nodig is of wanneer u een controle wilt.',
      },
      {
        title: 'Service bij storing',
        text: 'Bij een storing kunt u contact opnemen voor beoordeling en vervolgstappen.',
      },
      {
        title: 'Eén aanspreekpunt',
        text: 'Installatie en onderhoud komen samen bij hetzelfde team.',
      },
    ],
    suitableFor: [
      'Eigenaren van een cv-ketel die onderhoud willen laten uitvoeren',
      'Wie een storing ervaart of twijfelt over de werking',
      'Klanten die na installatie nazorg zoeken',
    ],
    process: [
      {
        title: 'Melding',
        text: 'U geeft aan of het om onderhoud, een storing of een vraag gaat.',
      },
      {
        title: 'Afspraak',
        text: 'We plannen een moment dat past, zodra de agenda bekend is.',
      },
      {
        title: 'Uitvoering',
        text: 'De monteur voert de werkzaamheden uit en licht toe wat er is gedaan.',
      },
      {
        title: 'Vervolg',
        text: 'Als er meer nodig is, hoort u dat helder.',
      },
    ],
    helpItems: [
      'Onderhoud van cv-ketels',
      'Service bij storingen',
      'Controle van de installatie',
      'Advies over vervanging als onderhoud niet meer logisch is',
    ],
    technicalNotes: [
      'Welke controles nodig zijn, hangt af van het toestel en de staat ervan.',
      'Het onderhoudsinterval volgt het toestel, het gebruik en de fabrikantvoorschriften.',
      'Bij een storing beoordelen we eerst de oorzaak en bespreken we de vervolgstappen.',
    ],
    relatedSlugs: ['cv-ketel', 'airco', 'warmtepomp'],
    faqIds: [
      'onderhoud-interval',
      'onderhoud-jaarlijks',
      'onderhoud-storing',
      'onderhoud-waarom',
    ],
    blogSlugs: ['checklist-onderhoud', 'gids-airco-onderhoud', 'onderhoud-cv-ketel'],
  },
]

export function getService(slug: ServiceSlug): ServiceRecord {
  const service = services.find((item) => item.slug === slug)
  if (!service) {
    throw new Error(`Unknown service: ${slug}`)
  }
  return service
}

export function getServicesBySlug(slugs: ServiceSlug[]): ServiceRecord[] {
  return slugs.map((slug) => getService(slug))
}
