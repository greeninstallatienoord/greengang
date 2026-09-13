import type { ReactNode } from 'react'
import {
  CalendarDays,
  FileText,
  Globe2,
  Inbox,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  NotebookPen,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Smartphone,
  Users,
  Wrench,
} from 'lucide-react'
import { business } from '../../data/business'
import { cn } from '../../lib/cn'
import { PageHeader } from '../components/PageHeader'

type StatusTone = 'active' | 'ready' | 'manual' | 'optional' | 'later' | 'recommend'

const statusStyles: Record<StatusTone, string> = {
  active: 'bg-[#eef3ef] text-[#1f3d28] ring-[#9bb5a0]/55',
  ready: 'bg-[#f3f4f1] text-[#3d4540] ring-[#c5cac1]',
  manual: 'bg-[var(--admin-warn-soft)] text-[var(--admin-warn)] ring-[#8a6a1f]/25',
  optional: 'bg-[#f5f4f1] text-[var(--admin-muted)] ring-[var(--admin-line)]',
  later: 'bg-[#f5f4f1] text-[var(--admin-muted)] ring-[var(--admin-line)]',
  recommend: 'bg-[var(--admin-accent-soft)] text-[#14692a] ring-[#1a8a34]/25',
}

function StatusChip({
  label,
  tone = 'active',
}: {
  label: string
  tone?: StatusTone
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[3px] px-1.5 py-0.5 text-[11px] font-semibold tracking-[0.01em] ring-1 ring-inset',
        statusStyles[tone],
      )}
    >
      {label}
    </span>
  )
}

function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('mb-5 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-4 sm:mb-6 sm:p-5', className)}>
      {children}
    </section>
  )
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-[var(--admin-muted)] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-1 text-base font-semibold tracking-[-0.015em] text-[var(--admin-ink)] sm:text-[1.05rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--admin-muted)]">{description}</p>
      ) : null}
    </div>
  )
}

function FeatureBlock({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="border border-[var(--admin-line)] bg-[#fbfaf7] p-3.5 sm:p-4">
      <h4 className="text-sm font-semibold text-[var(--admin-ink)]">{title}</h4>
      <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-[var(--admin-muted)]">
        {children}
      </div>
    </div>
  )
}

function GroupHeading({
  icon: Icon,
  title,
}: {
  icon: typeof Globe2
  title: string
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="inline-flex size-7 items-center justify-center border border-[var(--admin-line)] bg-white text-[var(--admin-ink)]">
        <Icon className="size-3.5" aria-hidden />
      </span>
      <h3 className="text-sm font-semibold tracking-[-0.01em] text-[var(--admin-ink)]">{title}</h3>
    </div>
  )
}

const systemStatus = [
  { label: 'Website', status: 'Actief', tone: 'active' as const },
  { label: 'Offerteaanvragen', status: 'Actief', tone: 'active' as const },
  { label: 'Afspraken', status: 'Actief', tone: 'active' as const },
  { label: 'Contactformulier', status: 'Actief', tone: 'active' as const },
  { label: 'Klantenbeheer', status: 'Actief', tone: 'active' as const },
  { label: 'E-mailcentrum', status: 'Actief', tone: 'active' as const },
  { label: 'Adminbeveiliging', status: 'Actief', tone: 'active' as const },
  { label: '24/7 storingsinformatie', status: 'Actief', tone: 'active' as const },
  { label: 'SEO & kennis', status: 'Ingericht', tone: 'ready' as const },
  { label: 'Cookie/privacy', status: 'Ingericht', tone: 'ready' as const },
]

const adminModules = [
  { name: 'Overzicht', icon: LayoutDashboard },
  { name: 'Afspraken', icon: CalendarDays },
  { name: 'Offertes', icon: FileText },
  { name: 'Klanten', icon: Users },
  { name: 'Agenda', icon: CalendarDays },
  { name: 'Contactaanvragen', icon: Inbox },
  { name: 'E-mails', icon: Mail },
  { name: 'Templates', icon: NotebookPen },
  { name: 'Instellingen', icon: Settings },
]

