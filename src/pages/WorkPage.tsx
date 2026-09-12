import { useMemo, useState } from 'react'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Container } from '../components/Container'
import { Lightbox } from '../components/media/Lightbox'
import { CTASection } from '../components/sections/CTASection'
import { PageMeta } from '../components/seo/PageMeta'
import { WorkPortfolio } from '../components/work/WorkPortfolio'
import { workCategoryLabels, type WorkCategory } from '../data/media'
import { workShots, type WorkFilterId } from '../data/mediaGallery'
import { pageSeo } from '../data/seo'
import { cn } from '../lib/cn'

const filters: Array<{ id: WorkFilterId; label: string }> = [
  { id: 'all', label: 'Alle' },
  { id: 'cv-ketel', label: workCategoryLabels['cv-ketel'] },
  { id: 'airco', label: workCategoryLabels.airco },
  { id: 'warmtepomp', label: workCategoryLabels.warmtepomp },
]

export function WorkPage() {
  const [filter, setFilter] = useState<WorkFilterId>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const shots = useMemo(
    () =>
      filter === 'all'
        ? workShots
        : workShots.filter((shot) => shot.category === (filter as WorkCategory)),
    [filter],
  )

  return (
    <>
      <PageMeta {...pageSeo.work} />
      <header className="border-b border-line bg-paper">
        <Container className="py-8 sm:py-10 lg:py-14">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Werk', href: '/werk' },
            ]}
          />
          <p className="eyebrow mt-6 sm:mt-8">Werk uit de praktijk</p>
          <h1 className="mt-3 max-w-xl font-display text-[clamp(1.7rem,3vw,2.35rem)] font-medium leading-[1.2] tracking-[-0.02em]">
            Een selectie van installaties die we in de praktijk hebben uitgevoerd.
          </h1>
        </Container>
      </header>

      <section className="bg-paper pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pb-24">
        <Container>
          <div
            className="flex flex-wrap gap-x-5 gap-y-2 border-b border-line pb-4"
            role="tablist"
            aria-label="Filter op type installatie"
          >
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                aria-controls="werk-portfolio"
                className={cn(
                  'min-h-11 text-sm font-semibold tracking-[-0.01em] transition-colors',
                  filter === item.id
                    ? 'text-ink'
                    : 'text-ink-muted hover:text-ink',
                )}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div id="werk-portfolio" className="mt-7 sm:mt-10 lg:mt-14" role="tabpanel">
            {shots.length > 0 ? (
              <WorkPortfolio shots={shots} onOpen={setOpenIndex} />
            ) : (
              <p className="text-ink-muted">Geen foto’s in deze categorie.</p>
            )}
          </div>
        </Container>
      </section>

      {openIndex != null ? (
        <Lightbox
          items={shots}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndex={setOpenIndex}
        />
      ) : null}

      <CTASection
        title="Een vergelijkbare installatie?"
        text="Deze foto’s laten de afwerking zien, geen merkenlijst of standaardprijs. Voor een voorstel kijken we naar uw woning."
        image={null}
      />
    </>
  )
}
