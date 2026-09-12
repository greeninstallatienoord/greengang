import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type PlaceholderNoteProps = {
  children: ReactNode
  className?: string
}

export function PlaceholderNote({ children, className }: PlaceholderNoteProps) {
  return (
    <p
      className={cn(
        'rounded-md border border-dashed border-line bg-surface px-3 py-2 text-sm text-ink-muted',
        className,
      )}
    >
      {children}
    </p>
  )
}
