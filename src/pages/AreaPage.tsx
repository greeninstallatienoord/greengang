import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { PlaceholderNote } from '../components/PlaceholderNote'
import { Container } from '../components/Container'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { Link } from 'react-router-dom'
import { areas } from '../data/areas'
import { pageSeo } from '../data/seo'
import { services } from '../data/services'

export function AreaIndexPage() {
  return (
    <>
      <PageMeta {...pageSeo.areas} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Werkgebied', href: '/werkgebied' },
        ]}
        eyebrow="Regio"
        title="Werkgebied"
        intro="Het werkgebied publiceren we plaats voor plaats, pas als er bevestigde en eigen informatie is. We zetten hier geen verzonnen gemeenten en geen dunne deurenpagina’s."
      >
        <PlaceholderNote className="mt-6 max-w-2xl">
          Plaatsnamen volgen. Tot die tijd kunt u een offerte of afspraak
          aanvragen via de landelijke dienstpagina’s.
        </PlaceholderNote>
      </PageHero>
      <Section>
        <Container>
          {areas.length === 0 ? (
            <p className="text-ink-muted">Er zijn nog geen plaatsnamen gepubliceerd.</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
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
