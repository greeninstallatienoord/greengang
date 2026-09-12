import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import type { ServiceRecord } from '../types'
import { ButtonLink } from './ButtonLink'
import { serviceImage } from '../data/media'
import { MediaImage } from './media/MediaImage'

type ServiceCardProps = {
  service: ServiceRecord
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-card transition-shadow hover:shadow-md">
      <MediaImage
        asset={serviceImage(service.slug)}
        className="rounded-none"
        sizes="(min-width: 1024px) 33vw, 100vw"
      />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold">
          <Link to={service.href} className="hover:text-brand-dark">
            {service.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-ink-muted">{service.summary}</p>
        <p className="mt-3 text-sm font-medium">{service.benefit}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to={service.href}
            className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-brand-dark"
          >
            {site.copy.ctaMore}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <ButtonLink
            to={`/offerte-aanvragen?dienst=${service.slug}`}
            variant="secondary"
            size="sm"
          >
            {site.copy.ctaQuote}
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
