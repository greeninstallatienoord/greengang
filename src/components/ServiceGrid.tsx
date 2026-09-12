import { services } from '../data/services'
import { ServiceCard } from './ServiceCard'

export function ServiceGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  )
}
