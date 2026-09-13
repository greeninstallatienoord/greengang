import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { blogCategoryLabels, blogPosts, featuredGuideSlugs } from '../../data/blog'
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
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="eyebrow">Advies & kennis</p>
              <Heading as="h2" className="mt-2.5 sm:mt-3">
                Handig om te weten
              </Heading>
              <p className="lead mt-2.5 sm:mt-3">
                Praktische informatie over cv-ketels, warmtepompen en onderhoud.
              </p>
            </div>
            <Link to="/blog" className="text-link inline-flex min-h-11 items-center">
              Alle artikelen
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-5 sm:mt-8">
          <ul className="grid gap-2.5 sm:gap-3 lg:grid-cols-3 lg:gap-4">
            {posts.map((post) => (
              <li key={post.slug} className="h-full">
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full min-h-[8.5rem] flex-col border border-line bg-paper p-3.5 transition-[border-color,background-color] duration-[var(--duration-fast)] hover:border-ink/25 hover:bg-stone/30 min-[390px]:p-4 sm:min-h-[9.25rem] sm:p-5"
                >
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-dark">
                    {blogCategoryLabels[post.category]}
                  </span>
                  <span className="mt-2.5 block font-semibold tracking-[-0.015em] group-hover:text-brand-dark">
                    {post.title}
                  </span>
                  <span className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">
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
      </Container>
    </Section>
  )
}
