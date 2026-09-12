import { cn } from '../../lib/cn'

const tone: Record<string, string> = {
  pending: 'bg-[#eef5ea] text-[#14692a]',
  requested: 'bg-[#eef5ea] text-[#14692a]',
  new: 'bg-[#eef5ea] text-[#14692a]',
  confirmed: 'bg-[#e8f0ea] text-[#102418]',
  contacted: 'bg-[#f3f4f1] text-[#3d4540]',
  read: 'bg-[#f3f4f1] text-[#3d4540]',
  in_progress: 'bg-[#f3f4f1] text-[#3d4540]',
  completed: 'bg-[#f3f4f1] text-[#6a716c]',
  archived: 'bg-[#f3f4f1] text-[#6a716c]',
  cancelled: 'bg-[#f8eeee] text-[#9b2c2c]',
  declined: 'bg-[#f8eeee] text-[#9b2c2c]',
  quoted: 'bg-[#eef5ea] text-[#14692a]',
  sent: 'bg-[#eef5ea] text-[#14692a]',
  failed: 'bg-[#f8eeee] text-[#9b2c2c]',
  skipped: 'bg-[#f3f4f1] text-[#6a716c]',
}

type StatusBadgeProps = {
  value: string
  label?: string
}

export function StatusBadge({ value, label }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-[3px] px-1.5 py-0.5 text-[11px] font-semibold tracking-[0.01em]',
        tone[value] ?? 'bg-[#f3f4f1] text-[#6a716c]',
      )}
    >
      {label ?? value}
    </span>
  )
}
