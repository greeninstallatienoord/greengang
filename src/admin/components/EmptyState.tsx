import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  text: string
  action?: ReactNode
}

export function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="border border-[var(--admin-line)] bg-[var(--admin-panel)] px-5 py-9 text-center">
      <p className="font-semibold text-[var(--admin-ink)]">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-[var(--admin-muted)]">{text}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  )
}
