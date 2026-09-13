import { business } from './business'

export type LegalDoc = {
  title: string
  path: string
  intro: string
  sections: { heading: string; paragraphs: string[] }[]
}

const address = `${business.address.street}, ${business.address.postalCode} ${business.address.city}`

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
      `Deze verklaring beschrijft hoe ${business.businessName} persoonsgegevens gebruikt die via greeninstallatienoord.nl binnenkomen. Het is een feitelijke toelichting, geen juridisch advies.`,
    sections: [
      {
        heading: 'Verantwoordelijke',
        paragraphs: [
          `${business.businessName}, ${address}. KVK ${business.kvk}.`,
          `Vragen over uw gegevens: ${business.email} of ${business.phone}.`,
        ],
      },
      {
        heading: 'Welke gegevens we ontvangen',
        paragraphs: [
          'Contactformulier: naam, e-mail en bericht. Telefoon en onderwerp zijn optioneel.',
          'Offerteaanvraag: voornaam, achternaam, e-mail, telefoon, gekozen dienst en situatie. Straat, huisnummer, postcode, plaats, toelichting en contactvoorkeur zijn optioneel. Foto’s die u in de browser selecteert, worden niet naar onze server gestuurd.',
          'Afspraakaanvraag: voornaam, achternaam, e-mail, telefoon, adres, dienst, gewenste datum en tijd, en eventuele toelichting.',
          'Als u ons belt of mailt buiten het formulier om, gebruiken we de gegevens die u zelf doorgeeft om te kunnen antwoorden.',
        ],
      },
      {
        heading: 'Waarom we die gegevens gebruiken',
        paragraphs: [
          'We gebruiken de gegevens om uw vraag, offerteaanvraag of afspraakaanvraag te behandelen, u te bereiken en een ontvangstbevestiging te sturen. Een aanvraag via de website is geen opdracht.',
          'In ons beheersysteem blijven de aanvraag, uw contactgegevens en de status van de behandeling bewaard, zodat we het verzoek kunnen opvolgen.',
        ],
      },
      {
        heading: 'E-mail',
        paragraphs: [
          'Na een geldige aanvraag kan het systeem een bericht sturen naar ons bedrijfsadres en een ontvangstbevestiging naar het e-mailadres dat u heeft ingevuld.',
          'Die berichten gaan via Resend. Resend verwerkt het e-mailadres en de inhoud van het bericht om het te kunnen versturen. Of een bericht is aangeboden, wordt in ons systeem gelogd (ontvanger, onderwerp, tijdstip en resultaat). Dat is geen bewijs dat het bericht in uw inbox is aangekomen.',
        ],
      },
      {
        heading: 'Website, hosting en beheer',
        paragraphs: [
          'De website en de bijbehorende programmatuur draaien bij Cloudflare. Aanvragen worden opgeslagen in onze Cloudflare D1-database. Cloudflare kan technische gegevens verwerken die nodig zijn om de pagina te tonen en te beveiligen, zoals een IP-adres. Dat is geen statistiek- of marketingmeting van ons.',
          'Medewerkers die inloggen op het beheerscherm krijgen een beveiligde sessiecookie. Bezoekers van de gewone website krijgen die cookie niet.',
        ],
      },
      {
        heading: 'Cookies en lokale opslag',
        paragraphs: [
          'In deze browser slaan we uw cookiekeuze op. Onvoltooide formulieren kunnen tijdelijk in deze browser blijven staan, zodat u niet alles opnieuw hoeft in te vullen. Die concepten gaan pas naar ons als u het formulier verstuurt.',
          'Er is geen statistiekprogramma en geen marketingpixel aangesloten. Lettertypen staan op onze eigen website. Er gaat geen lettertypeverzoek naar Google.',
          'Het cookiebeleid legt de categorieën verder uit.',
        ],
      },
      {
        heading: 'Sociale media',
        paragraphs: [
          'Links naar Facebook, Google, Instagram of TikTok openen die diensten. Wat u daar doet, valt onder hun eigen voorwaarden. We plaatsen geen ingesloten feeds of volgpixels van die platforms op deze website.',
        ],
      },
      {
        heading: 'Bewaartermijn',
        paragraphs: [
          'We bewaren aanvragen zolang dat nodig is om ze te behandelen en voor een redelijke administratie daarna. Een vaste termijn in maanden publiceren we hier niet, omdat die per situatie kan verschillen. U kunt vragen wat we van u hebben, of om verwijdering vragen.',
        ],
      },
      {
        heading: 'Uw rechten',
        paragraphs: [
          'U kunt vragen om inzage, correctie, verwijdering of beperking van gegevens die wij van u hebben, en u kunt bezwaar maken tegen verwerking die op ons gerechtvaardigd belang rust.',
          `Stuur daarvoor een bericht naar ${business.email}. We kunnen om een extra controle vragen, zodat we niet de gegevens van iemand anders vrijgeven.`,
          'Bent u het niet eens met hoe wij met uw gegevens omgaan, dan kunt u een klacht indienen bij de Autoriteit Persoonsgegevens.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookiebeleid',
    path: '/cookies',
    intro:
      'Deze pagina beschrijft welke cookies en vergelijkbare opslag deze website gebruikt. We noemen alleen wat nu echt actief is.',
    sections: [
      {
        heading: 'Wat we nu gebruiken',
        paragraphs: [
          'Op dit moment gebruiken we alleen noodzakelijke opslag. Er zijn geen analytische cookies en geen marketingcookies aangesloten.',
        ],
      },
      {
        heading: 'Noodzakelijk',
        paragraphs: [
          'We slaan uw cookiekeuze op in deze browser (localStorage), zodat de melding niet bij elk bezoek terugkomt. Zonder die opslag kunnen we uw keuze niet onthouden.',
          'Onvoltooide contact-, offerte- of afspraakaanvragen kunnen tijdelijk in deze browser blijven staan (sessionStorage). Die gegevens blijven op uw apparaat tot u het formulier verstuurt of het tabblad sluit.',
          'Cloudflare, onze host, kan technische cookies of vergelijkbare middelen gebruiken die nodig zijn om de site te beveiligen en uit te leveren. Die plaatsen wij niet zelf voor statistiek of reclame.',
          'Wie inlogt op het interne beheer krijgt een sessiecookie. Dat geldt niet voor gewone websitebezoekers.',
        ],
      },
      {
        heading: 'Analytisch',
        paragraphs: [
          'Niet in gebruik. Er start geen meetprogramma, ook niet als u “Alles accepteren” kiest, zolang er geen statistiek-script is aangesloten.',
        ],
      },
      {
        heading: 'Marketing',
        paragraphs: [
          'Niet in gebruik. Er is geen advertentiepixel, geen remarketingtag en geen tracking van sociale media op deze website.',
        ],
      },
      {
        heading: 'Uw keuze wijzigen',
        paragraphs: [
          'Onderaan elke pagina staat “Cookie-instellingen”. Daar kunt u de melding opnieuw openen. Op deze pagina staat dezelfde knop.',
        ],
      },
    ],
  },
  terms: {
    title: 'Algemene voorwaarden',
    path: '/algemene-voorwaarden',
    intro:
      'Een aanvraag via de website is een verzoek om contact, geen opdracht. Offertes en werkzaamheden worden per situatie afgesproken.',
    sections: [
      {
        heading: 'Aanvragen',
        paragraphs: [
          'Via offerte, afspraak of contact geeft u aan dat u benaderd wilt worden. Daaruit volgt nog geen verplichting tot uitvoering of tot een prijs.',
        ],
      },
      {
        heading: 'Offertes en afspraken',
        paragraphs: [
          'Een offerte of afspraak is pas bindend als wij die schriftelijk of per e-mail bevestigen. Een gekozen tijdstip op de website is een voorkeur, geen garantie.',
        ],
      },
      {
        heading: 'Prijzen en termijnen',
        paragraphs: [
          'Standaardprijzen, levertijden of garantieperiodes staan niet op deze pagina. Die horen bij het voorstel voor uw situatie.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          `Vragen over een offerte of opdracht: ${business.email} of ${business.phone}.`,
        ],
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    path: '/disclaimer',
    intro:
      'Informatie op deze website is algemeen van aard en geen advies op maat voor uw woning.',
    sections: [
      {
        heading: 'Inhoud',
        paragraphs: [
          'Teksten over cv-ketels, airconditioning en warmtepompen zijn bedoeld als uitleg. Ze vervangen geen beoordeling ter plaatse.',
        ],
      },
      {
        heading: 'Beoordelingen en erkenningen',
        paragraphs: [
          'Op deze website staan geen reviewscores of aantallen installaties. Informatie over certificering of lidmaatschappen tonen we alleen als die voor Green Installatie Noord zijn vastgesteld.',
        ],
      },
      {
        heading: 'Koppelingen',
        paragraphs: [
          'Links naar Facebook, Google, Instagram of TikTok verwijzen naar onze profielen. Inhoud op die platforms valt buiten deze website.',
        ],
      },
    ],
  },
}
