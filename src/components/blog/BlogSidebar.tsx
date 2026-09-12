import { Link } from 'react-router-dom'
import {
  blogCategoryLabels,
  blogCategoryOrder,
  blogCategoryServiceHref,
  blogPosts,
} from '../../data/blog'
import type { BlogCategorySlug } from '../../types'
import { cn } from '../../lib/cn'

type BlogSidebarProps = {
  query: string
  onQueryChange: (value: string) => void
  activeCategory?: BlogCategorySlug
}

function categoryCount(slug: BlogCategorySlug) {
  return blogPosts.filter((post) => post.category === slug).length
}

export function BlogSidebar({
  query,
  onQueryChange,
  activeCategory,
}: BlogSidebarProps) {
  const serviceHref = activeCategory
    ? blogCategoryServiceHref[activeCategory]
    : undefined

  return (
    <aside className="grid gap-4">
      <div>
        <label htmlFor="blog-search" className="mb-2 block text-sm font-semibold">
          Zoeken
        </label>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Trefwoord, bijvoorbeeld warmtepomp"
          className="min-h-12 w-full rounded-sm border border-line bg-surface px-3.5 text-base outline-none focus:border-brand"
        />
      </div>

      <nav aria-label="Categorieën">
        <p className="text-sm font-semibold">Categorie</p>
        <div className="mt-2 flex flex-wrap gap-2 lg:flex-col lg:items-start">
          <Link
            to="/blog"
            className={cn(
              'min-h-11 px-1 text-sm font-semibold',
              !activeCategory
                ? 'text-ink underline decoration-brand decoration-2 underline-offset-8'
                : 'text-ink-muted hover:text-ink',
            )}
          >
            Alle ({blogPosts.length})
          </Link>
          {blogCategoryOrder.map((slug) => (
            <Link
              key={slug}
              to={`/blog/categorie/${slug}`}
              className={cn(
                'min-h-11 px-1 text-sm font-semibold',
                activeCategory === slug
                  ? 'text-ink underline decoration-brand decoration-2 underline-offset-8'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              {blogCategoryLabels[slug]} ({categoryCount(slug)})
            </Link>
          ))}
        </div>
      </nav>

      {serviceHref ? (
        <p className="text-sm">
          <Link to={serviceHref} className="font-semibold underline underline-offset-2">
            Naar de dienst {blogCategoryLabels[activeCategory!].toLowerCase()}
          </Link>
        </p>
      ) : null}

      <nav className="border border-line bg-paper p-5" aria-label="Gerelateerde pagina’s">
        <h2 className="font-semibold tracking-[-0.01em]">Vervolg</h2>
        <ul className="mt-3 grid gap-2 text-sm font-semibold">
          <li>
            <Link to="/veelgestelde-vragen" className="underline underline-offset-2">
              Veelgestelde vragen
            </Link>
          </li>
          <li>
            <Link to="/offerte-aanvragen" className="underline underline-offset-2">
              Offerte aanvragen
            </Link>
          </li>
          <li>
            <Link to="/afspraak-maken" className="underline underline-offset-2">
              Afspraak maken
            </Link>
          </li>
          <li>
            <Link to="/contact" className="underline underline-offset-2">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/werkgebied" className="underline underline-offset-2">
              Werkgebied
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border border-line bg-paper p-5">
        <h2 className="font-semibold tracking-[-0.01em]">Bronnen en links</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Artikelen linken intern naar diensten, FAQ en andere stukken. Officiële
          citaties gaan naar overheids- en vakbronnen. Dat zijn uitgaande
          verwijzingen, geen gekochte backlinks en geen bewijs dat die sites naar
          ons linken.
        </p>
      </div>
    </aside>
  )
}
