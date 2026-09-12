import type { BlogPost } from '../../types'
import { BlogCard } from '../BlogCard'
import { Reveal } from '../Reveal'

type BlogPostGridProps = {
  posts: BlogPost[]
  emptyText?: string
}

export function BlogPostGrid({
  posts,
  emptyText = 'Geen artikelen gevonden voor deze zoekopdracht.',
}: BlogPostGridProps) {
  if (posts.length === 0) {
    return <p className="text-ink-muted">{emptyText}</p>
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {posts.map((post, index) => (
        <Reveal key={post.slug} delay={Math.min(index * 40, 160)}>
          <BlogCard post={post} />
        </Reveal>
      ))}
    </div>
  )
}
