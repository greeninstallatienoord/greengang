import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { blogCategoryLabels } from '../data/blog'
import { postImage } from '../data/media'
import type { BlogPost } from '../types'
import { MediaImage } from './media/MediaImage'

type BlogCardProps = {
  post: BlogPost
  priority?: boolean
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  return (
    <article className="group flex h-full flex-col bg-paper">
      <Link
        to={`/blog/${post.slug}`}
        className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <MediaImage
          asset={postImage(post)}
          alt={post.imageAlt}
          variant="card"
          className="rounded-none"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          priority={priority}
        />
        <div className="flex flex-1 flex-col border border-t-0 border-line p-5 sm:p-6">
          <p className="eyebrow">{blogCategoryLabels[post.category]}</p>
          <h3 className="mt-3 text-lg font-semibold leading-snug tracking-[-0.02em] group-hover:text-brand-dark">
            {post.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
            {post.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            Lees artikel
            <ArrowRight
              size={14}
              strokeWidth={1.7}
              className="transition-transform motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  )
}
