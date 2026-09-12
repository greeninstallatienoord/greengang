import { Link } from 'react-router-dom'
import { BlogCard } from '../components/BlogCard'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { Container } from '../components/Container'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import {
  blogCategoryLabels,
  blogCategoryOrder,
  blogPosts,
} from '../data/blog'
import { pageSeo } from '../data/seo'
import { services } from '../data/services'

export function BlogPage() {
  return (
    <>
      <PageMeta {...pageSeo.blog} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Kennisbank', href: '/blog' },
        ]}
        eyebrow="Kennisbank"
        title="Kennisbank"
        intro="Nuchtere artikelen om een gesprek over cv-ketel, airconditioning, warmtepomp of onderhoud voor te bereiden. Geen vultekst, geen verzonnen cijfers."
      >
        <nav aria-label="Categorieën" className="mt-6 flex flex-wrap gap-2">
          {blogCategoryOrder.map((slug) => (
            <Link
              key={slug}
              to={`/blog/categorie/${slug}`}
              className="min-h-10 rounded-md border border-line bg-paper px-3 py-2 text-sm font-semibold hover:border-brand"
            >
              {blogCategoryLabels[slug]}
            </Link>
          ))}
        </nav>
      </PageHero>
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </Section>
      <RelatedServices services={services} />
      <CTASection />
    </>
  )
}
