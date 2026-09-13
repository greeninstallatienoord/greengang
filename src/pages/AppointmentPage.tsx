import { AppointmentFlow } from '../components/forms/AppointmentFlow'
import { PageHero } from '../components/page/PageHero'
import { PhoneFallback } from '../components/page/PhoneFallback'
import { Container } from '../components/Container'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { pageSeo } from '../data/seo'
import { absoluteUrl } from '../lib/seo'

export function AppointmentPage() {
  return (
    <>
      <PageMeta
        {...pageSeo.appointment}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: pageSeo.appointment.title,
          description: pageSeo.appointment.description,
          url: absoluteUrl(pageSeo.appointment.path),
        }}
      />
      <PageHero
        compact
        className="!py-6 sm:!py-8 lg:!py-9"
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Afspraak aanvragen', href: '/afspraak-maken' },
        ]}
        eyebrow="Planning"
        title="Afspraak aanvragen"
        titleClassName="text-[clamp(1.5rem,3.2vw,2.35rem)]"
        intro="Kies een dienst, voorkeursdatum en tijdvak. Daarna uw gegevens. Een gekozen moment is pas definitief na onze bevestiging."
        narrow
      />
      <Section className="!py-6 sm:!py-8 lg:!py-10">
        <Container className="max-w-3xl">
          <p className="mb-5 text-sm text-ink-muted">
            U vraagt een voorkeursmoment aan. Wij bekijken de aanvraag en bevestigen
            het moment persoonlijk.
          </p>
          <AppointmentFlow />
        </Container>
      </Section>
      <PhoneFallback text="Liever bellen om een moment af te stemmen? Gebruik het telefoonnummer of de contactpagina." />
    </>
  )
}
