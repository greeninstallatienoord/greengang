import { Link } from 'react-router-dom'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

export type CrossLink = {
  href: string
  label: string
  note?: string
}

type CrossLinksProps = {
  title?: string
  links: CrossLink[]
}

export function CrossLinks({ title = 'Verder op deze site', links }: CrossLinksProps) {
  if (links.length === 0) return null

  return (
    <Section>
      <Container>
        <Heading as="h2">{title}</Heading>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {links.map((item) => (
            <li key={item.href} className="rounded-lg border border-line bg-paper p-4">
              <Link to={item.href} className="font-semibold underline">
                {item.label}
              </Link>
              {item.note ? <p className="mt-1 text-sm text-ink-muted">{item.note}</p> : null}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
