import { ArrowRight, MapPinned, Navigation, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ButtonLink } from '../components/ButtonLink'
import { Container } from '../components/Container'
import { CtaPair } from '../components/CtaPair'
import { Heading } from '../components/Heading'
import { NorthMap } from '../components/region/NorthMap'
import { ProvinceHighlights } from '../components/region/ProvinceHighlights'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { CertificationMarks } from '../components/trust/CertificationMarks'
import { areas } from '../data/areas'
import { business, formatAddress } from '../data/business'
import { schemeMarks } from '../data/media'
import { mapsDirectionsUrl, serviceArea } from '../data/region'
import { pageSeo } from '../data/seo'
import { serviceIcons } from '../data/serviceIcons'
import { services } from '../data/services'
import { site } from '../data/site'
import { localBusinessJsonLd, serviceAreaPageJsonLd } from '../lib/jsonld'

const areaServiceSummaries: Record<string, string> = {
  'cv-ketel': 'Plaatsen of vervangen van een cv-ketel, met aansluiting en uitleg.',
  airco: 'Koelen (en soms verwarmen) met een voorstel dat bij de ruimte past.',
  warmtepomp: 'Hybride of all-electric: eerst beoordelen, daarna adviseren en installeren.',
  'service-onderhoud': business.emergencyService.available
    ? 'Onderhoud, service en 24/7 storingsdienst.'
    : 'Onderhoud en service van cv-ketels en klimaatinstallaties.',
}

