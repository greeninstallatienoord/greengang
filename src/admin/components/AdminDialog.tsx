import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

type AdminDialogProps = {
  title: string
  description?: string
  wide?: boolean
  busy?: boolean
  onClose: () => void
  children?: ReactNode
  footer?: ReactNode
}

export function AdminDialog({
  title,
  description,
  wide = false,
  busy = false,
  onClose,
  children,
  footer,
}: AdminDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const panel = panelRef.current
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusable = () =>
      [
        ...(panel?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
        ) ?? []),
      ]

    const nodes = focusable()
    nodes[0]?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) onClose()
      if (event.key !== 'Tab' || !panel) return
      const list = focusable()
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [busy, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        className="admin-dialog-backdrop absolute inset-0 cursor-default bg-[#102418]/50"
        aria-label="Sluiten"
        disabled={busy}
        onClick={() => {
          if (!busy) onClose()
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        ref={panelRef}
        className={cn(
          'admin-dialog-panel relative max-h-[92dvh] w-full overflow-y-auto border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5 shadow-[0_16px_48px_rgb(16_36_24_/_0.18)]',
          wide ? 'max-w-3xl' : 'max-w-lg',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold tracking-[-0.02em]">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm leading-relaxed text-[var(--admin-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center border border-[var(--admin-line)] text-[var(--admin-ink)] transition-colors hover:bg-[#f7f8f5]"
            disabled={busy}
            onClick={onClose}
          >
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">Sluiten</span>
          </button>
        </div>
        {children ? <div className="mt-4">{children}</div> : null}
        {footer ? <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div> : null}
      </div>
    </div>
  )
}
