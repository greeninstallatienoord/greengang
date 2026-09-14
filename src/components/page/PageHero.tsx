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
  /** Constrain the copy column (useful with hero images). */
  copyClassName?: string
  titleClassName?: string
  imageClassName?: string
  /** Slightly tighter vertical rhythm for long headlines + CTAs above the fold. */
  compact?: boolean
  /**
   * hero = marketing cover crop; project = full install documentation.
   * Prefer `imageVariant`. `imageFit` remains for older call sites.
   */
  imageVariant?: 'hero' | 'project'
  imageFit?: 'cover' | 'contain'
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
  copyClassName,
  titleClassName,
  imageClassName,
  compact = false,
  imageVariant,
  imageFit,
}: PageHeroProps) {
  const variant = imageVariant ?? (imageFit === 'contain' ? 'project' : 'hero')
  const documentPhoto = variant === 'project'

  return (
    <section
      className={cn(
        'border-b border-line bg-paper',
        compact ? 'py-7 sm:py-9 lg:py-11' : 'py-8 sm:py-12 lg:py-16',
        className,
      )}
    >
      <Container className={narrow ? 'max-w-3xl' : undefined}>
        <Breadcrumbs items={crumbs} />
        <div
          className={
            image
              ? cn(
                  'grid items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]',
                  compact
                    ? 'mt-5 gap-6 sm:mt-6 sm:gap-8 lg:gap-10'
                    : 'mt-6 gap-8 sm:mt-8 sm:gap-10 lg:gap-12',
                )
              : 'mt-6 max-w-3xl sm:mt-8'
          }
        >
          <div className={cn(image ? 'max-w-xl' : undefined, copyClassName)}>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <Heading as="h1" className={cn(eyebrow ? 'mt-3' : 'mt-0', titleClassName)}>
              {title}
            </Heading>
            {intro ? (
              <p className={cn('lead max-w-prose', compact ? 'mt-4' : 'mt-5')}>{intro}</p>
            ) : null}
            {actions ? (
              <div className={compact ? 'mt-6 sm:mt-7' : 'mt-7 sm:mt-8'}>{actions}</div>
            ) : null}
            {children}
          </div>
          {image ? (
            <MediaImage
              asset={image}
              alt={imageAlt}
              variant={variant}
              fit={imageFit}
              className={cn(
                documentPhoto
                  ? cn(
                      imageFit === 'cover'
                        ? 'mx-auto w-full max-w-full'
                        : 'mx-auto w-fit max-w-full',
                      compact
                        ? 'max-h-[17.5rem] sm:max-h-[20rem] lg:max-h-[24rem]'
                        : 'max-h-[18.5rem] sm:max-h-[22rem] lg:max-h-[26rem]',
                    )
                  : compact
                    ? 'max-h-[15rem] sm:max-h-[17rem] lg:max-h-[19rem]'
                    : 'max-h-[16.5rem] sm:max-h-[18rem] lg:max-h-[21rem]',
                imageClassName ?? 'rounded-none',
              )}
              sizes="(min-width: 1024px) 38vw, 100vw"
              priority
            />
          ) : null}
        </div>
      </Container>
    </section>
  )
}
