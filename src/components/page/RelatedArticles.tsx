import { Link } from 'react-router-dom'
import type { BlogPost } from '../../types'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

type RelatedArticlesProps = {
  posts: BlogPost[]
  title?: string
}

export function RelatedArticles({
  posts,
  title = 'Artikelen',
}: RelatedArticlesProps) {
  if (posts.length === 0) return null

  return (
    <Section>
      <Container>
        <Heading as="h2">{title}</Heading>
        <ul className="mt-4 grid gap-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="font-semibold underline">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
