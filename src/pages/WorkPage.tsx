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
        <Container className="py-7 sm:py-9 lg:py-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Werk', href: '/werk' },
            ]}
          />
          <p className="eyebrow mt-5">Werk uit de praktijk</p>
          <h1 className="mt-3 max-w-xl font-display text-[clamp(1.7rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em]">
            Een selectie van installaties die we in de praktijk hebben uitgevoerd.
          </h1>
        </Container>
      </header>

      <section className="bg-paper pb-12 pt-6 sm:pb-16 sm:pt-7 lg:pb-20">
        <Container>
          <div
            className="flex flex-wrap gap-x-4 gap-y-2 border-b border-line pb-3"
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
                    ? 'text-ink underline decoration-brand decoration-2 underline-offset-8'
                    : 'text-ink-muted hover:text-ink',
                )}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div id="werk-portfolio" className="mt-6 sm:mt-8" role="tabpanel">
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
