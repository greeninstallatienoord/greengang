import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { business } from '../../data/business'
import {
  maintenanceConfig,
  maintenanceCopy,
  maintenancePackages,
  maintenanceTeaserCopy,
  monthlyPriceCents,
  type MaintenanceFrequency,
  type MaintenancePackageId,
} from '../../data/maintenance'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'
import { MaintenanceFrequencyToggle } from './MaintenanceFrequencyToggle'
import { MaintenancePackageCard } from './MaintenancePackageCard'

export type MaintenancePackagesVariant = 'full' | 'compact'

type MaintenancePackagesProps = {
  variant?: MaintenancePackagesVariant
  className?: string
}

export function MaintenancePackages({
  variant = 'full',
  className,
}: MaintenancePackagesProps) {
  const [frequency, setFrequency] = useState<MaintenanceFrequency>('biennial')

  const prices = useMemo(() => {
    const activeFrequency = variant === 'compact' ? 'biennial' : frequency
    return Object.fromEntries(
      maintenancePackages.map((pack) => [
        pack.id,
        monthlyPriceCents(pack.id, activeFrequency),
      ]),
    ) as Record<MaintenancePackageId, number>
  }, [frequency, variant])

  if (variant === 'compact') {
    return (
      <Section className={cn('bg-brand-deep text-white', className)}>
        <Container>
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-white/70 uppercase">
              {maintenanceTeaserCopy.eyebrow}
            </p>
            <Heading as="h2" className="mt-2.5 text-white sm:mt-3">
              {maintenanceTeaserCopy.title}
            </Heading>
            <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-white/82 sm:mt-4">
              {maintenanceTeaserCopy.text}
            </p>
          </div>

          <div
            className="-mx-4 mt-7 flex gap-3 overflow-x-auto px-4 pb-3 snap-x snap-mandatory [scrollbar-width:thin] md:mx-0 md:mt-8 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0"
            role="list"
            aria-label="Onderhoudspakketten"
          >
            {maintenancePackages.map((pack) => (
              <div key={pack.id} role="listitem" className="md:min-w-0">
                <MaintenancePackageCard
                  pack={pack}
                  frequency="biennial"
                  priceCents={prices[pack.id]}
                  variant="compact"
                  emphasized={pack.id === 'comfort'}
                />
              </div>
            ))}
          </div>

          <ul className="mt-6 grid gap-2 text-sm text-white/78 sm:mt-7 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {maintenanceTeaserCopy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <div className="mt-6 sm:mt-8">
            <ButtonLink
              to={maintenanceConfig.packagesHashHref}
              className="group min-h-11 w-full max-w-[22rem] sm:w-auto"
            >
              {maintenanceTeaserCopy.cta}
              <ArrowRight
                size={16}
                strokeWidth={1.75}
                className="transition-transform duration-[var(--duration-fast)] motion-safe:group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section id="pakketten" className={cn('bg-paper', className)}>
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">{maintenanceCopy.eyebrow}</p>
          <Heading as="h2" className="mt-3">
            {maintenanceCopy.title}
          </Heading>
          <p className="lead mt-4">{maintenanceCopy.intro}</p>
        </div>

        <MaintenanceFrequencyToggle
          value={frequency}
          onChange={setFrequency}
          className="mt-8"
        />

        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {maintenancePackages.map((pack) => (
            <li
              key={pack.id}
              className="h-full md:max-lg:last:col-span-2"
            >
              <MaintenancePackageCard
                pack={pack}
                frequency={frequency}
                priceCents={prices[pack.id]}
                variant="full"
                emphasized={pack.id === 'comfort'}
              />
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-2xl text-sm text-ink-muted">
          {maintenanceCopy.coverageNote}
        </p>

        {business.emergencyService.available ? (
          <div className="mt-8 flex flex-col gap-4 border border-brand-dark/20 bg-brand-deep p-5 text-white sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="max-w-xl">
              <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-white/65 uppercase">
                Storing?
              </p>
              <p className="mt-1.5 text-lg font-semibold tracking-[-0.015em]">
                {business.emergencyService.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                Heeft u een storing? Onze storingsdienst is dag en nacht bereikbaar.
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
