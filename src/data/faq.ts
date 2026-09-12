import type { FaqItem } from '../types'

export const faqCategories = [
  'Algemeen',
  'CV-ketel',
  'Airco',
  'Warmtepomp',
  'Onderhoud',
  'Offerte',
  'Afspraak',
] as const

export const faqs: FaqItem[] = [
  {
    id: 'algemeen-diensten',
    category: 'Algemeen',
    question: 'Welke diensten biedt Green Installatie Noord?',
    answer:
      'Wij richten ons op installatie van cv-ketels, airconditioning en warmtepompen, plus service en onderhoud. Andere vragen kunt u stellen via het contact- of offerteformulier; dat betekent niet automatisch dat wij die dienst uitvoeren.',
  },
  {
    id: 'algemeen-werkwijze',
    category: 'Algemeen',
    question: 'Hoe werkt een aanvraag?',
    answer:
      'U vraagt een offerte aan of plant een afspraak. Daarna volgt persoonlijk contact over de situatie. Pas daarna komt er een concreet voorstel. Reactietijden publiceren we hier niet; die volgen zodra ze vastliggen.',
  },
  {
    id: 'cv-wanneer-vervangen',
    category: 'CV-ketel',
    relatedServiceSlug: 'cv-ketel',
    question: 'Wanneer is het verstandig om een cv-ketel te laten bekijken?',
    answer:
      'Laat de ketel beoordelen bij herhaalde storingen, zichtbare slijtage, twijfel over veiligheid of als u vervanging overweegt. Of vervanging nodig is, hangt af van de staat van het toestel — dat beoordelen we ter plaatse of in overleg.',
  },
  {
    id: 'cv-offerte',
    category: 'CV-ketel',
    relatedServiceSlug: 'cv-ketel',
    question: 'Wat heb ik nodig voor een cv-offerte?',
    answer:
      'Een korte omschrijving van de huidige situatie helpt: type woning, of het om vervanging gaat en wat u wilt bereiken. Foto’s van de opstelling zijn welkom, maar niet verplicht.',
  },
  {
    id: 'airco-verwarmen',
    category: 'Airco',
    relatedServiceSlug: 'airco',
    question: 'Kan airconditioning ook verwarmen?',
    answer:
      'Veel systemen kunnen koelen én verwarmen. Of dat in uw situatie zinvol is, hangt af van het toestel, de ruimte en hoe u de woning verder verwarmt. Dat bespreken we in het advies.',
  },
  {
    id: 'airco-plaatsing',
    category: 'Airco',
    relatedServiceSlug: 'airco',
    question: 'Waar moet ik op letten bij plaatsing?',
    answer:
      'Binnenunit, buitenunit, leidingweg, condensafvoer en bereikbaarheid zijn belangrijke punten. Elke woning is anders; daarom kijken we eerst naar de ruimte voordat we een voorstel doen.',
  },
  {
    id: 'wp-past-woning',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Past een warmtepomp bij elke woning?',
    answer:
      'Nee. Isolatie, afgiftesysteem, beschikbare ruimte en de huidige installatie spelen mee. Een warmtepomp is maatwerk. We doen hier geen algemene geschiktheidsclaim.',
  },
  {
    id: 'wp-of-cv',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Kan een warmtepomp samen met een cv-ketel?',
    answer:
      'In sommige situaties is een combinatie mogelijk. Of dat past, beoordelen we per woning. Vraag daarvoor een adviesgesprek of offerte aan.',
  },
  {
    id: 'onderhoud-waarom',
    category: 'Onderhoud',
    relatedServiceSlug: 'service-onderhoud',
    question: 'Waarom is onderhoud van een cv-ketel belangrijk?',
    answer:
      'Onderhoud is bedoeld om de installatie te controleren, aandachtspunten vroeg te zien en veilig gebruik te ondersteunen. De precieze werkzaamheden hangen af van het toestel en de staat ervan.',
  },
  {
    id: 'onderhoud-interval',
    category: 'Onderhoud',
    relatedServiceSlug: 'service-onderhoud',
    question: 'Hoe vaak is onderhoud nodig?',
    answer:
      'Dat verschilt per toestel, gebruik en fabrikantvoorschrift. We noemen hier geen vaste termijn. Bij een aanvraag geven we advies dat bij uw situatie past.',
  },
  {
    id: 'offerte-wat-nodig',
    category: 'Offerte',
    question: 'Wat gebeurt er na een offerteaanvraag?',
    answer:
      'Uw aanvraag komt binnen via het formulier. Daarna nemen we contact op om de vraag scherp te krijgen. Een offerte is een voorstel, geen automatische opdracht.',
  },
  {
    id: 'offerte-prijs',
    category: 'Offerte',
    question: 'Waarom staan er geen prijzen op de website?',
    answer:
      'Installatiewerk is afhankelijk van de woning, het toestel en de werkzaamheden. Daarom werken we met een persoonlijke offerte in plaats van vaste websiteprijzen.',
  },
  {
    id: 'afspraak-hoe',
    category: 'Afspraak',
    question: 'Kan ik direct een tijdstip vastleggen?',
    answer:
      'De agenda-integratie wordt nog gekoppeld. U kunt nu een voorkeursdatum en -dagdeel doorgeven. Een afspraak is pas definitief na bevestiging door Green Installatie Noord.',
  },
  {
    id: 'co-veiligheid',
    category: 'CV-ketel',
    relatedServiceSlug: 'cv-ketel',
    question: 'Wat moet ik doen bij twijfel over koolmonoxide?',
    answer:
      'Koolmonoxide is reukloos. Officiële uitleg staat bij de Rijksoverheid. Bij acute klachten of een CO-alarm: volg dat advies en schakel hulpdiensten in. Voor een niet-spoedeisende beoordeling van de ketel kunt u contact of een afspraak aanvragen. Wij publiceren geen eigen medische of meetclaims.',
  },
  {
    id: 'airco-onderhoud',
    category: 'Airco',
    relatedServiceSlug: 'airco',
    question: 'Wat kan ik zelf doen aan onderhoud van de airco?',
    answer:
      'Filters en vrije ruimte rond binnen- en buitenunit kunt u volgens de handleiding bijhouden. Werk aan koudemiddel is gereguleerd en hoort bij een bevoegde vakman. Zie de airco-onderhoudgids voor het onderscheid.',
  },
  {
    id: 'installatie-voorbereiden',
    category: 'Algemeen',
    question: 'Hoe bereid ik een installatie of onderhoudsbezoek voor?',
    answer:
      'Maak de opstelling bereikbaar, noteer wat u merkt, en zet vragen over scope en planning op papier. Foto’s helpen. Checklists staan in de kennisbank; ze zijn geen toelatingseis.',
  },
  {
    id: 'afspraak-annuleren',
    category: 'Afspraak',
    question: 'Hoe wijzig ik een afspraak?',
    answer:
      'Neem contact op via het contactformulier of, zodra bekend, telefonisch. Noem uw naam en het gewenste moment.',
  },
]

export function getFaqsByIds(ids: string[]): FaqItem[] {
  return ids
    .map((id) => faqs.find((item) => item.id === id))
    .filter((item): item is FaqItem => Boolean(item))
}
