import { CtaPair } from '../components/CtaPair'
import { Heading } from '../components/Heading'
import { Container } from '../components/Container'
import { PageFaq } from '../components/page/PageFaq'
import { PageHero } from '../components/page/PageHero'
import { CrossLinks } from '../components/page/CrossLinks'
import { RelatedArticles } from '../components/page/RelatedArticles'
import { RelatedServices } from '../components/page/RelatedServices'
import { serviceImage } from '../data/media'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { TrustSection } from '../components/trust/TrustSection'
import { blogPosts } from '../data/blog'
import { getFaqsByIds } from '../data/faq'
import { getService, getServicesBySlug } from '../data/services'
import { serviceSeo } from '../data/seo'
import { faqJsonLd, serviceJsonLd } from '../lib/jsonld'
import type { BlogCategorySlug, ServiceSlug } from '../types'

const serviceBlogCategory: Record<ServiceSlug, BlogCategorySlug> = {
  'cv-ketel': 'cv-ketel',
  airco: 'airco',
  warmtepomp: 'warmtepomp',
  'service-onderhoud': 'onderhoud',
}

type ServicePageProps = {
  slug: ServiceSlug
}

export function ServicePage({ slug }: ServicePageProps) {
  const service = getService(slug)
  const seo = serviceSeo[slug]
  const related = getServicesBySlug(service.relatedSlugs)
  const faqItems = getFaqsByIds(service.faqIds)
  const articles = blogPosts.filter((post) => service.blogSlugs.includes(post.slug))
  const quoteTo = `/offerte-aanvragen?dienst=${service.slug}`
  const appointmentTo = `/afspraak-maken?dienst=${service.slug}`

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
        image={serviceImage(slug)}
        actions={
          <CtaPair quoteTo={quoteTo} appointmentTo={appointmentTo} showCall />
        }
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <Heading as="h2">Wat houdt deze dienst in?</Heading>
            {service.explanation.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <div>
            <Heading as="h2">Voordelen</Heading>
            <ul className="mt-4 grid gap-4">
              {service.benefits.map((item) => (
                <li key={item.title} className="rounded-lg border border-line bg-paper p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section className="bg-paper">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <Heading as="h2">Wat de dienst omvat</Heading>
            <ul className="mt-4 grid gap-2">
              {service.helpItems.map((item) => (
                <li key={item} className="rounded-md bg-surface px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Heading as="h2">Voor wie</Heading>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
              {service.suitableFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <Heading as="h2">Hoe het werkt</Heading>
            <ol className="mt-4 grid gap-3">
              {service.process.map((item, index) => (
                <li key={item.title} className="rounded-md border border-line bg-paper p-4">
                  <p className="eyebrow">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <Heading as="h2">Technische aandachtspunten</Heading>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
              {service.technicalNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CrossLinks
        title="Offerte, afspraak of meer lezen"
        links={[
          {
            href: quoteTo,
            label: 'Offerte aanvragen',
            note: `Voorstel voor ${service.shortName.toLowerCase()}.`,
          },
          {
            href: appointmentTo,
            label: 'Afspraak maken',
            note: 'Voorkeursmoment doorgeven. Bevestiging volgt later.',
          },
          {
            href: '/veelgestelde-vragen',
            label: 'Veelgestelde vragen',
            note: 'Antwoorden over installatie, onderhoud en aanvragen.',
          },
          {
            href: `/blog/categorie/${serviceBlogCategory[slug]}`,
            label: 'Artikelen bij deze dienst',
            note: 'Gidsen en checklists in de kennisbank.',
          },
        ]}
      />
      <TrustSection />
      <PageFaq items={faqItems} />
      <RelatedServices services={related} />
      <RelatedArticles posts={articles} />
      <CTASection
        title={`Offerte of afspraak voor ${service.shortName.toLowerCase()}?`}
        text="Vertel wat u nodig heeft. We nemen de vraag daarna persoonlijk met u door."
        quoteTo={quoteTo}
        appointmentTo={appointmentTo}
      />
    </>
  )
}