const flowSteps = [
  {
    title: 'Bezoeker doet een aanvraag',
    text: 'Offerte, afspraak of contact via de publieke website.',
  },
  {
    title: 'Backend controleert en verwerkt',
    text: 'Gegevens worden gevalideerd en veilig opgeslagen.',
  },
  {
    title: 'Admin wordt bijgewerkt',
    text: 'De aanvraag verschijnt in Offertes, Afspraken of Contact.',
  },
  {
    title: 'E-mail naar Green Installatie Noord',
    text: `Melding naar ${business.email}.`,
  },
  {
    title: 'Klant krijgt bevestiging',
    text: 'Ontvangstbevestiging — geen automatische eindafspraak of offerte-akkoord.',
  },
]

const techRows = [
  { label: 'Frontend', value: 'React / Vite' },
  { label: 'Hosting & backend', value: 'Cloudflare Workers' },
  { label: 'Database', value: 'Cloudflare D1' },
  { label: 'E-mail', value: 'Transactionele e-mailinfrastructuur' },
  { label: 'Bescherming', value: 'Validatie, honeypot, rate limiting, Cloudflare' },
  { label: 'Deployment', value: 'Git + Cloudflare-uitrol' },
]

type RoadmapItem = {
  title: string
  text: string
  tag: 'AANBEVOLEN' | 'LATER' | 'OPTIONEEL'
}

const roadmapGroups: Array<{
  title: string
  items: RoadmapItem[]
}> = [
  {
    title: 'Communicatie',
    items: [
      {
        title: 'SMS-notificaties',
        text: 'Korte sms bij een nieuwe offerte of afspraak, naast de bestaande e-mail.',
        tag: 'LATER',
      },
      {
        title: 'Telegram-meldingen',
        text: 'Optioneel: nieuwe aanvragen of belangrijke alerts via een privé Telegram-bot.',
        tag: 'OPTIONEEL',
      },
      {
        title: 'WhatsApp-integratie',
        text: 'Diepere WhatsApp Business-koppeling of statusberichten. De huidige zwevende knop is een algemeen contactmenu (bellen, offerte, afspraak, storing) — geen WhatsApp-automatisering.',
        tag: 'OPTIONEEL',
      },
    ],
  },
  {
    title: 'Planning',
    items: [
      {
        title: 'Agenda-synchronisatie',
        text: 'Bevestigde afspraken automatisch naar Google Calendar of Outlook.',
        tag: 'AANBEVOLEN',
      },
      {
        title: 'Automatische afspraakherinneringen',
        text: 'Bijvoorbeeld 24 of 48 uur vóór een bevestigde afspraak een herinnering naar de klant.',
        tag: 'AANBEVOLEN',
      },
      {
        title: 'Monteur-/teamplanning',
        text: 'Handig als meerdere monteurs of teams gelijktijdig moeten worden ingepland.',
        tag: 'LATER',
      },
    ],
  },
  {
    title: 'Klantervaring',
    items: [
      {
        title: 'Klantportaal',
        text: 'Later: klanten die hun afspraken, documenten of status zelf kunnen inzien. Bestaat nu niet.',
        tag: 'OPTIONEEL',
      },
      {
        title: 'Digitale offerte-goedkeuring',
        text: 'Klant keurt een offerte online goed. Alleen als toekomstige uitbreiding.',
        tag: 'LATER',
      },
      {
        title: 'Document- / factuurkoppeling',
        text: 'Koppeling met boekhoud- of facturatiesoftware.',
        tag: 'OPTIONEEL',
      },
    ],
  },
  {
    title: 'Marketing',
    items: [
      {
        title: 'Review-automatisering',
        text: 'Na afgerond werk automatisch een uitnodiging voor een Google-review sturen.',
        tag: 'AANBEVOLEN',
      },
      {
        title: 'Rapportage / analytics-dashboard',
        text: 'Aanvragen, bronnen, drukke periodes en meest gevraagde diensten in één overzicht.',
        tag: 'AANBEVOLEN',
      },
      {
        title: 'Campagne-landingspagina’s',
        text: 'Specifieke pagina’s voor Google Ads of seizoenscampagnes.',
        tag: 'LATER',
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        title: 'Contentbeheer in admin',
        text: 'Zelf projectfoto’s uploaden, projecten publiceren, geselecteerde teksten of kennisartikelen bijwerken — minder afhankelijk van een ontwikkelaar.',
        tag: 'LATER',
      },
    ],
  },
  {
    title: 'Operatie',
    items: [
      {
        title: 'Onderhouds-klantdossier',
        text: 'Ketel/installatie, installatiedatum, laatste en volgende onderhoud bijhouden per klant.',
        tag: 'AANBEVOLEN',
      },
      {
        title: 'Automatische onderhoudsherinneringen',
        text: 'Klanten tijdig herinneren aan onderhoud — direct relevant voor Green Installatie Noord.',
        tag: 'AANBEVOLEN',
      },
      {
        title: 'Servicecontracten / abonnementen',
        text: 'Onderhoudsklanten en terugkerende afspraken beheren. Hoge operationele waarde.',
        tag: 'AANBEVOLEN',
      },
    ],
  },
]

