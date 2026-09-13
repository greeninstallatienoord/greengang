import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, Mail, Phone, Search, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ButtonLink } from '../components/ButtonLink'
import { Container } from '../components/Container'
import { FAQ } from '../components/FAQ'
import { Heading } from '../components/Heading'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import {
  faqCategories,
  faqCountByCategory,
  faqPreviewLimits,
  faqs,
  filterFaqs,
  type FaqCategoryName,
} from '../data/faq'
import { pageSeo } from '../data/seo'
import { site } from '../data/site'
import { faqJsonLd, localBusinessJsonLd } from '../lib/jsonld'
import { cn } from '../lib/cn'
import type { FaqItem } from '../types'

const ALL = 'Alle'
const categoryOptions = [ALL, ...faqCategories] as const
type CategoryFilter = (typeof categoryOptions)[number]

const faqLd = faqJsonLd(faqs)
const counts = faqCountByCategory()

function isFaqCategory(name: string): name is FaqCategoryName {
  return (faqCategories as readonly string[]).includes(name)
}

function previewLimit(name: string): number {
  if (!isFaqCategory(name)) return 3
  return faqPreviewLimits[name]
}

function resolveHashFaq(hash: string): FaqItem | null {
  const raw = hash.replace(/^#/, '')
  if (!raw) return null
  return faqs.find((item) => item.id === raw) ?? null
}

export function FaqPage() {
  const { hash } = useLocation()
  const hashFaq = resolveHashFaq(hash)
  return (
    <>
      <PageMeta
        {...pageSeo.faq}
        jsonLd={[localBusinessJsonLd(), ...(faqLd ? [faqLd] : [])]}
      />
      <FaqPageContent key={hash || 'faq-root'} hashFaq={hashFaq} />
    </>
  )
}

function FaqPageContent({ hashFaq }: { hashFaq: FaqItem | null }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>(
    () => (hashFaq ? (hashFaq.category as CategoryFilter) : ALL),
  )
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!hashFaq) return
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hashFaq.id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [hashFaq])

  const searching = query.trim().length > 0
  const preferredOpenId =
    hashFaq && (category === ALL || category === hashFaq.category)
      ? hashFaq.id
      : null

  const filtered = useMemo(
    () => filterFaqs(query, searching ? ALL : category),
    [category, query, searching],
  )

  const groups = useMemo(() => {
    return faqCategories
      .map((name) => {
        const items = filtered.filter((item) => item.category === name)
        if (items.length === 0) return null
        const limit =
          !searching && category === ALL ? previewLimit(name) : items.length
        return {
          name,
          items: items.slice(0, limit),
          total: items.length,
          truncated: items.length > limit,
        }
      })
      .filter((group): group is NonNullable<typeof group> => Boolean(group))
  }, [category, filtered, searching])

  const singleCategoryItems = useMemo(() => {
    if (category === ALL || searching) return [] as FaqItem[]
    return filtered
  }, [category, filtered, searching])

  const resultCount = filtered.length

  const clearSearch = () => {
    setQuery('')
    searchRef.current?.focus()
  }

  const selectCategory = (next: CategoryFilter) => {
    setCategory(next)
    if (query.trim()) setQuery('')
  }

  return (
    <>
      <section className="border-b border-line bg-paper">
        <Container className="py-6 sm:py-8 lg:py-9">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Veelgestelde vragen', href: '/veelgestelde-vragen' },
            ]}
          />
          <p className="eyebrow mt-5">Vragen & antwoorden</p>
          <Heading as="h1" className="mt-2.5 max-w-2xl text-balance">
            Veelgestelde vragen
          </Heading>
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-muted sm:mt-3.5 sm:text-base">
            Vind snel antwoord op vragen over cv-ketels, airconditioning,
            warmtepompen, onderhoud, offertes en afspraken.
          </p>

          <div className="relative mt-5 max-w-2xl sm:mt-6">
            <label htmlFor="faq-search" className="sr-only">
              Zoek in veelgestelde vragen
            </label>
            <Search
              size={18}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                if (event.target.value.trim()) setCategory(ALL)
              }}
              placeholder="Zoek bijvoorbeeld op warmtepomp, onderhoud of offerte"
              className="min-h-12 w-full rounded-sm border border-line bg-surface py-3 pl-11 pr-11 text-base outline-none transition-[border-color] duration-[var(--duration-fast)] placeholder:text-ink-muted/80 focus:border-brand"
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                className="absolute right-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center text-ink-muted hover:text-ink"
                onClick={clearSearch}
                aria-label="Wis zoekopdracht"
              >
                <X size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="text-ink-muted">Geen antwoord gevonden?</span>
            <a
              href={site.contact.phoneHref}
              className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-ink underline-offset-2 hover:underline"
            >
              <Phone size={14} strokeWidth={1.75} aria-hidden="true" />
              Bel ons
            </a>
            <Link
              to="/contact"
              className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-ink underline-offset-2 hover:underline"
            >
              <Mail size={14} strokeWidth={1.75} aria-hidden="true" />
              Contact
            </Link>
            <Link
              to="/afspraak-maken"
              className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-ink underline-offset-2 hover:underline"
            >
              <CalendarDays size={14} strokeWidth={1.75} aria-hidden="true" />
              Afspraak aanvragen
            </Link>
          </div>
        </Container>

        <div
          className={cn(
            'sticky z-30 border-t border-line bg-paper/96 backdrop-blur-md lg:hidden',
            'top-[var(--header-offset)]',
          )}
        >
          <div className="relative">
            <div
              className="flex gap-2 overflow-x-auto overscroll-x-contain px-3.5 py-3 min-[375px]:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Onderwerpen"
            >
              {categoryOptions.map((item) => {
                const selected = !searching && category === item
                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={cn(
                      'shrink-0 touch-manipulation rounded-sm border px-3 py-2 text-sm font-semibold transition-[background-color,border-color,color] duration-[var(--duration-fast)]',
                      selected
                        ? 'border-brand-dark bg-brand-deep text-white'
                        : 'border-line bg-surface text-ink-muted hover:border-ink/25 hover:text-ink',
                    )}
                    onClick={() => selectCategory(item)}
                  >
                    {item}
                    <span
                      className={cn(
                        'ml-1.5 tabular-nums',
                        selected ? 'text-white/70' : 'text-ink-muted/80',
                      )}
                    >
                      {counts[item] ?? 0}
                    </span>
                  </button>
                )
              })}
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-paper to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <Section className="!py-6 sm:!py-8 lg:!py-10">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,15.5rem)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-offset)+1rem)]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
                Onderwerp
              </p>
              <nav className="mt-3" aria-label="FAQ-categorieën">
                <ul className="grid gap-0.5">
                  {categoryOptions.map((item) => {
                    const selected = !searching && category === item
                    return (
                      <li key={item}>
                        <button
                          type="button"
                          aria-current={selected ? 'true' : undefined}
                          className={cn(
                            'flex min-h-10 w-full items-center justify-between gap-3 rounded-sm px-2.5 py-2 text-left text-sm font-semibold transition-[background-color,color] duration-[var(--duration-fast)]',
                            selected
                              ? 'bg-brand-soft text-brand-dark'
                              : 'text-ink-muted hover:bg-stone/60 hover:text-ink',
                          )}
                          onClick={() => selectCategory(item)}
                        >
                          <span>{item}</span>
                          <span className="tabular-nums text-ink-muted/80">
                            {counts[item] ?? 0}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="mt-6 border-t border-line pt-5">
                <p className="text-sm font-semibold tracking-[-0.01em]">
                  Staat uw vraag er niet tussen?
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  Bel{' '}
                  <a
                    href={site.contact.phoneHref}
                    className="font-semibold text-ink underline-offset-2 hover:underline"
                  >
                    {site.contact.phone}
                  </a>{' '}
                  of stuur een bericht. We helpen u graag verder.
                </p>
              </div>
            </div>
          </aside>

          <div className="min-w-0 max-w-3xl">
            {searching ? (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-ink-muted">
                  {resultCount === 0
                    ? 'Geen resultaten'
                    : `${resultCount} ${resultCount === 1 ? 'resultaat' : 'resultaten'} voor “${query.trim()}”`}
                </p>
                <button
                  type="button"
                  className="text-sm font-semibold text-ink underline-offset-2 hover:underline"
                  onClick={clearSearch}
                >
                  Wis zoekopdracht
                </button>
              </div>
            ) : category !== ALL ? (
              <div className="mb-4">
                <Heading as="h2" className="text-[clamp(1.25rem,2.4vw,1.65rem)]">
                  {category}
                </Heading>
                <p className="mt-1 text-sm text-ink-muted">
                  {singleCategoryItems.length}{' '}
                  {singleCategoryItems.length === 1 ? 'vraag' : 'vragen'}
                </p>
              </div>
            ) : (
              <div className="mb-5 rounded-sm border border-line bg-paper px-4 py-3.5 sm:hidden">
                <p className="text-sm font-semibold">Staat uw vraag er niet tussen?</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Bel{' '}
                  <a href={site.contact.phoneHref} className="font-semibold text-ink">
                    {site.contact.phone}
                  </a>{' '}
                  of{' '}
                  <Link
                    to="/contact"
                    className="font-semibold text-ink underline-offset-2 hover:underline"
                  >
                    stuur een bericht
                  </Link>
                  .
                </p>
              </div>
            )}

            {resultCount === 0 ? (
              <div className="border border-line bg-paper p-5 sm:p-7">
                <Heading as="h2" className="text-[1.35rem]">
                  Geen antwoord gevonden
                </Heading>
                <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-ink-muted">
                  Probeer een ander zoekwoord of neem contact met ons op. We denken
                  graag mee over uw situatie.
                </p>
                <div className="mt-5 flex w-full max-w-md flex-col gap-2 min-[400px]:flex-row">
                  <ButtonLink to={site.contact.phoneHref} external className="min-h-11">
                    Bel {site.contact.phone}
                  </ButtonLink>
                  <ButtonLink to="/contact" variant="secondary" className="min-h-11">
                    Contact opnemen
                  </ButtonLink>
                </div>
                {searching ? (
                  <button
                    type="button"
                    className="mt-4 text-sm font-semibold underline underline-offset-2"
                    onClick={clearSearch}
                  >
                    Wis zoekopdracht
                  </button>
                ) : null}
              </div>
            ) : searching || category === ALL ? (
              <div className="grid gap-7 sm:gap-8">
                {groups.map((group) => (
                  <section
                    key={group.name}
                    aria-labelledby={`faq-group-${group.name}`}
                    className="scroll-mt-[calc(var(--header-offset)+0.75rem)]"
                  >
                    <div className="flex flex-wrap items-end justify-between gap-2 border-b border-line pb-2.5">
                      <Heading
                        as="h2"
                        id={`faq-group-${group.name}`}
                        className="text-[clamp(1.2rem,2.2vw,1.5rem)]"
                      >
                        {group.name}
                      </Heading>
                      <p className="text-sm text-ink-muted">
                        {group.truncated
                          ? `${group.items.length} van ${group.total}`
                          : `${group.total} ${group.total === 1 ? 'vraag' : 'vragen'}`}
                      </p>
                    </div>
                    <div className="mt-3">
                      <FAQ
                        key={`${group.name}-${preferredOpenId ?? 'closed'}`}
                        items={group.items}
                        exclusive
                        variant="panel"
                        preferredOpenId={preferredOpenId}
                      />
                    </div>
                    {group.truncated ? (
                      <button
                        type="button"
                        className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand-dark underline-offset-2 hover:underline"
                        onClick={() => selectCategory(group.name)}
                      >
                        Bekijk alle {group.total} vragen over{' '}
                        {group.name.toLowerCase()} →
                      </button>
                    ) : null}
                  </section>
                ))}
              </div>
            ) : (
              <FAQ
                key={`${category}-${preferredOpenId ?? 'closed'}`}
                items={singleCategoryItems}
                exclusive
                variant="panel"
                preferredOpenId={preferredOpenId}
              />
            )}
          </div>
        </Container>
      </Section>

      <CTASection
        eyebrow="Nog een vraag?"
        title="Niet gevonden wat u zocht?"
        text="Neem contact op of vraag een voorkeursmoment aan om uw situatie te bespreken. We denken graag mee."
        quoteTo="/contact"
        appointmentTo="/afspraak-maken"
        primaryLabel="Contact opnemen"
        secondaryLabel="Afspraak aanvragen"
        phoneLead="Liever bellen?"
        showEmergency={false}
        image={null}
      />
    </>
  )
}
