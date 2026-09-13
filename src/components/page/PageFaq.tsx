import { Link } from 'react-router-dom'
import type { FaqItem } from '../../types'
import { Container } from '../Container'
import { FAQ } from '../FAQ'
import { Heading } from '../Heading'
import { Section } from '../Section'
import { cn } from '../../lib/cn'

type PageFaqProps = {
  items: FaqItem[]
  title?: string
  intro?: string
  tone?: 'plain' | 'paper'
  compact?: boolean
}

export function PageFaq({
  items,
  title = 'Veelgestelde vragen',
  intro,
  tone = 'paper',
  compact = false,
}: PageFaqProps) {
  if (items.length === 0) return null

  return (
    <Section
      className={cn(
        tone === 'paper' && 'bg-paper',
        compact && '!py-7 sm:!py-9 lg:!py-11',
      )}
    >
      <Container className={compact ? 'max-w-3xl' : undefined}>
        <Heading as="h2">{title}</Heading>
        {intro ? (
          <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-[0.95rem]">{intro}</p>
        ) : null}
        <div className={intro ? 'mt-5' : 'mt-4'}>
          <FAQ items={items} />
        </div>
        <p className="mt-4 text-sm">
          <Link to="/veelgestelde-vragen" className="font-semibold underline">
            Meer vragen over installatie en onderhoud
          </Link>
        </p>
      </Container>
    </Section>
  )
}
