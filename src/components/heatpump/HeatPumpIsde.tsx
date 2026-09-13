import { isdeInfo } from '../../data/heatPumpAssumptions'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

export function HeatPumpIsde() {
  return (
    <Section>
      <Container className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="max-w-2xl lg:col-span-8">
          <p className="eyebrow">{isdeInfo.eyebrow}</p>
          <Heading as="h2" className="mt-2.5 sm:mt-3">
            {isdeInfo.title}
          </Heading>
          <p className="lead mt-3 sm:mt-4">{isdeInfo.text}</p>
          <p className="mt-3 text-sm text-ink-muted">{isdeInfo.note}</p>
        </div>
        <div className="flex flex-col gap-2.5 lg:col-span-4 lg:items-end">
          <ButtonLink
            to={isdeInfo.ctaHref}
            external
            variant="secondary"
            className="min-h-11"
          >
            {isdeInfo.ctaLabel}
          </ButtonLink>
          <ButtonLink
            to="/offerte-aanvragen?dienst=warmtepomp"
            className="min-h-11"
          >
            Meer over subsidie in uw voorstel
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
