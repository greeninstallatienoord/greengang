import { cn } from '../../lib/cn'

type Tone = 'new' | 'progress' | 'success' | 'neutral' | 'danger' | 'warn'

const toneByStatus: Record<string, Tone> = {
  pending: 'warn',
  requested: 'warn',
  new: 'new',
  confirmed: 'success',
  contacted: 'progress',
  read: 'progress',
  in_progress: 'progress',
  answered: 'progress',
  completed: 'neutral',
  archived: 'neutral',
  cancelled: 'danger',
  declined: 'danger',
  quoted: 'success',
  sent: 'success',
  failed: 'danger',
  skipped: 'neutral',
}

const toneClass: Record<Tone, string> = {
  new: 'bg-[var(--admin-accent-soft)] text-[#14692a] ring-[#1a8a34]/25',
  progress: 'bg-[#eef1ed] text-[#3d4540] ring-[#9aaea0]/40',
  success: 'bg-[#e8f0ea] text-[#102418] ring-[#1a8a34]/20',
  neutral: 'bg-[#f3f4f1] text-[#6a716c] ring-[#c5cac1]',
  danger: 'bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] ring-[#9b2c2c]/25',
  warn: 'bg-[var(--admin-warn-soft)] text-[var(--admin-warn)] ring-[#8a6a1f]/25',
}

const toneMark: Record<Tone, string> = {
  new: '●',
  progress: '◐',
  success: '✓',
  neutral: '○',
  danger: '×',
  warn: '!',
}

type StatusBadgeProps = {
  value: string
  label?: string
  className?: string
}

export function StatusBadge({ value, label, className }: StatusBadgeProps) {
  const tone = toneByStatus[value] ?? 'neutral'
  const text = label ?? value

  return (
    <span
      className={cn(
        'inline-flex max-w-full shrink-0 items-center gap-1 rounded-[3px] px-1.5 py-0.5 text-[11px] font-semibold tracking-[0.01em] ring-1 ring-inset',
        toneClass[tone],
        className,
      )}
      title={text}
    >
      <span aria-hidden="true" className="text-[10px] leading-none opacity-80">
        {toneMark[tone]}
      </span>
      <span className="truncate">{text}</span>
    </span>
  )
}
