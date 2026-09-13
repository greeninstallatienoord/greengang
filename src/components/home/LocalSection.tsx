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
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12">
            <div className="lg:col-span-6 lg:flex lg:flex-col lg:justify-center">
              <p className="eyebrow">Werkgebied</p>
              <Heading as="h2" className="mt-2.5 sm:mt-3">
                {site.copy.localTitle}
              </Heading>
              <p className="lead mt-3 sm:mt-4">{serviceArea.statement}</p>
              <div className="mt-5 sm:mt-6">
                <ButtonLink to="/werkgebied" variant="secondary" size="sm">
                  Bekijk werkgebied
                </ButtonLink>
              </div>
            </div>

            <div className="border border-line bg-surface p-4 min-[390px]:p-5 sm:p-6 lg:col-span-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
                Provincies
              </p>
              <ul className="mt-3 divide-y divide-line min-[390px]:mt-4">
                {serviceArea.provinces.map((province) => (
                  <li key={province.name} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
                    <span className="font-semibold tracking-[-0.01em]">{province.name}</span>
                    <span className="text-sm text-ink-muted">{province.text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-line pt-3.5 text-sm text-ink-muted sm:mt-5 sm:pt-4">
                {serviceArea.baseLine}
                <br />
                {street}, {postalCode} {city}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
