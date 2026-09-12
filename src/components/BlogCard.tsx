import { Link } from 'react-router-dom'
import { blogCategoryLabels } from '../data/blog'
import { blogImage } from '../data/media'
import type { BlogPost } from '../types'
import { MediaImage } from './media/MediaImage'

type BlogCardProps = {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-card">
      <MediaImage
        asset={blogImage(post.category)}
        alt={post.imageAlt}
        className="rounded-none"
        sizes="(min-width: 1024px) 33vw, 100vw"
      />
      <div className="flex flex-1 flex-col p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
        {blogCategoryLabels[post.category]}
      </p>
      <h3 className="mt-2 text-lg font-semibold">
        <Link to={`/blog/${post.slug}`} className="hover:text-brand-dark">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-ink-muted">{post.excerpt}</p>
      </div>
    </article>
  )
}
