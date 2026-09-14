import type { LucideIcon } from 'lucide-react'
import { ArrowRight, BadgeCheck, Shield, ShieldCheck } from 'lucide-react'
import {
  formatEuroFromCents,
  maintenanceConfig,
  maintenanceCopy,
  maintenanceTeaserCopy,
  quoteHref,
  type MaintenanceFrequency,
  type MaintenancePackage,
  type MaintenancePackageId,
} from '../../data/maintenance'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ButtonLink'

const packageIcons: Record<MaintenancePackageId, LucideIcon> = {
  basis: Shield,
  comfort: ShieldCheck,
  'all-in': BadgeCheck,
}

export type MaintenancePackageCardVariant = 'full' | 'compact'

type MaintenancePackageCardProps = {
  pack: MaintenancePackage
  frequency: MaintenanceFrequency
  priceCents: number
  variant?: MaintenancePackageCardVariant
  /** Soft emphasis for Comfort — visual only, no “popular” claim. */
  emphasized?: boolean
  className?: string
}

export function MaintenancePackageCard({
  pack,
  frequency,
  priceCents,
  variant = 'full',
  emphasized = false,
  className,
}: MaintenancePackageCardProps) {
  const Icon = packageIcons[pack.id]
  const price = formatEuroFromCents(priceCents)

  if (variant === 'compact') {
    return (
      <article
        className={cn(
          'flex h-full min-w-[15.25rem] snap-start flex-col border bg-paper p-4 text-ink transition-[border-color,box-shadow,transform] duration-[var(--duration-fast)] motion-reduce:transition-none sm:min-w-0',
          emphasized ? 'border-brand/35 shadow-[var(--shadow-card)]' : 'border-line',
          'hover:border-brand/45 hover:shadow-[var(--shadow-card)] motion-safe:hover:-translate-y-0.5',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className="inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-brand-soft text-brand-dark"
            aria-hidden="true"
          >
            <Icon size={18} strokeWidth={1.75} />
          </span>
          <div className="text-right">
            <p className="font-display text-[1.45rem] leading-none tracking-[-0.02em] text-brand-dark tabular-nums">
              {price}
            </p>
            <p className="mt-1 text-[0.72rem] font-semibold text-ink-muted">
              {maintenanceCopy.perMonthShort}
            </p>
          </div>
        </div>

        <h3 className="mt-4 text-lg font-semibold tracking-[-0.015em]">{pack.name}</h3>
        <p className="mt-1 text-sm text-ink-muted">{maintenanceTeaserCopy.cardLabel}</p>

        <ButtonLink
          to={maintenanceConfig.packagesHashHref}
          size="sm"
          className="group mt-5 min-h-11 w-full"
        >
          {maintenanceTeaserCopy.cardCta}
          <ArrowRight
            size={16}
            strokeWidth={1.75}
            className="transition-transform duration-[var(--duration-fast)] motion-safe:group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </ButtonLink>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'flex h-full flex-col border bg-paper p-5 transition-[border-color,box-shadow,transform] duration-[var(--duration-fast)] motion-reduce:transition-none sm:p-6',
        emphasized
          ? 'border-brand/40 bg-brand-soft/45 shadow-[var(--shadow-card)]'
          : 'border-line',
        'hover:border-brand/50 hover:shadow-[var(--shadow-card)] motion-safe:hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-brand-soft text-brand-dark"
          aria-hidden="true"
        >
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 text-right">
          <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
            {maintenanceCopy.vanafLabel}
          </p>
          <p
            key={`${pack.id}-${priceCents}`}
            className="mt-1 font-display text-[1.85rem] leading-none tracking-[-0.02em] text-brand-dark tabular-nums transition-opacity duration-[var(--duration-fast)]"
          >
            {price}
          </p>
          <p className="mt-1.5 text-sm font-semibold text-ink-muted">
            {maintenanceCopy.perMonthShort}
          </p>
        </div>
      </div>

      <h3 className="mt-6 text-xl font-semibold tracking-[-0.015em]">{pack.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
        {maintenanceCopy.cardBlurb}
      </p>

      <ButtonLink
        to={quoteHref(pack.id, frequency)}
        size="sm"
        className="group mt-6 min-h-11 w-full"
      >
        {maintenanceCopy.ctaChoose} {pack.name}
        <ArrowRight
          size={16}
          strokeWidth={1.75}
          className="transition-transform duration-[var(--duration-fast)] motion-safe:group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </ButtonLink>
    </article>
  )
}
