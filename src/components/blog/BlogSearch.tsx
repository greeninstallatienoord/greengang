import { Search } from 'lucide-react'

type BlogSearchProps = {
  id?: string
  query: string
  onQueryChange: (value: string) => void
}

export function BlogSearch({
  id = 'blog-search',
  query,
  onQueryChange,
}: BlogSearchProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <label htmlFor={id} className="sr-only">
        Zoek in Advies &amp; kennis
      </label>
      <Search
        size={18}
        strokeWidth={1.75}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Zoek bijvoorbeeld op warmtepomp, onderhoud of airco"
        autoComplete="off"
        className="min-h-12 w-full rounded-sm border border-line bg-surface py-3 pl-11 pr-4 text-base text-ink outline-none placeholder:truncate placeholder:text-ink-muted/80 focus:border-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      />
    </div>
  )
}
