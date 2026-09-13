import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BlogCategoryNav } from '../components/blog/BlogCategoryNav'
import { BlogPostGrid } from '../components/blog/BlogPostGrid'
import { BlogSearch } from '../components/blog/BlogSearch'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { Container } from '../components/Container'
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
        ]}
      />
      <PageHero
        compact
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Advies & kennis', href: '/blog' },
          { label, href: path },
        ]}
        eyebrow="Advies & kennis"
        title={label}
        titleClassName="max-w-[16ch] text-[clamp(1.55rem,3.4vw,2.45rem)]"
        intro={seo.intro}
      />

      <Section className="!py-7 sm:!py-9 lg:!py-11">
        <Container>
          <Reveal>
            <BlogSearch
              id={`blog-search-${validCategory}`}
              query={query}
              onQueryChange={setQuery}
            />
          </Reveal>

          <Reveal delay={40} className="mt-6 sm:mt-7">
            <BlogCategoryNav activeCategory={validCategory} />
          </Reveal>

          <Reveal delay={60} className="mt-8 sm:mt-10">
            <p className="text-sm text-ink-muted">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'artikel' : 'artikelen'}
              {query.trim() ? ` voor “${query.trim()}”` : null}
            </p>
            <div className="mt-5 sm:mt-6">
              <BlogPostGrid
                posts={filtered}
                emptyText="In deze categorie staan nog geen artikelen voor deze zoekopdracht."
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      {relatedServices.length > 0 ? (
        <RelatedServices services={relatedServices} title="Dienst bij dit onderwerp" />
      ) : null}

      <CTASection
        eyebrow="Advies"
        title="Advies nodig over uw installatie?"
        text="Bespreek uw situatie met Green Installatie Noord."
        quoteTo={
          serviceSlug
            ? `/offerte-aanvragen?dienst=${serviceSlug}`
            : '/offerte-aanvragen'
        }
      />
    </>
  )
}
