import { site } from '../../data/site'
import { Container } from '../Container'

export function TrustStrip() {
  return (
    <div className="border-y border-line bg-paper">
      <Container className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {site.copy.trust.map((item) => (
          <div key={item.title}>
            <p className="font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{item.text}</p>
          </div>
        ))}
      </Container>
    </div>
  )
}
