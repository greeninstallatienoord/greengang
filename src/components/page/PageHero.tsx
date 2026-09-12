import type { ReactNode } from 'react'
import type { MediaAsset } from '../../data/media'
import { Breadcrumbs } from '../Breadcrumbs'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { MediaImage } from '../media/MediaImage'
import { cn } from '../../lib/cn'

export type PageCrumb = {
  label: string
  href?: string
}

type PageHeroProps = {
  crumbs: PageCrumb[]
  eyebrow?: string
  title: string
  intro?: string
  image?: MediaAsset
  imageAlt?: string
  actions?: ReactNode
  children?: ReactNode
  narrow?: boolean
  className?: string
}

export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  actions,
  children,
  narrow = false,
  className,
}: PageHeroProps) {
  return (
    <section className={cn('bg-paper py-10 sm:py-12', className)}>
      <Container className={narrow ? 'max-w-3xl' : undefined}>
        <Breadcrumbs items={crumbs} />
        <div
          className={
            image
              ? 'mt-6 grid items-center gap-8 lg:grid-cols-2'
              : 'mt-6 max-w-3xl'
          }
        >
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <Heading as="h1" className={eyebrow ? 'mt-3' : 'mt-0'}>
              {title}
            </Heading>
            {intro ? <p className="mt-4 text-lg text-ink-muted">{intro}</p> : null}
            {actions ? <div className="mt-6">{actions}</div> : null}
            {children}
          </div>
          {image ? (
            <MediaImage
              asset={image}
              alt={imageAlt}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          ) : null}
        </div>
      </Container>
    </section>
  )
}
