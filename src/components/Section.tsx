import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type SectionProps = {
  id?: string
  className?: string
  children: ReactNode
  'aria-labelledby'?: string
  'aria-label'?: string
}

export function Section({
  id,
  className,
  children,
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('section-y', className)}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  )
}
