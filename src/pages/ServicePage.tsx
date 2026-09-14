import { CtaPair } from '../components/CtaPair'
import { Heading } from '../components/Heading'
import { Container } from '../components/Container'
import { PageFaq } from '../components/page/PageFaq'
import { PageHero } from '../components/page/PageHero'
import { CrossLinks } from '../components/page/CrossLinks'
import { RelatedArticles } from '../components/page/RelatedArticles'
import { RelatedServices } from '../components/page/RelatedServices'
import { ButtonLink } from '../components/ButtonLink'
import { MediaImage } from '../components/media/MediaImage'
import { BrandShowcase } from '../components/service/BrandShowcase'
import { EmergencyServiceBanner } from '../components/service/EmergencyServiceBanner'
import { MaintenancePlans } from '../components/service/MaintenancePlans'
import { pageImages, serviceImage, type MediaAsset } from '../data/media'
import { aircoBrands, cvBoilerBrands } from '../data/brands'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { GreenFlowSection, type GreenFlowVariant } from '../components/greenflow/TechnicalBackdrop'
import { PageMeta } from '../components/seo/PageMeta'
import { TrustSection } from '../components/trust/TrustSection'
import { blogPosts } from '../data/blog'
import { getFaqsByIds } from '../data/faq'
import { serviceArea } from '../data/region'
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

const serviceFlow: Record<ServiceSlug, GreenFlowVariant> = {
  airco: 'airflow',
  'cv-ketel': 'hydronic',
  warmtepomp: 'thermal',
  'service-onderhoud': 'service',
}

type ServiceShot = {
  asset: MediaAsset
  caption: string
}

const serviceStory: Record<
  ServiceSlug,
  {
    contextTitle: string
    context: string
    photos: ServiceShot[]
  }
> = {
  'cv-ketel': {
    contextTitle: 'Wanneer een cv-ketel aan de beurt is',
    context:
      'Vervanging speelt als de ketel storingen geeft, het einde van de levensduur nadert, of de woning een andere opstelling vraagt. We beginnen bij de bestaande situatie.',
    photos: [
      {
        asset: pageImages.cvHero,
        caption: 'Cv-ketelopstelling uit eigen installatiewerk.',
      },
    ],
  },
  airco: {
    contextTitle: 'Comfort begint bij de ruimte',
    context:
      'Een airco koelt én verwarmt. Hij werkt alleen goed als binnenunit, buitenunit en leidingweg bij de woning passen. Daarom kijken we naar de ruimte en de gevel voordat er een voorstel komt.',
    photos: [
      {
        asset: pageImages.aircoOutdoor,
        caption: 'Buitenunit aan de gevel, leidingen weggewerkt. Foto uit eigen werk.',
      },
    ],
  },
  warmtepomp: {
    contextTitle: 'Eerst toetsen of het past',
    context:
      'Een warmtepomp past niet bij elke cv-ketel of woning. Isolatie, afgifte en beschikbare ruimte bepalen of het zinvol is. Dat beoordelen we per situatie.',
    photos: [],
  },
  'service-onderhoud': {
    contextTitle: 'Onderhoud, storing of twijfel',
    context:
      'Soms is een controle genoeg. Soms is er een storing. En soms is vervanging logischer dan nog een reparatie. U hoort wat we zien en wat de vervolgstap is.',
    photos: [
      {
        asset: pageImages.serviceHero,
        caption: 'Service en onderhoud aan een bestaande installatie. Foto uit eigen werk.',
      },
    ],
  },
}

type ServicePageProps = {
  slug: ServiceSlug
}