export function AreaIndexPage() {
  return (
    <>
      <PageMeta
        {...pageSeo.areas}
        jsonLd={[localBusinessJsonLd(), serviceAreaPageJsonLd()]}
      />

      <section className="border-b border-line bg-paper">
        <Container className="py-6 sm:py-8 lg:py-9">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Werkgebied', href: '/werkgebied' },
            ]}
          />
          <p className="eyebrow mt-5">Werkgebied</p>
          <Heading as="h1" className="mt-2.5 max-w-3xl text-balance">
            {serviceArea.heroTitle}
          </Heading>
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-muted sm:mt-3.5 sm:text-base">
            {serviceArea.heroText}
          </p>
          <CtaPair className="mt-5 sm:mt-6" />
          <p className="mt-3.5 text-sm text-ink-muted">
            Twijfelt u of wij bij u komen?{' '}
            <a
              href={site.contact.phoneHref}
              className="font-semibold text-ink underline-offset-2 hover:underline"
            >
              Bel {site.contact.phone}
            </a>
          </p>
        </Container>
      </section>

      <Section className="!py-6 sm:!py-8 lg:!py-10">
        <Container>
          <div className="max-w-2xl">
            <p className="eyebrow">Regio</p>
            <Heading as="h2" className="mt-2.5 sm:mt-3">
              Actief in Noord-Nederland
            </Heading>
            <p className="lead mt-3 sm:mt-3.5">{serviceArea.intro}</p>
          </div>
          <ProvinceHighlights className="mt-5 sm:mt-6" />
        </Container>
      </Section>

      <Section className="bg-paper !py-6 sm:!py-8 lg:!py-10">
        <Container>
          <div className="grid gap-7 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
            <div className="lg:col-span-5">
              <p className="eyebrow">Vestiging</p>
              <Heading as="h2" className="mt-2.5 sm:mt-3">
                Vanuit Oude Pekela door Noord-Nederland
              </Heading>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted sm:mt-3.5 sm:text-base">
                Green Installatie Noord is gevestigd in Oude Pekela. Vanuit hier
                voeren we werkzaamheden uit voor klanten in Groningen, Drenthe en
                Friesland.
              </p>

              <div className="mt-5 border border-line bg-surface p-4 min-[390px]:p-5">
                <span className="icon-mark size-9 bg-paper">
                  <MapPinned size={16} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold tracking-[-0.01em]">
                  Adres
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {business.address.street}
                  <br />
                  {business.address.postalCode} {business.address.city}
                </p>
                <div className="mt-4 flex flex-col gap-2 min-[400px]:flex-row">
                  <ButtonLink
                    to={mapsDirectionsUrl()}
                    external
                    variant="secondary"
                    size="sm"
                    className="min-h-11"
                  >
                    <Navigation size={15} strokeWidth={1.75} aria-hidden="true" />
                    Route bekijken
                  </ButtonLink>
                  <ButtonLink to="/contact" variant="secondary" size="sm" className="min-h-11">
                    Contact opnemen
                  </ButtonLink>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 xl:col-span-7">
              <p className="eyebrow">Kaart</p>
              <Heading as="h2" className="mt-2.5 sm:mt-3">
                Ons werkgebied
              </Heading>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-muted sm:text-base">
                {serviceArea.mapIntro}
              </p>
              <p className="mt-2 text-sm text-ink-muted lg:sr-only">
                Vestiging in {business.address.city}. Werkgebied: Groningen,
                Drenthe en Friesland.
              </p>
              <NorthMap className="mt-4 sm:mt-5" />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="!py-6 sm:!py-8">
        <Container>
          <div className="border border-line bg-paper p-4 min-[390px]:p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
            <div className="max-w-xl">
              <Heading as="h2" className="text-[1.25rem] sm:text-[1.35rem]">
                Werken jullie bij mij?
              </Heading>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-[0.95rem]">
                Woont u in Noord-Nederland en twijfelt u of we bij u komen? Vraag
                het ons — we kijken graag met u mee.
              </p>
            </div>
            <div className="mt-4 flex w-full max-w-md flex-col gap-2 min-[400px]:flex-row sm:mt-0 sm:w-auto sm:max-w-none sm:shrink-0">
              <ButtonLink to="/contact" className="min-h-11 justify-center">
                Vraag het ons
              </ButtonLink>
              <ButtonLink
                to={site.contact.phoneHref}
                external
                variant="secondary"
                className="min-h-11 justify-center"
              >
                <Phone size={15} strokeWidth={1.75} aria-hidden="true" />
                Bel {site.contact.phone}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface !py-6 sm:!py-8 lg:!py-10">
        <Container>
          <div className="max-w-2xl">
            <p className="eyebrow">Diensten</p>
            <Heading as="h2" className="mt-2.5 sm:mt-3">
              Wat we in de regio uitvoeren
            </Heading>
            <p className="lead mt-3 sm:mt-3.5">
              Vanuit Oude Pekela helpen we met installatie, advies en onderhoud —
              afhankelijk van uw woning en situatie.
            </p>
          </div>
          <ul className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = serviceIcons[service.slug]
              return (
                <li key={service.slug}>
                  <Link
                    to={service.href}
                    className="group flex min-h-14 items-start gap-3 border border-line bg-paper px-3.5 py-3.5 transition-[border-color,background-color] duration-[var(--duration-fast)] hover:border-ink/25 hover:bg-stone/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand min-[390px]:px-4"
                  >
                    <span className="mt-0.5 inline-flex text-brand-dark">
                      <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold tracking-[-0.015em]">
                        {service.name}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                        {areaServiceSummaries[service.slug] ?? service.summary}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.6}
                      className="mt-1 shrink-0 text-ink-muted transition-transform motion-safe:group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </Container>
      </Section>

      <Section className="!py-6 sm:!py-8 lg:!py-10">
        <Container className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:col-span-7">
            <p className="eyebrow">Aanpak</p>
            <Heading as="h2" className="mt-2.5 sm:mt-3">
              Voor woningen in Noord-Nederland
            </Heading>
            <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-muted sm:mt-3.5 sm:text-base">
              {serviceArea.housingIntro}
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={service.href}
                    className="underline-offset-2 hover:underline"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/offerte-aanvragen" className="underline-offset-2 hover:underline">
                  Offerte aanvragen
                </Link>
              </li>
            </ul>
          </div>

          <div className="border border-line bg-paper p-4 min-[390px]:p-5 lg:col-span-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
              Actief in Noord-Nederland
            </p>
            <ul className="mt-3 divide-y divide-line">
              {serviceArea.provinces.map((province) => (
                <li key={province.name} className="py-2.5 first:pt-0 last:pb-0">
                  <span className="font-semibold tracking-[-0.01em]">
                    {province.name}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-line pt-3 text-sm text-ink-muted">
              {serviceArea.baseLine}
              <br />
              {formatAddress()}
            </p>
            {areas.length > 0 ? (
              <ul className="mt-4 grid gap-2">
                {areas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      to={`/werkgebied/${area.slug}`}
                      className="text-sm font-semibold underline underline-offset-2"
                    >
                      {area.city}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Container>
      </Section>

      {schemeMarks.length > 0 ? (
        <Section
          className="border-y border-line bg-paper !py-5 sm:!py-6"
          aria-labelledby="area-certifications-heading"
        >
          <Container>
            <h2
              id="area-certifications-heading"
              className="text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-dark"
            >
              Erkend & gecertificeerd
            </h2>
            <CertificationMarks framed className="mx-auto mt-4 max-w-5xl sm:mt-5" />
          </Container>
        </Section>
      ) : null}

      <CTASection
        eyebrow="Contact"
        title="Woont u in ons werkgebied?"
        text="Vertel ons wat u wilt laten uitvoeren. We bekijken graag wat mogelijk is op uw locatie."
        phoneLead="Of bel"
        image={null}
      />
    </>
  )
}
