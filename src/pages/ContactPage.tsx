import { ContactDetails } from '../components/ContactDetails'
import { CtaPair } from '../components/CtaPair'
import { ContactForm } from '../components/forms/ContactForm'
import { PageFaq } from '../components/page/PageFaq'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { SocialLinks } from '../components/SocialLinks'
import { Container } from '../components/Container'
import { Heading } from '../components/Heading'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { getFaqsByIds } from '../data/faq'
import { pageSeo } from '../data/seo'
import { localBusinessJsonLd } from '../lib/jsonld'
import { services } from '../data/services'

export function ContactPage() {
  return (
    <>
      <PageMeta {...pageSeo.contact} jsonLd={localBusinessJsonLd()} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact' },
        ]}
        eyebrow="Bereikbaar"
        title="Contact met Green Installatie Noord"
        intro="Bel, mail of stuur een bericht. Voor een voorstel of een moment op locatie gebruikt u offerte of afspraak."
        actions={<CtaPair showCall />}
      />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="grid gap-4">
            <div className="border border-line bg-paper p-6 sm:p-7">
              <Heading as="h2" className="text-xl sm:text-xl">
                Gegevens
              </Heading>
              <p className="mt-2 text-sm text-ink-muted">
                Maandag tot en met vrijdag 07:00-17:00. In het weekend gesloten.
              </p>
              <div className="mt-3">
                <ContactDetails />
              </div>
              <SocialLinks className="mt-4" />
              <CtaPair className="mt-5" compact showCall />
            </div>
          </aside>
          <div className="border border-line bg-paper p-6 sm:p-8">
            <Heading as="h2" className="text-xl sm:text-xl">
              Waar kunnen we u mee helpen?
            </Heading>
            <p className="mt-2 text-sm text-ink-muted">
              Kort en duidelijk is genoeg. We vragen geen extra persoonsgegevens.
            </p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
      <PageFaq
        items={getFaqsByIds(['algemeen-diensten', 'algemeen-werkwijze', 'afspraak-hoe'])}
      />
      <RelatedServices services={services} title="Diensten" />
      <CTASection />
    </>
  )
}
