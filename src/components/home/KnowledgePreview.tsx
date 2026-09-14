import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  blogCategoryLabels,
  blogPosts,
  estimateReadingMinutes,
  featuredGuideSlugs,
} from '../../data/blog'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function KnowledgePreview() {
  const posts = featuredGuideSlugs
    .map((slug) => blogPosts.find((post) => post.slug === slug))
    .filter((post): post is (typeof blogPosts)[number] => Boolean(post))

  if (posts.length === 0) return null

  return (
    <Section>
      <Container>
        <Reveal>
          <div className="max-w-xl">
            <p className="eyebrow">Advies & kennis</p>
            <Heading as="h2" className="mt-2.5 sm:mt-3">
              Handig om te weten
            </Heading>
            <p className="lead mt-2.5 sm:mt-3">
              Praktische informatie over cv-ketels, warmtepompen en onderhoud.
            </p>
          </div>
        </Reveal>

        {/* Mobile: compact editorial rows */}
        <ul className="home-article-list mt-5 sm:hidden" aria-label="Uitgelichte artikelen">
          {posts.map((post, index) => {
            const minutes = estimateReadingMinutes(post)
            return (
              <li key={post.slug}>
                <Reveal delay={index * 50}>
                  <Link to={`/blog/${post.slug}`} className="home-article-list__row">
                    <span className="home-article-list__body">
                      <span className="home-article-list__cat">
                        {blogCategoryLabels[post.category]}
                      </span>
                      <span className="home-article-list__title">{post.title}</span>
                      <span className="home-article-list__meta">
                        Circa {minutes} {minutes === 1 ? 'minuut' : 'minuten'} lezen
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      className="home-article-list__arrow"
                      aria-hidden="true"
                    />
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>

        {/* Tablet/desktop: richer cards */}
        <Reveal className="mt-5 hidden sm:mt-8 sm:block">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {posts.map((post) => (
              <li key={post.slug} className="h-full">
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full min-h-[8.5rem] flex-col border border-line bg-paper p-4 transition-[border-color,background-color,transform] duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:border-ink/25 hover:bg-stone/30 sm:min-h-[9.25rem] sm:p-5"
                >
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-dark">
                    {blogCategoryLabels[post.category]}
                  </span>
                  <span className="mt-2.5 block font-semibold tracking-[-0.015em] group-hover:text-brand-dark">
                    {post.title}
                  </span>
                  <span className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-muted lg:line-clamp-3">
                    {post.excerpt}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                    Lees artikel
                    <ArrowRight
                      size={14}
                      strokeWidth={1.7}
                      className="transition-transform motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="home-secondary-cta mt-5 sm:mt-7">
          <Link to="/blog" className="home-secondary-cta__link">
            Alle artikelen
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </Section>
  )
}
