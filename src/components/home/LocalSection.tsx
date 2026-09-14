import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { GreenFlowSection } from '../greenflow/TechnicalBackdrop'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { RegionGlance } from '../region/RegionGlance'
import { Section } from '../Section'

export function LocalSection() {
  return (
    <GreenFlowSection variant="regional" ambient mask="left" intensity="strong" className="bg-paper section-grain">
      <Section className="!bg-transparent">
        <Container>
          <Reveal>
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
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

              <div className="lg:col-span-6">
                <RegionGlance showLink={false} className="h-full" />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </GreenFlowSection>
  )
}
