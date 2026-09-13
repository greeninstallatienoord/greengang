import { brandCopy, type InstallBrand } from '../../data/brands'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

type BrandShowcaseProps = {
  category: 'airco' | 'warmtepomp'
  brands: InstallBrand[]
}

export function BrandShowcase({ category, brands }: BrandShowcaseProps) {
  const copy = brandCopy[category]

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
              ? 'mt-6 grid grid-cols-2 gap-2.5 min-[390px]:gap-3 sm:mt-8 sm:grid-cols-4'
              : 'mt-6 grid grid-cols-2 gap-2.5 min-[390px]:gap-3 sm:mt-8 sm:grid-cols-3 lg:grid-cols-5'
          }
        >
          {brands.map((brand) => (
            <li
              key={brand.id}
              className="flex min-h-16 items-center justify-center border border-line bg-surface px-3 py-4 text-center sm:min-h-[4.75rem]"
            >
              <span className="text-[0.95rem] font-semibold tracking-[-0.015em] text-ink">
                {brand.name}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
