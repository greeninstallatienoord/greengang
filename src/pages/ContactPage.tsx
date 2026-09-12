import { Link } from 'react-router-dom'
import { ContactDetails } from '../components/ContactDetails'
import { CtaPair } from '../components/CtaPair'
import { ContactForm } from '../components/forms/ContactForm'
import { PageFaq } from '../components/page/PageFaq'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { SocialLinks } from '../components/SocialLinks'
import { Container } from '../components/Container'
import { Heading } from '../components/Heading'
import { Reveal } from '../components/Reveal'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { getFaqsByIds } from '../data/faq'
import { pageSeo } from '../data/seo'
import { breadcrumbJsonLd, contactPageJsonLd, faqJsonLd, localBusinessJsonLd } from '../lib/jsonld'
import { services } from '../data/services'

const contactFaqs = getFaqsByIds(['algemeen-diensten', 'algemeen-werkwijze', 'afspraak-hoe'])
const contactFaqLd = faqJsonLd(contactFaqs)

export function ContactPage() {
  return (
    <>
      <PageMeta
        {...pageSeo.contact}
        jsonLd={[
          localBusinessJsonLd(),
          contactPageJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          ...(contactFaqLd ? [contactFaqLd] : []),
        ]}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact' },
        ]}
        eyebrow="Bereikbaar"
        title="Contact met Green Installatie Noord"
        intro="Bel, mail of stuur een bericht. Voor een voorstel of een moment op locatie gebruikt u offerte of afspraak."
        actions={<CtaPair equal />}
      />
      <Section>
        <Container className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start lg:gap-8">
          <Reveal>
            <aside className="grid gap-4">
              <div className="border border-line bg-paper p-5 sm:p-6">
                <Heading as="h2" className="text-xl sm:text-xl">
                  Gegevens
                </Heading>
                <div className="mt-4">
                  <ContactDetails />
                </div>
              </div>
              <div className="border border-line bg-paper p-5 sm:p-6">
                <h3 className="font-semibold tracking-[-0.01em]">Volg ons</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Facebook, Instagram, TikTok en Google. Geen sterren of aantallen
                  op deze pagina.
                </p>
                <SocialLinks className="mt-3" />
              </div>
              <nav aria-label="Vervolgstappen" className="border border-line bg-paper p-5 sm:p-6">
                <h3 className="font-semibold tracking-[-0.01em]">Vervolg</h3>
                <ul className="mt-3 grid gap-2 text-sm font-semibold">
                  <li>
                    <Link to="/offerte-aanvragen" className="underline underline-offset-2">
                      Offerte aanvragen
                    </Link>
                  </li>
                  <li>
                    <Link to="/afspraak-maken" className="underline underline-offset-2">
                      Afspraak maken
                    </Link>
                  </li>
                  <li>
                    <Link to="/werkgebied" className="underline underline-offset-2">
                      Werkgebied
                    </Link>
                  </li>
                  <li>
                    <Link to="/over-ons" className="underline underline-offset-2">
                      Over ons
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>
          </Reveal>
          <Reveal delay={70}>
            <div className="border border-line bg-paper p-5 sm:p-7">
              <Heading as="h2" className="text-xl sm:text-xl">
                Stuur een bericht
              </Heading>
              <p className="mt-2 text-sm text-ink-muted">
                Kort en duidelijk is genoeg. We vragen geen extra persoonsgegevens.
              </p>
              <div className="mt-5">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
      <PageFaq items={contactFaqs} />
      <RelatedServices services={services} title="Diensten" />
      <CTASection />
    </>
  )
}
