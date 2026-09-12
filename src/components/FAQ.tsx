import type { FaqItem } from '../types'
import { FAQItem } from './FAQItem'

type FAQProps = {
  items: FaqItem[]
}

export function FAQ({ items }: FAQProps) {
  if (items.length === 0) {
    return <p className="text-ink-muted">Er staan hier nog geen vragen.</p>
  }

  return (
    <div>
      {items.map((item) => (
        <FAQItem key={item.id} item={item} />
      ))}
    </div>
  )
}
