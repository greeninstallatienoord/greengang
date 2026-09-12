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
import { Reveal } from '../components/Reveal'
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
        actions={<CtaPair equal />}
      />

      <Section>
        <Container>
          <Reveal>
            <div className="max-w-2xl">
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
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Reveal delay={40}>
              <figure>
                <MediaImage
                  asset={pageImages.aboutHouse}
                  className="rounded-none"
                  ratio="16 / 10"
                  sizes="(min-width: 640px) 44vw, 100vw"
                />
                <figcaption className="mt-2 text-sm text-ink-muted">
                  Plaatsing aan de gevel. Foto uit eigen werk.
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={110}>
              <figure>
                <MediaImage
                  asset={pageImages.aboutCraft}
                  className="rounded-none"
                  ratio="16 / 10"
                  sizes="(min-width: 640px) 44vw, 100vw"
                />
                <figcaption className="mt-2 text-sm text-ink-muted">
                  Afgewerkte buitenunit en leiding. Foto uit eigen werk.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Container>
      </Section>

      <ProcessSteps />

      <Section className="bg-paper">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
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
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {expect.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <li className="border-t border-line pt-4">
                  <h3 className="font-semibold tracking-[-0.015em]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <TrustMarks />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Heading as="h2">Bereikbaar</Heading>
            <p className="mt-2 text-sm font-semibold">{site.name}</p>
            <div className="mt-6">
              <ContactDetails />
            </div>
            <SocialLinks className="mt-6" />
          </Reveal>
          <Reveal className="lg:col-span-6" delay={80}>
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
          </Reveal>
        </Container>
      </Section>

      <RelatedServices services={services} />
      <CTASection image={null} />
    </>
  )
}
