import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Check, X } from 'lucide-react'

type StatusOption = {
  value: string
  label: string
}

type StatusSheetProps = {
  title?: string
  value: string
  options: StatusOption[]
  busy?: boolean
  onChange: (value: string) => void
  triggerLabel?: string
}

export function StatusSheet({
  title = 'Status wijzigen',
  value,
  options,
  busy = false,
  onChange,
  triggerLabel,
}: StatusSheetProps) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const current = options.find((option) => option.value === value)

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
      <button
        type="button"
        disabled={busy}
        className="inline-flex min-h-11 items-center justify-center border border-[var(--admin-line)] bg-[var(--admin-panel)] px-4 text-sm font-semibold"
        onClick={() => setOpen(true)}
      >
        {triggerLabel ?? current?.label ?? title}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="admin-dialog-backdrop absolute inset-0 bg-[#102418]/45"
            aria-label="Sluiten"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="admin-dialog-panel absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-[0.5rem] border border-[var(--admin-line)] bg-[var(--admin-panel)] pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center justify-between border-b border-[var(--admin-line)] px-4 py-3">
              <h2 id={titleId} className="text-base font-semibold">
                {title}
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
                      disabled={busy || selected}
                      className={`flex min-h-12 w-full items-center justify-between px-3 text-left text-sm font-semibold ${
                        selected ? 'bg-[var(--admin-accent-soft)] text-[#14692a]' : ''
                      }`}
                      onClick={() => {
                        onChange(option.value)
                        setOpen(false)
                      }}
                    >
                      <span>{option.label}</span>
                      {selected ? <Check size={16} aria-hidden="true" /> : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  )
}

type StickyActionsProps = {
  children: ReactNode
}

export function StickyActions({ children }: StickyActionsProps) {
  return (
    <div className="sticky bottom-[calc(var(--admin-nav-h)+0.5rem)] z-20 -mx-3.5 mt-6 border-t border-[var(--admin-line)] bg-[var(--admin-panel)]/95 px-3.5 py-3 backdrop-blur-sm min-[360px]:-mx-4 min-[360px]:px-4 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
