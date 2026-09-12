import { useMemo, useState } from 'react'
import { CtaPair } from '../components/CtaPair'
import { BlogPostGrid } from '../components/blog/BlogPostGrid'
import { BlogSidebar } from '../components/blog/BlogSidebar'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { Container } from '../components/Container'
import { Heading } from '../components/Heading'
import { Reveal } from '../components/Reveal'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import {
  blogPosts,
  featuredGuideSlugs,
} from '../data/blog'
import { pageSeo } from '../data/seo'
import { services } from '../data/services'
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  localBusinessJsonLd,
} from '../lib/jsonld'

function matchesQuery(haystack: string, query: string) {
  return haystack.toLowerCase().includes(query.trim().toLowerCase())
}

export function BlogPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return blogPosts.filter((post) =>
      matchesQuery(
        `${post.title} ${post.excerpt} ${post.intro} ${post.tags.join(' ')}`,
        query,
      ),
    )
  }, [query])

  const featured = useMemo(
    () =>
      featuredGuideSlugs
        .map((slug) => blogPosts.find((post) => post.slug === slug))
        .filter((post): post is (typeof blogPosts)[number] => Boolean(post)),
    [],
  )

  const listed = useMemo(() => {
    if (query.trim()) return filtered
    const featuredSet = new Set<string>(featuredGuideSlugs)
    return filtered.filter((post) => !featuredSet.has(post.slug))
  }, [filtered, query])

  return (
    <>
      <PageMeta
        {...pageSeo.blog}
        jsonLd={[
          localBusinessJsonLd(),
          collectionPageJsonLd({
            name: pageSeo.blog.title,
            description: pageSeo.blog.description,
            path: '/blog',
            items: blogPosts.map((post) => ({
              name: post.title,
              path: `/blog/${post.slug}`,
            })),
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Kennisbank', path: '/blog' },
          ]),
        ]}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Kennisbank', href: '/blog' },
        ]}
        eyebrow="Kennisbank"
        title="Kennisbank"
        intro="Nuchtere artikelen om een gesprek over cv-ketel, airconditioning, warmtepomp of onderhoud voor te bereiden. Geen vultekst, geen verzonnen cijfers."
        actions={<CtaPair equal />}
      />

      <Section className="bg-paper">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,17.5rem)_1fr] lg:items-start">
          <Reveal>
            <BlogSidebar query={query} onQueryChange={setQuery} />
          </Reveal>
          <Reveal delay={50}>
            <div className="grid gap-10">
              {query.trim() === '' ? (
                <section>
                  <Heading as="h2">Gidsen om te beginnen</Heading>
                  <p className="mt-1 text-sm text-ink-muted">
                    Langere stukken met officiële bronnen erbij.
                  </p>
                  <div className="mt-4">
                    <BlogPostGrid posts={featured} />
                  </div>
                </section>
              ) : null}
              <section>
                <Heading as="h2">
                  {query.trim() ? 'Zoekresultaten' : 'Overige artikelen'}
                </Heading>
                <p className="mt-1 text-sm text-ink-muted">
                  {listed.length} {listed.length === 1 ? 'artikel' : 'artikelen'}
                </p>
                <div className="mt-4">
                  <BlogPostGrid posts={listed} />
                </div>
              </section>
            </div>
          </Reveal>
        </Container>
      </Section>

      <RelatedServices services={services} title="Diensten" />
      <CTASection />
    </>
  )
}
