import { PageHeader } from '../components/PageHeader'

const included = [
  {
    title: 'Sterke bedrijfswebsite',
    text: 'Een complete, professionele site voor Green Installatie Noord: CV-ketel, airco, warmtepomp en service — met jullie eigen projectfoto’s, duidelijke teksten en vaste bedrijfsgegevens.',
  },
  {
    title: 'Offerteaanvragen die binnenkomen',
    text: 'Bezoekers vragen eenvoudig een offerte aan. Elke aanvraag verschijnt hier in het beheer én in jullie mailbox. De klant krijgt meteen een nette ontvangstbevestiging.',
  },
  {
    title: 'Afspraakaanvragen met overzicht',
    text: 'Klanten kiezen dienst, datum en tijdvak. Alles landt in Afspraken. Bevestigen of annuleren doe je vanuit dit paneel — de klant wordt automatisch geïnformeerd.',
  },
  {
    title: 'Contactformulier',
    text: 'Berichten via de contactpagina komen hier én per e-mail binnen, zodat geen vraag verloren gaat.',
  },
  {
    title: 'Klanten bij elkaar',
    text: 'Contacten worden hergebruikt op e-mailadres. Offertes, afspraken en berichten horen zo bij dezelfde klant — overzichtelijk en professioneel.',
  },
  {
    title: 'E-mailcentrum',
    text: 'Templates aanpassen, zelf een bericht sturen en zien wat er is verzonden. Communicatie vanaf één plek, in jullie huisstijl.',
  },
  {
    title: 'Beveiligd beheer',
    text: 'Alleen voor jullie: veilig inloggen, privé-omgeving en beschermde sessie. Gevoelige gegevens blijven uit de publieke website.',
  },
  {
    title: 'Snel op telefoon én desktop',
    text: 'De site is gemaakt om er goed uit te zien en snel te laden — of bezoekers nu op hun telefoon of achter de computer zitten.',
  },
  {
    title: 'Werkgebied & kennis',
    text: 'Duidelijke pagina’s over jullie werkgebied, plus advies- en kennisartikelen die vertrouwen wekken en helpen gevonden te worden.',
  },
  {
    title: 'Portfolio van echt werk',
    text: 'Projectfoto’s tonen wat jullie maken: nette montage, buitenunits, ketels en warmtepompen — zichtbaar voor de bezoeker.',
  },
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
    title: 'Extra landingspagina’s',
    text: 'Meer plaats- of dienstpagina’s om nog beter gevonden te worden in de regio.',
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
    text: 'Overzicht van aanvragen per maand, drukke periodes en wat goed werkt.',
  },
]

export function WebsiteInfoPage() {
  return (
    <div>
      <PageHeader
        title="Website & mogelijkheden"
        description="Wat jullie online al hebben — en wat later nog verder uitgebreid kan worden."
      />

      <section className="mb-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">Kort gezegd</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--admin-muted)]">
          Green Installatie Noord heeft een complete online aanwezigheid: een sterke publieke
          website én dit privé-adminpaneel. Offertes, afspraken en contactaanvragen komen hier
          binnen en gaan tegelijk naar{' '}
          <span className="font-medium text-[var(--admin-ink)]">info@greeninstallatienoord.nl</span>.
          Klanten krijgen een nette ontvangstbevestiging — helder en professioneel, zonder valse
          beloftes over een al definitieve afspraak.
        </p>
      </section>

      <section className="mb-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">Wat jullie website al kan</h2>
        <p className="mt-1 max-w-3xl text-sm text-[var(--admin-muted)]">
          Dit zit er al in — klaar voor gebruik, gericht op meer aanvragen en een betrouwbare
          uitstraling.
        </p>
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
        <h2 className="font-semibold">Wat gebeurt er bij een aanvraag</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--admin-muted)]">
          <li>Bezoeker vult offerte, afspraak of contact in op de website.</li>
          <li>De aanvraag wordt veilig opgeslagen en is meteen zichtbaar in dit beheer.</li>
          <li>Het item verschijnt onder Offertes, Afspraken of Contact.</li>
          <li>Er gaat automatisch een melding naar info@greeninstallatienoord.nl.</li>
          <li>De klant krijgt een ontvangstbevestiging per e-mail.</li>
        </ol>
      </section>

      <section className="border border-[#d8e8db] bg-[#f3faf4] p-5">
        <h2 className="font-semibold text-[#1f4d2a]">Later uitbreiden</h2>
        <p className="mt-1 max-w-3xl text-sm text-[#3d5f46]">
          De basis staat. Onderstaande opties zijn logische vervolgstappen als jullie later nóg
          meer uit de online aanwezigheid willen halen.
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
    </div>
  )
}
