import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  blogCategoryLabels,
  blogPosts,
  estimateReadingMinutes,
} from '../../data/blog'
import { getFaqsByIds } from '../../data/faq'
import { getServicesBySlug } from '../../data/services'
import { site } from '../../data/site'
import {
  articleJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
} from '../../lib/jsonld'
import { formatNlDate } from '../../lib/dates'
import type { BlogPost } from '../../types'
import { ContentLinks } from '../ContentLinks'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { postImage } from '../../data/media'
import { MediaImage } from '../media/MediaImage'
import { PageFaq } from '../page/PageFaq'
import { RelatedArticles } from '../page/RelatedArticles'
import { RelatedServices } from '../page/RelatedServices'
import { Reveal } from '../Reveal'
import { ArticleWorkNote } from './ArticleWorkNote'
import { ArticleReadingProgress, ArticleToc } from './ArticleToc'
import { Breadcrumbs } from '../Breadcrumbs'
import { CTASection } from '../sections/CTASection'
import { PageMeta } from '../seo/PageMeta'
import { cn } from '../../lib/cn'

type ArticleTemplateProps = {
  post: BlogPost
}

function workNoteSubject(category: BlogPost['category']): string {
  switch (category) {
    case 'cv-ketel':
      return 'cv-ketelinstallaties'
    case 'airco':
      return 'airco-installaties'
    case 'warmtepomp':
      return 'warmtepompinstallaties'
    case 'onderhoud':
      return 'onderhoudsprojecten'
    default:
      return 'installaties'
  }
}

function articleCtaCopy(serviceSlug: string | undefined): {
  title: string
  text: string
  quoteTo: string
} {
  switch (serviceSlug) {
    case 'cv-ketel':
      return {
        title: 'Hulp nodig bij uw cv-ketel?',
        text: 'Twijfelt u over vervanging of de staat van uw ketel? We kijken graag naar uw situatie.',
        quoteTo: '/offerte-aanvragen?dienst=cv-ketel',
      }
    case 'airco':
      return {
        title: 'Hulp nodig bij airconditioning?',
        text: 'Twijfelt u over een airco voor koelen én verwarmen? We kijken graag naar uw situatie.',
        quoteTo: '/offerte-aanvragen?dienst=airco',
      }
    case 'warmtepomp':
      return {
        title: 'Hulp nodig bij een warmtepomp?',
        text: 'Twijfelt u of een warmtepomp bij uw woning past? We kijken graag mee.',
        quoteTo: '/offerte-aanvragen?dienst=warmtepomp',
      }
    case 'service-onderhoud':
      return {
        title: 'Hulp nodig bij service of onderhoud?',
        text: 'Voor onderhoud of een storing kunt u bij ons terecht — ook buiten kantooruren via de storingsdienst.',
        quoteTo: '/offerte-aanvragen?dienst=service-onderhoud',
      }
    default:
      return {
        title: 'Hulp nodig bij uw installatie?',
        text: 'Twijfelt u over uw cv-ketel, warmtepomp of airco? We kijken graag naar uw situatie.',
        quoteTo: '/offerte-aanvragen',
      }
  }
}

