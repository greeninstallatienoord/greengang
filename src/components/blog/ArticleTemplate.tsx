import { Link } from 'react-router-dom'
import { blogCategoryLabels, blogPosts } from '../../data/blog'
import { getFaqsByIds } from '../../data/faq'
import { getServicesBySlug } from '../../data/services'
import { site } from '../../data/site'
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
} from '../../lib/jsonld'
import { formatNlDate } from '../../lib/dates'
import type { BlogPost } from '../../types'
import { ContentLinks } from '../ContentLinks'
import { Container } from '../Container'
import { CtaPair } from '../CtaPair'
import { blogImage } from '../../data/media'
import { MediaImage } from '../media/MediaImage'
import { PageFaq } from '../page/PageFaq'
import { PageHero } from '../page/PageHero'
import { RelatedArticles } from '../page/RelatedArticles'
import { RelatedServices } from '../page/RelatedServices'
import { Reveal } from '../Reveal'
import { ArticleWorkNote } from './ArticleWorkNote'
import { CTASection } from '../sections/CTASection'
import { Section } from '../Section'
import { PageMeta } from '../seo/PageMeta'

type ArticleTemplateProps = {
  post: BlogPost
}

export function ArticleTemplate({ post }: ArticleTemplateProps) {
  const related = blogPosts.filter((item) =>
    post.relatedArticleSlugs.includes(item.slug),
  )
  const relatedServices = getServicesBySlug(post.relatedServiceSlugs)
  const faqItems = getFaqsByIds(post.faqIds)
  const categoryLabel = blogCategoryLabels[post.category]
  const path = `/blog/${post.slug}`
  const jsonLd = [
    localBusinessJsonLd(),
    articleJsonLd(post),
    faqJsonLd(faqItems),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Kennisbank', path: '/blog' },
      { name: categoryLabel, path: `/blog/categorie/${post.category}` },
      { name: post.title, path },
    ]),
  ].filter((item): item is Record<string, unknown> => Boolean(item))

  return (
    <>
      <PageMeta
        title={post.title}
        description={post.excerpt}
        path={path}
        type="article"
        imageAlt={post.imageAlt}
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        jsonLd={jsonLd}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Kennisbank', href: '/blog' },
          { label: categoryLabel, href: `/blog/categorie/${post.category}` },
          { label: post.title, href: path },
        ]}
        eyebrow={categoryLabel}
        title={post.title}
        intro={post.intro}
        narrow
      >
        <p className="mt-4 text-sm text-ink-muted">
          Door {site.name} · gepubliceerd {formatNlDate(post.publishedAt)} ·
          bijgewerkt {formatNlDate(post.updatedAt)}
        </p>
        <div className="mt-5">
          <CtaPair equal />
        </div>
      </PageHero>
      <Section>
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,17.5rem)] lg:items-start">
          <Reveal>
            <div className="max-w-3xl">
              <MediaImage
                asset={blogImage(post.category)}
                alt={post.imageAlt}
                className="mb-8"
                ratio="16 / 10"
                sizes="(min-width: 768px) 48rem, 100vw"
              />
              {post.sections.map((section) => (
                <article key={section.id} id={section.id} className="mb-8 scroll-mt-28">
                  <h2 className="text-2xl font-semibold">{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-3 text-ink-muted">
                      {paragraph}
                    </p>
                  ))}
                  {section.links ? <ContentLinks items={section.links} /> : null}
                </article>
              ))}
              <ArticleWorkNote />
              {post.resources && post.resources.length > 0 ? (
                <aside className="mt-10 border border-line bg-paper p-5">
                  <h2 className="text-xl font-semibold">Officiële bronnen</h2>
                  <p className="mt-2 text-sm text-ink-muted">
                    Uitgaande citaties naar overheids- of vakbronnen. Geen
                    partnerpagina’s en geen bewijs van een backlink naar ons.
                  </p>
                  <ContentLinks items={post.resources} />
                </aside>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={50} className="lg:sticky lg:top-28">
            <aside className="grid gap-4">
              <nav aria-label="Inhoudsopgave" className="border border-line bg-paper p-5">
                <h2 className="text-base font-semibold">Inhoud</h2>
                <ol className="mt-3 grid gap-2 text-sm">
                  {post.sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="underline underline-offset-2">
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <nav className="border border-line bg-paper p-5" aria-label="Vervolg">
                <h2 className="text-base font-semibold">Vervolg</h2>
                <ul className="mt-3 grid gap-2 text-sm font-semibold">
                  <li>
                    <Link
                      to={`/blog/categorie/${post.category}`}
                      className="underline underline-offset-2"
                    >
                      Meer over {categoryLabel.toLowerCase()}
                    </Link>
                  </li>
                  {relatedServices.map((service) => (
                    <li key={service.slug}>
                      <Link to={service.href} className="underline underline-offset-2">
                        Dienst: {service.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/veelgestelde-vragen" className="underline underline-offset-2">
                      Veelgestelde vragen
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="underline underline-offset-2">
                      Alle artikelen
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>
          </Reveal>
        </Container>
      </Section>
      <PageFaq items={faqItems} title="Vragen bij dit onderwerp" />
      <RelatedServices services={relatedServices} />
      <RelatedArticles posts={related} title="Meer artikelen" />
      <CTASection
        quoteTo={
          relatedServices[0]
            ? `/offerte-aanvragen?dienst=${relatedServices[0].slug}`
            : '/offerte-aanvragen'
        }
      />
    </>
  )
}
