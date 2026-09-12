import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import type { HeadingLevel } from '../types'

const sizeClass: Record<HeadingLevel, string> = {
  h1: 'font-display text-[clamp(1.85rem,4.4vw,3.05rem)] font-medium leading-[1.14] tracking-[-0.02em]',
  h2: 'font-display text-[clamp(1.5rem,2.6vw,2.15rem)] font-medium leading-[1.2] tracking-[-0.018em]',
  h3: 'text-[1.15rem] font-semibold leading-[1.3] tracking-[-0.015em] sm:text-[1.3rem]',
  h4: 'text-lg font-semibold tracking-[-0.012em]',
  h5: 'text-base font-semibold',
  h6: 'text-xs font-semibold uppercase tracking-[0.14em]',
}

type HeadingProps = {
  as?: HeadingLevel
  className?: string
  children: ReactNode
}

export function Heading({ as = 'h2', className, children }: HeadingProps) {
  const Tag = as
  const hasTextColor = Boolean(
    className?.split(/\s+/).some((item) => /^text-(?!xs|sm|base|lg|xl|\[)/.test(item)),
  )
  return (
    <Tag className={cn(!hasTextColor && 'text-ink', 'text-pretty', sizeClass[as], className)}>
      {children}
    </Tag>
  )
}
