import type { BlogPost } from '../../types'
import { BlogPostGrid } from '../blog/BlogPostGrid'
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
        <div className="mt-6">
          <BlogPostGrid posts={posts} />
        </div>
      </Container>
    </Section>
  )
}
