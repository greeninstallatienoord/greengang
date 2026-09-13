import { BrandShowcase } from '../components/service/BrandShowcase'
import { EmergencyServiceBanner } from '../components/service/EmergencyServiceBanner'
import { HeatPumpCalculator } from '../components/heatpump/HeatPumpCalculator'
import { HeatPumpIsde } from '../components/heatpump/HeatPumpIsde'
import { HeatPumpSuitability } from '../components/heatpump/HeatPumpSuitability'
import { HeatPumpSystemCompare } from '../components/heatpump/HeatPumpSystemCompare'
import { ButtonLink } from '../components/ButtonLink'
import { CtaPair } from '../components/CtaPair'
import { Heading } from '../components/Heading'
import { Container } from '../components/Container'
import { PageFaq } from '../components/page/PageFaq'
import { PageHero } from '../components/page/PageHero'
import { CrossLinks } from '../components/page/CrossLinks'
import { RelatedArticles } from '../components/page/RelatedArticles'
import { RelatedServices } from '../components/page/RelatedServices'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { TrustSection } from '../components/trust/TrustSection'
import { heatPumpBrands } from '../data/brands'
import { blogPosts } from '../data/blog'
import { getFaqsByIds } from '../data/faq'
import { serviceImage } from '../data/media'
import { serviceArea } from '../data/region'
import { getService, getServicesBySlug } from '../data/services'
import { serviceSeo } from '../data/seo'
import { faqJsonLd, serviceJsonLd } from '../lib/jsonld'

export function WarmtepompPage() {
  const service = getService('warmtepomp')
  const seo = serviceSeo.warmtepomp
  const related = getServicesBySlug(service.relatedSlugs)
  const faqItems = getFaqsByIds(service.faqIds)
  const articles = blogPosts.filter((post) => service.blogSlugs.includes(post.slug))
  const quoteTo = '/offerte-aanvragen?dienst=warmtepomp'
  const appointmentTo = '/afspraak-maken?dienst=warmtepomp'

  return (
    <>
      <PageMeta
        title={seo?.title ?? service.heroTitle}
        description={seo?.description ?? service.heroText}
        path={service.href}
        jsonLd={[
          serviceJsonLd(service.name, service.href, service.summary),
          faqJsonLd(faqItems),
        ].filter((item): item is Record<string, unknown> => Boolean(item))}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: service.name, href: service.href },
        ]}
        eyebrow={service.heroEyebrow}
        title={service.heroTitle}
        intro={service.heroText}
        image={serviceImage('warmtepomp')}
        actions={
          <CtaPair quoteTo={quoteTo} appointmentTo={appointmentTo} showCall />
        }
      />

      <Section>
        <Container className="max-w-3xl">
          <p className="eyebrow">Wat doet een warmtepomp?</p>
          <Heading as="h2" className="mt-2.5 sm:mt-3">
            Warmte uit de omgeving, in plaats van alleen gas
          </Heading>
          {service.explanation.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-ink-muted">
              {paragraph}
            </p>
          ))}
        </Container>
      </Section>

      <HeatPumpSystemCompare />
      <HeatPumpSuitability />

      <div id="besparing">
        <HeatPumpCalculator />
      </div>

      <HeatPumpIsde />
      <BrandShowcase category="warmtepomp" brands={heatPumpBrands} />

      <Section className="bg-paper">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Aanpak</p>
            <Heading as="h2" className="mt-2.5 sm:mt-3">
              Hoe Green Installatie Noord te werk gaat
            </Heading>
            <p className="lead mt-3 sm:mt-4">
              Eerst de woning, daarna het systeem. Planning en prijs volgen in
              het persoonlijke voorstel.
            </p>
          </div>
          <ol className="grid gap-5 lg:col-span-7">
            {service.process.map((item, index) => (
              <li
                key={item.title}
                className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-line pb-5"
              >
                <p className="font-display text-2xl text-brand-dark">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <div>
                  <h3 className="font-semibold tracking-[-0.015em]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <Heading as="h2">Onderhoud en storing</Heading>
            <p className="mt-3 text-ink-muted">
              Een warmtepomp vraagt periodiek onderhoud. Bij storingen is onze
              storingsdienst 24/7 bereikbaar.
            </p>
            <div className="mt-5">
              <ButtonLink to="/service-onderhoud" className="min-h-11">
                Naar service & onderhoud
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-6">
            <Heading as="h2">Werkgebied</Heading>
            <p className="mt-3 text-ink-muted">
              Warmtepompadvies en installatie in Groningen, Drenthe en Friesland.{' '}
              {serviceArea.statement}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              {serviceArea.provinces.map((province) => (
                <li key={province.name}>{province.name}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <EmergencyServiceBanner />

      <CrossLinks
        title="Volgende stap"
        links={[
          {
            href: quoteTo,
            label: 'Offerte aanvragen',
            note: 'Voorstel voor warmtepomp of hybride.',
          },
          {
            href: appointmentTo,
            label: 'Afspraak maken',
            note: 'Woning laten beoordelen.',
          },
          {
            href: '/service-onderhoud',
            label: 'Service & onderhoud',
            note: 'Onderhoudsabonnementen en storing.',
          },
          {
            href: '/blog/categorie/warmtepomp',
            label: 'Artikelen over warmtepompen',
            note: 'Gidsen en checklists in de kennisbank.',
          },
        ]}
      />
      <TrustSection />
      <PageFaq items={faqItems} />
      <RelatedServices services={related} />
      <RelatedArticles posts={articles} />
      <CTASection
        title="Wilt u weten of een warmtepomp bij uw woning past?"
        text="Vraag advies of een offerte aan. We nemen gasverbruik, woning en wensen daarna met u door."
        quoteTo={quoteTo}
        appointmentTo={appointmentTo}
      />
    </>
  )
}
