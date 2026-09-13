import {
  activeCookies,
  cookieCategories,
  type CookieCategory,
  type CookieRegistryItem,
} from '../../config/cookies'
import { business } from '../business'
import { legalDates } from './meta'
import type { LegalBlock, LegalDocument, LegalSection } from './types'

const d = legalDates.cookies

const storageLabel: Record<CookieRegistryItem['storage'], string> = {
  'http-cookie': 'HTTP-cookie',
  localStorage: 'localStorage',
  sessionStorage: 'sessionStorage',
  script: 'Script',
  server: 'Server / infrastructuur',
}

function cookieRows(items: CookieRegistryItem[]): string[][] {
  return items.map((item) => [
    item.name,
    item.provider,
    item.purpose,
    storageLabel[item.storage],
    item.lifetime,
  ])
}

const publicCookies = activeCookies('public')
const adminOnly = activeCookies('admin').filter((item) => item.audience === 'admin')

const categoryOrder: CookieCategory[] = ['necessary', 'preferences', 'analytics', 'marketing']

function categorySections(): LegalSection[] {
  return categoryOrder.map((category) => {
    const items = publicCookies.filter((item) => item.category === category)
    const meta = cookieCategories[category]
    const blocks: LegalBlock[] =
      items.length > 0
        ? [
            { type: 'p', text: meta.description },
            {
              type: 'table',
              caption: `Actieve items — ${meta.label}`,
              headers: ['Naam', 'Aanbieder', 'Doel', 'Type', 'Bewaartermijn'],
              rows: cookieRows(items),
            },
          ]
        : [
            { type: 'p', text: meta.description },
            {
              type: 'notice',
              tone: 'info',
              title: 'Niet actief',
              text: `Er zijn op dit moment geen actieve ${meta.label.toLowerCase()} cookies of vergelijkbare technologieën aangesloten voor bezoekers van de openbare website.`,
            },
          ]

    return {
      id: `categorie-${category}`,
      number: String(3 + categoryOrder.indexOf(category)),
      title: `Categorie: ${meta.label}`,
      blocks,
    }
  })
}

