import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { business } from '../../data/business'
import { serviceIcons } from '../../data/serviceIcons'
import { services } from '../../data/services'
import type { ServiceSlug } from '../../types'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

const listTitles: Record<ServiceSlug, string> = {
  'cv-ketel': 'CV-ketels',
  airco: 'Airconditioning',
  warmtepomp: 'Warmtepompen',
  'service-onderhoud': 'Service & onderhoud',
}

const listSummaries: Record<ServiceSlug, string> = {
  'cv-ketel':
    'Plaatsen of vervangen van een cv-ketel, inclusief aansluiting en uitleg.',
  airco:
    'Koelen én verwarmen in huis, met een voorstel dat past bij de ruimte en het gebruik.',
  warmtepomp:
    'Hybride of all-electric: eerst beoordelen, daarna adviseren en installeren.',
  'service-onderhoud': business.emergencyService.available
    ? 'Onderhoud, service en 24/7 storingsdienst.'
    : 'Onderhoud en service van cv-ketels en klimaatinstallaties.',
}

export function ServiceList() {
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Diensten</p>
            <Heading as="h2" className="mt-2.5 sm:mt-3">
              Wat we installeren
            </Heading>
            <p className="lead mt-3 sm:mt-4">
              Welke installatie past, hangt af van uw woning, gebruik en wensen.
              Kies hieronder de dienst die u zoekt.
            </p>
          </div>
        </Reveal>
        <Reveal className="mt-5 sm:mt-8">
          <ul className="grid gap-2.5 sm:gap-0 sm:divide-y sm:divide-line sm:border-y sm:border-line">
            {services.map((service) => {
              const Icon = serviceIcons[service.slug]
              return (
                <li key={service.slug}>
                  <Link
                    to={service.href}
                    className="group flex min-h-14 items-start gap-3 border border-line bg-paper px-3.5 py-3.5 transition-[border-color,background-color] duration-[var(--duration-fast)] hover:border-ink/25 hover:bg-stone/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand min-[390px]:gap-3.5 min-[390px]:px-4 min-[390px]:py-4 sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8 sm:border-0 sm:bg-transparent sm:px-0 sm:py-5 sm:hover:bg-transparent"
                  >
                    <span className="mt-0.5 inline-flex text-brand-dark sm:mt-0">
                      <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[1.05rem] font-semibold tracking-[-0.02em] min-[390px]:text-lg sm:text-[1.3rem]">
                        {listTitles[service.slug]}
                      </span>
                      <span className="mt-1 block max-w-xl text-[0.8125rem] leading-relaxed text-ink-muted min-[390px]:text-sm">
                        {listSummaries[service.slug]}
                      </span>
                    </span>
                    <ArrowRight
                      size={18}
                      strokeWidth={1.6}
                      className="mt-1 shrink-0 text-ink-muted transition-transform motion-safe:group-hover:translate-x-1 sm:mt-0 sm:justify-self-end"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </Container>
    </Section>
  )
}
