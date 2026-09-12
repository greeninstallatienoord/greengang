import { Link } from 'react-router-dom'
import { QuoteForm } from '../components/forms/QuoteForm'
import { PageHero } from '../components/page/PageHero'
import { CrossLinks } from '../components/page/CrossLinks'
import { PhoneFallback } from '../components/page/PhoneFallback'
import { Container } from '../components/Container'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { pageSeo } from '../data/seo'
import { services } from '../data/services'

export function QuotePage() {
  return (
    <>
      <PageMeta {...pageSeo.quote} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Offerte aanvragen', href: '/offerte-aanvragen' },
        ]}
        eyebrow="Offerte"
        title="Offerte aanvragen"
        intro="Vier korte stappen. Begin met de dienst; contactgegevens komen pas later. Foto’s zijn optioneel. Zonder serverkoppeling is een verzending nog geen ontvangstbevestiging."
        narrow
      >
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {services.map((service) => (
            <li key={service.slug}>
              <Link to={service.href} className="underline">
                {service.heroTitle}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>
      <Section>
        <Container className="max-w-3xl">
          <div className="mb-8 rounded-lg border border-line bg-paper p-5 shadow-card">
            <h2 className="font-semibold">Hoe we met uw aanvraag omgaan</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Een offerteaanvraag is een verzoek om contact, geen opdracht. We
              gebruiken alleen de gegevens die nodig zijn om u te bereiken. De
              privacytoelichting staat bij de laatste stap.
            </p>
          </div>
          <QuoteForm />
        </Container>
      </Section>
      <CrossLinks
        links={[
          {
            href: '/contact',
            label: 'Contact',
            note: 'Telefoon, e-mail of het contactformulier.',
          },
          {
            href: '/veelgestelde-vragen',
            label: 'Veelgestelde vragen',
            note: 'Wat er na een aanvraag gebeurt, en waarom er geen websiteprijzen staan.',
          },
          {
            href: '/blog/offerte-voorbereiden',
            label: 'Offerte voorbereiden',
            note: 'Wat u kunt noteren voordat u het formulier invult.',
          },
        ]}
      />
      <PhoneFallback text="Liever telefonisch een offerte voorbereiden? Bel ons of gebruik de contactpagina." />
    </>
  )
}
