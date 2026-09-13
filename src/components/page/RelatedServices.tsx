import { ArrowRight, Flame, Snowflake, ThermometerSun, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import type { ServiceRecord, ServiceSlug } from '../../types'
import { cn } from '../../lib/cn'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

const serviceIcons: Record<ServiceSlug, LucideIcon> = {
  'cv-ketel': Flame,
  airco: Snowflake,
  warmtepomp: ThermometerSun,
  'service-onderhoud': Wrench,
}

type RelatedServicesProps = {
  services: ServiceRecord[]
  title?: string
  tone?: 'plain' | 'paper'
  /** Prefer 4 equal columns on wide screens when showing all services. */
  columns?: 3 | 4
}

export function RelatedServices({
  services,
  title = 'Gerelateerde diensten',
  tone = 'plain',
  columns = 3,
}: RelatedServicesProps) {
  if (services.length === 0) return null

  return (
    <Section className={tone === 'paper' ? 'bg-paper' : undefined}>
      <Container>
        <Heading as="h2">{title}</Heading>
        <div
          className={cn(
            'mt-7 grid gap-4 sm:gap-5',
            columns === 4
              ? 'sm:grid-cols-2 xl:grid-cols-4'
              : 'md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {services.map((item) => {
            const Icon = serviceIcons[item.slug] ?? Wrench
            return (
              <Link
                key={item.slug}
                to={item.href}
                className={cn(
                  'group flex h-full flex-col rounded-md border border-line bg-paper p-5 shadow-[0_1px_2px_rgba(20,40,28,0.05)] sm:p-6',
                  'transition-[transform,box-shadow,border-color,background-color] duration-200',
                  'hover:-translate-y-0.5 hover:border-brand/35 hover:bg-brand-soft/40 hover:shadow-[0_10px_28px_-14px_rgba(20,40,28,0.35)]',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                )}
              >
                <span className="inline-flex size-10 items-center justify-center rounded-md bg-brand-soft text-brand-dark transition-colors group-hover:bg-paper">
                  <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[1.05rem] font-semibold tracking-[-0.015em] text-ink sm:text-[1.125rem]">
                  {item.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {item.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark">
                  Lees meer
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
