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
  const featured = homeProjectShots[0]
  const rest = homeProjectShots.slice(1)
  if (!featured) return null

  return (
    <Section id="werkzaamheden" className="bg-paper">
      <Container>
        <Reveal>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="eyebrow">Werk</p>
              <Heading as="h2" className="mt-3">
                {site.copy.workTitle}
              </Heading>
              <p className="lead mt-4">{site.copy.workText}</p>
            </div>
            <Link to="/werk" className="text-link shrink-0">
              Bekijk al het werk
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-8 sm:mt-10">
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
            <Link
              to={featured.href ?? '/werk'}
              className="group relative overflow-hidden lg:col-span-7"
            >
              <MediaImage
                asset={featured.asset}
                className="rounded-none min-h-56 sm:min-h-72 lg:min-h-[26rem]"
                ratio="4 / 5"
                sizes="(min-width: 1024px) 52vw, 100vw"
              />
              <span className="absolute inset-x-0 bottom-0 bg-ink/78 p-4 text-white sm:p-6">
                <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/70">
                  {workCategoryLabels[featured.category]}
                </span>
                <span className="mt-1 block font-semibold">{featured.title}</span>
              </span>
            </Link>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {rest.map((shot) => (
                <Link key={shot.id} to={shot.href ?? '/werk'} className="group">
                  <MediaImage
                    asset={shot.asset}
                    className="rounded-none"
                    ratio="4 / 3"
                    sizes="(min-width: 1024px) 34vw, 50vw"
                  />
                  <span className="mt-3 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
                    {workCategoryLabels[shot.category]}
                  </span>
                  <span className="mt-1 block font-semibold">{shot.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
