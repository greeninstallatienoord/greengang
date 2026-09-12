import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type CardProps = {
  className?: string
  children: ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <article
      className={cn(
        'rounded-lg border border-line bg-paper p-6 shadow-card',
        className,
      )}
    >
      {children}
    </article>
  )
}
