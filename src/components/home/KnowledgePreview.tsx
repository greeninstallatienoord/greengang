import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { blogPosts, featuredGuideSlugs } from '../../data/blog'
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
            <div>
              <p className="eyebrow">Kennisbank</p>
              <Heading as="h2" className="mt-3">
                Eerst lezen, dan bellen
              </Heading>
            </div>
            <Link to="/blog" className="text-link">
              Alle artikelen
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-7 sm:mt-10">
          <ul className="divide-y divide-line border-y border-line">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex min-h-16 items-start justify-between gap-4 py-5"
                >
                  <span>
                    <span className="block font-semibold tracking-[-0.015em] group-hover:text-brand-dark">
                      {post.title}
                    </span>
                    <span className="mt-1.5 block max-w-2xl text-sm leading-relaxed text-ink-muted">
                      {post.excerpt}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    strokeWidth={1.6}
                    className="mt-1 shrink-0 text-ink-muted transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  )
}
