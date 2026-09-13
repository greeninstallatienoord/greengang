import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  text: string
  action?: ReactNode
  compact?: boolean
}

export function EmptyState({ title, text, action, compact = false }: EmptyStateProps) {
  return (
    <div
      className={`admin-panel text-center ${
        compact ? 'px-4 py-5' : 'px-5 py-7 sm:py-8'
      }`}
    >
      <p className="font-semibold text-[var(--admin-ink)]">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-[var(--admin-muted)]">
        {text}
      </p>
      {action ? <div className="mt-3 flex justify-center">{action}</div> : null}
    </div>
  )
}
