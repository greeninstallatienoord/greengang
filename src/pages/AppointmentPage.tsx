import { AppointmentFlow } from '../components/forms/AppointmentFlow'
import { PageHero } from '../components/page/PageHero'
import { CrossLinks } from '../components/page/CrossLinks'
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
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Afspraak maken', href: '/afspraak-maken' },
        ]}
        eyebrow="Planning"
        title="Afspraak aanvragen"
        intro="Kies een dienst, een datum en een vrij tijdstip. Er worden geen voorbeeldtijden getoond. Een afspraak is pas definitief na onze bevestiging."
        narrow
      />
      <Section>
        <Container className="max-w-3xl">
          <AppointmentFlow />
        </Container>
      </Section>
      <CrossLinks
        links={[
          {
            href: '/contact',
            label: 'Contact',
            note: 'Bellen of mailen als een formulier niet past.',
          },
          {
            href: '/offerte-aanvragen',
            label: 'Offerte aanvragen',
            note: 'Als u eerst een voorstel wilt, geen moment.',
          },
          {
            href: '/veelgestelde-vragen',
            label: 'Vragen over afspraken',
            note: 'Een voorkeur is nog geen bevestigde afspraak.',
          },
        ]}
      />
      <PhoneFallback text="Liever bellen om een moment af te stemmen? Gebruik het telefoonnummer of de contactpagina." />
    </>
  )
}
