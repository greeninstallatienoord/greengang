import { Link } from 'react-router-dom'
import {
  blogCategoryLabels,
  blogCategoryOrder,
  blogPosts,
} from '../../data/blog'
import { cn } from '../../lib/cn'
import type { BlogCategorySlug } from '../../types'

type BlogCategoryNavProps = {
  activeCategory?: BlogCategorySlug
}

function categoryCount(slug: BlogCategorySlug) {
  return blogPosts.filter((post) => post.category === slug).length
}

export function BlogCategoryNav({ activeCategory }: BlogCategoryNavProps) {
  return (
    <nav aria-label="Onderwerpen" className="-mx-3.5 min-[375px]:-mx-4 sm:mx-0">
      <div className="flex gap-1 overflow-x-auto border-b border-line px-3.5 pb-1 [scrollbar-width:none] min-[375px]:px-4 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <Link
          to="/blog"
          className={cn(
            'shrink-0 px-3 py-3 text-sm font-semibold tracking-[-0.01em] transition-colors',
            'min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            !activeCategory
              ? 'text-ink underline decoration-brand decoration-2 underline-offset-8'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          Alle
          <span className="ml-1.5 font-normal text-ink-muted/80">
            {blogPosts.length}
          </span>
        </Link>
        {blogCategoryOrder.map((slug) => {
          const count = categoryCount(slug)
          if (count === 0) return null
          return (
            <Link
              key={slug}
              to={`/blog/categorie/${slug}`}
              className={cn(
                'shrink-0 px-3 py-3 text-sm font-semibold tracking-[-0.01em] transition-colors',
                'min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                activeCategory === slug
                  ? 'text-ink underline decoration-brand decoration-2 underline-offset-8'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              {blogCategoryLabels[slug]}
              <span className="ml-1.5 font-normal text-ink-muted/80">{count}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
