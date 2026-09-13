import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { homeProjectShots, workCategoryLabels } from '../../data/media'
import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { MediaImage } from '../media/MediaImage'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function HomeProjects() {
  if (homeProjectShots.length === 0) return null

  const [featured, ...rest] = homeProjectShots

  return (
    <Section id="werkzaamheden" className="scroll-mt-[calc(var(--header-offset)+0.75rem)] bg-paper">
      <Container>
        <Reveal>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end sm:gap-5">
            <div className="max-w-xl">
              <p className="eyebrow">Werk</p>
              <Heading as="h2" className="mt-2.5 sm:mt-3">
                {site.copy.workTitle}
              </Heading>
              <p className="lead mt-2.5 sm:mt-3">{site.copy.workText}</p>
            </div>
            <Link to="/werk" className="text-link inline-flex min-h-11 items-center shrink-0">
              Bekijk al het werk
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-5 sm:mt-7">
          {/* Mobile: featured + horizontal scroll */}
          <div className="lg:hidden">
            {featured ? (
              <Link to={featured.href ?? '/werk'} className="group block">
                <MediaImage
                  asset={featured.asset}
                  className="rounded-none"
                  imgClassName="transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                  ratio="4 / 3"
                  sizes="100vw"
                />
                <span className="mt-2.5 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
                  {workCategoryLabels[featured.category]}
                </span>
                <span className="mt-0.5 block font-semibold">{featured.title}</span>
              </Link>
            ) : null}
            {rest.length > 0 ? (
              <div className="-mx-3.5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3.5 pb-1 min-[375px]:-mx-4 min-[375px]:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {rest.map((shot) => (
                  <Link
                    key={shot.id}
                    to={shot.href ?? '/werk'}
                    className="group w-[min(78%,17.5rem)] shrink-0 snap-start"
                  >
                    <MediaImage
                      asset={shot.asset}
                      className="rounded-none"
                      imgClassName="transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                      ratio="4 / 3"
                      sizes="78vw"
                    />
                    <span className="mt-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
                      {workCategoryLabels[shot.category]}
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold">{shot.title}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {/* Desktop: equal grid */}
          <div className="hidden gap-4 lg:grid lg:grid-cols-3">
            {homeProjectShots.map((shot) => (
              <Link key={shot.id} to={shot.href ?? '/werk'} className="group min-w-0">
                <MediaImage
                  asset={shot.asset}
                  className="rounded-none"
                  imgClassName="transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                  ratio="4 / 3"
                  sizes="(min-width: 1024px) 32vw, 100vw"
                />
                <span className="mt-2.5 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
                  {workCategoryLabels[shot.category]}
                </span>
                <span className="mt-0.5 block font-semibold">{shot.title}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
