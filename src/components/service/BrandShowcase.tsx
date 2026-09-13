import { brandCopy, type BrandCategory, type InstallBrand } from '../../data/brands'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'
import { cn } from '../../lib/cn'

type BrandShowcaseProps = {
  category: BrandCategory
  brands: InstallBrand[]
}

function logoClass(brand: InstallBrand) {
  const ratio = (brand.logoWidth ?? 1) / (brand.logoHeight ?? 1)
  if (ratio > 8) {
    return 'max-h-8 max-w-[min(100%,13.5rem)] sm:max-h-9 sm:max-w-[min(100%,14.5rem)]'
  }
  if (ratio > 4.5) {
    // Wide wordmarks (Daikin, Kaisai, Haier)
    return 'max-h-8 max-w-[min(100%,11.5rem)] sm:max-h-9 sm:max-w-[min(100%,12.5rem)]'
  }
  if (ratio < 1.6) {
    // More compact marks (LG circle + word)
    return 'max-h-10 max-w-[min(100%,8.5rem)] sm:max-h-11 sm:max-w-[min(100%,9.5rem)]'
  }
  return 'max-h-9 max-w-[min(100%,10.5rem)] sm:max-h-10 sm:max-w-[min(100%,11.5rem)]'
}

export function BrandShowcase({ category, brands }: BrandShowcaseProps) {
  const copy = brandCopy[category]
  const withLogos = brands.every((brand) => Boolean(brand.logoSrc))
  const fiveUp = brands.length === 5

  return (
    <Section className="bg-paper section-grain">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">{copy.eyebrow}</p>
            <Heading as="h2" className="mt-2.5 sm:mt-3">
              {copy.title}
            </Heading>
            <p className="lead mt-3 sm:mt-4">{copy.text}</p>
          </div>
        </Reveal>
        <ul
          className={cn(
            'mt-6 gap-2.5 min-[390px]:gap-3 sm:mt-7 sm:gap-3.5',
            brands.length <= 4
              ? 'grid grid-cols-2 md:grid-cols-4'
              : fiveUp
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
            fiveUp &&
              'max-sm:[&>li:last-child]:col-span-2 max-sm:[&>li:last-child]:mx-auto max-sm:[&>li:last-child]:w-[calc(50%-0.3125rem)]',
          )}
        >
          {brands.map((brand, index) => (
            <li key={brand.id}>
              <Reveal delay={index * 70}>
                <div
                  className={cn(
                    'flex items-center justify-center border border-line bg-white',
                    withLogos
                      ? 'h-[6.75rem] px-4 py-5 transition-[border-color,background-color] duration-[var(--duration-base)] sm:h-[7.25rem] sm:px-5 hover:border-brand/30 hover:bg-brand-soft/20'
                      : 'min-h-16 px-3 py-4 sm:min-h-[4.75rem]',
                  )}
                >
                  {brand.logoSrc ? (
                    <div className="flex w-full flex-col items-center justify-center gap-2">
                      <img
                        src={brand.logoSrc}
                        alt=""
                        width={brand.logoWidth}
                        height={brand.logoHeight}
                        decoding="async"
                        className={cn('h-auto w-auto object-contain object-center', logoClass(brand))}
                      />
                      {(brand.logoWidth ?? 1) / (brand.logoHeight ?? 1) > 8 ? (
                        <span className="text-[0.7rem] font-medium tracking-[0.04em] text-ink-muted">
                          {brand.name}
                        </span>
                      ) : (
                        <span className="sr-only">{brand.name}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-center text-[0.95rem] font-semibold tracking-[-0.015em] text-ink">
                      {brand.name}
                    </span>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
