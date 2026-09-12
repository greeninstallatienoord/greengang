import { business } from './business'

export type LegalDoc = {
  title: string
  path: string
  intro: string
  sections: { heading: string; paragraphs: string[] }[]
}

export const legalDocs: {
  privacy: LegalDoc
  cookies: LegalDoc
  terms: LegalDoc
  disclaimer: LegalDoc
} = {
  privacy: {
    title: 'Privacyverklaring',
    path: '/privacy',
    intro:
      'Dit is een tijdelijke tekst. Hier komt later de echte privacyverklaring, nadat die is opgesteld of getoetst.',
    sections: [
      {
        heading: 'Wat deze pagina nog niet is',
        paragraphs: [
          'Dit is geen volledige, getoetste privacyverklaring en geen juridisch advies. Een cookiebanner of dit document maakt de website niet automatisch rechtmatig.',
        ],
      },
      {
        heading: 'Welke gegevens formulieren nu vragen',
        paragraphs: [
          'Offerte en afspraak: voor- en achternaam, telefoon en e-mail, zodat we u kunnen terugbellen of mailen. Adres, toelichting en foto’s zijn optioneel en helpen alleen om de situatie in te schatten.',
          'Contact: naam, e-mail en bericht. Telefoon en onderwerp zijn optioneel.',
          `Zolang er geen serverkoppeling is, worden deze gegevens niet naar ${business.businessName} verstuurd. U kunt ons bereiken via ${business.email} of ${business.phone}.`,
        ],
      },
      {
        heading: 'Cookies',
        paragraphs: [
          'Noodzakelijk: we onthouden uw cookiekeuze in de browser. Optionele categorieën (voorkeuren, statistieken, marketing) starten geen extra scripts zonder uw keuze. Zie de cookie-uitleg.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie-uitleg',
    path: '/cookies',
    intro:
      'Dit is een tijdelijke uitleg. Hier komt later de echte cookieverklaring, inclusief de tools die dan echt worden gebruikt.',
    sections: [
      {
        heading: 'Wat deze pagina nog niet is',
        paragraphs: [
          'Dit is geen juridisch sluitende cookieverklaring. Er is nog geen gekoppeld statistiek- of marketingprogramma. Deze pagina beschrijft alleen hoe de technische keuze werkt.',
        ],
      },
      {
        heading: 'Categorieën',
        paragraphs: [
          'Noodzakelijk: onthoudt uw keuze, zodat de melding niet elke keer terugkomt.',
          'Voorkeuren (preferences): optioneel, bijvoorbeeld extra lettertypen van een externe dienst.',
          'Statistieken (analytics): optioneel. Er wordt geen analysescript gestart voordat u dit aanzet, en er is nu geen meetprogramma aangesloten.',
          'Marketing: optioneel. Er wordt geen marketing-script gestart voordat u dit aanzet, en er is nu geen campagnetool aangesloten.',
        ],
      },
      {
        heading: 'Uw keuze wijzigen',
        paragraphs: [
          'Onderaan elke pagina staat “Cookie-instellingen”. Daar kunt u alles accepteren, alleen noodzakelijk kiezen, of zelf categorieën aanzetten. De keuze blijft bewaard in deze browser.',
        ],
      },
    ],
  },
  terms: {
    title: 'Algemene voorwaarden',
    path: '/algemene-voorwaarden',
    intro:
      'Dit is een tijdelijke tekst. Hier komen later de echte algemene voorwaarden voor offertes en opdrachten.',
    sections: [
      {
        heading: 'Wat deze pagina nog niet is',
        paragraphs: [
          'Er gelden hier geen verzonnen leveringsvoorwaarden, garanties of termijnen. Tot de echte tekst er is, is deze pagina alleen een gereserveerde plek.',
        ],
      },
      {
        heading: 'Offertes',
        paragraphs: [
          'Een offerteaanvraag via de website is een verzoek om contact, geen opdracht. Wat er in een voorstel komt te staan, volgt per situatie.',
        ],
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    path: '/disclaimer',
    intro:
      'Informatie op deze website is algemeen van aard en geen advies op maat.',
    sections: [
      {
        heading: 'Inhoud',
        paragraphs: [
          'Teksten over cv-ketels, airconditioning en warmtepompen zijn bedoeld als uitleg. Ze vervangen geen beoordeling van uw woning.',
        ],
      },
    ],
  },
}