const recommendedNext = [
  'Agenda-synchronisatie (Google / Outlook)',
  'Automatische afspraakherinneringen',
  'Review-automatisering na afgerond werk',
  'Onderhoudsherinneringen & klantendossiers',
  'Rapportage van aanvragen en drukte',
]

function tagTone(tag: RoadmapItem['tag']): StatusTone {
  if (tag === 'AANBEVOLEN') return 'recommend'
  if (tag === 'LATER') return 'later'
  return 'optional'
}

export function WebsiteInfoPage() {
  return (
    <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-2">
      <PageHeader
        eyebrow="Website & systeem"
        title="Alles wat online voor Green Installatie Noord is ingericht"
        description="Een overzicht van wat er is gebouwd, hoe het systeem werkt en welke uitbreidingen later mogelijk zijn."
      />

      <Panel>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--admin-muted)]">
          Green Installatie Noord beschikt niet alleen over een professionele bedrijfswebsite, maar
          over een complete digitale omgeving: publieke website, offerte- en afspraakflows,
          contactaanvragen, klantenbeheer, privé-admin, e-mailautomatisering, beveiliging,
          SEO/content en een Cloudflare-backend met database.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--admin-muted)]">
          Dit is een intern overzicht — geen marketingpagina. Statussen hieronder weerspiegelen wat
          er in de software daadwerkelijk aanwezig is.
        </p>
      </Panel>

      <Panel>
        <SectionTitle
          title="Systeemstatus"
          description="Compact overzicht van de onderdelen die nu in gebruik of ingericht zijn."
        />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {systemStatus.map((item) => (
            <div
              key={item.label}
              className="border border-[var(--admin-line)] bg-[#fbfaf7] px-2.5 py-2.5"
            >
              <p className="text-[0.8rem] font-medium leading-snug text-[var(--admin-ink)]">
                {item.label}
              </p>
              <div className="mt-1.5">
                <StatusChip label={item.status} tone={item.tone} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionTitle
          eyebrow="Overzicht"
          title="Wat er al is gebouwd"
          description="Gegroepeerd naar website, aanvragen, beheer, e-mail en beveiliging."
        />

        <div className="mt-5 space-y-6">
          <div>
            <GroupHeading icon={Globe2} title="Website & presentatie" />
            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureBlock title="Professionele maatwerkwebsite">
                <p>
                  Specifiek opgebouwd rond CV-ketels, airconditioning, warmtepompen, service &amp;
                  onderhoud, Noord-Nederland, echte projectfotografie en de huisstijl van Green
                  Installatie Noord.
                </p>
                <p>
                  Responsive voor telefoon, tablet en desktop — dezelfde inhoud, nette presentatie
                  op elk scherm.
                </p>
              </FeatureBlock>
              <FeatureBlock title="24/7 storingsdienst">
                <p>
                  Reguliere openingstijden en de 24/7 storingsdienst zijn overal op de site
                  duidelijk gescheiden: contact, topbalk en zwevend contactmenu.
                </p>
                <p>
                  Bezoekers zien wanneer jullie bereikbaar zijn voor regulier werk én hoe ze bij
                  storingen moeten handelen.
                </p>
              </FeatureBlock>
              <FeatureBlock title="Portfolio & regio">
                <p>
                  Op <span className="font-medium text-[var(--admin-ink)]">/werk</span> staan
                  projectfoto’s van eigen installaties. Werkgebiedpagina’s maken de regio zichtbaar
                  en linkbaar.
                </p>
              </FeatureBlock>
              <FeatureBlock title="Zwevend contactmenu">
                <p>
                  Snelle acties voor bellen, offerte, afspraak en storing. Dit is een algemeen
                  contactmenu — geen WhatsApp Business-automatisering.
                </p>
              </FeatureBlock>
            </div>
          </div>

          <div>
            <GroupHeading icon={Inbox} title="Aanvragen & klanten" />
            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureBlock title="Offerteaanvragen">
                <p>
                  Bezoeker doorloopt een gestructureerde, meertrapsflow. De aanvraag wordt
                  server-side gevalideerd, opgeslagen en is zichtbaar onder Offertes.
                </p>
                <p>
                  Green Installatie Noord krijgt een interne melding; de klant ontvangt een
                  ontvangstbevestiging. Dit is geen juridisch bindende offerte.
                </p>
              </FeatureBlock>
              <FeatureBlock title="Afspraken">
                <p>
                  Dienst, voorkeursdatum en tijdvak worden centraal opgeslagen en zijn in het beheer
                  te bevestigen, herplannen of annuleren — met klantcommunicatie waar dat hoort.
                </p>
                <p>
                  Een afspraakaanvraag is niet automatisch een definitief bevestigde afspraak.
                </p>
              </FeatureBlock>
              <FeatureBlock title="Contactaanvragen">
                <p>
                  Het contactformulier landt in de admin-inbox en genereert een e-mailmelding.
                  Statussen helpen bij opvolging (nieuw, in behandeling, afgehandeld).
                </p>
              </FeatureBlock>
              <FeatureBlock title="Klanten">
                <p>
                  Gerelateerde aanvragen kunnen rond een klantdossier worden gekoppeld en hergebruikt
                  (onder meer op e-mailadres), zodat offertes, afspraken en berichten bij elkaar
                  horen.
                </p>
              </FeatureBlock>
            </div>
          </div>

          <div>
            <GroupHeading icon={LayoutDashboard} title="Admin / lichtgewicht CRM" />
            <p className="mb-3 max-w-3xl text-sm leading-relaxed text-[var(--admin-muted)]">
              De privé-adminomgeving is een intern beheersysteem (lichtgewicht CRM) — geen
              enterprise-CRM. Nieuwe aanvragen hoeven niet alleen uit een mailbox gehaald te worden;
              ze zijn centraal terug te vinden en te verwerken.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {adminModules.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 border border-[var(--admin-line)] bg-[#fbfaf7] px-2.5 py-2"
                >
                  <item.icon className="size-3.5 shrink-0 text-[var(--admin-muted)]" aria-hidden />
                  <span className="text-[0.8rem] font-medium text-[var(--admin-ink)]">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <GroupHeading icon={Mail} title="E-mail" />
            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureBlock title="Automatisering & templates">
                <p>
                  Automatische ontvangstbevestigingen en interne meldingen via een professionele
                  transactionele maildienst. Templates zijn in de admin bewerkbaar en volgen de
                  huisstijl.
                </p>
              </FeatureBlock>
              <FeatureBlock title="Handmatig & historie">
                <p>
                  Vanuit het e-mailcentrum kun je zelf een bericht opstellen en verzenden. Verzonden
                  berichten zijn terug te zien in de e-maillogs.
                </p>
              </FeatureBlock>
            </div>
          </div>

          <div>
            <GroupHeading icon={ShieldCheck} title="Beveiliging" />
            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureBlock title="Privé-admin & sessies">
                <p>
                  Beveiligde login, server-side authenticatie en beschermde sessies. De beveiliging
                  zit niet alleen in de zichtbare loginpagina: de backend controleert of een
                  beheerder daadwerkelijk is ingelogd voordat admin-API’s werken.
                </p>
              </FeatureBlock>
              <FeatureBlock title="Formulieren & infrastructuur">
                <p>
                  Server-side validatie, honeypot tegen triviale bots, rate limiting / misbruikremmen
                  op publieke endpoints, gescheiden geheimen buiten de publieke site, en HTTPS via
                  Cloudflare.
                </p>
              </FeatureBlock>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle
          eyebrow="Proces"
          title="Wat gebeurt er bij een aanvraag"
          description="Van bezoeker tot bevestiging — in vijf stappen."
        />
        <ol className="mt-5 grid list-none gap-3 p-0 md:grid-cols-5 md:gap-2">
          {flowSteps.map((step, index) => (
            <li
              key={step.title}
              className="relative border border-[var(--admin-line)] bg-[#fbfaf7] p-3.5 md:min-h-[9.5rem]"
            >
              <span className="inline-flex size-6 items-center justify-center border border-[var(--admin-line)] bg-white text-[0.7rem] font-semibold text-[var(--admin-ink)]">
                {index + 1}
              </span>
              {index < flowSteps.length - 1 ? (
                <span
                  className="pointer-events-none absolute top-1/2 -right-2 hidden h-px w-2 bg-[var(--admin-line)] md:block"
                  aria-hidden
                />
              ) : null}
              <h3 className="mt-2 text-sm font-semibold text-[var(--admin-ink)]">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--admin-muted)]">{step.text}</p>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel>
        <SectionTitle
          eyebrow="Maatwerk"
          title="Waarom dit maatwerk is"
          description="Dit is geen standaard brochure-site of losse pagina-builder."
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <FeatureBlock title="Website en beheer delen data">
            <p>
              Een aanvraag op de publieke website wordt direct onderdeel van het interne proces:
              database, admin en e-mail werken als één systeem.
            </p>
          </FeatureBlock>
          <FeatureBlock title="Eigen flows & content">
            <p>
              Eigen offerte- en afspraakflows, klantdossiers, e-mailtemplates, werkgebiedstructuur,
              projectportfolio en een responsive Green Installatie Noord-huisstijl.
            </p>
          </FeatureBlock>
        </div>
      </Panel>

      <Panel>
        <SectionTitle
          eyebrow="Fundament"
          title="Technische basis"
          description="Owner-vriendelijk overzicht — geen ontwikkeldocumentatie."
        />
        <div className="mt-4 divide-y divide-[var(--admin-line)] border border-[var(--admin-line)]">
          {techRows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-0.5 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span className="text-sm font-medium text-[var(--admin-ink)]">{row.label}</span>
              <span className="text-sm text-[var(--admin-muted)] sm:text-right">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 text-sm text-[var(--admin-muted)]">
          <Server className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <p>
            De site is maatwerksoftware op Cloudflare, geen losse website-builder met alleen
            pagina’s.
          </p>
        </div>
      </Panel>

      <div className="mb-5 grid gap-5 sm:mb-6 lg:grid-cols-2">
        <Panel className="mb-0">
          <SectionTitle
            eyebrow="Online"
            title="Vindbaarheid & content"
            description="De technische basis voor zoekmachinevindbaarheid is ingericht. Dit belooft geen rankings."
          />
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--admin-muted)]">
            <li className="flex gap-2">
              <Search className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                Dienstpagina’s, werkgebied, Advies &amp; kennis (blog), FAQ, portfolio, interne
                links en lokale bedrijfsgegevens.
              </span>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>Pagina-metadata, sitemap en structured data (JSON-LD) waar ingericht.</span>
            </li>
            <li className="flex gap-2">
              <Smartphone className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>Mobielvriendelijke opmaak en snelle, lichte presentatie van content.</span>
            </li>
          </ul>
        </Panel>

        <Panel className="mb-0">
          <SectionTitle
            eyebrow="Juridisch"
            title="Privacy & juridische informatie"
            description="Uitgebreide basis op de site. Formele juridische controle blijft altijd mogelijk."
          />
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--admin-muted)]">
            <li>Privacyverklaring</li>
            <li>Cookiebeleid en cookievoorkeuren</li>
            <li>Algemene voorwaarden</li>
            <li>Disclaimer</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-[var(--admin-muted)]">
            Geen claim van “100% juridisch waterdicht” — wel een serieuze, zichtbare privacy- en
            juridische laag voor bezoekers.
          </p>
        </Panel>
      </div>

      <Panel>
        <SectionTitle
          eyebrow="Infrastructuur"
          title="Technische voorzieningen"
          description="Geen live health-checks — alleen wat aantoonbaar is ingericht."
        />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: 'Website', value: 'Ingericht' },
            { label: 'Database', value: 'Ingericht' },
            { label: 'E-mailservice', value: 'Ingericht' },
            { label: 'Admin', value: 'Beveiligd' },
            { label: 'Cloudflare', value: 'Ingericht' },
          ].map((item) => (
            <div
              key={item.label}
              className="border border-[var(--admin-line)] bg-[#fbfaf7] px-2.5 py-2.5"
            >
              <p className="text-[0.8rem] font-medium text-[var(--admin-ink)]">{item.label}</p>
              <div className="mt-1.5">
                <StatusChip
                  label={item.value}
                  tone={item.value === 'Beveiligd' ? 'active' : 'ready'}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 text-sm text-[var(--admin-muted)]">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <p>
            Geen valse “online”-lampjes: beschikbaarheid wordt hier niet realtime gemeten.
          </p>
        </div>
      </Panel>

      <Panel className="border-[#d8e8db] bg-[#f6faf6]">
        <SectionTitle
          eyebrow="Toekomst"
          title="Mogelijke uitbreidingen"
          description="De huidige basis is compleet. Onderstaande functies zijn uitbreidingen die later kunnen worden toegevoegd wanneer ze operationeel voordeel opleveren."
        />

        <div className="mt-4 border border-[#c5dbc9] bg-white/80 p-3.5 sm:p-4">
          <div className="flex items-center gap-2">
            <Wrench className="size-3.5 text-[#1f4d2a]" aria-hidden />
            <h3 className="text-sm font-semibold text-[#1f4d2a]">Aanbevolen vervolgstappen</h3>
          </div>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-[#3d5f46]">
            {recommendedNext.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p className="mt-3 text-xs leading-relaxed text-[#3d5f46]">
            Labels als AANBEVOLEN / LATER / OPTIONEEL zijn advies — geen bestaande functionaliteit.
          </p>
        </div>

        <div className="mt-5 space-y-5">
          {roadmapGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-[#1f4d2a]">{group.title}</h3>
              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                {group.items.map((item) => (
                  <div
                    key={item.title}
                    className="border border-[#c5dbc9] bg-white/75 p-3.5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#1f4d2a]">{item.title}</h4>
                      <StatusChip label={item.tag} tone={tagTone(item.tag)} />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#3d5f46]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
