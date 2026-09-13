import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { services } from '../data/services'
import type { FaqItem as FaqRecord } from '../types'
import { cn } from '../lib/cn'

type FAQItemProps = {
  item: FaqRecord
  /** Controlled open state. Omit for uncontrolled behaviour. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: 'plain' | 'panel'
  className?: string
}

export function FAQItem({
  item,
  open: openProp,
  onOpenChange,
  variant = 'plain',
  className,
}: FAQItemProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const controlled = openProp !== undefined
  const open = controlled ? Boolean(openProp) : uncontrolledOpen
  const panelId = useId()
  const buttonId = useId()
  const related = services.find((service) => service.slug === item.relatedServiceSlug)

  const setOpen = (next: boolean) => {
    if (!controlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  return (
    <div
      id={item.id}
      className={cn(
        'scroll-mt-[calc(var(--header-offset)+0.75rem)]',
        variant === 'panel'
          ? cn(
              'border border-line bg-paper transition-[border-color,background-color] duration-[var(--duration-fast)]',
              open && 'border-ink/20 bg-surface',
            )
          : 'border-b border-line',
        className,
      )}
    >
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(
            'flex w-full items-start justify-between gap-3 text-left font-semibold tracking-[-0.015em] transition-colors duration-[var(--duration-fast)]',
            variant === 'panel'
              ? 'min-h-12 px-3.5 py-3.5 text-[0.95rem] min-[390px]:px-4 min-[390px]:py-3.5 sm:text-[0.98rem]'
              : 'min-h-12 py-3.5 text-[0.98rem] sm:py-4',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          )}
          onClick={() => setOpen(!open)}
        >
          <span className="pt-0.5 text-pretty">{item.question}</span>
          <ChevronDown
            className={cn(
              'mt-0.5 size-5 shrink-0 text-brand-dark transition-transform duration-[var(--duration-base)] motion-reduce:transition-none',
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
        className={cn(
          'text-[0.95rem] leading-relaxed text-ink-muted',
          variant === 'panel'
            ? 'border-t border-line/80 px-3.5 pb-4 pt-3 min-[390px]:px-4'
            : 'pb-4',
        )}
      >
        <p>{item.answer}</p>
        {related || item.sources?.length ? (
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-ink">
            {related ? (
              <Link to={related.href} className="underline underline-offset-2">
                Meer over {related.name.toLowerCase()}
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
