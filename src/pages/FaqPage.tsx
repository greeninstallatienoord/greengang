import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CtaPair } from '../components/CtaPair'
import { Container } from '../components/Container'
import { FAQ } from '../components/FAQ'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { faqCategories, faqs } from '../data/faq'
import { pageSeo } from '../data/seo'
import { services } from '../data/services'
import { faqJsonLd } from '../lib/jsonld'
import { cn } from '../lib/cn'

export function FaqPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Alle')

  const filtered = useMemo(() => {
    return faqs.filter((item) => {
      const matchCategory = category === 'Alle' || item.category === category
      const haystack = `${item.question} ${item.answer}`.toLowerCase()
      return matchCategory && haystack.includes(query.toLowerCase())
    })
  }, [category, query])

  return (
    <>
      <PageMeta {...pageSeo.faq} jsonLd={faqJsonLd(faqs) ?? undefined} />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Veelgestelde vragen', href: '/veelgestelde-vragen' },
        ]}
        eyebrow="Vragen"
        title="Veelgestelde vragen"
        intro="Antwoorden over installatie, onderhoud, offertes en afspraken. Zonder beloftes die we niet kunnen onderbouwen."
        actions={<CtaPair compact />}
      />
      <Section className="bg-paper">
        <Container>
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="faq-search">
              Zoek in vragen
            </label>
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Zoek op trefwoord"
              className="min-h-12 rounded-md border border-line px-3.5 text-base"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Alle', ...faqCategories].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                className={cn(
                  'min-h-11 rounded-md border px-3 text-sm font-semibold',
                  category === item
                    ? 'border-brand bg-brand-soft text-brand-dark'
                    : 'border-line bg-paper',
                )}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          {filtered.length === 0 ? (
            <p className="text-ink-muted">Geen vragen gevonden voor deze zoekopdracht.</p>
          ) : (
            <FAQ items={filtered} />
          )}
          <p className="mt-10 text-sm">
            <Link to="/blog" className="font-semibold underline">
              Artikelen in de kennisbank
            </Link>
          </p>
        </Container>
      </Section>
      <RelatedServices services={services} />
      <CTASection />
    </>
  )
}
