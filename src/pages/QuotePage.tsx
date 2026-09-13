import { QuoteForm } from '../components/forms/QuoteForm'
import { PageHero } from '../components/page/PageHero'
import { PhoneFallback } from '../components/page/PhoneFallback'
import { Container } from '../components/Container'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { pageSeo } from '../data/seo'

export function QuotePage() {
  return (
    <>
      <PageMeta {...pageSeo.quote} />
      <PageHero
        compact
        className="!py-6 sm:!py-8 lg:!py-9"
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Offerte aanvragen', href: '/offerte-aanvragen' },
        ]}
        eyebrow="Offerte"
        title="Offerte aanvragen"
        titleClassName="text-[clamp(1.5rem,3.2vw,2.35rem)]"
        intro="Vier korte stappen: wat u wilt laten doen, de situatie, uw gegevens en een controle. Dit is een aanvraag, geen automatisch voorstel."
        narrow
      />
      <Section className="!py-6 sm:!py-8 lg:!py-10">
        <Container className="max-w-3xl">
          <p className="mb-5 text-sm text-ink-muted">
            Na het versturen nemen we contact op om de vraag scherp te krijgen.
          </p>
          <QuoteForm />
        </Container>
      </Section>
      <PhoneFallback text="Liever telefonisch een offerte voorbereiden? Bel ons of gebruik de contactpagina." />
    </>
  )
}
