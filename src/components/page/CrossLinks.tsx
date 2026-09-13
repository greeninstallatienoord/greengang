import { ArrowRight, CircleHelp, FileText, Images, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Container } from '../Container'
import { GreenFlowSection } from '../greenflow/TechnicalBackdrop'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export type CrossLink = {
  href: string
  label: string
  note?: string
  /** Short action line, e.g. "Bekijk vragen". */
  cta?: string
  icon?: 'faq' | 'articles' | 'work' | 'service' | 'default'
}

type CrossLinksProps = {
  title?: string
  eyebrow?: string
  links: CrossLink[]
  className?: string
}

const iconMap: Record<NonNullable<CrossLink['icon']>, LucideIcon> = {
  faq: CircleHelp,
  articles: FileText,
  work: Images,
  service: Wrench,
  default: ArrowRight,
}

function inferIcon(href: string, label: string): NonNullable<CrossLink['icon']> {
  const hay = `${href} ${label}`.toLowerCase()
  if (hay.includes('vraag') || hay.includes('faq')) return 'faq'
  if (hay.includes('blog') || hay.includes('artikel') || hay.includes('kennis')) return 'articles'
  if (hay.includes('werk') || hay.includes('praktijk') || hay.includes('project')) return 'work'
  if (hay.includes('service') || hay.includes('onderhoud')) return 'service'
  return 'default'
}

function inferCta(icon: NonNullable<CrossLink['icon']>, label: string): string {
  if (icon === 'faq') return 'Bekijk vragen'
  if (icon === 'articles') return 'Lees artikelen'
  if (icon === 'work') return 'Bekijk projecten'
  if (icon === 'service') return 'Bekijk service'
  return label
}

export function CrossLinks({
  title = 'Verder op deze site',
  eyebrow = 'Navigatie',
  links,
  className,
}: CrossLinksProps) {
  if (links.length === 0) return null

  return (
    <GreenFlowSection variant="service" mask="right" className={cn('bg-paper', className)}>
      <Section className="!bg-transparent">
        <Container>
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <Heading as="h2" className="mt-2.5 sm:mt-3">
              {title}
            </Heading>
          </Reveal>

          <ul
            className={cn(
              'mt-6 grid gap-3 sm:mt-7 sm:gap-4',
              links.length >= 3 ? 'md:grid-cols-3' : links.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1',
            )}
          >
            {links.map((item, index) => {
              const iconKey = item.icon ?? inferIcon(item.href, item.label)
              const Icon = iconMap[iconKey]
              const cta = item.cta ?? inferCta(iconKey, item.label)

              return (
                <li key={item.href} className="h-full">
                  <Reveal delay={index * 70} className="h-full">
                    <Link
                      to={item.href}
                      className={cn(
                        'group resource-card flex h-full flex-col border border-line bg-white p-4 min-[390px]:p-5',
                        'transition-[border-color,transform,background-color] duration-[var(--duration-base)]',
                        'hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-soft/25',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                      )}
                    >
                      <span className="icon-mark size-9 bg-brand-soft sm:size-10">
                        <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      <h3 className="mt-3.5 text-[1.02rem] font-semibold tracking-[-0.015em] text-ink sm:mt-4 sm:text-[1.06rem]">
                        {item.label}
                      </h3>
                      {item.note ? (
                        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">{item.note}</p>
                      ) : (
                        <span className="flex-1" />
                      )}
                      <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-dark">
                        {cta}
                        <ArrowRight
                          size={15}
                          strokeWidth={2}
                          className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </Container>
      </Section>
    </GreenFlowSection>
  )
}

/** Alias used by service pages for the polished “Meer informatie” block. */
export const RelatedResources = CrossLinks
