import { serviceArea } from '../../data/region'
import { cn } from '../../lib/cn'

export function ProvinceHighlights() {
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {serviceArea.provinces.map((province) => (
        <li
          key={province.name}
          className={cn(
            'border border-line px-5 py-5',
            province.featured ? 'bg-brand-soft/70 sm:py-6' : 'bg-paper',
          )}
        >
          {province.featured ? (
            <p className="eyebrow">Thuisprovincie</p>
          ) : (
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Werkgebied
            </p>
          )}
          <p className="mt-2 font-display text-[1.65rem] leading-none tracking-[-0.02em]">
            {province.name}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{province.text}</p>
        </li>
      ))}
    </ul>
  )
}
