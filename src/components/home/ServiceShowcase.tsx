import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { serviceImage } from '../../data/media'
import { serviceIcons } from '../../data/serviceIcons'
import { services } from '../../data/services'
import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { MediaImage } from '../media/MediaImage'
import { Section } from '../Section'

export function ServiceShowcase() {
  const featured = services[0]
  const rest = services.slice(1)
  if (!featured) return null
  const FeaturedIcon = serviceIcons[featured.slug]

  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="eyebrow">Diensten</p>
            <Heading as="h2" className="mt-3">
              Wat we installeren
            </Heading>
            <p className="lead mt-4">
              Cv-ketel, airco, warmtepomp en onderhoud. Elke vraag begint bij de
              woning, niet bij een standaardpakket.
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-muted lg:text-right">
            Geen merkenlijst of prijzen op deze pagina. Dat volgt in het
            persoonlijke voorstel.
          </p>
        </div>

        <article className="mt-12 grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          <Link to={featured.href} className="group lg:col-span-7">
            <MediaImage
              asset={serviceImage(featured.slug)}
              className="rounded-none min-h-64 lg:min-h-[28rem]"
              ratio="4 / 5"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Link>
          <div className="flex flex-col justify-center lg:col-span-5">
            <FeaturedIcon size={22} strokeWidth={1.5} className="text-brand-dark" aria-hidden="true" />
            <p className="eyebrow mt-5">{featured.heroEyebrow}</p>
            <h3 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.4rem)] font-medium leading-[1.15]">
              <Link to={featured.href} className="hover:text-brand-dark">
                {featured.name}
              </Link>
            </h3>
            <p className="mt-4 text-ink-muted">{featured.heroText}</p>
            <Link to={featured.href} className="text-link mt-6">
              {site.copy.ctaMore}
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </article>

        <ul className="mt-14 divide-y divide-line border-y border-line">
          {rest.map((service) => {
            const Icon = serviceIcons[service.slug]
            return (
              <li key={service.slug}>
                <Link
                  to={service.href}
                  className="group grid items-center gap-5 py-6 sm:grid-cols-[7.5rem_1fr_auto] sm:gap-8"
                >
                  <MediaImage
                    asset={serviceImage(service.slug)}
                    className="rounded-none"
                    ratio="5 / 4"
                    sizes="120px"
                  />
                  <span>
                    <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
                      <Icon size={14} strokeWidth={1.7} aria-hidden="true" />
                      {service.heroEyebrow}
                    </span>
                    <span className="mt-2 block text-xl font-semibold tracking-[-0.02em]">
                      {service.name}
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed text-ink-muted">
                      {service.summary}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    strokeWidth={1.6}
                    className="hidden text-ink-muted transition-transform motion-safe:group-hover:translate-x-1 sm:block"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
