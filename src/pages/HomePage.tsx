import { Flame, Snowflake, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BlogCard } from '../components/BlogCard'
import { CtaPair } from '../components/CtaPair'
import { Container } from '../components/Container'
import { Heading } from '../components/Heading'
import { MediaImage } from '../components/media/MediaImage'
import { heroImage } from '../data/media'
import { ProcessSteps } from '../components/sections/ProcessSteps'
import { CTASection } from '../components/sections/CTASection'
import { TrustStrip } from '../components/sections/TrustStrip'
import { TrustSection } from '../components/trust/TrustSection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { ServiceGrid } from '../components/ServiceGrid'
import { blogPosts, featuredGuideSlugs } from '../data/blog'
import { site } from '../data/site'
import { pageSeo } from '../data/seo'
import { localBusinessJsonLd, websiteJsonLd } from '../lib/jsonld'

export function HomePage() {
  return (
    <>
      <PageMeta
        {...pageSeo.home}
        jsonLd={[websiteJsonLd(), localBusinessJsonLd()]}
      />
      <section className="bg-paper">
        <Container className="grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="fade-up">
            <p className="eyebrow">{site.copy.eyebrow}</p>
            <Heading as="h1" className="mt-3">
              {site.copy.heroTitle}
            </Heading>
            <p className="mt-5 max-w-xl text-lg text-ink-muted">{site.copy.heroText}</p>
            <CtaPair className="mt-7" size="lg" showCall />
          </div>
          <MediaImage
            asset={heroImage}
            priority
            className="w-full"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
        </Container>
      </section>

      <TrustStrip />

      <Section>
        <Container>
          <Heading as="h2">Diensten</Heading>
          <p className="mt-3 max-w-2xl text-ink-muted">
            Vier duidelijke specialismen. Kies wat bij uw vraag past, of start
            met een offerte als u nog twijfelt.
          </p>
          <div className="mt-8">
            <ServiceGrid />
          </div>
        </Container>
      </Section>

      <ProcessSteps />

      <TrustSection />

      <Section className="bg-paper">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <Heading as="h2">Kennisbank</Heading>
            <Link to="/blog" className="text-sm font-semibold text-brand-dark hover:underline">
              Naar de kennisbank
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featuredGuideSlugs
              .map((slug) => blogPosts.find((post) => post.slug === slug))
              .filter((post): post is (typeof blogPosts)[number] => Boolean(post))
              .map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-line bg-paper p-5">
            <Snowflake className="text-brand" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">Koelen of verwarmen per ruimte</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Start bij <Link to="/airco" className="underline">airconditioning</Link>.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-paper p-5">
            <Flame className="text-brand" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">Bestaande verwarming vervangen</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Start bij <Link to="/cv-ketel" className="underline">cv-ketel</Link> of{' '}
              <Link to="/service-onderhoud" className="underline">onderhoud</Link>.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-paper p-5">
            <Wrench className="text-brand" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">Vragen over de volgende stap</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Bekijk de <Link to="/veelgestelde-vragen" className="underline">FAQ</Link> of{' '}
              <Link to="/contact" className="underline">neem contact op</Link>.
            </p>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  )
}
