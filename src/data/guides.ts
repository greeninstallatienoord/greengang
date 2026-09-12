import { officialSources } from './citations'
import type { BlogPost, ContentLink } from '../types'

function resource(source: { label: string; url: string }): ContentLink {
  return { label: source.label, href: source.url, external: true }
}

export const featuredGuideSlugs = [
  'gids-cv-ketel',
  'gids-warmtepomp',
  'checklist-onderhoud',
] as const

export const guidePosts: BlogPost[] = [
  {
    slug: 'gids-cv-ketel',
    title: 'Gids: cv-ketel in huis begrijpen, beoordelen en vervangen',
    excerpt:
      'Wat een cv-ketel doet, welke signalen een beoordeling zinvol maken, en hoe u een gesprek over vervanging voorbereidt, zonder standaardleeftijd of prijs.',
    intro:
      'Een cv-ketel verwarmt het huis en levert vaak ook warm tapwater. Of onderhoud, reparatie of vervanging logisch is, hangt af van de staat van het toestel en de woning, niet van een vast jaartal op internet. Deze gids helpt u de situatie te ordenen voordat u een installateur belt.',
    category: 'cv-ketel',
    tags: ['cv-ketel', 'gids', 'veiligheid', 'vervanging'],
    publishedAt: '2026-09-12',
    updatedAt: '2026-09-12',
    imageAlt: 'Cv-ketel in een technische ruimte, ter illustratie van deze gids',
    relatedServiceSlugs: ['cv-ketel', 'service-onderhoud'],
    relatedArticleSlugs: [
      'wanneer-cv-ketel-vervangen',
      'onderhoud-cv-ketel',
      'checklist-installatie',
    ],
    faqIds: ['cv-wanneer-vervangen', 'cv-offerte', 'co-veiligheid'],
    resources: [
      resource(officialSources.rijksoverheidCo),
      resource(officialSources.techniekNederland),
    ],
    sections: [
      {
        id: 'werking',
        heading: 'Wat een cv-ketel in de praktijk doet',
        paragraphs: [
          'De ketel verwarmt water voor radiatoren of vloerverwarming. Bij combiketels gaat een deel van de warmte naar de kraan. Hoe goed dat voelt, hangt af van het vermogen, de afgifte in huis en of de ketel nog stabiel werkt.',
          'U hoeft het merklabel niet te ontcijferen om te starten. Noteer wel wat u merkt: geluid, drukverlies, wisselend warm water, of een foutcode op het display. Dat is nuttiger dan een algemene levensduurclaim.',
        ],
      },
      {
        id: 'signalen',
        heading: 'Signalen dat een beoordeling zinvol is',
        paragraphs: [
          'Terugkerende storingen, zichtbare lekkage of roest, een ketel die vaak opnieuw opstart, of twijfel over rookgasafvoer: dat zijn redenen om te laten kijken. Ook als u toch al nadenkt over een andere manier van verwarmen, is een nuchtere opname beter dan zelf een type kiezen.',
          'Een beoordeling is geen opdracht tot vervanging. Soms is onderhoud of een gerichte reparatie voldoende. Soms is vervangen logischer. Dat onderscheid hoort u pas na het gesprek of het bezoek.',
        ],
        links: [
          { label: 'Dienst: cv-ketel installatie', href: '/cv-ketel' },
          { label: 'Dienst: service en onderhoud', href: '/service-onderhoud' },
        ],
      },
      {
        id: 'veiligheid',
        heading: 'Veiligheid: koolmonoxide is geen marketingonderwerp',
        paragraphs: [
          'Koolmonoxide is reukloos. Officiële uitleg over risico’s, melders en wat u kunt doen, staat bij de Rijksoverheid. Wij gebruiken die pagina als bron, niet als verkooppraatje.',
          'Twijfelt u over veiligheid, rookgas of een CO-melder? Zet dat bovenaan in uw bericht. Een offerteformulier is niet de plek voor een spoed-noodgeval; bel dan de hulpdiensten en daarna een vakman.',
        ],
        links: [
          {
            label: officialSources.rijksoverheidCo.label,
            href: officialSources.rijksoverheidCo.url,
            external: true,
          },
        ],
      },
      {
        id: 'voorbereiden',
        heading: 'Zo bereidt u het gesprek voor',
        paragraphs: [
          'Schrijf op: type woning, of het om vervanging gaat, wat u wilt verbeteren, en of er recent onderhoud is geweest. Een foto van de ketel en de rookgasafvoer helpt, maar is niet verplicht.',
          'Vraag in het gesprek wat er wél en niet in het voorstel zit: toestel, demontage, afvoer, inregeling, en wat later onderhoud vraagt. Zonder die opsomming vergelijkt u appels met peren.',
        ],
        links: [
          { label: 'Checklist voor installatie', href: '/blog/checklist-installatie' },
          { label: 'Offerte aanvragen', href: '/offerte-aanvragen?dienst=cv-ketel' },
        ],
      },
    ],
  },
  {
    slug: 'gids-airco-onderhoud',
    title: 'Gids: airco onderhouden zonder het toestel te forceren',
    excerpt:
      'Wat u zelf kunt bijhouden aan filters en vrije ruimte, wat bij een vakman hoort, en waarom koudemiddelwerk geen doe-het-zelfklus is.',
    intro:
      'Airconditioning blijft schoner en rustiger werken als filters en de buitenunit niet verstopt raken. Dat is geen garantie op “nooit meer storing”. Deze gids scheidt huishoudelijk onderhoud van werk dat bij een vakman hoort, vooral als het om koudemiddel gaat.',
    category: 'onderhoud',
    tags: ['airco', 'onderhoud', 'filters', 'koudemiddel'],
    publishedAt: '2026-09-12',
    updatedAt: '2026-09-12',
    imageAlt: 'Binnenunit van een airconditioner, ter illustratie van onderhoud',
    relatedServiceSlugs: ['airco', 'service-onderhoud'],
    relatedArticleSlugs: ['airco-koelen-en-verwarmen', 'checklist-onderhoud'],
    faqIds: ['airco-onderhoud', 'airco-plaatsing', 'onderhoud-waarom'],
    resources: [
      resource(officialSources.iltFgassen),
      resource(officialSources.techniekNederland),
    ],
    sections: [
      {
        id: 'thuis',
        heading: 'Wat u zelf kunt bijhouden',
        paragraphs: [
          'Volg de handleiding van het toestel voor het reinigen of vervangen van filters. Een verstopt filter geeft minder lucht, meer geluid en soms een storing. Maak de omgeving van de binnenunit stofvrij en houd de uitblaas vrij.',
          'Buiten: houd bladeren, sneeuw en opslag weg van de unit. Blokkeer de uitblaas niet. Spuit niet met hoge druk in de lamellen; dat kan schade geven. Zie iets dat lekt, ijsvorming of een vreemde geur: stop met experimenteren en laat het beoordelen.',
        ],
      },
      {
        id: 'koudemiddel',
        heading: 'Koudemiddel en F-gassen: geen huis-tuin-en-keukenklus',
        paragraphs: [
          'Bijvullen, aftappen of openen van het koudemiddelcircuit is gereguleerd werk. De Inspectie Leefomgeving en Transport legt uit hoe F-gassen wettelijk zijn omkaderd. Die regels bestaan om mens en milieu te beschermen, niet om een extra product te verkopen.',
          'Wij publiceren hier geen STEK- of certificeringsclaim. Wel: laat koudemiddelwerk over aan iemand die daarvoor bevoegd is. Vraag gerust welke handelingen tijdens een servicebezoek wél en niet gebeuren.',
        ],
        links: [
          {
            label: officialSources.iltFgassen.label,
            href: officialSources.iltFgassen.url,
            external: true,
          },
        ],
      },
      {
        id: 'service',
        heading: 'Wanneer een servicebezoek logisch is',
        paragraphs: [
          'Minder koelvermogen, water dat niet goed wegloopt, ijs op de unit, of een toestel dat steeds uitvalt: dat zijn servicevragen. Noteer het merk, het typeplaatje als u erbij kunt, en wat u al zelf heeft gedaan (bijvoorbeeld filter schoonmaken).',
          'Plaatsing en onderhoud hangen samen. Een lastige buitenunit of een korte leidingweg die u destijds koos, beïnvloedt later het onderhoud. Daarom eerst de situatie, dan het voorstel.',
        ],
        links: [
          { label: 'Dienst: airconditioning', href: '/airco' },
          { label: 'Afspraak maken voor onderhoud', href: '/afspraak-maken?dienst=airco' },
        ],
      },
    ],
  },
  {
    slug: 'gids-warmtepomp',
    title: 'Gids: een warmtepomp overwegen zonder geschiktheidsmythe',
    excerpt:
      'Welke woningvragen eerst komen, wat hybride versus volledig elektrisch betekent in grote lijnen, en waar u officiële informatie over subsidies vindt.',
    intro:
      'Een warmtepomp is geen catalogusproduct dat “altijd past”. Isolatie, afgifte, buitenruimte en wat u met de bestaande ketel wilt, bepalen de route. Deze gids helpt u die vragen te verzamelen. Geschiktheid volgt pas na beoordeling, niet vanaf deze pagina.',
    category: 'warmtepomp',
    tags: ['warmtepomp', 'gids', 'isolatie', 'subsidie'],
    publishedAt: '2026-09-12',
    updatedAt: '2026-09-12',
    imageAlt: 'Buitenunit van een warmtepomp bij een woning, ter illustratie',
    relatedServiceSlugs: ['warmtepomp', 'cv-ketel'],
    relatedArticleSlugs: [
      'warmtepomp-waar-op-letten',
      'kiezen-tussen-systemen',
      'checklist-installatie',
    ],
    faqIds: ['wp-past-woning', 'wp-of-cv', 'offerte-wat-nodig'],
    resources: [
      resource(officialSources.milieuCentraalWp),
      resource(officialSources.milieuCentraalIsolatie),
      resource(officialSources.rvoIsde),
      resource(officialSources.rvoEnergielabel),
    ],
    sections: [
      {
        id: 'eerst-woning',
        heading: 'Eerst de woning, dan het toestel',
        paragraphs: [
          'Lage-temperatuurverwarming (vaak vloerverwarming of grote radiatoren) en redelijke isolatie maken een warmtepomp kansrijker. Een tochtige schil of alleen kleine radiatoren betekent niet automatisch “onmogelijk”, maar wel een ander gesprek: isoleren, afgifte aanpassen, of een hybride stap.',
          'Milieu Centraal legt voor bewoners uit hoe isolatie en warmtepompen samenhangen. Gebruik die uitleg als achtergrond, niet als vervanging van een opname in uw huis.',
        ],
        links: [
          {
            label: officialSources.milieuCentraalWp.label,
            href: officialSources.milieuCentraalWp.url,
            external: true,
          },
          {
            label: officialSources.milieuCentraalIsolatie.label,
            href: officialSources.milieuCentraalIsolatie.url,
            external: true,
          },
        ],
      },
      {
        id: 'hybride',
        heading: 'Hybride of volledig: twee verschillende keuzes',
        paragraphs: [
          'Hybride betekent vaak: de warmtepomp doet een deel, de cv-ketel springt bij. Volledig elektrisch betekent dat de ketel verdwijnt en de woning op de pomp (plus eventueel een boiler) moet kunnen. Dat zijn verschillende investeringen, geluids- en ruimtevragen, en verschillende verwachtingen in een koude week.',
          'Wij zetten hier geen ranglijst. Vraag wat u wilt bereiken: minder gas, van het gas af, of vooral comfort. Het antwoord stuurt het advies, niet een slogan.',
        ],
        links: [
          { label: 'Dienst: warmtepomp', href: '/warmtepomp' },
          { label: 'Dienst: cv-ketel', href: '/cv-ketel' },
        ],
      },
      {
        id: 'subsidie',
        heading: 'Subsidie: kijk bij RVO, niet bij een belofte op deze site',
        paragraphs: [
          'Voor sommige maatregelen bestaat de ISDE. Voorwaarden, bedragen en of úw situatie in aanmerking komt, staan bij de Rijksdienst voor Ondernemend Nederland. Wij noemen die regeling zodat u de officiële bron kent. We claimen hier geen bemiddeling, geen vast bedrag en geen “subsidiegarantie”.',
          'Het energielabel van de woning is eveneens een officieel gegeven, geen verkoopargument. RVO beschrijft hoe labels werken. Neem een eventueel label mee naar het gesprek; het vervangt geen technische opname.',
        ],
        links: [
          {
            label: officialSources.rvoIsde.label,
            href: officialSources.rvoIsde.url,
            external: true,
          },
          {
            label: officialSources.rvoEnergielabel.label,
            href: officialSources.rvoEnergielabel.url,
            external: true,
          },
          { label: 'Offerte of advies aanvragen', href: '/offerte-aanvragen?dienst=warmtepomp' },
        ],
      },
    ],
  },
  {
    slug: 'checklist-installatie',
    title: 'Checklist: zo bereidt u een installatiedag voor',
    excerpt:
      'Praktische punten voor cv-ketel, airco of warmtepomp: toegang, bestaande opstelling, beslissingen die u al kunt nemen, en vragen die in de offerte horen.',
    intro:
      'Installatiewerk verloopt rustiger als de woning bereikbaar is en de belangrijkste keuzes al op papier staan. Deze checklist is geen toelatingseis. Hij voorkomt vooral heen-en-weer op de dag zelf.',
    category: 'praktische-tips',
    tags: ['checklist', 'installatie', 'voorbereiding'],
    publishedAt: '2026-09-12',
    updatedAt: '2026-09-12',
    imageAlt: 'Voorbereiding van een technische ruimte voor installatiewerk, ter illustratie',
    relatedServiceSlugs: ['cv-ketel', 'airco', 'warmtepomp'],
    relatedArticleSlugs: ['offerte-voorbereiden', 'gids-cv-ketel', 'gids-warmtepomp'],
    faqIds: ['installatie-voorbereiden', 'offerte-wat-nodig', 'afspraak-hoe'],
    resources: [resource(officialSources.techniekNederland)],
    sections: [
      {
        id: 'toegang',
        heading: 'Toegang en werkruimte',
        paragraphs: [
          'Zorg dat de technische ruimte, zolder of de plek van de buitenunit bereikbaar is. Haal spullen weg die in de weg staan. Bespreek parkeren en of er een steiger, ladder of extra handen nodig zijn. Dat hoort in het voorstel, niet als verrassing.',
          'Is er een huisdier of werkt u thuis? Zeg dat van tevoren. Installatie vraagt soms om water of stroom even uit, of om de ketel een dagdeel niet te gebruiken.',
        ],
      },
      {
        id: 'bestaand',
        heading: 'Bestaande situatie vastleggen',
        paragraphs: [
          'Foto van de huidige ketel, airco of de beoogde plek. Typeplaatje als het leesbaar is. Noteer merken van radiatoren alleen als u ze weet; giswerk is niet nodig.',
          'Voor airco: waar mag de buitenunit staan, hoe loopt een mogelijke leidingweg, en wie is de burenpartij als de unit zichtbaar is? Voor een warmtepomp: vrije ruimte, afstand tot erfgrens en of er een voorkeur is voor geluidarm opstellen. Concrete eisen volgen per situatie.',
        ],
        links: [
          { label: 'Airco: plaatsingsvragen', href: '/airco' },
          { label: 'Warmtepomp: woning eerst beoordelen', href: '/warmtepomp' },
        ],
      },
      {
        id: 'offerte',
        heading: 'Wat in het voorstel moet staan',
        paragraphs: [
          'Vraag een opsomming van werkzaamheden, wat u zelf nog moet regelen, en wat ná plaatsing van u wordt verwacht (onderhoud, filters, instellingen). Prijzen publiceren we niet op de site; wél hoort het voorstel vergelijkbaar te zijn.',
          'Een akkoord is pas een opdracht als dat schriftelijk is bevestigd. De afspraakmodule op deze site is een voorkeur, geen slot in de agenda.',
        ],
        links: [
          { label: 'Offerte aanvragen', href: '/offerte-aanvragen' },
          { label: 'Afspraakvoorkeur doorgeven', href: '/afspraak-maken' },
        ],
      },
    ],
  },
  {
    slug: 'checklist-onderhoud',
    title: 'Checklist: onderhoud van cv-ketel of klimaatinstallatie voorbereiden',
    excerpt:
      'Wat u klaarzet voor een onderhoudsbezoek: merkteken, klachten, druk, foutcodes, en wat u níet zelf hoeft open te schroeven.',
    intro:
      'Onderhoud gaat sneller als de monteur niet hoeft te zoeken naar het toestel of de klacht. Deze lijst is bewust kort. U hoeft geen technicus te worden om het bezoek zinvol te maken.',
    category: 'onderhoud',
    tags: ['checklist', 'onderhoud', 'cv-ketel', 'airco'],
    publishedAt: '2026-09-12',
    updatedAt: '2026-09-12',
    imageAlt: 'Notities bij een cv-installatie voorafgaand aan onderhoud, ter illustratie',
    relatedServiceSlugs: ['service-onderhoud', 'cv-ketel', 'airco'],
    relatedArticleSlugs: [
      'onderhoud-cv-ketel',
      'gids-airco-onderhoud',
      'onderhoudsinterval',
    ],
    faqIds: ['onderhoud-waarom', 'onderhoud-interval', 'afspraak-hoe'],
    sections: [
      {
        id: 'klaarzetten',
        heading: 'Voor het bezoek',
        paragraphs: [
          'Maak het toestel bereikbaar. Noteer merk en type als die op het plaatje staan. Schrijf foutcodes of knippercodes op, ook als ze later verdwijnen. Noem wanneer de klacht begon en of hij wisselt met koud weer of douchegebruik.',
          'Cv: kijk of de druk op het display of de manometer in een bereik staat dat de handleiding noemt. Vul niet zelf bij als u niet weet hoe dat veilig moet. Airco: vermeld of u het filter recent heeft schoongemaakt.',
        ],
        links: [
          { label: 'Wat onderhoud inhoudt', href: '/blog/onderhoud-cv-ketel' },
          { label: 'Airco-onderhoudgids', href: '/blog/gids-airco-onderhoud' },
        ],
      },
      {
        id: 'niet-zelf',
        heading: 'Wat u beter niet zelf doet',
        paragraphs: [
          'Demontage van panelen, het openen van gas- of koudemiddelleidingen, of het resetten tot het toestel “toch weer start” zonder te weten waarom: dat verschuift het probleem. Zet in uw bericht wat u al heeft geprobeerd, zodat de monteur niet hetzelfde pad overdoet.',
          'Een vast onderhoudsjaar op een website is geen diagnose. Neem wel mee wat de fabrikant in de handleiding noemt, als u die nog heeft.',
        ],
      },
      {
        id: 'na-afloop',
        heading: 'Na het bezoek',
        paragraphs: [
          'Vraag wat er is nagekeken en of er onderdelen aandacht vragen. Als vervanging logischer is dan nog een ronde onderhoud, hoort u dat in gewone taal, niet als druk om dezelfde dag te tekenen.',
          'Plan daarna eventueel een vervolg via de onderhoudsdienst of, bij vervanging, via de cv-ketel- of warmtepomppagina.',
        ],
        links: [
          { label: 'Service en onderhoud', href: '/service-onderhoud' },
          { label: 'Afspraak maken', href: '/afspraak-maken?dienst=service-onderhoud' },
          { label: 'Veelgestelde vragen', href: '/veelgestelde-vragen' },
        ],
      },
    ],
  },
]
