import { Link, useParams } from 'react-router-dom'
import { BlogCard } from '../components/BlogCard'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { Container } from '../components/Container'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import {
  blogCategoryLabels,
  getPostsByCategory,
  isBlogCategory,
} from '../data/blog'
import { blogCategorySeo } from '../data/seo'
import { services } from '../data/services'
import { NotFoundPage } from './NotFoundPage'

const categoryService: Record<string, string> = {
  'cv-ketel': '/cv-ketel',
  airco: '/airco',
  warmtepomp: '/warmtepomp',
  onderhoud: '/service-onderhoud',
}

export function BlogCategoryPage() {
  const { categorie } = useParams()
  if (!categorie || !isBlogCategory(categorie)) return <NotFoundPage />

  const seo = blogCategorySeo[categorie]
  if (!seo) return <NotFoundPage />

  const posts = getPostsByCategory(categorie)
  const label = blogCategoryLabels[categorie]
  const serviceHref = categoryService[categorie]

  return (
    <>
      <PageMeta
        title={seo.title}
        description={seo.description}
        path={`/blog/categorie/${categorie}`}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Kennisbank', href: '/blog' },
          { label, href: `/blog/categorie/${categorie}` },
        ]}
        eyebrow="Categorie"
        title={seo.title}
        intro={seo.intro}
      >
        {serviceHref ? (
          <p className="mt-4 text-sm">
            <Link to={serviceHref} className="font-semibold underline">
              Naar de dienst {label.toLowerCase()}
            </Link>
          </p>
        ) : null}
      </PageHero>
      <Section>
        <Container>
          {posts.length === 0 ? (
            <p className="text-ink-muted">In deze categorie staan nog geen artikelen.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </Container>
      </Section>
      <RelatedServices services={services} />
      <CTASection />
    </>
  )
}
