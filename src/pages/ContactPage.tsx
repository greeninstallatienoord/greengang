import { ContactDetails } from '../components/ContactDetails'
import { CtaPair } from '../components/CtaPair'
import { ContactForm } from '../components/forms/ContactForm'
import { MediaImage } from '../components/media/MediaImage'
import { PageFaq } from '../components/page/PageFaq'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { SocialLinks } from '../components/SocialLinks'
import { Container } from '../components/Container'
import { Heading } from '../components/Heading'
import { PlaceholderNote } from '../components/PlaceholderNote'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { Link } from 'react-router-dom'
import { getFaqsByIds } from '../data/faq'
import { localImage } from '../data/media'
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
        title="Contact"
        intro="Stel uw vraag via het formulier, bel of mail. U kunt ook een offerte aanvragen of een afspraakvoorkeur doorgeven."
        actions={<CtaPair showCall />}
      />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="grid gap-4">
            <div className="rounded-lg border border-line bg-paper p-5 shadow-card">
              <Heading as="h2" className="text-xl sm:text-xl">
                Gegevens
              </Heading>
              <div className="mt-3">
                <ContactDetails />
              </div>
              <SocialLinks className="mt-4" />
              <CtaPair className="mt-5" compact showCall />
            </div>
            <PlaceholderNote>
              Openingstijden publiceren we hier pas als ze vastliggen. Zie ook
              het{' '}
              <Link to="/werkgebied" className="underline">
                werkgebied
              </Link>
              .
            </PlaceholderNote>
            <MediaImage asset={localImage} sizes="(min-width: 1024px) 36vw, 100vw" />
          </aside>
          <div className="rounded-lg border border-line bg-paper p-5 shadow-card sm:p-7">
            <Heading as="h2" className="text-xl sm:text-xl">
              Stuur een bericht
            </Heading>
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
