import { cn } from '../../lib/cn'

const tone: Record<string, string> = {
  pending: 'bg-brand-soft text-brand-dark',
  requested: 'bg-brand-soft text-brand-dark',
  new: 'bg-brand-soft text-brand-dark',
  confirmed: 'bg-brand-soft text-brand-deep',
  contacted: 'bg-surface text-ink',
  read: 'bg-surface text-ink',
  in_progress: 'bg-surface text-ink',
  completed: 'bg-surface text-ink-muted',
  archived: 'bg-surface text-ink-muted',
  cancelled: 'bg-paper text-danger border-danger/30',
  declined: 'bg-paper text-danger border-danger/30',
  sent: 'bg-brand-soft text-brand-dark',
  failed: 'bg-paper text-danger border-danger/30',
  skipped: 'bg-surface text-ink-muted',
}

type StatusBadgeProps = {
  value: string
  label?: string
}

export function StatusBadge({ value, label }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-sm border border-transparent px-2 py-0.5 text-xs font-semibold',
        tone[value] ?? 'bg-surface text-ink-muted',
      )}
    >
      {label ?? value}
    </span>
  )
}
