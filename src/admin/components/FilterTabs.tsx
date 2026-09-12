type FilterTabsProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string; count?: number }>
}

export function FilterTabs<T extends string>({ value, onChange, options }: FilterTabsProps<T>) {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={`min-h-10 shrink-0 px-3 text-sm font-medium ${
              active
                ? 'bg-[#102418] text-white'
                : 'border border-[var(--admin-line)] bg-[var(--admin-panel)] text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-hover)]'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            {typeof option.count === 'number' ? (
              <span className={`ml-1.5 text-xs ${active ? 'text-white/70' : 'text-[var(--admin-muted)]'}`}>
                {option.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
