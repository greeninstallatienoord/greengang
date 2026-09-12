import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type ImagePlaceholderProps = {
  label: string
  className?: string
  icon?: ReactNode
  pending?: boolean
}

export function ImagePlaceholder({
  label,
  className,
  icon,
  pending = true,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-48 overflow-hidden rounded-lg border border-line bg-brand-deep',
        className,
      )}
      role="img"
      aria-label={label}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(135deg, #14692a 0%, #0f4f20 48%, #1a8a34 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #ffffff 0 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="relative z-10 flex flex-1 flex-col items-start justify-end gap-2 p-5 text-white">
        {icon}
        <p className="max-w-sm text-sm font-medium leading-snug">{label}</p>
        {pending ? (
          <p className="text-xs text-white/70">Beeldbestand volgt</p>
        ) : null}
      </div>
    </div>
  )
}
