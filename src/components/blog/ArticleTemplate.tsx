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
  const related = blogPosts
    .filter((item) => post.relatedArticleSlugs.includes(item.slug))
    .slice(0, 3)
  const relatedServices = getServicesBySlug(post.relatedServiceSlugs)
  const faqItems = getFaqsByIds(post.faqIds)
  const categoryLabel = blogCategoryLabels[post.category]
  const path = `/blog/${post.slug}`
  const minutes = estimateReadingMinutes(post)
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
      <PageHero
        compact
        narrow
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Advies & kennis', href: '/blog' },
          { label: categoryLabel, href: `/blog/categorie/${post.category}` },
          { label: post.title, href: path },
        ]}
        eyebrow={categoryLabel}
        title={post.title}
        titleClassName="text-[clamp(1.45rem,3.2vw,2.35rem)]"
        intro={post.intro}
      >
        <p className="mt-4 text-sm text-ink-muted">
          Door {site.name} · bijgewerkt {formatNlDate(post.updatedAt)} · circa{' '}
          {minutes} {minutes === 1 ? 'minuut' : 'minuten'} lezen
        </p>
      </PageHero>

      <Section className="!py-7 sm:!py-9 lg:!py-11">
        <Container>
          <div className="mx-auto grid max-w-3xl gap-10 lg:mx-0 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(12rem,15rem)] lg:gap-12 xl:grid-cols-[minmax(0,42rem)_minmax(12rem,15rem)] xl:justify-between">
            <Reveal>
              <div>
                <MediaImage
                  asset={postImage(post)}
                  alt={post.imageAlt}
                  variant="project"
                  className="mb-8 mx-auto w-fit max-h-[22rem] max-w-full sm:max-h-[26rem] lg:max-h-[28rem]"
                  sizes="(min-width: 768px) 42rem, 100vw"
                  priority
                />
                {post.sections.length > 1 ? (
                  <nav
                    aria-label="Inhoudsopgave"
                    className="mb-8 border border-line bg-paper p-5 lg:hidden"
                  >
                    <h2 className="text-base font-semibold">Inhoud</h2>
                    <ol className="mt-3 grid gap-2 text-sm">
                      {post.sections.map((section) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className="underline underline-offset-2"
                          >
                            {section.heading}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                ) : null}
                {post.sections.map((section) => (
                  <article
                    key={section.id}
                    id={section.id}
                    className="mb-8 scroll-mt-[calc(var(--header-offset)+0.75rem)]"
                  >
                    <Heading
                      as="h2"
                      className="!text-[clamp(1.25rem,2.2vw,1.65rem)]"
                    >
                      {section.heading}
                    </Heading>
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
                    <Heading
                      as="h2"
                      className="!text-[clamp(1.2rem,2vw,1.45rem)]"
                    >
                      Officiële bronnen
                    </Heading>
                    <p className="mt-2 text-sm text-ink-muted">
                      Verwijzingen naar overheids- of vakbronnen bij dit onderwerp.
                    </p>
                    <ContentLinks items={post.resources} />
                  </aside>
                ) : null}
              </div>
            </Reveal>

            {post.sections.length > 1 ? (
              <Reveal delay={50} className="hidden lg:block">
                <aside className="sticky top-28">
                  <nav
                    aria-label="Inhoudsopgave"
                    className="border border-line bg-paper p-5"
                  >
                    <h2 className="text-base font-semibold">Inhoud</h2>
                    <ol className="mt-3 grid gap-2 text-sm">
                      {post.sections.map((section) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className="underline underline-offset-2"
                          >
                            {section.heading}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                  <p className="mt-4 text-sm">
                    <Link
                      to={`/blog/categorie/${post.category}`}
                      className="font-semibold underline underline-offset-2"
                    >
                      Meer over {categoryLabel.toLowerCase()}
                    </Link>
                  </p>
                </aside>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </Section>

      <PageFaq items={faqItems} title="Vragen bij dit onderwerp" />
      <RelatedServices services={relatedServices} />
      <RelatedArticles posts={related} title="Gerelateerde artikelen" />
      <CTASection
        eyebrow="Advies"
        title="Advies nodig over uw installatie?"
        text="Bespreek uw situatie met Green Installatie Noord."
        quoteTo={
          relatedServices[0]
            ? `/offerte-aanvragen?dienst=${relatedServices[0].slug}`
            : '/offerte-aanvragen'
        }
      />
    </>
  )
}
