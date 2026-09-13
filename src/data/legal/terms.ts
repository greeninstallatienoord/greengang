import { business } from '../business'
import { legalDates, legalMeta } from './meta'
import type { LegalDocument } from './types'

const d = legalDates.terms

export const terms: LegalDocument = {
  id: 'terms',
  title: 'Algemene voorwaarden',
  path: '/algemene-voorwaarden',
  eyebrow: 'Voorwaarden',
  intro:
    `Deze algemene voorwaarden gelden voor diensten en overeenkomsten van ${business.legalName}. Een aanvraag via de website (offerte, afspraak of contact) is een verzoek om contact — geen bindende overeenkomst. Een overeenkomst komt pas tot stand na onze schriftelijke of e-mailbevestiging.`,
  metaDescription:
    `Algemene voorwaarden van ${business.legalName}: aanvragen, offertes, uitvoering, betaling, garantie, aansprakelijkheid en klachten.`,
  version: d.version,
  effectiveDate: d.effective,
  lastUpdated: d.updated,
  sections: [
    {
      id: 'art-1',
      number: 'Artikel 1',
      title: 'Definities',
      blocks: [
        {
          type: 'dl',
          items: [
            {
              term: 'Opdrachtnemer',
              description: `${business.legalName}, gevestigd te ${business.address.street}, ${business.address.postalCode} ${business.address.city}, KvK ${business.kvk} (hierna: “wij” / “ons”).`,
            },
            {
              term: 'Opdrachtgever',
              description:
                'De natuurlijke persoon of rechtspersoon die een overeenkomst met ons aangaat of via de website een verzoek indient (hierna: “u”).',
            },
            {
              term: 'Consument',
              description:
                'Een opdrachtgever die handelt als natuurlijke persoon buiten beroep of bedrijf.',
            },
            {
              term: 'Zakelijke klant',
              description:
                'Een opdrachtgever die handelt in de uitoefening van beroep of bedrijf.',
            },
            {
              term: 'Website',
              description: 'greeninstallatienoord.nl en bijbehorende (sub)pagina’s.',
            },
            {
              term: 'Aanvraag',
              description:
                'Een via de website of anderszins ingediend verzoek om contact, offerte of afspraak, zonder dat daarmee al een overeenkomst tot stand komt.',
            },
            {
              term: 'Overeenkomst',
              description:
                'De schriftelijk of per e-mail door ons bevestigde afspraak tot het verrichten van werkzaamheden of het leveren van goederen/diensten.',
            },
          ],
        },
      ],
    },
    {
      id: 'art-2',
      number: 'Artikel 2',
      title: 'Toepasselijkheid',
      blocks: [
        {
          type: 'p',
          text: 'Deze voorwaarden zijn van toepassing op alle aanbiedingen, offertes, overeenkomsten en werkzaamheden van Green Installatie Noord, tenzij schriftelijk anders overeengekomen.',
        },
        {
          type: 'p',
          text: 'Afwijkingen gelden alleen als wij die schriftelijk of per e-mail hebben bevestigd. Algemene voorwaarden van de opdrachtgever worden uitdrukkelijk van de hand gewezen, tenzij wij die schriftelijk accepteren.',
        },
        {
          type: 'p',
          text: 'Bij strijd tussen deze voorwaarden en een specifieke schriftelijke overeenkomst prevaleren de specifieke afspraken in die overeenkomst.',
        },
      ],
    },
    {
      id: 'art-3',
      number: 'Artikel 3',
      title: 'Consumenten en zakelijke klanten',
      blocks: [
        {
          type: 'p',
          text: 'Waar de wet dwingende bescherming biedt aan consumenten, blijven die rechten onverlet. Bepalingen die aansprakelijkheid beperken of uitsluiten, gelden jegens consumenten alleen voor zover dat wettelijk is toegestaan.',
        },
        {
          type: 'p',
          text: 'Jegens zakelijke klanten kunnen wij verdergaande beperkingen overeenkomen of hanteren, voor zover de wet dat toelaat. Waar in deze voorwaarden onderscheid relevant is, staat dat expliciet vermeld.',
        },
      ],
    },
    {
      id: 'art-4',
      number: 'Artikel 4',
      title: 'Website-aanvragen zijn geen overeenkomst',
      blocks: [
        {
          type: 'notice',
          tone: 'warn',
          title: 'Belangrijk',
          text: 'Het invullen en versturen van een contact-, offerte- of afspraakaanvraag via de website is uitsluitend een verzoek om contact of om een voorstel. Daaruit ontstaat geen verplichting tot uitvoering, geen prijsafspraak en geen gegarandeerd tijdstip.',
        },
        {
          type: 'p',
          text: 'Een overeenkomst komt pas tot stand wanneer wij die schriftelijk of per e-mail bevestigen (bijvoorbeeld een geaccepteerde offerte of een bevestigde afspraak tot werkzaamheden). Tot die tijd blijven beide partijen vrij.',
        },
        {
          type: 'p',
          text: 'Een door u gekozen voorkeurstijdslot op de website is een wens, geen garantie. Definitieve planning volgt na overleg en bevestiging.',
        },
      ],
    },
    {
      id: 'art-5',
      number: 'Artikel 5',
      title: 'Aanbiedingen en offertes',
      blocks: [
        {
          type: 'p',
          text: 'Alle offertes en aanbiedingen zijn vrijblijvend, tenzij daarin een termijn voor aanvaarding is opgenomen. Offertes zijn gebaseerd op de informatie die u verstrekt en op een redelijke inschatting van de situatie.',
        },
        {
          type: 'p',
          text: 'Kennelijke vergissingen of verschrijvingen in offertes of op de website binden ons niet. Prijzen op de website of in algemene teksten zijn informatief en geen bindend aanbod, tenzij uitdrukkelijk anders aangegeven.',
        },
        {
          type: 'p',
          text: 'Een offerte kan vervallen of worden aangepast als de situatie ter plaatse afwijkt van de verstrekte informatie, of als prijzen van materialen of derden wijzigen voordat de overeenkomst tot stand is gekomen.',
        },
      ],
    },
    {
      id: 'art-6',
      number: 'Artikel 6',
      title: 'Totstandkoming van de overeenkomst',
      blocks: [
        {
          type: 'p',
          text: 'De overeenkomst komt tot stand door uw aanvaarding van ons aanbod en onze bevestiging daarvan schriftelijk of per e-mail, of door ondertekening van een opdrachtbevestiging of vergelijkbaar document.',
        },
        {
          type: 'p',
          text: 'Mondelinge toezeggingen binden ons alleen voor zover wij die schriftelijk of per e-mail bevestigen.',
        },
      ],
    },
    {
      id: 'art-7',
      number: 'Artikel 7',
      title: 'Prijzen',
      blocks: [
        {
          type: 'p',
          text: 'Prijzen worden vermeld in euro’s. Of bedragen inclusief of exclusief btw zijn, staat in de offerte of bevestiging. Op deze website publiceren wij geen btw-nummer.',
        },
        {
          type: 'p',
          text: 'Tenzij anders overeengekomen, zijn in de prijs niet inbegrepen: bijkomende werkzaamheden die buiten de overeengekomen scope vallen, noodzakelijke aanpassingen aan de bestaande installatie die pas ter plaatse blijken, vergunningen, asbestsanering, constructieve aanpassingen en vergelijkbare derdenkosten.',
        },
      ],
    },
    {
      id: 'art-8',
      number: 'Artikel 8',
      title: 'Meer- en minderwerk',
      blocks: [
        {
          type: 'p',
          text: 'Meerwerk is werk dat buiten de overeengekomen opdracht valt of dat nodig blijkt door omstandigheden die bij het aangaan van de overeenkomst redelijkerwijs niet voorzienbaar waren. Minderwerk is overeengekomen werk dat niet wordt uitgevoerd.',
        },
        {
          type: 'p',
          text: 'Meerwerk wordt, voor zover praktisch mogelijk, vooraf besproken en bevestigd. Spoedeisende situaties of situaties waarin stilstand onredelijke schade of gevaar oplevert, kunnen tot gevolg hebben dat wij eerst handelen en daarna afrekenen of bevestigen.',
        },
        {
          type: 'p',
          text: 'U bent gehouden redelijke kosten van meerwerk te voldoen. Bij minderwerk vindt verrekening plaats voor zover overeengekomen of redelijk.',
        },
      ],
    },
    {
      id: 'art-9',
      number: 'Artikel 9',
      title: 'Planning en termijnen',
      blocks: [
        {
          type: 'p',
          text: 'Opgegeven termijnen en afspraakmomenten zijn streeftermijnen, tenzij uitdrukkelijk een fatale termijn is overeengekomen. Vertraging door omstandigheden die redelijkerwijs niet aan ons toe te rekenen zijn (zoals leveranciers buiten onze invloed, extreme weersomstandigheden, ontoereikende bereikbaarheid of overmacht) geeft geen recht op schadevergoeding, behoudens dwingend recht. Bij vertraging die wél aan ons toe te rekenen is, blijven dwingende consumentenrechten onverlet.',
        },
        {
          type: 'p',
          text: 'Wij plannen werkzaamheden in overleg. Wijziging van een bevestigde afspraak door u dient tijdig te worden gemeld. Onnodig geannuleerde of gemiste afspraken kunnen tot redelijke kosten leiden, voor zover dat redelijk en wettelijk toelaatbaar is.',
        },
      ],
    },
    {
      id: 'art-10',
      number: 'Artikel 10',
      title: 'Toegang tot de werklocatie',
      blocks: [
        {
          type: 'p',
          text: 'U zorgt ervoor dat de werklocatie tijdig toegankelijk, veilig en geschikt is voor de overeengekomen werkzaamheden, inclusief voldoende werkruimte, stroom waar nodig, en medewerking van bewoners of beheerders.',
        },
        {
          type: 'p',
          text: 'Vertraging of extra kosten door gebrekkige toegang, ontoereikende informatie of onveilige situaties komen voor uw rekening, tenzij die aan ons toe te rekenen zijn.',
        },
      ],
    },
    {
      id: 'art-11',
      number: 'Artikel 11',
      title: 'Uw medewerking en informatie',
      blocks: [
        {
          type: 'p',
          text: 'U verstrekt tijdig alle gegevens die redelijkerwijs nodig zijn voor een juiste uitvoering, waaronder technische kenmerken van bestaande installaties, eerdere storingen en eventuele relevante bouwtechnische beperkingen.',
        },
        {
          type: 'p',
          text: 'Foto’s of documenten die u later per e-mail of ander overeengekomen kanaal stuurt, gebruikt u op eigen verantwoordelijkheid. Bij website-offerteaanvragen worden geselecteerde foto’s niet als beeldbestand geüpload; alleen eventuele bestandsmetadata kan in de aanvraag meegaan.',
        },
      ],
    },
    {
      id: 'art-11a',
      number: 'Artikel 11a',
      title: 'Vergunningen en toestemmingen',
      blocks: [
        {
          type: 'p',
          text: 'Voor zover voor de werkzaamheden vergunningen, meldingen of toestemmingen van derden (bijvoorbeeld VvE, verhuurder of gemeente) nodig zijn, bent u daarvoor verantwoordelijk, tenzij schriftelijk anders is overeengekomen. Vertraging of weigering daarvan kan tot uitstel of merkosten leiden.',
        },
      ],
    },
    {
      id: 'art-11b',
      number: 'Artikel 11b',
      title: 'Onvoorziene omstandigheden en bestaande installaties',
      blocks: [
        {
          type: 'p',
          text: 'Bij onvoorziene technische omstandigheden (bijvoorbeeld asbestverdachte materialen, verborgen leidingen, afwijkende constructies of ondeugdelijke bestaande installaties) informeren wij u zo spoedig mogelijk. Extra werkzaamheden of materialen die daaruit volgen, worden als meerwerk behandeld, tenzij dwingend recht anders bepaalt.',
        },
        {
          type: 'p',
          text: 'Wij zijn niet verantwoordelijk voor gebreken aan bestaande installaties of bouwkundige voorzieningen die u of derden hebben aangelegd, voor zover die buiten onze opdracht vallen.',
        },
      ],
    },
    {
      id: 'art-12',
      number: 'Artikel 12',
      title: 'Materialen en derden',
      blocks: [
        {
          type: 'p',
          text: 'Wij mogen materialen van gerenommeerde merken gebruiken die geschikt zijn voor het beoogde doel, ook als dat een equivalent is van een door u genoemde specificatie, tenzij schriftelijk anders overeengekomen.',
        },
        {
          type: 'p',
          text: 'Voor zover wij onderdelen of diensten van derden inkopen, gelden voor garantie en levering mede de voorwaarden van die derden, voor zover dat redelijk en kenbaar is.',
        },
      ],
    },
    {
      id: 'art-13',
      number: 'Artikel 13',
      title: 'Uitvoering van werkzaamheden',
      blocks: [
        {
          type: 'p',
          text: 'Wij voeren werkzaamheden uit volgens de eisen van goed vakmanschap en de overeengekomen specificaties. Wij mogen de uitvoering deels laten verrichten door bekwame derden onder onze verantwoordelijkheid, tenzij anders overeengekomen.',
        },
        {
          type: 'p',
          text: 'Kleine afwijkingen die de functionaliteit niet wezenlijk aantasten, vormen geen tekortkoming.',
        },
      ],
    },
    {
      id: 'art-14',
      number: 'Artikel 14',
      title: 'Oplevering en klachten over uitvoering',
      blocks: [
        {
          type: 'p',
          text: 'Na afronding van werkzaamheden geldt de oplevering als aanvaard indien u die heeft goedgekeurd, dan wel indien u niet binnen een redelijke termijn na oplevering gemotiveerd heeft geklaagd over zichtbare gebreken.',
        },
        {
          type: 'p',
          text: 'Verborgen gebreken meldt u zo spoedig mogelijk na ontdekking. Klachten schorten de betalingsverplichting niet automatisch op voor het onbetwiste deel van de factuur. Bij consumenten kunnen dwingende regels of een ernstig gebrek aanleiding geven tot opschorting of verrekening; die rechten blijven onverlet. Wij kunnen schriftelijk anders overeenkomen.',
        },
      ],
    },
    {
      id: 'art-15',
      number: 'Artikel 15',
      title: 'Betaling',
      blocks: [
        {
          type: 'p',
          text: 'Betaling geschiedt binnen de op de factuur vermelde termijn, of bij gebreke daarvan binnen 14 dagen na factuurdatum, tenzij schriftelijk anders overeengekomen. Wij kunnen een aanbetaling of betaling vooraf verlangen.',
        },
        {
          type: 'p',
          text: 'Bezwaren tegen een factuur deelt u zo spoedig mogelijk schriftelijk of per e-mail mee. Dat ontslaat u niet van tijdige betaling van het onbetwiste deel.',
        },
      ],
    },
    {
      id: 'art-16',
      number: 'Artikel 16',
      title: 'Verzuim en incassokosten',
      blocks: [
        {
          type: 'p',
          text: 'Bij overschrijding van de betalingstermijn bent u van rechtswege in verzuim, zonder nadere ingebrekestelling, voor zover de wet dat toelaat. Jegens consumenten sturen wij eerst de wettelijk vereiste aanmaning voordat buitengerechtelijke incassokosten in rekening worden gebracht.',
        },
        {
          type: 'p',
          text: 'Bij consumenten vorderen wij buitengerechtelijke incassokosten conform de wettelijke staffel (Besluit vergoeding voor buitengerechtelijke incassokosten), na de vereiste aanmaning. Bij zakelijke klanten kunnen redelijke incassokosten en wettelijke (handels)rente in rekening worden gebracht voor zover toegestaan.',
        },
        {
          type: 'p',
          text: 'Wij mogen werkzaamheden opschorten bij openstaande opeisbare vorderingen, na kennisgeving, voor zover dat redelijk en wettelijk toelaatbaar is.',
        },
      ],
    },
    {
      id: 'art-17',
      number: 'Artikel 17',
      title: 'Eigendomsvoorbehoud',
      blocks: [
        {
          type: 'p',
          text: 'Geleverde goederen blijven ons eigendom tot u alle daarop betrekking hebbende vorderingen volledig heeft voldaan, voor zover de wet dat toelaat. U mag die goederen niet verpanden of belasten zolang het voorbehoud geldt.',
        },
      ],
    },
    {
      id: 'art-18',
      number: 'Artikel 18',
      title: 'Herroepingsrecht bij overeenkomsten op afstand (consumenten)',
      blocks: [
        {
          type: 'notice',
          tone: 'info',
          title: 'Niet van toepassing op een enkele website-aanvraag',
          text: 'Het herroepingsrecht geldt niet voor het enkele versturen van een contact-, offerte- of afspraakaanvraag via de website. Dat is geen overeenkomst op afstand tot levering of dienstverlening.',
        },
        {
          type: 'p',
          text: 'Indien later wél een overeenkomst op afstand met een consument tot stand komt (bijvoorbeeld digitaal gesloten zonder dat u ons bedrijfspand bezoekt), heeft u in beginsel een bedenktijd van 14 dagen om zonder opgave van redenen te herroepen, tenzij een wettelijke uitzondering geldt.',
        },
        {
          type: 'p',
          text: 'Herroeping kan schriftelijk of per e-mail (bijvoorbeeld naar het adres in artikel 1), met een duidelijke verklaring. U mag daarvoor het Europese modelformulier voor herroeping gebruiken, maar dat is niet verplicht. Wij bevestigen de ontvangst van een herroeping zo spoedig mogelijk.',
        },
        {
          type: 'p',
          text: 'Uitzonderingen kunnen onder meer gelden bij diensten die met uw uitdrukkelijke voorafgaande toestemming tijdens de bedenktijd volledig zijn uitgevoerd én waarbij u heeft erkend dat u uw herroepingsrecht verliest zodra de overeenkomst volledig is uitgevoerd, of bij op maat gemaakte goederen, voor zover de wet dat bepaalt. Bij spoedeisend herstel of onderhoud dat u uitdrukkelijk heeft verzocht, kunnen eveneens uitzonderingen gelden.',
        },
        {
          type: 'p',
          text: 'Wilt u dat wij tijdens de bedenktijd al starten met werkzaamheden, dan vragen wij daarvoor uw uitdrukkelijke verzoek. U bent dan, indien de wet dat bepaalt, een evenredig bedrag verschuldigd voor de reeds verrichte prestaties als u alsnog herroept. Wanneer herroepingsrecht van toepassing is, herhalen wij de bedenktijd en de wijze van herroeping in de bevestiging of offerte.',
        },
      ],
    },
    {
      id: 'art-19',
      number: 'Artikel 19',
      title: 'Annulering en wijziging',
      blocks: [
        {
          type: 'p',
          text: 'Dit artikel beperkt niet het wettelijke herroepingsrecht van consumenten bij overeenkomsten op afstand (zie artikel 18).',
        },
        {
          type: 'p',
          text: 'Buiten dat herroepingsrecht is annulering of wijziging van een bevestigde overeenkomst alleen mogelijk met onze instemming, tenzij dwingend recht anders bepaalt. Reeds gemaakte, aantoonbare kosten (materialen, derden, gereserveerde tijd) kunnen in rekening worden gebracht voor zover dat redelijk en wettelijk toelaatbaar is — ook als uitzondering op herroeping van toepassing is omdat werkzaamheden op uitdrukkelijk verzoek tijdens de bedenktijd zijn gestart.',
        },
      ],
    },
    {
      id: 'art-20',
      number: 'Artikel 20',
      title: 'Garantie en conformiteit',
      blocks: [
        {
          type: 'p',
          text: 'Op uitgevoerde werkzaamheden en geleverde producten geldt de wettelijke conformiteit jegens consumenten. Daarnaast kunnen fabrieksgaranties van fabrikanten van toepassing zijn; die gelden naast — en niet in plaats van — dwingende consumentenrechten.',
        },
        {
          type: 'p',
          text: 'Wij publiceren in deze voorwaarden geen vaste garantieperioden in maanden of jaren, omdat die afhankelijk zijn van product, installatie en afspraak. Concrete garantievoorwaarden staan in de offerte, bevestiging of productdocumentatie.',
        },
        {
          type: 'p',
          text: 'Garantie geldt niet bij normaal slijtage, onjuist gebruik, gebrek aan onderhoud, wijzigingen door derden zonder onze toestemming, of schade door externe oorzaken (bijvoorbeeld vorst, bliksem, verkeerde druk of vervuiling), voor zover dat redelijk en wettelijk toelaatbaar is.',
        },
      ],
    },
    {
      id: 'art-21',
      number: 'Artikel 21',
      title: 'Onderhoud en instructies',
      blocks: [
        {
          type: 'p',
          text: 'U volgt de gebruiks- en onderhoudsinstructies van de installatie en fabrikant. Achterstallig onderhoud kan de levensduur en werking beïnvloeden en kan gevolgen hebben voor garantieclaims.',
        },
      ],
    },
    {
      id: 'art-22',
      number: 'Artikel 22',
      title: 'Aansprakelijkheid',
      blocks: [
        {
          type: 'p',
          text: 'Wij zijn aansprakelijk voor schade die het rechtstreekse gevolg is van een toerekenbare tekortkoming in de nakoming van de overeenkomst, voor zover de wet dat bepaalt.',
        },
        {
          type: 'p',
          text: 'Voor zover wettelijk toegestaan is onze aansprakelijkheid beperkt tot het bedrag dat in het betreffende geval door onze aansprakelijkheidsverzekering wordt uitbetaald, vermeerderd met het eigen risico. Is er geen dekking, dan is de aansprakelijkheid — voor zover toegestaan — beperkt tot het factuurbedrag van de opdracht waarop de schade betrekking heeft. Jegens consumenten laten wij dwingende rechten onverlet, waaronder wettelijke conformiteit en aansprakelijkheid die niet mag worden uitgesloten of beperkt.',
        },
        {
          type: 'p',
          text: 'Wij zijn niet aansprakelijk voor indirecte schade, gevolgschade, gederfde winst, gemiste besparingen of bedrijfsstagnatie, voor zover uitsluiting wettelijk is toegestaan. Dwingende rechten van consumenten, waaronder aansprakelijkheid voor schade door dood of letsel veroorzaakt door opzet of bewuste roekeloosheid, worden niet uitgesloten.',
        },
      ],
    },
    {
      id: 'art-23',
      number: 'Artikel 23',
      title: 'Overmacht',
      blocks: [
        {
          type: 'p',
          text: 'Onder overmacht wordt verstaan elke omstandigheid buiten onze redelijke controle die nakoming verhindert of onredelijk bezwaarlijk maakt, waaronder — maar niet beperkt tot — extreme weersomstandigheden, epidemieën, oorlog, stakingen, storingen bij nutsbedrijven, tekorten aan materialen, transportproblemen en tekortkomingen van toeleveranciers die niet aan ons toe te rekenen zijn.',
        },
        {
          type: 'p',
          text: 'Bij overmacht kunnen termijnen worden verlengd. Duurt de overmacht langer dan 60 dagen, dan kunnen partijen de overeenkomst voor het niet-uitvoerbare deel ontbinden zonder schadeplichtigheid, onverminderd het recht op betaling van reeds verrichte prestaties.',
        },
      ],
    },
    {
      id: 'art-24',
      number: 'Artikel 24',
      title: 'Opschorting en ontbinding',
      blocks: [
        {
          type: 'p',
          text: 'Wij mogen de overeenkomst opschorten of ontbinden indien u wezenlijk tekortschiet, failliet gaat, surseance aanvraagt, of indien nakoming door overmacht duurzaam onmogelijk is, met inachtneming van dwingend recht.',
        },
      ],
    },
    {
      id: 'art-25',
      number: 'Artikel 25',
      title: 'Klachtenprocedure',
      blocks: [
        {
          type: 'p',
          text: `Klachten over uitvoering of facturatie stuurt u bij voorkeur schriftelijk of per e-mail naar ${business.email}, onder vermelding van uw gegevens, de opdracht en een duidelijke omschrijving. Wij streven ernaar klachten zorgvuldig en binnen een redelijke termijn te behandelen.`,
        },
        {
          type: 'p',
          text: `U kunt ons ook bereiken op ${business.phone}. Spoedeisende storingen: zie onze storingsdienst; bij acuut gevaar belt u altijd eerst de noodhulpdiensten.`,
        },
      ],
    },
    {
      id: 'art-26',
      number: 'Artikel 26',
      title: 'Privacy',
      blocks: [
        {
          type: 'p',
          text: 'Verwerking van persoonsgegevens is beschreven in onze privacyverklaring. Website-aanvragen verwerken wij voor zover nodig om uw verzoek te behandelen en (waar van toepassing) om precontractuele stappen te zetten, zoals in die verklaring toegelicht. Het versturen van een aanvraag is geen aparte “privacy-toestemming” naast de wettelijke grondslagen in de privacyverklaring.',
        },
      ],
    },
    {
      id: 'art-27',
      number: 'Artikel 27',
      title: 'Intellectuele eigendom',
      blocks: [
        {
          type: 'p',
          text: 'Teksten, ontwerpen, foto’s, logo’s en overige content op de website en in offertes blijven ons intellectuele eigendom of dat van onze licentiegevers. Zonder toestemming mag u die niet kopiëren of commercieel gebruiken, behoudens dwingend recht (zoals citaatrecht).',
        },
      ],
    },
    {
      id: 'art-28',
      number: 'Artikel 28',
      title: 'Geheimhouding',
      blocks: [
        {
          type: 'p',
          text: 'Partijen betrachten geheimhouding over vertrouwelijke informatie die zij in het kader van de opdracht ontvangen, tenzij openbaarmaking wettelijk verplicht is of met toestemming gebeurt.',
        },
      ],
    },
    {
      id: 'art-29',
      number: 'Artikel 29',
      title: 'Nietigheid',
      blocks: [
        {
          type: 'p',
          text: 'Indien een bepaling van deze voorwaarden nietig of vernietigbaar is, blijven de overige bepalingen van kracht. Partijen treden in overleg over een vervangende bepaling die de bedoeling van de oorspronkelijke zoveel mogelijk benadert.',
        },
      ],
    },
    {
      id: 'art-30',
      number: 'Artikel 30',
      title: 'Wijziging van voorwaarden',
      blocks: [
        {
          type: 'p',
          text: 'Wij kunnen deze voorwaarden wijzigen. Voor lopende overeenkomsten geldt de versie die bij totstandkoming van toepassing was, tenzij een wijziging wettelijk verplicht is of u met een nieuwe versie instemt. De actuele versie staat op de website met versienummer en datum.',
        },
      ],
    },
    {
      id: 'art-31',
      number: 'Artikel 31',
      title: 'Toepasselijk recht',
      blocks: [
        {
          type: 'p',
          text: 'Op alle rechtsverhoudingen met Green Installatie Noord is Nederlands recht van toepassing.',
        },
      ],
    },
    {
      id: 'art-32',
      number: 'Artikel 32',
      title: 'Geschillen',
      blocks: [
        {
          type: 'p',
          text: 'Geschillen worden bij voorkeur in onderling overleg opgelost. Leidt dat niet tot een oplossing, dan is de bevoegde rechter in het arrondissement van onze vestigingsplaats bevoegd, tenzij dwingend recht een andere rechter aanwijst (bijvoorbeeld voor consumenten).',
        },
      ],
    },
    {
      id: 'art-33',
      number: 'Artikel 33',
      title: 'Printen en downloaden',
      blocks: [
        {
          type: 'p',
          text: 'Als u deze pagina print of opslaat, is de tekst dezelfde als op de website op het moment van raadpleging. Controleer altijd het versienummer en de datum “laatste wijziging” bovenaan de pagina. Een geprinte of gedownloade kopie kan verouderd zijn als de online versie later is bijgewerkt.',
        },
      ],
    },
    {
      id: 'art-34',
      number: 'Artikel 34',
      title: 'Contactgegevens',
      blocks: [
        {
          type: 'ul',
          items: [
            legalMeta.companyLine,
            legalMeta.kvkLine,
            legalMeta.contactLine,
            `Website: ${business.website}`,
          ],
        },
      ],
    },
  ],
}
