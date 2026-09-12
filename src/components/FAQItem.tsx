import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { services } from '../data/services'
import type { FaqItem as FaqRecord } from '../types'
import { cn } from '../lib/cn'

type FAQItemProps = {
  item: FaqRecord
}

export function FAQItem({ item }: FAQItemProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonId = useId()
  const related = services.find((service) => service.slug === item.relatedServiceSlug)

  return (
    <div className="border-b border-line">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-12 w-full items-center justify-between gap-4 py-3.5 text-left text-[0.98rem] font-semibold tracking-[-0.015em] sm:py-4"
          onClick={() => setOpen((value) => !value)}
        >
          {item.question}
          <ChevronDown
            className={cn(
              'size-5 shrink-0 text-brand transition-transform duration-[var(--duration-base)]',
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
        className="pb-4 text-[0.95rem] leading-relaxed text-ink-muted"
      >
        <p>{item.answer}</p>
        {related || item.sources?.length ? (
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-ink">
            {related ? (
              <Link to={related.href} className="underline underline-offset-2">
                {related.name}
              </Link>
            ) : null}
            {item.sources?.map((source) =>
              source.external ? (
                <a
                  key={source.href}
                  href={source.href}
                  className="underline underline-offset-2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {source.label}
                </a>
              ) : (
                <Link key={source.href} to={source.href} className="underline underline-offset-2">
                  {source.label}
                </Link>
              ),
            )}
          </p>
        ) : null}
      </div>
    </div>
  )
}
