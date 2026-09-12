import type { ServiceRecord, ServiceSlug } from '../types'

export const services: ServiceRecord[] = [
  {
    slug: 'cv-ketel',
    name: 'CV-ketel',
    shortName: 'CV-ketel',
    navLabel: 'CV-ketel',
    href: '/cv-ketel',
    summary:
      'Installatie van een nieuwe of vervangende cv-ketel, afgestemd op de woning.',
    benefit: 'Betrouwbare warmte en warm water, vakkundig geïnstalleerd.',
    heroEyebrow: 'Centrale verwarming',
    heroTitle: 'CV-ketel installatie',
    heroText:
      'Van vervanging tot nieuwe installatie: Green Installatie Noord installeert cv-ketels en denkt mee over een passende oplossing voor uw woning.',
    explanation: [
      'Een cv-ketel verzorgt verwarming en vaak ook warm tapwater. Of het nu gaat om vervanging van een bestaande ketel of een nieuwe situatie: een goede installatie begint bij de juiste afstemming op de woning.',
      'Op deze pagina leest u wat wij doen, voor wie deze dienst bedoeld is en hoe het traject verloopt. Concrete merken, prijzen en planning volgen in het persoonlijke advies.',
    ],
    benefits: [
      {
        title: 'Duidelijk advies',
        text: 'We kijken naar de huidige situatie en wat u nodig heeft, zonder onnodige extra’s.',
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
      'Het vermogen en de opstelling hangen af van de woning en de bestaande leidingen.',
      'Merk- en typekeuze volgen in het advies, niet als vaste lijst op deze pagina.',
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
      'Installatie van airconditioning voor koelen en, waar van toepassing, verwarmen.',
    benefit: 'Een rustig binnenklimaat, afgestemd op de ruimte.',
    heroEyebrow: 'Klimaat in huis',
    heroTitle: 'Airconditioning installatie',
    heroText:
      'Green Installatie Noord installeert airconditioning. We kijken naar de ruimte, het gebruik en een nette plaatsing binnen en buiten.',
    explanation: [
      'Airconditioning kan een woning of werkruimte koelen en, afhankelijk van het systeem, ook verwarmen. Belangrijk is dat het toestel past bij de ruimte en dat binnen- en buitenunit zorgvuldig worden geplaatst.',
      'Wij helpen met advies en installatie. Welk type het beste past, hangt af van de situatie — dat bespreken we in het voortraject, zonder merken of beloftes die we hier niet kunnen onderbouwen.',
    ],
    benefits: [
      {
        title: 'Passend bij de ruimte',
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
        text: 'U krijgt een duidelijk voorstel voor de installatie.',
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
      'Het vermogen volgt de ruimte en het gebruik, niet een standaardmaat.',
      'Koelen en verwarmen zijn niet automatisch in elke situatie even zinvol.',
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
      'Advies en installatie van een warmtepomp, passend bij de woning en de vraag.',
    benefit: 'Een doordachte stap naar een andere manier van verwarmen.',
    heroEyebrow: 'Duurzame verwarming',
    heroTitle: 'Warmtepomp installatie',
    heroText:
      'Een warmtepomp vraagt om een goede beoordeling van de woning. Green Installatie Noord helpt met advies en installatie — zonder overhaaste beloftes.',
    explanation: [
      'Een warmtepomp haalt warmte uit lucht, bodem of water en kan een woning (deels) verwarmen. Of een warmtepomp past, hangt af van de woning, de afgifte en de wensen. Dat is maatwerk.',
      'Op deze pagina vindt u wat wij kunnen betekenen. Concrete geschiktheid, type systeem en investering volgen pas na een persoonlijke beoordeling.',
    ],
    benefits: [
      {
        title: 'Eerst de woning',
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
        text: 'We kijken naar de woning en de mogelijke aanpak.',
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
      'Er is geen algemene “past altijd”-conclusie op deze pagina.',
      'Combinatie met een bestaande cv-ketel is alleen aan de orde na beoordeling.',
    ],
    relatedSlugs: ['cv-ketel', 'service-onderhoud', 'airco'],
    faqIds: ['wp-past-woning', 'wp-of-cv', 'offerte-wat-nodig'],
    blogSlugs: ['gids-warmtepomp', 'warmtepomp-waar-op-letten', 'checklist-installatie'],
  },
  {
    slug: 'service-onderhoud',
    name: 'Service & onderhoud',
    shortName: 'Onderhoud',
    navLabel: 'Service & Onderhoud',
    href: '/service-onderhoud',
    summary:
      'Onderhoud en service van cv-ketels en andere klimaatinstallaties.',
    benefit: 'Tijdig onderhoud helpt storingen voorkomen en houdt de installatie in beeld.',
    heroEyebrow: 'Onderhoud & service',
    heroTitle: 'Service en onderhoud',
    heroText:
      'Green Installatie Noord verzorgt service en onderhoud van cv-ketels en andere door ons geïnstalleerde of te beoordelen klimaatinstallaties.',
    explanation: [
      'Onderhoud is bedoeld om een installatie te controleren, schoon te maken waar nodig en aandachtspunten vroeg te signaleren. Service is er voor storingen of vragen tijdens het gebruik.',
      'Hoe vaak onderhoud nodig is, hangt af van het toestel, het gebruik en de voorschriften van de fabrikant. We geven geen algemene termijnen als harde belofte; dat stemmen we af op uw situatie.',
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
      'We noemen geen vaste onderhoudstermijn als algemene belofte.',
      'Storingen beoordelen we eerst; een bezoek is geen automatische reparatiegarantie.',
    ],
    relatedSlugs: ['cv-ketel', 'airco', 'warmtepomp'],
    faqIds: ['onderhoud-waarom', 'afspraak-hoe', 'cv-wanneer-vervangen'],
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
