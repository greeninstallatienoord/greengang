import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BlogCategoryNav } from '../components/blog/BlogCategoryNav'
import { BlogFeatured } from '../components/blog/BlogFeatured'
import { BlogPostGrid } from '../components/blog/BlogPostGrid'
import { BlogSearch } from '../components/blog/BlogSearch'
import { PageHero } from '../components/page/PageHero'
import { Container } from '../components/Container'
import { Heading } from '../components/Heading'
import { Reveal } from '../components/Reveal'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import {
  blogPosts,
  primaryFeaturedSlug,
} from '../data/blog'
import { pageSeo } from '../data/seo'
import {
  collectionPageJsonLd,
  localBusinessJsonLd,
} from '../lib/jsonld'

function matchesQuery(haystack: string, query: string) {
  return haystack.toLowerCase().includes(query.trim().toLowerCase())
}

export function BlogPage() {
  const [query, setQuery] = useState('')
  const searching = query.trim().length > 0

  const featured = useMemo(
    () => blogPosts.find((post) => post.slug === primaryFeaturedSlug),
    [],
  )

  const filtered = useMemo(() => {
    return blogPosts.filter((post) =>
      matchesQuery(
        `${post.title} ${post.excerpt} ${post.intro} ${post.tags.join(' ')}`,
        query,
      ),
    )
  }, [query])

  const listed = useMemo(() => {
    if (searching) return filtered
    return filtered.filter((post) => post.slug !== primaryFeaturedSlug)
  }, [filtered, searching])

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
        ]}
      />
      <PageHero
        compact
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Advies & kennis', href: '/blog' },
        ]}
        eyebrow="Advies & kennis"
        title="Advies & kennis"
        titleClassName="max-w-[16ch] text-[clamp(1.55rem,3.4vw,2.45rem)]"
        intro="Praktische informatie over cv-ketels, airconditioning, warmtepompen, onderhoud en energiezuinig wonen."
      />

      <Section className="!py-7 sm:!py-9 lg:!py-11">
        <Container>
          <Reveal>
            <BlogSearch query={query} onQueryChange={setQuery} />
          </Reveal>

          <Reveal delay={40} className="mt-6 sm:mt-7">
            <BlogCategoryNav />
          </Reveal>

          {!searching && featured ? (
            <Reveal delay={60} className="mt-8 sm:mt-10">
              <p className="text-sm font-semibold text-ink-muted">Uitgelicht</p>
              <div className="mt-3">
                <BlogFeatured post={featured} />
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={80} className="mt-10 sm:mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <Heading as="h2">
                  {searching ? 'Zoekresultaten' : 'Alle artikelen'}
                </Heading>
                <p className="mt-1 text-sm text-ink-muted">
                  {listed.length}{' '}
                  {listed.length === 1 ? 'artikel' : 'artikelen'}
                  {searching ? ` voor “${query.trim()}”` : null}
                </p>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <BlogPostGrid posts={listed} />
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-12 sm:mt-14">
            <nav
              aria-label="Vervolg"
              className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-8 text-sm font-semibold"
            >
              <Link to="/veelgestelde-vragen" className="underline underline-offset-2">
                Veelgestelde vragen
              </Link>
              <Link to="/werkgebied" className="underline underline-offset-2">
                Werkgebied
              </Link>
              <Link to="/contact" className="underline underline-offset-2">
                Contact
              </Link>
            </nav>
          </Reveal>
        </Container>
      </Section>

      <CTASection
        eyebrow="Advies"
        title="Advies nodig over uw installatie?"
        text="Bespreek uw situatie met Green Installatie Noord."
      />
    </>
  )
}
