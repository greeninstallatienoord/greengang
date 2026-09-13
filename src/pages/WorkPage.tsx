import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Lightbox } from '../components/media/Lightbox'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { CTASection } from '../components/sections/CTASection'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { WorkPortfolio } from '../components/work/WorkPortfolio'
import { workCategoryLabels, type WorkCategory } from '../data/media'
import {
  WORK_PAGE_INITIAL_COUNT,
  workShots,
  type WorkFilterId,
} from '../data/mediaGallery'
import { pageSeo } from '../data/seo'
import { services } from '../data/services'
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
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? workShots
        : workShots.filter((shot) => shot.category === (filter as WorkCategory)),
    [filter],
  )

  const visible =
    filter === 'all' && !expanded
      ? filtered.slice(0, WORK_PAGE_INITIAL_COUNT)
      : filtered

  const canExpand =
    filter === 'all' && filtered.length > WORK_PAGE_INITIAL_COUNT && !expanded

  function selectFilter(next: WorkFilterId) {
    setFilter(next)
    setExpanded(false)
    setOpenIndex(null)
  }

  return (
    <>
      <PageMeta {...pageSeo.work} />
      <PageHero
        compact
        className="!py-6 sm:!py-8 lg:!py-9"
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Werk', href: '/werk' },
        ]}
        eyebrow="Portfolio"
        title="Werk uit de praktijk"
        titleClassName="max-w-[12ch] text-[clamp(1.5rem,3.2vw,2.45rem)] leading-[1.12] sm:max-w-[18ch] xl:max-w-none"
        intro="Een selectie van cv-ketel-, airco- en warmtepompinstallaties die we in de praktijk hebben uitgevoerd."
        copyClassName="max-w-2xl"
      />

      <Section className="!py-6 sm:!py-8 lg:!py-10">
        <Container>
          <div
            className="-mx-3.5 flex gap-1 overflow-x-auto border-b border-line px-3.5 pb-1 [scrollbar-width:none] min-[375px]:-mx-4 min-[375px]:px-4 sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Filter op type installatie"
          >
            {filters.map((item) => {
              const count =
                item.id === 'all'
                  ? workShots.length
                  : workShots.filter((shot) => shot.category === item.id).length
              if (item.id !== 'all' && count === 0) return null
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === item.id}
                  aria-controls="werk-portfolio"
                  id={`werk-filter-${item.id}`}
                  className={cn(
                    'shrink-0 px-3 py-3 text-sm font-semibold tracking-[-0.01em] transition-colors',
                    'min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                    filter === item.id
                      ? 'text-ink underline decoration-brand decoration-2 underline-offset-8'
                      : 'text-ink-muted hover:text-ink',
                  )}
                  onClick={() => selectFilter(item.id)}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <div
            id="werk-portfolio"
            className="mt-5 sm:mt-7"
            role="tabpanel"
            aria-labelledby={`werk-filter-${filter}`}
          >
            {visible.length > 0 ? (
              <WorkPortfolio shots={visible} onOpen={setOpenIndex} />
            ) : (
              <p className="text-ink-muted">Geen foto’s in deze categorie.</p>
            )}
          </div>

          {canExpand ? (
            <div className="mt-8 flex justify-center pb-14 sm:mt-10 sm:pb-0">
              <Button
                type="button"
                variant="secondary"
                className="min-h-11 px-5"
                onClick={() => setExpanded(true)}
              >
                Meer projecten tonen
                <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </Container>
      </Section>

      {openIndex != null ? (
        <Lightbox
          items={visible}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndex={setOpenIndex}
        />
      ) : null}

      <RelatedServices
        services={services}
        title="Onze diensten"
        columns={4}
      />
      <CTASection
        eyebrow="Interesse?"
        title="Ook een installatie laten uitvoeren?"
        text="Bespreek uw situatie met ons. We denken graag mee over een passende oplossing."
        image={null}
      />
    </>
  )
}
