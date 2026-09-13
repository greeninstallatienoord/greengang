import { MapPin, PhoneCall, Route } from 'lucide-react'
import { business } from '../../data/business'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { Reveal } from '../Reveal'
import { cn } from '../../lib/cn'

const facts = [
  {
    icon: MapPin,
    label: 'Vestiging',
    value: business.address.city,
    detail: `${business.address.street}`,
  },
  {
    icon: Route,
    label: 'Werkgebied',
    value: serviceArea.regionName,
    detail: serviceArea.provinces.map((item) => item.name).join(' · '),
  },
  ...(business.emergencyService.available
    ? [
        {
          icon: PhoneCall,
          label: 'Storingsdienst',
          value: '24/7 bereikbaar',
          detail: site.contact.phone,
        },
      ]
    : []),
] as const

/**
 * Compact verified trust composition — no invented certifications.
 * Designed as elegant rows with a connecting GreenFlow line.
 */
export function TrustFacts({ className }: { className?: string }) {
  return (
    <Reveal>
      <ul
        className={cn('trust-facts relative', className)}
        aria-label="Kerngegevens Green Installatie Noord"
      >
        <span className="trust-facts__rail" aria-hidden="true" />
        {facts.map((fact, index) => {
          const Icon = fact.icon
          return (
            <li
              key={fact.label}
              className="trust-facts__item relative grid grid-cols-[auto_1fr] gap-3 py-3.5 first:pt-0 last:pb-0 sm:gap-3.5"
              style={{ ['--fact-delay' as string]: `${index * 90}ms` }}
            >
              <span className="trust-facts__node mt-0.5 inline-flex size-9 items-center justify-center border border-brand/25 bg-brand-soft text-brand-dark">
                <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-brand-dark uppercase">
                  {fact.label}
                </p>
                <p className="mt-1 font-semibold tracking-[-0.015em] text-ink">{fact.value}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{fact.detail}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </Reveal>
  )
}
