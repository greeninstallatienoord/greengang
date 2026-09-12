import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function LocalSection() {
  const { street, postalCode, city } = site.contact

  return (
    <Section className="bg-paper">
      <Container>
        <Reveal>
          <div className="grid gap-7 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
              <p className="eyebrow">Werkgebied</p>
              <Heading as="h2" className="mt-3">
                {site.copy.localTitle}
              </Heading>
              <p className="lead mt-4">{serviceArea.statement}</p>
              <p className="mt-3 max-w-xl text-ink-muted">{site.copy.localText}</p>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold tracking-[-0.01em] lg:justify-end">
                {serviceArea.provinces.map((province) => (
                  <li key={province.name}>{province.name}</li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-ink-muted">
                {serviceArea.baseLine}
                <br />
                {street}, {postalCode} {city}
              </p>
              <div className="mt-6 lg:flex lg:justify-end">
                <ButtonLink to="/werkgebied" variant="secondary" size="sm">
                  Werkgebied
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
