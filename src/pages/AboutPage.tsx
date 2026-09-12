import { ContactDetails } from '../components/ContactDetails'
import { CtaPair } from '../components/CtaPair'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { Container } from '../components/Container'
import { CTASection } from '../components/sections/CTASection'
import { ProcessSteps } from '../components/sections/ProcessSteps'
import { SocialLinks } from '../components/SocialLinks'
import { TrustMarks } from '../components/home/TrustMarks'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { pageSeo } from '../data/seo'
import { localBusinessJsonLd } from '../lib/jsonld'
import { services } from '../data/services'
import { pageImages } from '../data/media'
import { MediaImage } from '../components/media/MediaImage'
import { Heading } from '../components/Heading'
import { serviceArea } from '../data/region'
import { site } from '../data/site'

const expect = [
  {
    title: 'Communicatie',
    text: 'U weet wie u spreekt en wat de volgende stap is. Geen onduidelijke tussenlagen.',
  },
  {
    title: 'Veiligheid',
    text: 'Installatiewerk in huis vraagt om zorgvuldig werken. Wat we niet kunnen onderbouwen, beloven we hier niet.',
  },
  {
    title: 'Afronding',
    text: 'Na het werk krijgt u uitleg. Voor onderhoud of een latere vraag blijft u ons bereiken.',
  },
]

export function AboutPage() {
  return (
    <>
      <PageMeta {...pageSeo.about} jsonLd={localBusinessJsonLd()} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Over ons', href: '/over-ons' },
        ]}
        eyebrow="Noord-Nederland"
        title="Installatiewerk dat begint met goed luisteren"
        intro="Green Installatie Noord installeert en onderhoudt cv-ketels, airconditioning en warmtepompen. Eerst de situatie, dan een voorstel."
        image={pageImages.aboutHero}
        actions={<CtaPair showCall />}
      />

      <Section>
        <Container className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow">Het bedrijf</p>
            <Heading as="h2" className="mt-3">
              Vanuit Oude Pekela actief in Noord-Nederland
            </Heading>
            <p className="lead mt-4">
              De werkplaats en het adres liggen in Oude Pekela. Het werkgebied is
              Noord-Nederland, met Groningen als thuisprovincie en daarnaast
              Drenthe en Friesland.
            </p>
            <p className="mt-5 max-w-xl text-ink-muted">
              We plaatsen hier geen verzonnen geschiedenis, teamfoto of jaartal.
              Wat vaststaat: vier diensten, een bereikbaar adres, en een
              werkwijze die begint bij uw woning.
            </p>
          </div>
          <figure className="lg:col-span-6">
            <MediaImage
              asset={pageImages.aboutHouse}
              className="rounded-none"
              ratio="4 / 5"
              sizes="(min-width: 1024px) 44vw, 100vw"
            />
            <figcaption className="mt-3 text-sm text-ink-muted">
              Plaatsing aan de gevel. Foto uit eigen werk.
            </figcaption>
          </figure>
        </Container>
      </Section>

      <ProcessSteps />

      <Section className="bg-paper">
        <Container>
          <figure>
            <MediaImage
              asset={pageImages.aboutCraft}
              className="rounded-none"
              ratio="16 / 10"
              sizes="100vw"
            />
            <figcaption className="mt-3 text-sm text-ink-muted">
              Afgewerkte buitenunit en leiding. Foto uit eigen werk.
            </figcaption>
          </figure>
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow">Vakmanschap</p>
              <Heading as="h2" className="mt-3">
                Nette montage, duidelijke uitleg
              </Heading>
              <p className="lead mt-4">
                Leidingwerk, plaatsing en afronding horen bij elkaar. We laten
                zien wat we doen, zonder merkenlijst of scores die hier niet
                onderbouwd zijn.
              </p>
            </div>
            <ul className="grid gap-6 lg:col-span-7">
              {expect.map((item) => (
                <li key={item.title} className="border-b border-line pb-6">
                  <h3 className="font-semibold tracking-[-0.015em]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <TrustMarks />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Heading as="h2">Bereikbaar</Heading>
            <p className="mt-2 text-sm font-semibold">{site.name}</p>
            <div className="mt-6">
              <ContactDetails />
            </div>
            <SocialLinks className="mt-6" />
          </div>
          <div className="lg:col-span-6">
            <Heading as="h2">Werkgebied</Heading>
            <p className="mt-4 text-ink-muted">{serviceArea.statement}</p>
            <ul className="mt-6 grid gap-3">
              {serviceArea.provinces.map((province) => (
                <li key={province.name} className="border-b border-line py-3">
                  <p className="font-semibold">{province.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">{province.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <RelatedServices services={services} />
      <CTASection image={null} />
    </>
  )
}
