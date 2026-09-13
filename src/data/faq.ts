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

export type FaqCategoryName = (typeof faqCategories)[number]

/** How many questions to show per category on the “Alle” overview. */
export const faqPreviewLimits: Record<FaqCategoryName, number> = {
  Algemeen: 3,
  'CV-ketel': 3,
  Airco: 3,
  Warmtepomp: 5,
  Onderhoud: 3,
  Offerte: 2,
  Afspraak: 2,
}

export const faqs: FaqItem[] = [
  {
    id: 'algemeen-diensten',
    category: 'Algemeen',
    question: 'Welke diensten biedt Green Installatie Noord?',
    answer:
      'Wij installeren cv-ketels, airconditioning en warmtepompen, en verzorgen service en onderhoud. Andere vragen kunt u stellen via contact of het offerteformulier; dat betekent niet automatisch dat wij die dienst uitvoeren.',
  },
  {
    id: 'algemeen-werkwijze',
    category: 'Algemeen',
    question: 'Hoe werkt een aanvraag?',
    answer:
      'U vraagt een offerte of een voorkeursmoment voor een afspraak aan. Daarna volgt persoonlijk contact over uw situatie. Pas daarna komt er een concreet voorstel — zonder standaardpakket. Een website-aanvraag is nog geen bevestigde afspraak of opdracht.',
  },
  {
    id: 'installatie-voorbereiden',
    category: 'Algemeen',
    question: 'Hoe bereid ik een installatie of onderhoudsbezoek voor?',
    answer:
      'Maak de opstelling bereikbaar, noteer wat u merkt, en zet vragen over scope en planning klaar. Foto’s helpen bij een snelle inschatting. Bij Advies & kennis staan praktische checklists.',
    sources: [{ label: 'Advies & kennis', href: '/blog' }],
  },
  {
    id: 'cv-wanneer-vervangen',
    category: 'CV-ketel',
    relatedServiceSlug: 'cv-ketel',
    question: 'Wanneer is het verstandig om een cv-ketel te laten bekijken?',
    answer:
      'Laat de ketel beoordelen bij herhaalde storingen, zichtbare slijtage, twijfel over veiligheid of als u vervanging overweegt. Of vervanging nodig is, hangt af van de staat van het toestel. Dat beoordelen we ter plaatse of in overleg.',
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
    id: 'co-veiligheid',
    category: 'CV-ketel',
    relatedServiceSlug: 'cv-ketel',
    question: 'Wat moet ik doen bij twijfel over koolmonoxide?',
    answer:
      'Koolmonoxide is reukloos en gevaarlijk. Bij een CO-alarm, acute klachten of ernstige twijfel: verlaat de ruimte indien veilig, volg het officiële advies van de Rijksoverheid en schakel hulpdiensten in bij spoed. Voor een beoordeling van de ketel buiten spoedsituaties kunt u contact of een afspraak aanvragen — probeer geen eigen reparatie aan gasapparatuur.',
    sources: [
      {
        label: 'Rijksoverheid over koolmonoxide',
        href: 'https://www.rijksoverheid.nl/onderwerpen/koolmonoxide',
        external: true,
      },
    ],
  },
  {
    id: 'airco-verwarmen',
    category: 'Airco',
    relatedServiceSlug: 'airco',
    question: 'Kan airconditioning ook verwarmen?',
    answer:
      'Ja. De airco’s die wij plaatsen, kunnen koelen én verwarmen. Of de airco in uw situatie de hoofdverwarming is of vooral voor comfort per ruimte, hangt af van de woning en hoe de rest wordt verwarmd. Dat bespreken we in het advies.',
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
    id: 'airco-onderhoud',
    category: 'Airco',
    relatedServiceSlug: 'airco',
    question: 'Wat kan ik zelf doen aan onderhoud van de airco?',
    answer:
      'Filters en vrije ruimte rond binnen- en buitenunit kunt u volgens de handleiding bijhouden. Werk aan koudemiddel is gereguleerd en hoort bij een bevoegde vakman. Zie Advies & kennis voor het onderscheid tussen zelf doen en vakwerk.',
    sources: [{ label: 'Advies & kennis', href: '/blog' }],
  },
  {
    id: 'wp-past-woning',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Past een warmtepomp bij elke woning?',
    answer:
      'Nee. Isolatie, afgiftesysteem, beschikbare ruimte en de huidige installatie spelen mee. Of een warmtepomp past, beoordelen we per woning — niet op basis van een algemene checklist alleen.',
  },
  {
    id: 'wp-of-cv',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Kan een warmtepomp samen met een cv-ketel?',
    answer:
      'In sommige situaties is een hybride combinatie mogelijk. Of dat past, beoordelen we per woning. Vraag daarvoor een adviesgesprek of offerte aan.',
  },
  {
    id: 'wp-hybride-all-electric',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Wat is het verschil tussen hybride en all-electric?',
    answer:
      'Hybride werkt samen met de cv-ketel en verlaagt vooral het gasverbruik voor verwarming. All-electric laat de warmtepomp de ruimteverwarming (en vaak ook warm water) verzorgen. Welke oplossing past, hangt onder meer af van isolatie, afgifte en de woning.',
  },
  {
    id: 'wp-stroomverbruik',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Hoeveel stroom gebruikt een warmtepomp?',
    answer:
      'Dat hangt af van het warmteverbruik, het seizoensrendement (SCOP) en of u hybride of all-electric kiest. Op de warmtepomppagina vindt u een indicatie op basis van uw gasverbruik; de werkelijke waarden volgen na beoordeling van uw situatie.',
    sources: [{ label: 'Warmtepompindicatie', href: '/warmtepomp#besparing' }],
  },
  {
    id: 'wp-subsidie',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Hoeveel subsidie kan ik krijgen?',
    answer:
      'Voor veel warmtepompen is ISDE-subsidie beschikbaar. Het bedrag verschilt per type en RVO-meldcode. Bij een concreet voorstel controleren we welk bedrag voor de gekozen warmtepomp geldt. We garanderen geen toekenning.',
  },
  {
    id: 'wp-vermogen',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Hoe wordt bepaald welk vermogen ik nodig heb?',
    answer:
      'Vermogen hangt af van warmteverlies, afgifte, warmwatervraag en gebruik. Dat bepalen we niet alleen op basis van gasverbruik of woningtype, maar na beoordeling van de situatie.',
  },
  {
    id: 'wp-vorst',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Werkt een warmtepomp ook bij vorst?',
    answer:
      'Ja, moderne warmtepompen blijven bij lage temperaturen werken, al daalt het rendement. Bij hybride kan de cv-ketel bijspringen. Exacte grenzen hangen af van het gekozen systeem.',
  },
  {
    id: 'wp-radiatoren',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Kan een warmtepomp met bestaande radiatoren?',
    answer:
      'Soms wel, vooral bij hybride of als de radiatoren voldoende afgifte hebben. Lage-temperatuurverwarming maakt all-electric vaak makkelijker. We beoordelen afgifte per woning.',
  },
  {
    id: 'wp-installatieduur',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Hoe lang duurt een installatie?',
    answer:
      'Dat verschilt per woning, type systeem en voorbereiding. In het voorstel geven we een realistische planning; vaste doorlooptijden op de website beloven we niet.',
  },
  {
    id: 'wp-onderhoud',
    category: 'Warmtepomp',
    relatedServiceSlug: 'warmtepomp',
    question: 'Heeft een warmtepomp onderhoud nodig?',
    answer:
      'Ja. Periodieke controle houdt de installatie in beeld. Via service & onderhoud kunt u een abonnement of een eenmalige afspraak aanvragen. Bij storing is de storingsdienst 24/7 bereikbaar.',
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
    question: 'Hoe vaak vindt onderhoud plaats?',
    answer:
      'Bij onze onderhoudspakketten is de standaardfrequentie eens per twee jaar. Liever elk jaar? Dan is jaarlijks onderhoud mogelijk voor €4,50 per maand extra.',
  },
  {
    id: 'onderhoud-jaarlijks',
    category: 'Onderhoud',
    relatedServiceSlug: 'service-onderhoud',
    question: 'Wat kost jaarlijks onderhoud extra?',
    answer:
      'Jaarlijks onderhoud kost €4,50 per maand bovenop het gekozen pakket (Basis, Comfort of All-in).',
  },
  {
    id: 'onderhoud-storing',
    category: 'Onderhoud',
    relatedServiceSlug: 'service-onderhoud',
    question: 'Hoe neem ik contact op bij een storing?',
    answer:
      'Onze 24/7 storingsdienst is bereikbaar via 050 569 0997. Bel bij een storing en we kijken met u mee wat de vervolgstap is. Reguliere openingstijden voor offertes en afspraken zijn ma–vr 07:00–17:00.',
  },
  {
    id: 'offerte-wat-nodig',
    category: 'Offerte',
    question: 'Wat gebeurt er na een offerteaanvraag?',
    answer:
      'Uw aanvraag komt binnen via het formulier. Daarna nemen we contact op om de vraag scherp te krijgen. Vervolgens volgt een voorstel dat u rustig kunt bekijken.',
  },
  {
    id: 'offerte-prijs',
    category: 'Offerte',
    question: 'Waarom staan er geen prijzen op de website?',
    answer:
      'Installatiewerk hangt af van de woning, het toestel en de werkzaamheden. Daarom werken we met een persoonlijke offerte in plaats van vaste websiteprijzen.',
  },
  {
    id: 'afspraak-hoe',
    category: 'Afspraak',
    question: 'Kan ik direct een tijdstip vastleggen?',
    answer:
      'U kunt een voorkeursdatum en tijdsvenster doorgeven. Een afspraak is pas definitief na bevestiging door Green Installatie Noord. Zo plannen we realistisch rond beschikbaarheid en de aard van het bezoek.',
  },
  {
    id: 'afspraak-annuleren',
    category: 'Afspraak',
    question: 'Hoe wijzig ik een afspraak?',
    answer:
      'Neem contact op via het contactformulier of bel 050 569 0997. Noem uw naam en het gewenste moment, dan kijken we wat mogelijk is.',
  },
]

export function getFaqsByIds(ids: string[]): FaqItem[] {
  return ids
    .map((id) => faqs.find((item) => item.id === id))
    .filter((item): item is FaqItem => Boolean(item))
}

export function faqCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = { Alle: faqs.length }
  for (const name of faqCategories) {
    counts[name] = faqs.filter((item) => item.category === name).length
  }
  return counts
}

export function filterFaqs(query: string, category: string): FaqItem[] {
  const needle = query.trim().toLowerCase()
  return faqs.filter((item) => {
    const matchCategory = category === 'Alle' || item.category === category
    if (!matchCategory) return false
    if (!needle) return true
    const haystack =
      `${item.question} ${item.answer} ${item.category}`.toLowerCase()
    return haystack.includes(needle)
  })
}
