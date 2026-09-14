import type { BlogPost } from '../../types'
import { BlogPostGrid } from '../blog/BlogPostGrid'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'
import { cn } from '../../lib/cn'

type RelatedArticlesProps = {
  posts: BlogPost[]
  title?: string
  /** Narrower editorial shell + 2-column preference for article footers. */
  compact?: boolean
}

export function RelatedArticles({
  posts,
  title = 'Artikelen',
  compact = false,
}: RelatedArticlesProps) {
  if (posts.length === 0) return null

  return (
    <Section className={cn(compact && '!py-7 sm:!py-9 lg:!py-11')}>
      <Container className={cn(compact && 'article-shell')}>
        <Heading
          as="h2"
          className={compact ? 'text-[clamp(1.3rem,2.4vw,1.75rem)]' : undefined}
        >
          {title}
        </Heading>
        <div className="mt-5 sm:mt-6">
          <BlogPostGrid posts={posts} columns={compact ? 2 : 3} />
        </div>
      </Container>
    </Section>
  )
}