export function ServicePage({ slug }: ServicePageProps) {
  const service = getService(slug)
  const seo = serviceSeo[slug]
  const story = serviceStory[slug]
  const related = getServicesBySlug(service.relatedSlugs)
  const faqItems = getFaqsByIds(service.faqIds)
  const articles = blogPosts.filter((post) => service.blogSlugs.includes(post.slug))
  const quoteTo = `/offerte-aanvragen?dienst=${service.slug}`
  const appointmentTo = `/afspraak-maken?dienst=${service.slug}`
  const flow = serviceFlow[slug]

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
        imageVariant="project"
        actions={
          <CtaPair quoteTo={quoteTo} appointmentTo={appointmentTo} showCall />
        }
      />

      {slug === 'airco' ? (
        <>
          <Section>
            <Container className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="max-w-xl text-ink-muted">
                Binnenunits, buitenunits en omkastingen uit eigen werk staan op de
                werkpagina.
              </p>
              <ButtonLink to="/werk" variant="secondary" size="sm">
                Bekijk al het werk
              </ButtonLink>
            </Container>
          </Section>
          <BrandShowcase category="airco" brands={aircoBrands} />
        </>
      ) : null}

      {slug === 'service-onderhoud' ? <MaintenancePlans /> : null}

      <Section className={slug === 'service-onderhoud' ? 'bg-surface' : undefined}>
        <Container
          className={
            story.photos.length > 0
              ? 'grid items-end gap-10 lg:grid-cols-12'
              : 'max-w-3xl'
          }
        >
          <div className={story.photos.length > 0 ? 'lg:col-span-6' : undefined}>
            <p className="eyebrow">Context</p>
            <Heading as="h2" className="mt-3">
              {story.contextTitle}
            </Heading>
            <p className="lead mt-4">{story.context}</p>
            {service.explanation.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
          {story.photos.length > 0 ? (
            <div className="grid gap-8 lg:col-span-6">
              {story.photos.map((shot) => (
                <Reveal key={shot.caption} image>
                  <figure>
                    <MediaImage
                      asset={shot.asset}
                      variant="project"
                      className="mx-auto w-fit max-w-full max-h-[22rem] rounded-none sm:max-h-[24rem] lg:max-h-[26rem]"
                      sizes="(min-width: 1024px) 42vw, 100vw"
                    />
                    <figcaption className="mt-3 text-sm text-ink-muted">
                      {shot.caption}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : null}
        </Container>
      </Section>

      {slug === 'cv-ketel' ? (
        <BrandShowcase category="cv-ketel" brands={cvBoilerBrands} />
      ) : null}

      <Section className={slug === 'warmtepomp' ? 'bg-paper' : 'section-soft'}>
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Heading as="h2">Wat Green Installatie Noord doet</Heading>
            <ul className="mt-6 grid gap-3">
              {service.helpItems.map((item) => (
                <li key={item} className="border-b border-line py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <Heading as="h2">Wanneer het zinvol is</Heading>
            <ul className="mt-6 list-disc space-y-2 pl-5 text-ink-muted">
              {service.suitableFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="mt-10 font-semibold tracking-[-0.015em]">Aandachtspunten</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
              {service.technicalNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <GreenFlowSection variant={flow} ambient intensity="strong" className="bg-paper">
        <Section className="!bg-transparent">
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow">Aanpak</p>
              <Heading as="h2" className="mt-3">
                Hoe het werkt
              </Heading>
              <p className="lead mt-4">
                Van eerste vraag tot afronding. Planning en prijs volgen in het
                persoonlijke voorstel, niet als vaste belofte op deze pagina.
              </p>
            </div>
            <ol className="process-rail process-rail--vertical lg:col-span-7">
              {service.process.map((item, index) => (
                <li key={item.title} className="process-rail__item">
                  <div className="process-rail__marker" aria-hidden="true">
                    <span className="process-rail__dot" />
                  </div>
                  <div className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-line pb-6">
                    <p className="font-display text-2xl text-brand-dark">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <div>
                      <h3 className="font-semibold tracking-[-0.015em]">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      </GreenFlowSection>

      <GreenFlowSection variant={flow} ambient mask="left" intensity="strong" className="section-grain">
        <Section className="!bg-transparent">
          <Container className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow">Werkgebied</p>
              <Heading as="h2" className="mt-3">
                {service.shortName} in Noord-Nederland
              </Heading>
              <p className="lead mt-4">
                {serviceArea.statement} Groningen is de thuisprovincie; daarnaast
                Drenthe en Friesland.
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold lg:col-span-5 lg:justify-end">
              {serviceArea.provinces.map((province) => (
                <li key={province.name} className="border-b border-brand/25 pb-1">
                  {province.name}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      </GreenFlowSection>

      <CrossLinks
        title="Meer informatie"
        links={[
          {
            href: '/veelgestelde-vragen',
            label: 'Veelgestelde vragen',
            note: 'Antwoorden over installatie, onderhoud en aanvragen.',
            cta: 'Bekijk vragen',
            icon: 'faq',
          },
          {
            href: `/blog/categorie/${serviceBlogCategory[slug]}`,
            label: 'Artikelen bij deze dienst',
            note: 'Gidsen en checklists bij Advies & kennis.',
            cta: 'Lees artikelen',
            icon: 'articles',
          },
          {
            href: '/werk',
            label: 'Werk uit de praktijk',
            note: 'Foto’s van vergelijkbare installaties.',
            cta: 'Bekijk projecten',
            icon: 'work',
          },
        ]}
      />
      {slug === 'service-onderhoud' || slug === 'cv-ketel' ? (
        <EmergencyServiceBanner />
      ) : null}
      <TrustSection flow={flow} />
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
