import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { serviceIcons } from '../../data/serviceIcons'
import { services } from '../../data/services'
import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

export function CapabilityIntro() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">Aanbod</p>
          <Heading as="h2" className="mt-3">
            {site.copy.introTitle}
          </Heading>
          <p className="lead mt-4">{site.copy.introText}</p>
        </div>

        <ul className="mt-12 grid gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {services.map((service) => {
            const Icon = serviceIcons[service.slug]
            return (
              <li key={service.slug} className="group">
                <Icon size={22} strokeWidth={1.5} className="text-brand-dark" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold tracking-[-0.015em]">
                  <Link to={service.href} className="hover:text-brand-dark">
                    {service.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{service.summary}</p>
                <Link to={service.href} className="text-link mt-4">
                  {site.copy.ctaMore}
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
