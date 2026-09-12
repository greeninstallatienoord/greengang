import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { serviceIcons } from '../../data/serviceIcons'
import { services } from '../../data/services'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function ServiceList() {
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Diensten</p>
            <Heading as="h2" className="mt-3">
              Wat we installeren
            </Heading>
            <p className="lead mt-4">
              CV-ketel, airco, warmtepomp en onderhoud. Elke vraag begint bij de
              woning.
            </p>
          </div>
        </Reveal>
        <Reveal className="mt-7 sm:mt-10">
          <ul className="divide-y divide-line border-y border-line">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.slug]
              return (
                <li key={service.slug}>
                  <Link
                    to={service.href}
                    className="group grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-4.5 sm:grid-cols-[3.5rem_auto_1fr_auto] sm:gap-8 sm:py-6"
                  >
                    <span className="hidden font-display text-2xl text-brand-dark/70 sm:block">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="inline-flex text-brand-dark">
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </span>
                    <span>
                      <span className="block text-xl font-semibold tracking-[-0.02em] sm:text-[1.35rem]">
                        {service.heroTitle}
                      </span>
                      <span className="mt-1.5 block max-w-xl text-sm leading-relaxed text-ink-muted">
                        {service.summary}
                      </span>
                    </span>
                    <ArrowRight
                      size={18}
                      strokeWidth={1.6}
                      className="justify-self-end text-ink-muted transition-transform motion-safe:group-hover:translate-x-1"
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
