import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { blogCategoryLabels, estimateReadingMinutes } from '../../data/blog'
import { postImage } from '../../data/media'
import type { BlogPost } from '../../types'
import { MediaImage } from '../media/MediaImage'

type BlogFeaturedProps = {
  post: BlogPost
}

export function BlogFeatured({ post }: BlogFeaturedProps) {
  const minutes = estimateReadingMinutes(post)

  return (
    <article className="border border-line bg-paper">
      <Link
        to={`/blog/${post.slug}`}
        className="group grid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
      >
        <MediaImage
          asset={postImage(post)}
          alt={post.imageAlt}
          className="rounded-none"
          ratio="16 / 10"
          sizes="(min-width: 1024px) 55vw, 100vw"
          priority
        />
        <div className="flex flex-col justify-center border-t border-line p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
          <p className="eyebrow">{blogCategoryLabels[post.category]}</p>
          <h2 className="mt-3 font-display text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold leading-snug tracking-[-0.02em] group-hover:text-brand-dark">
            {post.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-[0.95rem]">
            {post.excerpt}
          </p>
          <p className="mt-4 text-xs text-ink-muted">
            Circa {minutes} {minutes === 1 ? 'minuut' : 'minuten'} lezen
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            Lees artikel
            <ArrowRight
              size={15}
              strokeWidth={1.75}
              className="transition-transform motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  )
}
