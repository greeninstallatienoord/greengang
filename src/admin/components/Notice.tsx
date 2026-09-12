import { CircleAlert, CircleCheck, Info } from 'lucide-react'

type NoticeProps = {
  tone?: 'error' | 'success' | 'info'
  children: string
}

export function Notice({ tone = 'info', children }: NoticeProps) {
  const Icon = tone === 'error' ? CircleAlert : tone === 'success' ? CircleCheck : Info
  const classes =
    tone === 'error'
      ? 'border-[#e8c4c4] bg-[#fbf4f4] text-[#9b2c2c]'
      : tone === 'success'
        ? 'border-[#c9ddc9] bg-[#f3f8f3] text-[#14692a]'
        : 'border-[var(--admin-line)] bg-[var(--admin-panel)] text-[var(--admin-ink)]'

  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2 border px-3 py-2.5 text-sm ${classes}`}
    >
      <Icon size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}
