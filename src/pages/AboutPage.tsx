import { ContactDetails } from '../components/ContactDetails'
import { CtaPair } from '../components/CtaPair'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { PlaceholderNote } from '../components/PlaceholderNote'
import { Container } from '../components/Container'
import { CTASection } from '../components/sections/CTASection'
import { SocialLinks } from '../components/SocialLinks'
import { TrustSection } from '../components/trust/TrustSection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { pageSeo } from '../data/seo'
import { localBusinessJsonLd } from '../lib/jsonld'
import { services } from '../data/services'

const blocks = [
  {
    title: 'Introductie',
    text: 'Green Installatie Noord is een installatiebedrijf voor cv-ketels, airconditioning, warmtepompen en onderhoud. Bedrijfsgeschiedenis, teamfoto’s en cijfers volgen hier zodra ze zijn aangeleverd.',
  },
  {
    title: 'Aanpak',
    text: 'Eerst de vraag scherp, dan een voorstel. Geen standaardpakket van de website, wel een gesprek over wat de woning en de wens vragen.',
  },
  {
    title: 'Vakmanschap',
    text: 'Installatiewerk in huis vraagt om nette montage, duidelijke uitleg en aandacht voor veiligheid. Certificeringen publiceren we pas als ze bevestigd zijn.',
  },
  {
    title: 'Persoonlijk contact',
    text: 'Korte lijnen: u weet wie u spreekt en wat de volgende stap is. Telefoon, e-mail en adres staan in de kop, de footer en op de contactpagina.',
  },
  {
    title: 'Kwaliteit',
    text: 'Kwaliteit zit in de voorbereiding, de uitvoering en de nazorg. We beloven hier geen keurmerken of percentages die we niet kunnen onderbouwen.',
  },
  {
    title: 'Installatieproces',
    text: 'Aanvraag, advies, offerte, uitvoering. Planning en doorlooptijd volgen per opdracht.',
  },
  {
    title: 'Service en onderhoud',
    text: 'Na plaatsing blijven we beschikbaar voor onderhoud en service. Details over contracten volgen later, als die er zijn.',
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
        eyebrow="Bedrijf"
        title="Over Green Installatie Noord"
        intro="Een nuchter installatiebedrijf voor comfort en techniek in huis, gevestigd in Oude Pekela. Onderstaande blokken blijven feitelijk tot extra bedrijfsinformatie is gecontroleerd."
        actions={<CtaPair showCall />}
      >
        <div className="mt-6 max-w-md rounded-lg border border-line bg-paper p-5 shadow-card">
          <h2 className="font-semibold">Contact</h2>
          <div className="mt-3">
            <ContactDetails showHours={false} />
          </div>
          <SocialLinks className="mt-4" />
        </div>
        <PlaceholderNote className="mt-6 max-w-2xl">
          Foto’s van het team en gecontroleerde certificeringen kunnen hier
          later worden geplaatst.
        </PlaceholderNote>
      </PageHero>
      <Section>
        <Container className="grid gap-5 md:grid-cols-2">
          {blocks.map((block) => (
            <article
              key={block.title}
              className="rounded-lg border border-line bg-paper p-5 shadow-card"
            >
              <h2 className="text-xl font-semibold">{block.title}</h2>
              <p className="mt-2 text-ink-muted">{block.text}</p>
            </article>
          ))}
        </Container>
      </Section>
      <TrustSection />
      <RelatedServices services={services} />
      <CTASection />
    </>
  )
}
