import { PageHeader } from '../components/PageHeader'

const included = [
  {
    title: 'Professionele bedrijfswebsite',
    text: 'Duidelijke pagina’s over CV-ketel, airco, warmtepomp en service/onderhoud, met jullie eigen foto’s en vaste bedrijfsgegevens.',
  },
  {
    title: 'Offerteaanvragen',
    text: 'Bezoekers vragen een offerte aan. Die komt in het adminpaneel én automatisch in de mailbox info@greeninstallatienoord.nl. De klant krijgt een ontvangstbevestiging.',
  },
  {
    title: 'Afspraakaanvragen',
    text: 'Klanten kiezen dienst, datum en tijdvak. Aanvragen landen in Afspraken in het beheer. Bevestigen of annuleren kan vanuit het adminpaneel; de klant krijgt dan een mail.',
  },
  {
    title: 'Contactformulier',
    text: 'Berichten via contact komen eveneens in beheer én per e-mail binnen.',
  },
  {
    title: 'Klantenoverzicht',
    text: 'Contacten worden hergebruikt op e-mailadres, zodat afspraken, offertes en berichten bij elkaar horen.',
  },
  {
    title: 'E-mailcentrum',
    text: 'Templates aanpassen, handmatig een mail sturen en zien wat er verzonden, overgeslagen of mislukt is.',
  },
  {
    title: 'Beveiligd beheer',
    text: 'Login met wachtwoord, beveiligde sessie-cookie en een verborgen beheerpad. Geen wachtwoorden in de websitebron.',
  },
  {
    title: 'Mobielvriendelijk & snel',
    text: 'Gebouwd als moderne React-site op Cloudflare (Worker + database), zodat pagina’s snel laden op telefoon en desktop.',
  },
]

const howBuilt = [
  { label: 'Frontend', value: 'React + TypeScript (Vite)' },
  { label: 'Hosting', value: 'Cloudflare Worker + Assets op greeninstallatienoord.nl' },
  { label: 'Database', value: 'Cloudflare D1 (aanvragen, klanten, sessies, e-maillogs)' },
  { label: 'E-mail', value: 'Resend, afzender info@greeninstallatienoord.nl' },
  { label: 'Beheer', value: 'Privé-omgeving op /blackberry97' },
]

const addons = [
  {
    title: 'Agenda-koppeling (Google / Outlook)',
    text: 'Bevestigde afspraken automatisch in jullie agenda, met optionele herinneringen.',
  },
  {
    title: 'SMS-meldingen',
    text: 'Korte sms bij nieuwe offerte of afspraak, naast de e-mail.',
  },
  {
    title: 'Automatische herinneringen',
    text: 'Klanten automatisch een dag van tevoren mailen over hun bevestigde afspraak.',
  },
  {
    title: 'Review- en vertrouwensmodule',
    text: 'Netjes geverifieerde reviews tonen of een uitnodiging sturen na afronding van werk.',
  },
  {
    title: 'Uitgebreide SEO / landingspagina’s',
    text: 'Extra plaats- of dienstpagina’s (bijv. per stad) om beter gevonden te worden.',
  },
  {
    title: 'Foto- en contentbeheer',
    text: 'Zelf projectfoto’s of teksten aanpassen zonder ontwikkelaar.',
  },
  {
    title: 'WhatsApp-knop / chat',
    text: 'Direct contact via WhatsApp naast bellen en mailen.',
  },
  {
    title: 'Meertalig (NL/EN/DE)',
    text: 'Handig als jullie ook Duitse of Engelse bezoekers bedienen.',
  },
  {
    title: 'Uitgebreide rapportage',
    text: 'Overzicht van aanvragen per maand, conversie en drukke periodes.',
  },
]

export function WebsiteInfoPage() {
  return (
    <div>
      <PageHeader
        title="Website & mogelijkheden"
        description="Duidelijk overzicht van wat deze site nu doet, hoe hij is gebouwd, en welke uitbreidingen later mogelijk zijn."
      />

      <section className="mb-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">Kort gezegd</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--admin-muted)]">
          Green Installatie Noord heeft een complete online aanwezigheid: een sterke publieke website
          plus een privé-adminpaneel. Offertes, afspraken en contactaanvragen worden opgeslagen in de
          database, getoond in dit beheer, en automatisch gemaild naar{' '}
          <span className="font-medium text-[var(--admin-ink)]">info@greeninstallatienoord.nl</span>.
          Klanten krijgen een nette ontvangstbevestiging — geen valse “afspraak is al definitief”-taal.
        </p>
      </section>

      <section className="mb-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">Wat zit er al inbegrepen</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {included.map((item) => (
            <li key={item.title} className="border border-[var(--admin-line)] bg-white/40 p-4">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--admin-muted)]">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">Hoe is dit gebouwd</h2>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          Techniek in gewone taal — handig om te laten zien dat het geen “losse WordPress-pagina” is.
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          {howBuilt.map((row) => (
            <div key={row.label}>
              <dt className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
                {row.label}
              </dt>
              <dd className="mt-1 font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">Wat gebeurt er bij een aanvraag</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--admin-muted)]">
          <li>Bezoeker vult offerte, afspraak of contact in op de website.</li>
          <li>Gegevens worden veilig opgeslagen in de Cloudflare-database.</li>
          <li>Het item verschijnt meteen in dit adminpaneel (Offertes / Afspraken / Contact).</li>
          <li>Er gaat automatisch een melding naar info@greeninstallatienoord.nl.</li>
          <li>De klant krijgt een ontvangstbevestiging per e-mail.</li>
        </ol>
      </section>

      <section className="mb-6 border border-[#d8e8db] bg-[#f3faf4] p-5">
        <h2 className="font-semibold text-[#1f4d2a]">Later uitbreiden (meerprijs)</h2>
        <p className="mt-1 max-w-3xl text-sm text-[#3d5f46]">
          Onderstaande functies horen niet bij de huidige oplevering, maar zijn logische volgende
          stappen. Ideaal om met de klant te bespreken als upgrade.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {addons.map((item) => (
            <li key={item.title} className="border border-[#c5dbc9] bg-white/70 p-4">
              <h3 className="text-sm font-semibold text-[#1f4d2a]">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#3d5f46]">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">Tip voor oplevering</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--admin-muted)]">
          Laat de koper dit scherm zien samen met een testofferte of testafspraak. Dan is meteen
          zichtbaar: website → database → admin → mailbox. Dat maakt de waarde concreet — en opent
          het gesprek over optionele uitbreidingen.
        </p>
      </section>
    </div>
  )
}
