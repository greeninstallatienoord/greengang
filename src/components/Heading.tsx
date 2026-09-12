import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import type { HeadingLevel } from '../types'

const sizeClass: Record<HeadingLevel, string> = {
  h1: 'display text-[1.75rem] font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight',
  h2: 'display text-2xl font-semibold tracking-tight sm:text-3xl',
  h3: 'text-xl font-semibold tracking-tight sm:text-2xl',
  h4: 'text-lg font-semibold',
  h5: 'text-base font-semibold',
  h6: 'text-sm font-semibold uppercase tracking-wide',
}

type HeadingProps = {
  as?: HeadingLevel
  className?: string
  children: ReactNode
}

export function Heading({ as = 'h2', className, children }: HeadingProps) {
  const Tag = as
  const hasTextColor = Boolean(className?.split(/\s+/).some((item) => /^text-(?!xs|sm|base|lg|xl|\[)/.test(item)))
  return (
    <Tag className={cn(!hasTextColor && 'text-ink', sizeClass[as], className)}>
      {children}
    </Tag>
  )
}
