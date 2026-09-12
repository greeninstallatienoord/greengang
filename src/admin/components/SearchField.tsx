import { Search } from 'lucide-react'

type SearchFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function SearchField({
  id,
  value,
  onChange,
  placeholder = 'Zoeken',
  label = 'Zoeken',
}: SearchFieldProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        size={16}
        strokeWidth={1.75}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--admin-muted)]"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full border border-[var(--admin-line)] bg-[var(--admin-panel)] py-2 pr-3 pl-10 text-sm text-[var(--admin-ink)] placeholder:text-[var(--admin-muted)]"
      />
    </div>
  )
}
