import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
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
  blogCategoryLabels,
  getPostsByCategory,
  isBlogCategory,
} from '../data/blog'
import { blogCategorySeo } from '../data/seo'
import { getServicesBySlug } from '../data/services'
import type { BlogCategorySlug, ServiceSlug } from '../types'
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  localBusinessJsonLd,
} from '../lib/jsonld'
import { NotFoundPage } from './NotFoundPage'

const categoryServiceSlug: Partial<Record<BlogCategorySlug, ServiceSlug>> = {
  'cv-ketel': 'cv-ketel',
  airco: 'airco',
  warmtepomp: 'warmtepomp',
  onderhoud: 'service-onderhoud',
}

export function BlogCategoryPage() {
  const { categorie } = useParams()
  const [query, setQuery] = useState('')
  const validCategory = categorie && isBlogCategory(categorie) ? categorie : undefined
  const posts = useMemo(
    () => (validCategory ? getPostsByCategory(validCategory) : []),
    [validCategory],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return posts
    return posts.filter((post) =>
      `${post.title} ${post.excerpt} ${post.intro} ${post.tags.join(' ')}`
        .toLowerCase()
        .includes(needle),
    )
  }, [posts, query])

  if (!validCategory) return <NotFoundPage />

  const seo = blogCategorySeo[validCategory]
  if (!seo) return <NotFoundPage />

  const label = blogCategoryLabels[validCategory]
  const path = `/blog/categorie/${validCategory}`
  const serviceSlug = categoryServiceSlug[validCategory]
  const relatedServices = serviceSlug ? getServicesBySlug([serviceSlug]) : []

  return (
    <>
      <PageMeta
        title={seo.title}
        description={seo.description}
        path={path}
        jsonLd={[
          localBusinessJsonLd(),
          collectionPageJsonLd({
            name: seo.title,
            description: seo.description,
            path,
            items: posts.map((post) => ({
              name: post.title,
              path: `/blog/${post.slug}`,
            })),
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Kennisbank', path: '/blog' },
            { name: label, path },
          ]),
        ]}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Kennisbank', href: '/blog' },
          { label, href: path },
        ]}
        eyebrow="Categorie"
        title={seo.title}
        intro={seo.intro}
        actions={<CtaPair equal />}
      />

      <Section className="bg-paper">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,17.5rem)_1fr] lg:items-start">
          <Reveal>
            <BlogSidebar
              query={query}
              onQueryChange={setQuery}
              activeCategory={validCategory}
            />
          </Reveal>
          <Reveal delay={50}>
            <section>
              <Heading as="h2">{label}</Heading>
              <p className="mt-1 text-sm text-ink-muted">
                {filtered.length} {filtered.length === 1 ? 'artikel' : 'artikelen'}
              </p>
              <div className="mt-4">
                <BlogPostGrid
                  posts={filtered}
                  emptyText="In deze categorie staan nog geen artikelen voor deze zoekopdracht."
                />
              </div>
            </section>
          </Reveal>
        </Container>
      </Section>

      <RelatedServices services={relatedServices} title="Dienst bij dit onderwerp" />
      <CTASection
        quoteTo={
          serviceSlug
            ? `/offerte-aanvragen?dienst=${serviceSlug}`
            : '/offerte-aanvragen'
        }
      />
    </>
  )
}
