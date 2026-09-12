import { Link } from 'react-router-dom'
import { blogCategoryLabels } from '../data/blog'
import { blogImage } from '../data/media'
import { formatNlDate } from '../lib/dates'
import type { BlogPost } from '../types'
import { MediaImage } from './media/MediaImage'

type BlogCardProps = {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex h-full flex-col bg-paper">
      <Link to={`/blog/${post.slug}`} className="flex h-full flex-col">
        <MediaImage
          asset={blogImage(post.category)}
          alt={post.imageAlt}
          className="rounded-none"
          ratio="16 / 10"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <div className="flex flex-1 flex-col border border-t-0 border-line p-5 sm:p-6">
          <p className="eyebrow">{blogCategoryLabels[post.category]}</p>
          <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] leading-snug group-hover:text-brand-dark">
            {post.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
          <p className="mt-4 text-xs text-ink-muted">
            Bijgewerkt {formatNlDate(post.updatedAt)}
          </p>
        </div>
      </Link>
    </article>
  )
}
