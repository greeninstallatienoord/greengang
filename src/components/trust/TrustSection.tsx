import { business } from '../../data/business'
import {
  approvedBrands,
  approvedCertifications,
  approvedGuarantees,
  approvedMemberships,
  approvedNotes,
  approvedProjects,
  approvedReviewPlatforms,
  approvedReviews,
  hasTrustContent,
  trustContent,
} from '../../data/trust'
import { Card } from '../Card'
import { Container } from '../Container'
import { GreenFlowSection } from '../greenflow/TechnicalBackdrop'
import { TrustFacts } from '../greenflow/TrustFacts'
import { Heading } from '../Heading'
import { Section } from '../Section'
import { CertificationCard } from './CertificationCard'
import { GoogleReviewsCta } from './GoogleReviewsCta'
import { ReviewCard } from './ReviewCard'

type TrustSectionProps = {
  /** Service-page motif for the ambient backdrop. */
  flow?: 'airflow' | 'hydronic' | 'thermal' | 'service' | 'regional'
}

export function TrustSection({ flow = 'service' }: TrustSectionProps) {
  const notes = approvedNotes()
  const certifications = approvedCertifications()
  const reviews = approvedReviews()
  const platforms = approvedReviewPlatforms()
  const brands = approvedBrands()
  const projects = approvedProjects()
  const guarantees = approvedGuarantees()
  const memberships = approvedMemberships()
  const hasRichBlocks =
    hasTrustContent() &&
    (certifications.length > 0 ||
      guarantees.length > 0 ||
      reviews.length > 0 ||
      brands.length > 0 ||
      projects.length > 0 ||
      memberships.length > 0 ||
      notes.length > 1)

  return (
    <GreenFlowSection variant={flow} ambient mask="left" intensity="strong" className="bg-paper">
      <Section className="!bg-transparent">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="lg:col-span-6">
              <p className="eyebrow">Vertrouwen</p>
              <Heading as="h2" className="mt-3">
                Vakmanschap en kwaliteit
              </Heading>
              <p className="lead mt-4">
                Gevestigd in {business.address.city}. Beoordelingen, keurmerken en
                garanties tonen we alleen wanneer die geverifieerd zijn.
              </p>

              {notes.length > 0 || trustContent.yearsOfExperience !== null ? (
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {notes.map((item) => (
                    <Card key={item.title}>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm text-ink-muted">{item.text}</p>
                    </Card>
                  ))}
                  {trustContent.yearsOfExperience !== null ? (
                    <Card>
                      <h3 className="font-semibold">Ervaring</h3>
                      <p className="mt-2 text-sm text-ink-muted">
                        {trustContent.yearsOfExperience} jaar
                      </p>
                    </Card>
                  ) : null}
                  {trustContent.completedProjects !== null ? (
                    <Card>
                      <h3 className="font-semibold">Projecten</h3>
                      <p className="mt-2 text-sm text-ink-muted">
                        {trustContent.completedProjects} afgeronde projecten
                      </p>
                    </Card>
                  ) : null}
                </div>
              ) : null}

              {platforms.length > 0 || Boolean(business.googleBusinessProfile) ? (
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-1">
                  <GoogleReviewsCta />
                  {platforms.map((item) => (
                    <Card key={item.id}>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="mt-2 text-sm text-ink-muted">
                        Ervaringen van klanten vindt u op het bronplatform.
                      </p>
                      <p className="mt-4 text-sm">
                        <a
                          href={item.url}
                          className="font-semibold underline underline-offset-2"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Bekijk ervaringen op {item.name}
                        </a>
                      </p>
                    </Card>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-6">
              <TrustFacts className="border border-line bg-white/70 px-4 py-5 sm:px-5 sm:py-6" />
            </div>
          </div>

          {hasRichBlocks ? (
            <>
              {certifications.length > 0 ? (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold">Certificeringen</h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {certifications.map((item) => (
                      <CertificationCard key={item.id} certification={item} />
                    ))}
                  </div>
                </div>
              ) : null}

              {guarantees.length > 0 ? (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold">Garanties</h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {guarantees.map((item) => (
                      <Card key={item.title}>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm text-ink-muted">{item.text}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null}

              {reviews.length > 0 ? (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold">Ervaringen</h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {reviews.map((item) => (
                      <ReviewCard key={item.id} review={item} />
                    ))}
                  </div>
                </div>
              ) : null}

              {memberships.length > 0 ? (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold">Lidmaatschappen</h3>
                  <ul className="mt-4 grid gap-3">
                    {memberships.map((item) => (
                      <li key={item.name}>
                        {item.url ? (
                          <a
                            href={item.url}
                            className="font-semibold underline"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <span className="font-semibold">{item.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {brands.length > 0 ? (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold">Merken</h3>
                  <ul className="mt-4 flex flex-wrap gap-2 text-sm">
                    {brands.map((item) => (
                      <li key={item.name} className="rounded-md bg-surface px-3 py-1">
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {projects.length > 0 ? (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold">Projecten</h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {projects.map((item) => (
                      <Card key={item.title}>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm text-ink-muted">{item.summary}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </Container>
      </Section>
    </GreenFlowSection>
  )
}

export function TrustShowcase() {
  return <TrustSection />
}
