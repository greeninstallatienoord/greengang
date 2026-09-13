import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CtaPair } from '../components/CtaPair'
import { Container } from '../components/Container'
import { FAQ } from '../components/FAQ'
import { Heading } from '../components/Heading'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { Reveal } from '../components/Reveal'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { faqCategories, faqs } from '../data/faq'
import { pageSeo } from '../data/seo'
import { services } from '../data/services'
import { breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd } from '../lib/jsonld'
import { cn } from '../lib/cn'

const faqLd = faqJsonLd(faqs)

function categoryAnchor(name: string) {
  return `faq-${name.toLowerCase().replace(/\s+/g, '-')}`
}

export function FaqPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Alle')

  const filtered = useMemo(() => {
    return faqs.filter((item) => {
      const matchCategory = category === 'Alle' || item.category === category
      const haystack = `${item.question} ${item.answer}`.toLowerCase()
      return matchCategory && haystack.includes(query.trim().toLowerCase())
    })
  }, [category, query])

  const groups = useMemo(
    () =>
      faqCategories
        .map((name) => ({
          name,
          items: filtered.filter((item) => item.category === name),
        }))
        .filter((group) => group.items.length > 0),
    [filtered],
  )

  return (
    <>
      <PageMeta
        {...pageSeo.faq}
        jsonLd={[
          localBusinessJsonLd(),
          ...(faqLd ? [faqLd] : []),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Veelgestelde vragen', path: '/veelgestelde-vragen' },
          ]),
        ]}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Veelgestelde vragen', href: '/veelgestelde-vragen' },
        ]}
        eyebrow="Vragen"
        title="Veelgestelde vragen"
        intro="Antwoorden over installatie, onderhoud, offertes en afspraken bij Green Installatie Noord."
        actions={<CtaPair equal />}
      />

      <Section className="bg-paper">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,17.5rem)_1fr] lg:items-start">
          <Reveal>
            <aside className="grid gap-4">
              <div>
                <label htmlFor="faq-search" className="mb-2 block text-sm font-semibold">
                  Zoeken
                </label>
                <input
                  id="faq-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Trefwoord, bijvoorbeeld airco"
                  className="min-h-12 w-full rounded-sm border border-line bg-surface px-3.5 text-base outline-none focus:border-brand"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Onderwerp</p>
                <div className="mt-2 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                  {['Alle', ...faqCategories].map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={category === item}
                      className={cn(
                        'min-h-11 px-1 text-sm font-semibold',
                        category === item
                          ? 'text-ink underline decoration-brand decoration-2 underline-offset-8'
                          : 'text-ink-muted hover:text-ink',
                      )}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <nav className="border border-line bg-paper p-5" aria-label="Gerelateerde pagina’s">
                <h2 className="font-semibold tracking-[-0.01em]">Vervolg</h2>
                <ul className="mt-3 grid gap-2 text-sm font-semibold">
                  <li>
                    <Link to="/contact" className="underline underline-offset-2">
                      Contact
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
                  <li>
                    <Link to="/blog" className="underline underline-offset-2">
                      Kennisbank
                    </Link>
                  </li>
                  <li>
                    <Link to="/werkgebied" className="underline underline-offset-2">
                      Werkgebied
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>
          </Reveal>

          <Reveal delay={50}>
            <div>
              {groups.length === 0 ? (
                <p className="text-ink-muted">Geen vragen gevonden voor deze zoekopdracht.</p>
              ) : (
                <div className="grid gap-8">
                  {groups.map((group) => (
                    <section key={group.name} id={categoryAnchor(group.name)}>
                      <Heading as="h2">{group.name}</Heading>
                      <p className="mt-1 text-sm text-ink-muted">
                        {group.items.length} {group.items.length === 1 ? 'vraag' : 'vragen'}
                      </p>
                      <div className="mt-3">
                        <FAQ items={group.items} />
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </Container>
      </Section>

      <RelatedServices services={services} title="Diensten" />
      <CTASection />
    </>
  )
}
