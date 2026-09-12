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
  areaServicePath,
  getArea,
} from '../data/areas'
import { getFaqsByIds } from '../data/faq'
import { getService, getServicesBySlug, services } from '../data/services'
import type { ServiceSlug } from '../types'
import { NotFoundPage } from './NotFoundPage'

function isServiceSlug(value: string | undefined): value is ServiceSlug {
  return services.some((item) => item.slug === value)
}

export function AreaServicePage() {
  const { plaats, dienst } = useParams()
  const area = plaats ? getArea(plaats) : undefined
  const service = isServiceSlug(dienst) ? getService(dienst) : undefined

  if (!area || !service || !areaHasServiceCopy(area, service.slug)) {
    return <NotFoundPage />
  }

  const copy = area.serviceCopy[service.slug]
  const path = areaServicePath(area.slug, service.slug)
  const quoteTo = `/offerte-aanvragen?dienst=${service.slug}`
  const appointmentTo = `/afspraak-maken?dienst=${service.slug}`

  return (
    <>
      <PageMeta
        title={`${service.shortName} in ${area.city}`}
        description={copy?.intro ?? `${service.name} in ${area.city}`}
        path={path}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Werkgebied', href: '/werkgebied' },
          { label: area.city, href: `/werkgebied/${area.slug}` },
          { label: service.shortName, href: path },
        ]}
        eyebrow={area.region}
        title={`${service.shortName} in ${area.city}`}
        intro={copy?.intro}
        actions={
          <CtaPair quoteTo={quoteTo} appointmentTo={appointmentTo} showCall />
        }
      />
      <Section>
        <Container className="max-w-3xl">
          <Heading as="h2">Lokale toelichting</Heading>
          {copy?.notes.map((note) => (
            <p key={note} className="mt-3 text-ink-muted">
              {note}
            </p>
          ))}
          <p className="mt-6 text-ink-muted">
            Algemene uitleg staat op{' '}
            <Link to={service.href} className="font-semibold underline">
              {service.heroTitle}
            </Link>
            . Deze pagina is alleen voor wat specifiek is aan {area.city}.
          </p>
        </Container>
      </Section>
      <WhyChoose />
      <TrustSection />
      <PageFaq items={getFaqsByIds(service.faqIds)} />
      <RelatedServices services={getServicesBySlug(service.relatedSlugs)} />
      <CTASection quoteTo={quoteTo} appointmentTo={appointmentTo} />
    </>
  )
}
