import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { cn } from '../../lib/cn'

type RegionGlanceProps = {
  className?: string
  /** Show CTA to full werkgebied page. */
  showLink?: boolean
}

/**
 * Compact region panel — fills empty desktop space next to About copy
 * without loading the interactive map (consent + Leaflet stay on /werkgebied).
 */
export function RegionGlance({ className, showLink = true }: RegionGlanceProps) {
  const { street, postalCode, city } = site.contact

  return (
    <aside
      className={cn(
        'relative overflow-hidden border border-line bg-paper',
        className,
      )}
      aria-label="Werkgebied Noord-Nederland"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-brand-soft) 55%, transparent) 0%, transparent 52%), radial-gradient(ellipse 80% 70% at 100% 0%, color-mix(in srgb, var(--color-brand) 8%, transparent), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-6 -bottom-8 size-40 opacity-[0.07]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 120 140" className="size-full text-brand-deep" fill="currentColor">
          <path d="M72 8c18 4 34 18 38 38 3 16-2 30-12 42-8 10-14 18-14 28 0 8 4 14 4 14H48s4-8 4-16c0-12-8-22-16-32C24 66 18 52 22 36 28 16 48 4 72 8Z" />
          <path d="M48 78c12 8 22 20 24 34H28c2-12 8-24 20-34Z" opacity="0.55" />
          <path d="M28 52c-10 8-16 22-14 36 14-4 28-14 36-28-8-4-14-6-22-8Z" opacity="0.4" />
        </svg>
      </div>

      <div className="relative p-4 min-[390px]:p-5 sm:p-6">
        <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-brand-dark uppercase">
          {serviceArea.regionName}
        </p>
        <p className="mt-2 font-display text-[1.2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[1.3rem]">
          Groningen, Drenthe en Friesland
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Vestiging in {city}. Thuisprovincie Groningen, daarnaast Drenthe en Friesland.
        </p>

        <ul className="mt-4 divide-y divide-line border-y border-line">
          {serviceArea.provinces.map((province) => (
            <li key={province.name} className="flex items-start gap-2.5 py-2.5">
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center text-brand-dark">
                <Check size={14} strokeWidth={2.25} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-[-0.01em] text-ink">
                  {province.name}
                  {province.featured ? (
                    <span className="ml-2 align-middle text-[0.62rem] font-semibold tracking-[0.12em] text-brand-dark uppercase">
                      Thuis
                    </span>
                  ) : null}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-3.5 text-sm text-ink-muted">
          {street}, {postalCode} {city}
        </p>

        {showLink ? (
          <Link
            to="/werkgebied"
            className="group mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-dark"
          >
            Bekijk werkgebied
            <ArrowRight
              size={15}
              strokeWidth={2}
              className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </div>
    </aside>
  )
}
