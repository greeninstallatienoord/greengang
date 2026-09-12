import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/cn'

type FAQItemProps = {
  question: string
  answer: string
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonId = useId()

  return (
    <div className="border-b border-line">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold"
          onClick={() => setOpen((value) => !value)}
        >
          {question}
          <ChevronDown
            className={cn(
              'size-5 shrink-0 text-brand transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="pb-4 text-ink-muted"
      >
        <p>{answer}</p>
      </div>
    </div>
  )
}
