import type { FaqItem } from '../../types'
import { Container } from '../Container'
import { FAQ } from '../FAQ'
import { Heading } from '../Heading'
import { Section } from '../Section'
import { cn } from '../../lib/cn'
import { Link } from 'react-router-dom'

type PageFaqProps = {
  items: FaqItem[]
  title?: string
  intro?: string
  tone?: 'plain' | 'paper'
  compact?: boolean
  className?: string
}

export function PageFaq({
  items,
  title = 'Veelgestelde vragen',
  intro,
  tone = 'paper',
  compact = false,
  className,
}: PageFaqProps) {
  if (items.length === 0) return null

  return (
    <Section
      className={cn(
        tone === 'paper' && 'bg-paper',
        compact && '!py-7 sm:!py-9 lg:!py-11',
        className,
      )}
    >
      <Container className={cn(compact && 'article-shell')}>
        <Heading
          as="h2"
          className={compact ? 'text-[clamp(1.3rem,2.4vw,1.75rem)]' : undefined}
        >
          {title}
        </Heading>
        {intro ? (
          <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-[0.95rem]">
            {intro}
          </p>
        ) : null}
        <div className={intro ? 'mt-5' : 'mt-4'}>
          <FAQ items={items} />
        </div>
        <p className="mt-5 text-sm">
          <Link
            to="/veelgestelde-vragen"
            className="font-semibold text-brand-dark underline decoration-brand/30 underline-offset-2 transition-colors hover:decoration-brand"
          >
            Meer vragen over installatie en onderhoud
          </Link>
        </p>
      </Container>
    </Section>
  )
}
