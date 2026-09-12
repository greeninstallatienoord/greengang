import { Link } from 'react-router-dom'
import type { FaqItem } from '../../types'
import { Container } from '../Container'
import { FAQ } from '../FAQ'
import { Heading } from '../Heading'
import { Section } from '../Section'

type PageFaqProps = {
  items: FaqItem[]
  title?: string
  tone?: 'plain' | 'paper'
}

export function PageFaq({
  items,
  title = 'Veelgestelde vragen',
  tone = 'paper',
}: PageFaqProps) {
  if (items.length === 0) return null

  return (
    <Section className={tone === 'paper' ? 'bg-paper' : undefined}>
      <Container>
        <Heading as="h2">{title}</Heading>
        <div className="mt-4">
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
