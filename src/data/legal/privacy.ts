import { business } from '../business'
import { retentionPolicy } from '../../config/retention'
import { legalDates, legalMeta } from './meta'
import type { LegalDocument } from './types'

const d = legalDates.privacy

export const privacy: LegalDocument = {
  id: 'privacy',
  title: 'Privacyverklaring',
  path: '/privacy',
  eyebrow: 'Persoonsgegevens',
  intro:
    `Deze privacyverklaring legt uit hoe ${business.legalName} persoonsgegevens verwerkt die via greeninstallatienoord.nl of in verband met onze diensten binnenkomen. De tekst beschrijft onze huidige werkwijze zo feitelijk mogelijk. Het is geen juridisch advies en geen garantie dat elke verwerking in elke situatie volledig is uitgewerkt.`,
  metaDescription:
    `Hoe ${business.legalName} persoonsgegevens verwerkt via de website: formulieren, e-mail, hosting, bewaartermijnen en uw AVG-rechten.`,
  version: d.version,
  effectiveDate: d.effective,
  lastUpdated: d.updated,
  sections: [
    {
      id: 'verantwoordelijke',
      number: '1',
      title: 'Verantwoordelijke',
      blocks: [
        {
          type: 'p',
          text: `Verantwoordelijke voor de verwerking van persoonsgegevens is:`,
        },
        {
          type: 'dl',
          items: [
            { term: 'Naam', description: business.legalName },
            {
              term: 'Adres',
              description: `${business.address.street}, ${business.address.postalCode} ${business.address.city}, Nederland`,
            },
            { term: 'KvK', description: business.kvk },
            { term: 'E-mail', description: business.email },
            { term: 'Telefoon', description: business.phone },
          ],
        },
        {
          type: 'p',
          text: `Er is geen btw-nummer op deze website gepubliceerd. Vragen over privacy stuurt u bij voorkeur naar ${business.email}.`,
        },
      ],
    },
    {
      id: 'reikwijdte',
      number: '2',
      title: 'Reikwijdte van deze verklaring',
      blocks: [
        {
          type: 'p',
          text: 'Deze verklaring geldt voor persoonsgegevens die wij verwerken in verband met:',
        },
        {
          type: 'ul',
          items: [
            'het bezoeken en gebruiken van greeninstallatienoord.nl;',
            'het versturen van een contact-, offerte- of afspraakaanvraag via de website;',
            'e-mail- of telefooncontact dat daaruit volgt of dat u zelf initieert;',
            'het interne beheerscherm waarmee medewerkers aanvragen opvolgen (niet toegankelijk voor bezoekers).',
          ],
        },
        {
          type: 'p',
          text: 'Deze verklaring geldt niet voor verwerkingen door derden via hun eigen platforms wanneer u daarheen klikt (bijvoorbeeld Facebook, Instagram, TikTok of Google Business Profile). Die platforms handelen onder hun eigen privacyvoorwaarden.',
        },
        {
          type: 'notice',
          tone: 'info',
          title: 'Aanvraag is geen overeenkomst',
          text: 'Een formulier op de website is een verzoek om contact of om een voorstel. Daaruit ontstaat nog geen overeenkomst tot uitvoering van werkzaamheden. Een overeenkomst komt pas tot stand na onze schriftelijke of e-mailbevestiging, zoals nader beschreven in de algemene voorwaarden.',
        },
      ],
    },
    {
      id: 'categorieen',
      number: '3',
      title: 'Welke gegevens wij verwerken',
      blocks: [
        {
          type: 'p',
          text: 'Welke gegevens wij ontvangen, hangt af van hoe u contact zoekt. Hieronder staat een overzicht per bron.',
        },
        {
          type: 'dl',
          items: [
            {
              term: 'Contactformulier',
              description:
                'Naam, e-mailadres en bericht. Telefoonnummer en onderwerp zijn optioneel.',
            },
            {
              term: 'Offerteaanvraag',
              description:
                'Voornaam, achternaam, e-mailadres, telefoonnummer, gekozen dienst en situatieomschrijving. Straat, huisnummer, postcode, plaats, toelichting en contactvoorkeur zijn optioneel. Zie ook het onderdeel over foto’s hieronder.',
            },
            {
              term: 'Afspraakaanvraag',
              description:
                'Voornaam, achternaam, e-mailadres, telefoonnummer, adresgegevens, dienst, gewenste datum en tijdslot (voorkeur), en eventuele toelichting.',
            },
            {
              term: 'E-mail of telefoon buiten formulieren',
              description:
                'De gegevens die u zelf doorgeeft, voor zover nodig om te antwoorden en uw verzoek te behandelen.',
            },
            {
              term: 'Technische gegevens bij websitegebruik',
              description:
                'Onze hosting- en beveiligingsinfrastructuur (Cloudflare) kan technische gegevens verwerken die nodig zijn om de site te tonen en te beschermen, zoals IP-adres en verzoekmetadata. Wij gebruiken dat niet als statistiek- of marketingmeting van Green Installatie Noord.',
            },
            {
              term: 'Browseropslag',
              description:
                'Cookievoorkeuren (localStorage: gin-consent-v2) en tijdelijke formulierconcepten (sessionStorage). Concepten blijven op uw apparaat tot u verstuurt of de sessie sluit.',
            },
          ],
        },
        {
          type: 'notice',
          tone: 'warn',
          title: 'Foto’s bij offerteaanvragen',
          text: 'Selecteert u foto’s in de browser bij een offerteaanvraag, dan worden de beeldbestanden (de binaire inhoud) niet naar onze server geüpload. Wel kunnen bestandsnaam, bestandsgrootte en bestandstype als metadata in de aanvraag worden meegestuurd of tijdelijk in een concept in uw browser staan. Stuur foto’s alleen mee als u dat bewust doet via een kanaal dat wij daarvoor bevestigen (bijvoorbeeld e-mail na contact).',
        },
      ],
    },
    {
      id: 'doelen',
      number: '4',
      title: 'Doelen van de verwerking',
      blocks: [
        {
          type: 'p',
          text: 'Wij verwerken persoonsgegevens voor de volgende doelen:',
        },
        {
          type: 'ul',
          items: [
            'het beoordelen en beantwoorden van uw vraag, offerteaanvraag of afspraakaanvraag;',
            'het plannen van contact of een eventuele afspraak (een voorkeurstijdslot is geen garantie);',
            'het sturen van een ontvangstbevestiging en interne melding per e-mail;',
            'het bijhouden van status en opvolging in ons beheersysteem;',
            'het beveiligen van de website, het voorkomen van misbruik en het beschermen van systemen;',
            'het naleven van wettelijke verplichtingen waar die van toepassing zijn;',
            'het vastleggen van uw cookiekeuze en het tijdelijk bewaren van formulierconcepten voor gebruiksgemak.',
          ],
        },
        {
          type: 'p',
          text: 'Wij gebruiken uw gegevens niet voor geautomatiseerde besluitvorming met rechtsgevolgen of vergelijkbare aanzienlijke gevolgen, en niet voor profilering voor marketingdoeleinden via deze website.',
        },
      ],
    },
    {
      id: 'grondslagen',
      number: '5',
      title: 'Rechtsgrondslagen',
      blocks: [
        {
          type: 'p',
          text: 'Afhankelijk van de situatie steunen wij op een of meer van de volgende grondslagen uit de Algemene Verordening Gegevensbescherming (AVG):',
        },
        {
          type: 'ul',
          items: [
            'Artikel 6 lid 1 onder b AVG — verwerking die nodig is voor stappen vóór het aangaan van een overeenkomst (precontractueel), bijvoorbeeld het behandelen van een offerte- of afspraakaanvraag die u zelf indient.',
            'Artikel 6 lid 1 onder f AVG — gerechtvaardigd belang, met name bij beveiliging van systemen, misbruikpreventie, technische hosting en redelijke bedrijfsadministratie. Wij wegen belangen af en beperken de gegevens tot wat daarvoor nodig is.',
            'Artikel 6 lid 1 onder a AVG — toestemming, voor zover later optionele cookies of vergelijkbare technologieën (bijvoorbeeld analytisch of marketing) zouden worden aangesloten. Op dit moment zijn die categorieën niet actief; zie het cookiebeleid.',
            'Artikel 6 lid 1 onder c AVG — wettelijke verplichting, alleen wanneer een specifieke wettelijke plicht tot verwerking of bewaring geldt.',
          ],
        },
      ],
    },
    {
      id: 'verwerkers',
      number: '6',
      title: 'Verwerkers en andere partijen',
      blocks: [
        {
          type: 'p',
          text: 'Voor de technische en operationele uitvoering schakelen wij onder meer de volgende partijen in:',
        },
        {
          type: 'dl',
          items: [
            {
              term: 'Cloudflare',
              description:
                'Hosting van de website, Cloudflare Workers, Cloudflare D1 (opslag van aanvragen) en — alleen bij inloggen op het beheerscherm — Cloudflare Turnstile voor botbescherming. Cloudflare kan technische gegevens verwerken die nodig zijn voor levering en beveiliging.',
            },
            {
              term: 'Resend',
              description:
                'Verzending van e-mailberichten (bijvoorbeeld interne melding en ontvangstbevestiging). Resend verwerkt e-mailadressen en berichtinhoud voor zover nodig om berichten te versturen. Of een bericht is aangeboden, kan in ons systeem worden gelogd; dat is geen bewijs van aankomst in uw inbox.',
            },
            {
              term: 'OpenStreetMap-tegels',
              description:
                'Alleen als u op de werkgebiedpagina expliciet “Kaart laden” kiest, worden kaarttegels geladen. Daarbij kunnen technische verzoekgegevens (zoals IP-adres) bij de tegelprovider terechtkomen. Zonder die actie vinden er geen tegelverzoeken plaats. De kaart is geen tracking voor marketing.',
            },
          ],
        },
        {
          type: 'p',
          text: 'Lettertypen worden zelf gehost. Er gaat geen lettertypeverzoek naar Google Fonts. Er is geen Google Analytics en geen marketingpixel aangesloten. Links naar Facebook, Instagram, TikTok of Google Business Profile zijn alleen verwijzingen; wij plaatsen geen ingesloten feeds of volgpixels van die platforms op deze website.',
        },
      ],
    },
    {
      id: 'doorgifte',
      number: '7',
      title: 'Doorgifte buiten de EER',
      blocks: [
        {
          type: 'p',
          text: 'Onze primaire dienstverlening en website zijn gericht op Nederland. Providers zoals Cloudflare en Resend kunnen in sommige gevallen gegevens verwerken of laten verwerken buiten de Europese Economische Ruimte (EER), afhankelijk van hun infrastructuur en ondersteuningsprocessen.',
        },
        {
          type: 'p',
          text: 'Waar doorgifte buiten de EER plaatsvindt, steunen wij in beginsel op de waarborgen die die providers in hun dienstverlening en documentatie beschrijven (bijvoorbeeld contractuele beschermingsmechanismen of andere door de AVG erkende middelen). Wij publiceren hier geen specifieke contractdetails of modelclausules, omdat die kunnen wijzigen en omdat deze pagina geen volledige weergave van elke onderliggende overeenkomst is.',
        },
        {
          type: 'p',
          text: 'Wilt u meer weten over de concrete inrichting van een bepaalde doorgifte, dan kunt u contact met ons opnemen.',
        },
      ],
    },
    {
      id: 'bewaartermijnen',
      number: '8',
      title: 'Bewaartermijnen',
      blocks: [
        {
          type: 'p',
          text: `${retentionPolicy.note} Onderstaande termijnen zijn operationele richtlijnen (laatst intern herzien: ${retentionPolicy.lastReviewed}).`,
        },
        {
          type: 'table',
          caption: 'Richtlijnen bewaartermijnen',
          headers: ['Activiteit', 'Bewaartermijn', 'Toelichting'],
          rows: retentionPolicy.items.map((item) => [
            item.activity,
            item.retention,
            item.basis,
          ]),
        },
      ],
    },
    {
      id: 'overzicht',
      number: '9',
      title: 'Verwerkingsoverzicht',
      blocks: [
        {
          type: 'p',
          text: 'Onderstaande tabel vat de belangrijkste verwerkingen via of in verband met de website samen.',
        },
        {
          type: 'table',
          caption: 'Overzicht verwerkingen',
          headers: ['Verwerking', 'Belangrijkste gegevens', 'Doel', 'Grondslag (indicatief)'],
          rows: [
            [
              'Contactaanvraag',
              'Naam, e-mail, bericht; optioneel telefoon/onderwerp',
              'Beantwoorden en opvolgen',
              '6.1.b / 6.1.f',
            ],
            [
              'Offerteaanvraag',
              'Contact- en situatiegegevens; optioneel adres; bestandsmetadata (geen foto-upload)',
              'Beoordelen verzoek / voorstel voorbereiden',
              '6.1.b',
            ],
            [
              'Afspraakaanvraag',
              'Contact- en adresgegevens, voorkeursmoment',
              'Plannen van contact/afspraak',
              '6.1.b',
            ],
            [
              'E-mail via Resend',
              'E-mailadres, berichtinhoud, verzendresultaat',
              'Communicatie en bewijs van verzending',
              '6.1.b / 6.1.f',
            ],
            [
              'Hosting / D1 / Workers (Cloudflare)',
              'Aanvraaggegevens, technische metadata',
              'Opslag, weergave en beveiliging',
              '6.1.b / 6.1.f',
            ],
            [
              'Cookiekeuze (gin-consent-v2)',
              'Uw voorkeuren in localStorage',
              'Onthouden cookiekeuze',
              '6.1.f / noodzakelijk',
            ],
            [
              'Formulierconcepten',
              'Ingevoerde velden in sessionStorage',
              'Gebruiksgemak tijdens de sessie',
              '6.1.f',
            ],
            [
              'Kaarttegels (OSM)',
              'Technische verzoekgegevens bij openen kaart',
              'Tonen werkgebiedkaart',
              '6.1.f',
            ],
            [
              'Beheersessie (alleen medewerkers)',
              'Sessiecookie gin_admin_session; bij login Turnstile',
              'Beveiligde toegang beheer',
              '6.1.f',
            ],
          ],
        },
      ],
    },
    {
      id: 'beveiliging',
      number: '10',
      title: 'Beveiliging',
      blocks: [
        {
          type: 'p',
          text: 'Wij treffen passende technische en organisatorische maatregelen om persoonsgegevens te beschermen tegen verlies, misbruik en onbevoegde toegang. Denk onder meer aan versleutelde verbindingen (HTTPS), toegangsbeperking tot het beheerscherm, sessiebeheer voor medewerkers en infrastructuurbeveiliging via onze hostingprovider.',
        },
        {
          type: 'p',
          text: 'Geen beveiligingsmaatregel biedt absolute zekerheid. Bij een inbreuk in verband met persoonsgegevens handelen wij volgens de wettelijke meldingsplichten waar die van toepassing zijn, inclusief melding aan de Autoriteit Persoonsgegevens en — indien vereist — aan betrokkenen.',
        },
      ],
    },
    {
      id: 'rechten',
      number: '11',
      title: 'Uw rechten',
      blocks: [
        {
          type: 'p',
          text: 'Voor zover de AVG van toepassing is, kunt u onder meer verzoeken om:',
        },
        {
          type: 'ul',
          items: [
            'inzage in de persoonsgegevens die wij van u verwerken;',
            'rectificatie van onjuiste of onvolledige gegevens;',
            'verwijdering (“recht op vergetelheid”), voor zover wettelijk mogelijk;',
            'beperking van de verwerking;',
            'overdraagbaarheid van gegevens die u ons heeft verstrekt, voor zover van toepassing;',
            'bezwaar tegen verwerking die op ons gerechtvaardigd belang berust;',
            'intrekking van toestemming, indien de verwerking op toestemming berust (intrekken laat eerdere rechtmatige verwerking onaangetast).',
          ],
        },
        {
          type: 'p',
          text: `Stuur verzoeken naar ${business.email} en vermeld duidelijk waar uw verzoek over gaat. Om te voorkomen dat wij gegevens van een ander vrijgeven, kunnen wij om aanvullende informatie vragen om uw identiteit te verifiëren.`,
        },
        {
          type: 'p',
          text: 'Wij streven ernaar binnen één maand te reageren. Bij complexe of omvangrijke verzoeken kan die termijn met maximaal twee maanden worden verlengd; in dat geval informeren wij u daarover.',
        },
      ],
    },
    {
      id: 'kinderen',
      number: '12',
      title: 'Kinderen',
      blocks: [
        {
          type: 'p',
          text: 'Onze diensten en website zijn gericht op volwassenen en zakelijke contactpersonen, niet op kinderen. Wij vragen niet bewust persoonsgegevens van personen jonger dan 16 jaar via de website. Denkt u dat wij dergelijke gegevens onbedoeld hebben ontvangen, neem dan contact met ons op zodat wij die kunnen beoordelen en zo nodig verwijderen.',
        },
      ],
    },
    {
      id: 'klachten',
      number: '13',
      title: 'Klachten',
      blocks: [
        {
          type: 'p',
          text: `Heeft u een klacht over de verwerking van persoonsgegevens, neem dan eerst contact met ons op via ${business.email} of ${business.phone}. U heeft ook het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).`,
        },
      ],
    },
    {
      id: 'wijzigingen',
      number: '14',
      title: 'Wijzigingen',
      blocks: [
        {
          type: 'p',
          text: 'Wij kunnen deze privacyverklaring aanpassen als onze werkwijze, systemen of wetgeving wijzigen. De datum “laatste wijziging” en het versienummer bovenaan de pagina geven aan welke versie actief is. Bij belangrijke wijzigingen kunnen wij aanvullend aandacht vragen via de website.',
        },
      ],
    },
    {
      id: 'contact-privacy',
      number: '15',
      title: 'Contact',
      blocks: [
        {
          type: 'p',
          text: `Voor vragen over deze privacyverklaring of over uw persoonsgegevens:`,
        },
        {
          type: 'ul',
          items: [
            legalMeta.companyLine,
            legalMeta.kvkLine,
            legalMeta.contactLine,
          ],
        },
        {
          type: 'p',
          text: 'Zie ook ons cookiebeleid, de algemene voorwaarden en de disclaimer voor samenhangende informatie.',
        },
      ],
    },
  ],
}
