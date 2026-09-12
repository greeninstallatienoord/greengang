import { MapPin } from 'lucide-react'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { Container } from '../components/Container'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { Heading } from '../components/Heading'
import { ProvinceHighlights } from '../components/region/ProvinceHighlights'
import { Link } from 'react-router-dom'
import { areas } from '../data/areas'
import { serviceArea } from '../data/region'
import { pageSeo } from '../data/seo'
import { services } from '../data/services'
import { site } from '../data/site'

export function AreaIndexPage() {
  return (
    <>
      <PageMeta {...pageSeo.areas} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Werkgebied', href: '/werkgebied' },
        ]}
        eyebrow="Werkgebied"
        title="Actief in Noord-Nederland"
        intro={serviceArea.statement}
      />
      <Section>
        <Container>
          <p className="lead">{serviceArea.intro}</p>
          <div className="mt-10">
            <ProvinceHighlights />
          </div>
          <p className="mt-8 inline-flex items-start gap-3 text-sm text-ink-muted">
            <MapPin size={18} strokeWidth={1.6} className="mt-0.5 text-brand-dark" aria-hidden="true" />
            <span>
              {serviceArea.baseLine}
              <br />
              {site.contact.street}, {site.contact.postalCode} {site.contact.city}
            </span>
          </p>
        </Container>
      </Section>
      <Section className="bg-paper">
        <Container>
          <Heading as="h2">Plaatsnamen</Heading>
          <p className="lead mt-4">
            Afzonderlijke plaatsnamen publiceren we pas als daar eigen,
            gecontroleerde tekst voor is. Geen dunne deurenpagina’s.
          </p>
          {areas.length === 0 ? (
            <p className="mt-6 text-ink-muted">Er zijn nog geen plaatsnamen gepubliceerd.</p>
          ) : (
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {areas.map((area) => (
                <li key={area.slug}>
                  <Link to={`/werkgebied/${area.slug}`} className="font-semibold underline">
                    {area.city}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
      <RelatedServices services={services} title="Diensten" />
      <CTASection />
    </>
  )
}
