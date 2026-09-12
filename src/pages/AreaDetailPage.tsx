import { Link, useParams } from 'react-router-dom'
import { CtaPair } from '../components/CtaPair'
import { Container } from '../components/Container'
import { Heading } from '../components/Heading'
import { PageFaq } from '../components/page/PageFaq'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { WhyChoose } from '../components/page/WhyChoose'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { TrustSection } from '../components/trust/TrustSection'
import {
  areaHasServiceCopy,
  areaPath,
  areaServicePath,
  getArea,
  localServicePaths,
} from '../data/areas'
import { getFaqsByIds } from '../data/faq'
import { getService, services } from '../data/services'
import { NotFoundPage } from './NotFoundPage'

export function AreaDetailPage() {
  const { plaats } = useParams()
  const area = plaats ? getArea(plaats) : undefined

  if (!area) return <NotFoundPage />

  const publishedServices = localServicePaths.filter((slug) =>
    areaHasServiceCopy(area, slug),
  )

  return (
    <>
      <PageMeta
        title={`Installatie in ${area.city}`}
        description={area.intro}
        path={areaPath(area.slug)}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Werkgebied', href: '/werkgebied' },
          { label: area.city, href: areaPath(area.slug) },
        ]}
        eyebrow={area.region}
        title={area.city}
        intro={area.intro}
        actions={<CtaPair showCall />}
      />
      <Section>
        <Container>
          <Heading as="h2">Diensten in {area.city}</Heading>
          {publishedServices.length === 0 ? (
            <p className="mt-3 text-ink-muted">
              Dienstpagina’s per plaats volgen pas als daar unieke tekst voor
              is. Tot die tijd gebruikt u de landelijke dienstpagina’s.
            </p>
          ) : (
            <ul className="mt-4 grid gap-2">
              {publishedServices.map((slug) => {
                const service = getService(slug)
                return (
                  <li key={slug}>
                    <Link
                      to={areaServicePath(area.slug, slug)}
                      className="font-semibold underline"
                    >
                      {service.heroTitle} in {area.city}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Container>
      </Section>
      <WhyChoose />
      {area.localNotes.length > 0 ? (
        <Section>
          <Container>
            <Heading as="h2">Lokaal nuttig</Heading>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
              {area.localNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
      <TrustSection />
      <PageFaq items={getFaqsByIds(['algemeen-diensten', 'algemeen-werkwijze'])} />
      <RelatedServices services={services} title="Landelijke dienstpagina’s" />
      <CTASection />
    </>
  )
}
