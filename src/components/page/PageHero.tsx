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
    <section className={cn('border-b border-line bg-paper py-8 sm:py-12 lg:py-16', className)}>
      <Container className={narrow ? 'max-w-3xl' : undefined}>
        <Breadcrumbs items={crumbs} />
        <div
          className={
            image
              ? 'mt-6 grid items-center gap-6 sm:mt-8 sm:gap-10 lg:grid-cols-[1fr_0.95fr]'
              : 'mt-6 max-w-3xl sm:mt-8'
          }
        >
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <Heading as="h1" className={eyebrow ? 'mt-3' : 'mt-0'}>
              {title}
            </Heading>
            {intro ? <p className="lead mt-4">{intro}</p> : null}
            {actions ? <div className="mt-5">{actions}</div> : null}
            {children}
          </div>
          {image ? (
            <MediaImage
              asset={image}
              alt={imageAlt}
              className="rounded-none max-h-[18rem] sm:max-h-[24rem] lg:max-h-none"
              ratio="4 / 5"
              sizes="(min-width: 1024px) 42vw, 100vw"
              priority
            />
          ) : null}
        </div>
      </Container>
    </section>
  )
}