export const cookies: LegalDocument = {
  id: 'cookies',
  title: 'Cookiebeleid',
  path: '/cookies',
  eyebrow: 'Cookies & opslag',
  intro:
    'Dit cookiebeleid beschrijft welke cookies en vergelijkbare technieken greeninstallatienoord.nl gebruikt. Wij noemen alleen wat nu daadwerkelijk actief is. Er is geen Google Analytics en er zijn geen marketingpixels aangesloten.',
  metaDescription:
    'Cookiebeleid van Green Installatie Noord: noodzakelijke opslag, geen analytics of marketingcookies, toestemming en cookie-instellingen.',
  version: d.version,
  effectiveDate: d.effective,
  lastUpdated: d.updated,
  sections: [
    {
      id: 'wat-zijn-cookies',
      number: '1',
      title: 'Wat zijn cookies en vergelijkbare opslag?',
      blocks: [
        {
          type: 'p',
          text: 'Cookies zijn kleine tekstbestanden die een website via uw browser kan plaatsen. Daarnaast kunnen websites gegevens bewaren in localStorage of sessionStorage op uw apparaat, of technische gegevens laten verwerken door servers (bijvoorbeeld bij hosting of kaarttegels).',
        },
        {
          type: 'p',
          text: 'In dit beleid vallen onder “cookies en vergelijkbare technieken” ook localStorage, sessionStorage, bepaalde scripts en server-side verwerking die nodig is om de site te laten werken of te beveiligen.',
        },
      ],
    },
    {
      id: 'categorieen-uitleg',
      number: '2',
      title: 'Categorieën',
      blocks: [
        {
          type: 'p',
          text: 'Wij hanteren de volgende categorieën. Alleen wat onder “actief” valt, wordt daadwerkelijk gebruikt.',
        },
        {
          type: 'dl',
          items: categoryOrder.map((key) => ({
            term: cookieCategories[key].label,
            description: cookieCategories[key].description,
          })),
        },
        {
          type: 'notice',
          tone: 'info',
          title: 'Geen nep-analytics',
          text: 'Zolang er geen analytisch of marketing-script is aangesloten, starten die categorieën niet — ook niet als u in de cookiemelding “Alles accepteren” zou kiezen. De melding is voorbereid op eventuele latere uitbreiding; de actuele situatie staat in de tabellen hieronder.',
        },
      ],
    },
    ...categorySections(),
    {
      id: 'beheer-alleen',
      number: '7',
      title: 'Alleen voor medewerkers (beheer)',
      blocks: [
        {
          type: 'p',
          text: 'Gewone websitebezoekers krijgen geen beheersessie. Voor medewerkers die inloggen op het interne beheerscherm kunnen aanvullende noodzakelijke middelen actief zijn:',
        },
        {
          type: 'table',
          caption: 'Admin-only (niet voor publieke bezoekers)',
          headers: ['Naam', 'Aanbieder', 'Doel', 'Type', 'Bewaartermijn'],
          rows: cookieRows(adminOnly),
        },
        {
          type: 'p',
          text: 'De sessiecookie gin_admin_session is uitsluitend bedoeld voor beveiligde toegang tot het beheerscherm (maximaal 12 uur, idle-timeout 2 uur).',
        },
      ],
    },
    {
      id: 'toestemming',
      number: '8',
      title: 'Hoe toestemming werkt',
      blocks: [
        {
          type: 'p',
          text: 'Noodzakelijke cookies en opslag vereisen geen toestemming. Optionele categorieën (voorkeuren, analytisch, marketing) worden alleen na uw toestemming geactiveerd — en alleen als er daadwerkelijk een script of technologie in die categorie is aangesloten. Dat is op dit moment niet het geval.',
        },
        {
          type: 'p',
          text: 'Uw cookiekeuze wordt vastgelegd in localStorage onder de sleutel gin-consent-v2. We bewaren alleen de beleidversie, de gekozen categorieën, een tijdstip en de bron van de keuze (bijvoorbeeld banner of voorkeurenpaneel). Geen onnodige persoonsgegevens. Formulierconcepten staan in sessionStorage en verdwijnen wanneer u het tabblad of de browsersessie sluit, of wanneer u het formulier verstuurt.',
        },
        {
          type: 'p',
          text: 'Als het cookiebeleid materieel wijzigt (nieuwe doelen of categorieën), vragen we opnieuw om een keuze. Zolang niets materieel verandert, herhalen we de melding niet bij elk bezoek.',
        },
      ],
    },
    {
      id: 'wijzigen',
      number: '9',
      title: 'Uw keuze wijzigen',
      blocks: [
        {
          type: 'p',
          text: 'Via “Cookie-instellingen” (onderaan pagina’s en op deze pagina) opent u het voorkeurenpaneel. Daar kunt u een keuze opslaan, alles accepteren, alleen noodzakelijk kiezen, of toestemming intrekken (alle optionele categorieën uit). Daarnaast kunt u cookies en sitegegevens wissen of blokkeren via de instellingen van uw browser. Let op: als u noodzakelijke opslag verwijdert, kan de site minder goed werken (bijvoorbeeld opnieuw tonen van de melding, of verlies van een formulierconcept).',
        },
      ],
    },
    {
      id: 'derden',
      number: '10',
      title: 'Derden: Cloudflare-edge en OpenStreetMap',
      blocks: [
        {
          type: 'p',
          text: 'Cloudflare levert hosting, beveiliging en uitrol van de website. Daarbij kan Cloudflare technische gegevens verwerken die nodig zijn om de site te tonen en te beschermen (bijvoorbeeld IP-adres en verzoekmetadata). Dat is geen statistiek- of marketingmeting van Green Installatie Noord.',
        },
        {
          type: 'p',
          text: 'OpenStreetMap-tegels worden alleen geladen wanneer u op de werkgebiedpagina expliciet “Kaart laden” kiest. Dan kunnen technische verzoekgegevens bij de tegelprovider terechtkomen. Zonder die actie vinden die tegelverzoeken niet plaats.',
        },
        {
          type: 'p',
          text: 'Lettertypen staan op onze eigen website. Links naar sociale media openen die diensten; wij plaatsen geen embeds of trackingpixels van Facebook, Instagram, TikTok of Google Business Profile.',
        },
      ],
    },
    {
      id: 'meer-info',
      number: '11',
      title: 'Meer informatie',
      blocks: [
        {
          type: 'p',
          text: `Voor de bredere verwerking van persoonsgegevens (formulieren, e-mail, bewaartermijnen en AVG-rechten) zie de privacyverklaring. Vragen over dit cookiebeleid kunt u stellen via ${business.email} of ${business.phone}.`,
        },
      ],
    },
  ],
}
