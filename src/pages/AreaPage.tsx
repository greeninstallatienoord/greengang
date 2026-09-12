import { Link } from 'react-router-dom'
import { CtaPair } from '../components/CtaPair'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { Container } from '../components/Container'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { Heading } from '../components/Heading'
import { Reveal } from '../components/Reveal'
import { NorthMap } from '../components/region/NorthMap'
import { ProvinceHighlights } from '../components/region/ProvinceHighlights'
import { areas } from '../data/areas'
import { business, formatAddress } from '../data/business'
import { serviceArea } from '../data/region'
import { pageSeo } from '../data/seo'
import { services } from '../data/services'
import { breadcrumbJsonLd, localBusinessJsonLd, serviceAreaPageJsonLd } from '../lib/jsonld'

export function AreaIndexPage() {
  return (
    <>
      <PageMeta
        {...pageSeo.areas}
        jsonLd={[
          localBusinessJsonLd(),
          serviceAreaPageJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Werkgebied', path: '/werkgebied' },
          ]),
        ]}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Werkgebied', href: '/werkgebied' },
        ]}
        eyebrow="Werkgebied"
        title="Actief in Noord-Nederland"
        intro={serviceArea.statement}
        actions={<CtaPair equal />}
      />

      <Section>
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <Heading as="h2">Vanuit Oude Pekela</Heading>
              <p className="lead mt-4">{serviceArea.intro}</p>
              <p className="mt-4 text-ink-muted">
                {serviceArea.baseLine} {formatAddress()}.
              </p>
            </div>
          </Reveal>
          <Reveal className="mt-8" delay={40}>
            <ProvinceHighlights />
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-paper">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">Kaart</p>
              <Heading as="h2" className="mt-3">
                Het noorden op de kaart
              </Heading>
              <p className="lead mt-4">
                De marker staat bij de vestiging in Oude Pekela. Groningen,
                Drenthe en Friesland vallen binnen het werkgebied. Geen
                postcodelijst en geen extra plaatsnamen zonder eigen tekst.
              </p>
            </div>
          </Reveal>
          <Reveal className="mt-6" delay={60}>
            <NorthMap />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Heading as="h2">Plaatsnamen</Heading>
            <p className="lead mt-4">
              Afzonderlijke plaatsnamen publiceren we pas als daar eigen,
              gecontroleerde tekst voor is. Geen dunne deurenpagina’s.
            </p>
            {areas.length === 0 ? (
              <p className="mt-5 text-ink-muted">
                Er zijn nog geen plaatsnamen gepubliceerd. Het werkgebied is
                Noord-Nederland, met vestiging in Oude Pekela.
              </p>
            ) : (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {areas.map((area) => (
                  <li key={area.slug}>
                    <Link to={`/werkgebied/${area.slug}`} className="font-semibold underline underline-offset-2">
                      {area.city}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
          <Reveal className="lg:col-span-5" delay={70}>
            <nav className="border border-line bg-paper p-5 sm:p-6" aria-label="Gerelateerde pagina’s">
              <h3 className="font-semibold tracking-[-0.01em]">Vervolg</h3>
              <ul className="mt-3 grid gap-2 text-sm font-semibold">
                <li>
                  <Link to="/contact" className="underline underline-offset-2">
                    Contact en adres
                  </Link>
                </li>
                <li>
                  <Link to="/over-ons" className="underline underline-offset-2">
                    Over ons
                  </Link>
                </li>
                <li>
                  <Link to="/offerte-aanvragen" className="underline underline-offset-2">
                    Offerte aanvragen
                  </Link>
                </li>
                <li>
                  <Link to="/afspraak-maken" className="underline underline-offset-2">
                    Afspraak maken
                  </Link>
                </li>
                {business.googleBusinessProfile ? (
                  <li>
                    <a
                      href={business.googleBusinessProfile}
                      className="underline underline-offset-2"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Profiel op Google
                    </a>
                  </li>
                ) : null}
              </ul>
            </nav>
          </Reveal>
        </Container>
      </Section>

      <RelatedServices services={services} title="Diensten in dit werkgebied" />
      <CTASection />
    </>
  )
}
