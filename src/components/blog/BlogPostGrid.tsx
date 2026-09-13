import type { BlogPost } from '../../types'
import { BlogCard } from '../BlogCard'
import { Reveal } from '../Reveal'

type BlogPostGridProps = {
  posts: BlogPost[]
  emptyText?: string
  columns?: 2 | 3
}

export function BlogPostGrid({
  posts,
  emptyText = 'Geen artikelen gevonden voor deze zoekopdracht.',
  columns = 3,
}: BlogPostGridProps) {
  if (posts.length === 0) {
    return <p className="text-ink-muted">{emptyText}</p>
  }

  return (
    <div
      className={
        columns === 3
          ? 'grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'
          : 'grid gap-5 sm:gap-6 md:grid-cols-2'
      }
    >
      {posts.map((post, index) => (
        <Reveal key={post.slug} delay={Math.min(index * 40, 160)}>
          <BlogCard post={post} />
        </Reveal>
      ))}
    </div>
  )
}
