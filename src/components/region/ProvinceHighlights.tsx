import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { serviceArea } from '../../data/region'
import { cn } from '../../lib/cn'

type ProvinceHighlightsProps = {
  className?: string
}

export function ProvinceHighlights({ className }: ProvinceHighlightsProps) {
  return (
    <ul
      aria-label="Provincies in het werkgebied"
      className={cn(
        '-mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-1 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {serviceArea.provinces.map((province) => (
        <li
          key={province.name}
          className={cn(
            'w-[min(78vw,18.5rem)] shrink-0 snap-start border border-line bg-paper p-4 transition-[border-color,transform,box-shadow] duration-[var(--duration-fast)] min-[390px]:px-[1.125rem] min-[390px]:py-4 sm:w-auto sm:shrink sm:p-5',
            'motion-safe:lg:hover:-translate-y-0.5 motion-safe:lg:hover:border-ink/20 motion-safe:lg:hover:shadow-[var(--shadow-card)]',
            province.featured && 'border-brand/25 bg-brand-soft/50',
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'icon-mark size-9 shrink-0',
                  province.featured ? 'border-brand/20 bg-paper' : 'bg-surface',
                )}
              >
                <MapPin size={16} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                {province.featured ? (
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-dark">
                    Thuisprovincie
                  </p>
                ) : (
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                    Werkgebied
                  </p>
                )}
                <p className="mt-1 font-display text-[1.45rem] leading-none tracking-[-0.02em] sm:text-[1.55rem]">
                  {province.name}
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                  {province.text}
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="mt-4 inline-flex min-h-10 items-center gap-1.5 self-start text-sm font-semibold tracking-[-0.01em] text-ink underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {province.featured ? 'Neem contact op' : 'Vraag het ons'}
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
