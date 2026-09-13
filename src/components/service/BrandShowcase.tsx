import { brandCopy, type InstallBrand } from '../../data/brands'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'
import { cn } from '../../lib/cn'

type BrandShowcaseProps = {
  category: 'airco' | 'warmtepomp'
  brands: InstallBrand[]
}

export function BrandShowcase({ category, brands }: BrandShowcaseProps) {
  const copy = brandCopy[category]
  const withLogos = brands.every((brand) => Boolean(brand.logoSrc))

  return (
    <Section className="bg-paper">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <Heading as="h2" className="mt-2.5 sm:mt-3">
            {copy.title}
          </Heading>
          <p className="lead mt-3 sm:mt-4">{copy.text}</p>
        </div>
        <ul
          className={
            brands.length <= 4
              ? 'mt-6 grid grid-cols-2 gap-2.5 min-[390px]:gap-3 sm:mt-7 sm:gap-3.5 md:grid-cols-4'
              : 'mt-6 grid grid-cols-2 gap-2.5 min-[390px]:gap-3 sm:mt-8 sm:grid-cols-3 lg:grid-cols-5'
          }
        >
          {brands.map((brand) => (
            <li key={brand.id}>
              <div
                className={cn(
                  'flex items-center justify-center border border-line bg-surface',
                  withLogos
                    ? 'h-[6.75rem] px-4 py-5 transition-colors duration-200 sm:h-[7.25rem] sm:px-5 hover:border-brand/30 hover:bg-white'
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
                      className={cn(
                        'h-auto w-auto object-contain object-center',
                        (brand.logoWidth ?? 1) / (brand.logoHeight ?? 1) > 8
                          ? 'max-h-8 max-w-[min(100%,13.5rem)] sm:max-h-9 sm:max-w-[min(100%,14.5rem)]'
                          : 'max-h-9 max-w-[min(100%,10.5rem)] sm:max-h-10 sm:max-w-[min(100%,11.5rem)]',
                      )}
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
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
