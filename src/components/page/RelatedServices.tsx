import { Link } from 'react-router-dom'
import type { ServiceRecord } from '../../types'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

type RelatedServicesProps = {
  services: ServiceRecord[]
  title?: string
  tone?: 'plain' | 'paper'
}

export function RelatedServices({
  services,
  title = 'Gerelateerde diensten',
  tone = 'plain',
}: RelatedServicesProps) {
  if (services.length === 0) return null

  return (
    <Section className={tone === 'paper' ? 'bg-paper' : undefined}>
      <Container>
        <Heading as="h2">{title}</Heading>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {services.map((item) => (
            <article
              key={item.slug}
              className="border border-line bg-paper p-6"
            >
              <h3 className="font-semibold">
                <Link to={item.href} className="hover:text-brand-dark">
                  {item.name}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-ink-muted">{item.summary}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}
