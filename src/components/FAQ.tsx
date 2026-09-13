import { useState } from 'react'
import type { FaqItem } from '../types'
import { FAQItem } from './FAQItem'
import { cn } from '../lib/cn'

type FAQProps = {
  items: FaqItem[]
  /** Only one item open at a time (controlled accordion). */
  exclusive?: boolean
  variant?: 'plain' | 'panel'
  /** Prefer opening this item when present in `items`. */
  preferredOpenId?: string | null
  className?: string
}

export function FAQ({
  items,
  exclusive = false,
  variant = 'plain',
  preferredOpenId = null,
  className,
}: FAQProps) {
  const initial =
    preferredOpenId && items.some((item) => item.id === preferredOpenId)
      ? preferredOpenId
      : null
  const [openId, setOpenId] = useState<string | null>(initial)

  if (items.length === 0) {
    return <p className="text-ink-muted">Er staan hier nog geen vragen.</p>
  }

  return (
    <div className={cn(variant === 'panel' ? 'grid gap-2' : undefined, className)}>
      {items.map((item) => (
        <FAQItem
          key={item.id}
          item={item}
          variant={variant}
          open={exclusive ? openId === item.id : undefined}
          onOpenChange={
            exclusive
              ? (next) => setOpenId(next ? item.id : null)
              : undefined
          }
        />
      ))}
    </div>
  )
}
