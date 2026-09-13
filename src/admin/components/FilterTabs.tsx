import { useEffect, useId, useRef, useState } from 'react'
import { Filter, X } from 'lucide-react'

type FilterTabsProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string; count?: number }>
  label?: string
}

export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
  label = 'Filter',
}: FilterTabsProps<T>) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const active = options.find((option) => option.value === value)
  const isFiltered = value !== options[0]?.value

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      {/* Desktop / tablet: horizontal chips */}
      <div
        className="-mx-1 hidden gap-1 overflow-x-auto px-1 pb-1 md:flex"
        role="tablist"
        aria-label={label}
      >
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`min-h-10 shrink-0 px-3 text-sm font-medium transition-colors ${
                selected
                  ? 'bg-[var(--admin-sidebar)] text-white'
                  : 'border border-[var(--admin-line)] bg-[var(--admin-panel)] text-[var(--admin-ink)] hover:bg-[var(--admin-hover)]'
              }`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
              {typeof option.count === 'number' ? (
                <span
                  className={`ml-1.5 text-xs ${selected ? 'text-white/70' : 'text-[var(--admin-muted)]'}`}
                >
                  {option.count}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {/* Mobile: compact filter button + sheet */}
      <div className="md:hidden">
        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-between gap-2 border border-[var(--admin-line)] bg-[var(--admin-panel)] px-3 text-sm font-semibold"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className="inline-flex items-center gap-2">
            <Filter size={16} aria-hidden="true" />
            {label}
            {isFiltered ? (
              <span className="rounded-[3px] bg-[var(--admin-accent-soft)] px-1.5 py-0.5 text-[11px] text-[#14692a]">
                Actief
              </span>
            ) : null}
          </span>
          <span className="truncate text-[var(--admin-muted)]">{active?.label ?? 'Alles'}</span>
        </button>

        {open ? (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              className="admin-dialog-backdrop absolute inset-0 bg-[#102418]/45"
              aria-label="Filters sluiten"
              onClick={() => setOpen(false)}
            />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="admin-dialog-panel absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-[0.5rem] border border-[var(--admin-line)] bg-[var(--admin-panel)] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[var(--admin-shadow)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--admin-line)] px-4 py-3">
                <h2 id={titleId} className="text-base font-semibold">
                  {label}
                </h2>
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center border border-[var(--admin-line)]"
                  aria-label="Sluiten"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <ul className="grid p-2">
                {options.map((option) => {
                  const selected = option.value === value
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={`flex min-h-12 w-full items-center justify-between px-3 text-left text-sm font-medium ${
                          selected ? 'bg-[var(--admin-accent-soft)] text-[#14692a]' : ''
                        }`}
                        onClick={() => {
                          onChange(option.value)
                          setOpen(false)
                        }}
                      >
                        <span>{option.label}</span>
                        {typeof option.count === 'number' ? (
                          <span className="text-xs text-[var(--admin-muted)]">{option.count}</span>
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
              {isFiltered ? (
                <div className="border-t border-[var(--admin-line)] px-4 pt-3">
                  <button
                    type="button"
                    className="min-h-11 w-full text-sm font-semibold text-[var(--admin-muted)] underline-offset-2 hover:underline"
                    onClick={() => {
                      if (options[0]) onChange(options[0].value)
                      setOpen(false)
                    }}
                  >
                    Filters wissen
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
