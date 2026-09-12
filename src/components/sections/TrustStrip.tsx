import { business, formatAddress } from '../../data/business'
import { site } from '../../data/site'
import { Container } from '../Container'

const facts = [
  { label: 'Vestiging', value: formatAddress() },
  { label: 'Openingstijden', value: site.contact.openingHours },
  { label: 'Telefoon', value: business.phone },
  { label: 'Diensten', value: 'Cv-ketel, airco, warmtepomp, onderhoud' },
]

export function TrustStrip() {
  return (
    <div className="border-b border-line bg-paper">
      <Container className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-10">
        {facts.map((item) => (
          <div key={item.label}>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {item.label}
            </p>
            <p className="mt-2 text-sm font-medium leading-snug">{item.value}</p>
          </div>
        ))}
      </Container>
    </div>
  )
}
