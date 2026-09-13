import { useMemo, useState } from 'react'
import { business } from '../../data/business'
import {
  formatEuroFromCents,
  maintenanceCopy,
  maintenancePackages,
  monthlyPriceCents,
  type MaintenanceFrequency,
  type MaintenancePackageId,
} from '../../data/maintenance'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

export function MaintenancePlans() {
  const [frequency, setFrequency] = useState<MaintenanceFrequency>('biennial')

  const prices = useMemo(() => {
    return Object.fromEntries(
      maintenancePackages.map((pack) => [
        pack.id,
        monthlyPriceCents(pack.id, frequency),
      ]),
    ) as Record<MaintenancePackageId, number>
  }, [frequency])

  return (
    <Section id="pakketten" className="bg-paper">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">{maintenanceCopy.eyebrow}</p>
          <Heading as="h2" className="mt-3">
            {maintenanceCopy.title}
          </Heading>
          <p className="lead mt-4">{maintenanceCopy.intro}</p>
        </div>

        <div className="mt-8 max-w-xl">
          <p className="text-sm font-semibold tracking-[-0.01em]">
            {maintenanceCopy.frequencyLabel}
          </p>
          <div
            className="mt-3 grid grid-cols-2 gap-2 border border-line bg-surface p-1.5"
            role="group"
            aria-label={maintenanceCopy.frequencyLabel}
          >
            <button
              type="button"
              className={cn(
                'min-h-11 px-3 text-sm font-semibold transition-colors',
                frequency === 'biennial'
                  ? 'bg-brand text-white'
                  : 'bg-transparent text-ink hover:bg-stone/60',
              )}
              aria-pressed={frequency === 'biennial'}
              onClick={() => setFrequency('biennial')}
            >
              {maintenanceCopy.biennialLabel}
            </button>
            <button
              type="button"
              className={cn(
                'min-h-11 px-3 text-sm font-semibold transition-colors',
                frequency === 'annual'
                  ? 'bg-brand text-white'
                  : 'bg-transparent text-ink hover:bg-stone/60',
              )}
              aria-pressed={frequency === 'annual'}
              onClick={() => setFrequency('annual')}
            >
              {maintenanceCopy.annualLabel}
            </button>
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            {frequency === 'annual'
              ? maintenanceCopy.annualNote
              : maintenanceCopy.biennialHint}
          </p>
        </div>

        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {maintenancePackages.map((pack) => (
            <li
              key={pack.id}
              className="flex h-full flex-col border border-line bg-surface p-5"
            >
              <h3 className="text-lg font-semibold tracking-[-0.015em]">{pack.name}</h3>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-[1.85rem] leading-none tracking-[-0.02em] text-brand-dark">
                  {formatEuroFromCents(prices[pack.id])}
                </span>
                <span className="text-sm font-semibold text-ink-muted">/ maand</span>
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Onderhoud {frequency === 'annual' ? 'elk jaar' : 'eens per 2 jaar'}
              </p>
              {pack.features.length > 0 ? (
                <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-muted">
                  {pack.features.map((item) => (
                    <li key={item} className="border-t border-line pt-2">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                  Dekking en inhoud van dit pakket bespreken we bij de aanvraag.
                </p>
              )}
              <ButtonLink
                to={`/offerte-aanvragen?dienst=service-onderhoud&situatie=onderhoud&pakket=${pack.id}&frequentie=${frequency}`}
                className="mt-5 min-h-11 w-full sm:w-auto"
                size="sm"
              >
                {maintenanceCopy.ctaChoose} {pack.name}
              </ButtonLink>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-2xl text-sm text-ink-muted">
          {maintenanceCopy.coverageNote}
        </p>

        {business.emergencyService.available ? (
          <div className="mt-8 flex flex-col gap-4 border border-line bg-brand-deep p-4 text-white sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-white/65 uppercase">
                Storing melden
              </p>
              <p className="mt-1.5 text-lg font-semibold tracking-[-0.015em]">
                {business.emergencyService.label}
              </p>
              <p className="mt-1 text-sm text-white/75">
                {business.emergencyService.detail}
              </p>
            </div>
            <ButtonLink
              to={business.emergencyService.phoneHref}
              external
              className="min-h-11 shrink-0 self-start sm:self-center"
              aria-label={`${business.emergencyService.label}: bel ${business.emergencyService.phone}`}
            >
              Bel {business.emergencyService.phone}
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