export function ArticleTemplate({ post }: ArticleTemplateProps) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const related = blogPosts
    .filter((item) => post.relatedArticleSlugs.includes(item.slug))
    .slice(0, 3)
  const relatedServices = getServicesBySlug(post.relatedServiceSlugs)
  const faqItems = getFaqsByIds(post.faqIds)
  const categoryLabel = blogCategoryLabels[post.category]
  const path = `/blog/${post.slug}`
  const minutes = estimateReadingMinutes(post)
  const image = postImage(post)
  const portrait = image.height >= image.width
  const tocSections = post.sections.map((section) => ({
    id: section.id,
    heading: section.heading,
  }))
  const primaryService = relatedServices[0]
  const cta = articleCtaCopy(primaryService?.slug)
  const jsonLd = [
    localBusinessJsonLd(),
    articleJsonLd(post),
    faqJsonLd(faqItems),
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

      <ArticleReadingProgress targetRef={bodyRef} />

      <article>
        <header className="article-header border-b border-line bg-paper">
          <Container className="article-shell">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Advies & kennis', href: '/blog' },
                {
                  label: categoryLabel,
                  href: `/blog/categorie/${post.category}`,
                },
                { label: post.title, href: path },
              ]}
            />
            <p className="eyebrow mt-5 sm:mt-6">{categoryLabel}</p>
            <Heading as="h1" className="article-title mt-2.5 text-balance sm:mt-3">
              {post.title}
            </Heading>
            <p className="article-dek mt-4 sm:mt-5">{post.intro}</p>
            <p className="article-meta mt-4 sm:mt-5">
              <span>Door {site.name}</span>
              <span aria-hidden="true"> · </span>
              <span>Bijgewerkt {formatNlDate(post.updatedAt)}</span>
              <span aria-hidden="true"> · </span>
              <span>
                Circa {minutes} {minutes === 1 ? 'minuut' : 'minuten'} lezen
              </span>
            </p>
          </Container>
        </header>

        <div className="article-body-band">
          <Container className="article-shell py-7 sm:py-9 lg:py-11">
            <div className="article-grid">
              <div ref={bodyRef} className="article-main">
                <Reveal image>
                  <figure
                    className={cn(
                      'article-figure',
                      portrait
                        ? 'article-figure--portrait'
                        : 'article-figure--landscape',
                    )}
                  >
                    <MediaImage
                      asset={image}
                      alt={post.imageAlt}
                      variant="project"
                      className="article-figure__media"
                      sizes="(min-width: 1024px) 48rem, 100vw"
                      priority
                    />
                    <figcaption className="article-figure__caption">
                      {post.imageAlt}
                    </figcaption>
                  </figure>
                </Reveal>

                <ArticleToc
                  sections={tocSections}
                  variant="mobile"
                  className="mt-7 lg:hidden"
                />

                <div className="article-prose">
                  {post.sections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="article-section"
                    >
                      <Heading as="h2" className="article-prose__h2">
                        {section.heading}
                      </Heading>
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {section.links ? (
                        <ContentLinks items={section.links} variant="resources" />
                      ) : null}
                    </section>
                  ))}
                </div>

                <ArticleWorkNote subject={workNoteSubject(post.category)} />

                {post.resources && post.resources.length > 0 ? (
                  <ContentLinks
                    items={post.resources}
                    variant="sources"
                    className="mt-10"
                    intro="Voor dit onderwerp verwijzen we naar onafhankelijke overheids- en vakbronnen."
                  />
                ) : null}
              </div>

              <aside className="article-sidebar hidden lg:block">
                <div className="article-sidebar__sticky">
                  <ArticleToc sections={tocSections} variant="sidebar" />
                  <p className="mt-5 text-sm">
                    <Link
                      to={`/blog/categorie/${post.category}`}
                      className="inline-flex items-center gap-1 font-semibold text-brand-dark transition-colors hover:text-ink"
                    >
                      Meer over {categoryLabel.toLowerCase()}
                    </Link>
                  </p>
                </div>
              </aside>
            </div>
          </Container>
        </div>
      </article>

      <PageFaq
        items={faqItems}
        title="Vragen bij dit onderwerp"
        tone="paper"
        compact
        className="article-faq"
      />
      <RelatedServices services={relatedServices} />
      <RelatedArticles
        posts={related}
        title={`Meer over ${categoryLabel.toLowerCase()}`}
        compact
      />
      <CTASection
        eyebrow="Advies"
        title={cta.title}
        text={cta.text}
        quoteTo={cta.quoteTo}
        primaryLabel="Offerte aanvragen"
        secondaryLabel="Afspraak aanvragen"
      />
    </>
  )
}
