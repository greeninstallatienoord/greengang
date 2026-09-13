import { business } from '../business'
import { legalDates, legalMeta } from './meta'
import type { LegalDocument } from './types'

const d = legalDates.disclaimer

export const disclaimer: LegalDocument = {
  id: 'disclaimer',
  title: 'Disclaimer',
  path: '/disclaimer',
  eyebrow: 'Beperkingen',
  intro:
    `Informatie op greeninstallatienoord.nl is algemeen van aard. Zij is bedoeld om u te oriënteren op onze diensten (cv-ketel, airconditioning, warmtepomp en service) en vervangt geen beoordeling van uw specifieke woning of installatie.`,
  metaDescription:
    `Disclaimer van ${business.legalName}: algemene informatie, offertes, warmtepompcalculator, subsidies en aansprakelijkheid.`,
  version: d.version,
  effectiveDate: d.effective,
  lastUpdated: d.updated,
  sections: [
    {
      id: 'algemeen',
      number: '1',
      title: 'Algemene aard van de informatie',
      blocks: [
        {
          type: 'p',
          text: 'Teksten, uitleg en voorbeelden op deze website zijn met zorg samengesteld, maar kunnen onvolledig, verouderd of niet van toepassing op uw situatie zijn. Installatietechniek hangt af van onder meer woningtype, isolatie, bestaande leidingen, elektra, ventilatie en lokale voorschriften.',
        },
        {
          type: 'p',
          text: 'Niets op deze website geldt als site-specifiek advies, als technische keuring of als belofte dat een bepaalde oplossing in uw woning mogelijk, optimaal of subsidieerbaar is. Voor een onderbouwd voorstel is contact en — waar nodig — een beoordeling ter plaatse nodig.',
        },
      ],
    },
    {
      id: 'geen-overeenkomst',
      number: '2',
      title: 'Geen overeenkomst via alleen de website',
      blocks: [
        {
          type: 'p',
          text: 'Het indienen van een contact-, offerte- of afspraakaanvraag is een verzoek om contact. Daaruit volgt geen bindende prijs, planning of opdracht. Zie de algemene voorwaarden voor totstandkoming van overeenkomsten.',
        },
      ],
    },
    {
      id: 'prijzen',
      number: '3',
      title: 'Prijzen en offertes',
      blocks: [
        {
          type: 'p',
          text: 'Prijzen, voorbeelden of indicaties op de website zijn informatief. Definitieve prijzen volgen uit een offerte of schriftelijke/e-mailbevestiging die op uw situatie is afgestemd. Materiaalprijzen, arbeidsinzet en bijkomende werkzaamheden kunnen wijzigen.',
        },
        {
          type: 'p',
          text: 'Een offerte is gebaseerd op de door u verstrekte gegevens. Afwijkingen ter plaatse kunnen tot aanpassing van prijs of scope leiden.',
        },
      ],
    },
    {
      id: 'afbeeldingen',
      number: '4',
      title: 'Afbeeldingen en voorbeelden',
      blocks: [
        {
          type: 'p',
          text: 'Foto’s, illustraties en voorbeelden zijn ter illustratie. Uitvoering, merken, kleuren en plaatsing kunnen afwijken van wat u op de website ziet. Rechten op beeldmateriaal berusten bij ons of bij rechthebbenden.',
        },
      ],
    },
    {
      id: 'subsidies',
      number: '5',
      title: 'Subsidies en ISDE',
      blocks: [
        {
          type: 'notice',
          tone: 'warn',
          title: 'Geen garantie op subsidie',
          text: 'Informatie over subsidies, fiscale regelingen of ISDE (of vergelijkbare regelingen) is algemeen en kan wijzigen. Of u in aanmerking komt, hangt af van actuele overheidsvoorwaarden, uw situatie en correcte aanvraag. Wij garanderen geen toekenning, hoogte of uitbetaling van enige subsidie.',
        },
        {
          type: 'p',
          text: 'Controleer altijd de actuele voorwaarden bij de bevoegde instantie. Eventuele ondersteuning bij een aanvraag is geen resultaatsverplichting tenzij schriftelijk anders overeengekomen.',
        },
      ],
    },
    {
      id: 'warmtepompcalculator',
      number: '6',
      title: 'Warmtepompcalculator en schattingen',
      blocks: [
        {
          type: 'p',
          text: 'Op de website kan een warmtepompcalculator of vergelijkbare rekentool beschikbaar zijn. Resultaten daarvan zijn schattingen op basis van door u ingevoerde of aangenomen gegevens. Zij zijn geen ontwerp, geen definitieve dimensionering en geen belofte over verbruik, besparing, comfort of investering.',
        },
        {
          type: 'ul',
          items: [
            'Werkelijke uitkomsten hangen af van isolatie, afgiftesysteem, elektriciteitsaansluiting, gebruiksgedrag en installatiekeuze.',
            'Energieprijzen en tarieven wijzigen; berekeningen die daarop steunen, kunnen snel verouderen.',
            'Gebruik de uitkomst uitsluitend als oriëntatie en vraag om een onderbouwd voorstel voordat u beslissingen neemt.',
          ],
        },
      ],
    },
    {
      id: 'energieprijzen',
      number: '7',
      title: 'Energieprijzen en besparingen',
      blocks: [
        {
          type: 'p',
          text: 'Vermeldingen van energieprijzen, terugverdientijden of besparingen zijn indicatief. Uw werkelijke kosten en besparingen kunnen hoger of lager uitvallen. Wij zijn niet aansprakelijk voor beslissingen die u uitsluitend op basis van website-indicaties neemt, voor zover de wet dat toelaat.',
        },
      ],
    },
    {
      id: 'beoordelingen',
      number: '8',
      title: 'Beoordelingen, certificering en claims',
      blocks: [
        {
          type: 'p',
          text: 'Op deze website presenteren wij geen verzonnen reviewscores of niet-geverifieerde aantallen installaties. Informatie over certificering, keurmerken of lidmaatschappen tonen wij alleen voor zover die voor Green Installatie Noord zijn vastgesteld. Ontbreekt een vermelding, ga er dan niet van uit dat een bepaald keurmerk van toepassing is.',
        },
      ],
    },
    {
      id: 'links',
      number: '9',
      title: 'Links naar derden',
      blocks: [
        {
          type: 'p',
          text: 'De website kan linken naar derden, waaronder Facebook, Instagram, TikTok en Google Business Profile. Die links openen externe diensten. Inhoud, privacypraktijken en beschikbaarheid van die platforms vallen buiten onze controle. Wij plaatsen geen ingesloten feeds of trackingpixels van die platforms op deze website.',
        },
        {
          type: 'p',
          text: 'Ook bij OpenStreetMap-tegels (als u de werkgebiedkaart opent) gelden de voorwaarden en privacyregels van de betreffende tegelprovider.',
        },
      ],
    },
    {
      id: 'beschikbaarheid',
      number: '10',
      title: 'Beschikbaarheid van de website',
      blocks: [
        {
          type: 'p',
          text: 'Wij streven naar een goed bereikbare website, maar garanderen geen ononderbroken of foutloze werking. Onderhoud, storingen bij hostingproviders of overmacht kunnen de toegang beperken.',
        },
      ],
    },
    {
      id: 'aansprakelijkheid',
      number: '11',
      title: 'Aansprakelijkheid',
      blocks: [
        {
          type: 'p',
          text: 'Voor zover wettelijk toegestaan zijn wij niet aansprakelijk voor schade die voortvloeit uit het gebruik van of de onmogelijkheid tot gebruik van deze website, of uit vertrouwen op algemene website-informatie zonder nadere beoordeling. Dwingende rechten van consumenten en aansprakelijkheid die wettelijk niet mag worden uitgesloten, blijven onverlet.',
        },
        {
          type: 'p',
          text: 'Voor aansprakelijkheid in het kader van daadwerkelijk overeengekomen werkzaamheden gelden de algemene voorwaarden en het dwingende recht.',
        },
      ],
    },
    {
      id: 'storingen',
      number: '12',
      title: 'Storingen en noodgevallen',
      blocks: [
        {
          type: 'notice',
          tone: 'warn',
          title: 'Bij acuut gevaar: bel noodhulpdiensten',
          text: `Bij gaslucht, brand, rook, elektrocutiegevaar of andere acute noodsituaties belt u eerst 112. Voor installatiestoringen kunt u onze ${business.emergencyService.label.toLowerCase()} bereiken via ${business.emergencyService.phone}. Gebruik geen webformulier voor acute noodgevallen.`,
        },
      ],
    },
    {
      id: 'wijzigingen-disclaimer',
      number: '13',
      title: 'Wijzigingen',
      blocks: [
        {
          type: 'p',
          text: 'Wij kunnen website-inhoud en deze disclaimer wijzigen zonder voorafgaande aankondiging. De versie en datum bovenaan deze pagina geven de actuele status aan.',
        },
      ],
    },
    {
      id: 'contact-disclaimer',
      number: '14',
      title: 'Contact',
      blocks: [
        {
          type: 'p',
          text: 'Vragen over deze disclaimer of over onze diensten:',
        },
        {
          type: 'ul',
          items: [
            legalMeta.companyLine,
            legalMeta.kvkLine,
            legalMeta.contactLine,
          ],
        },
      ],
    },
  ],
}
