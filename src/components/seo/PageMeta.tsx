import { useSeo } from '../../hooks/useSeo'
import type { SeoInput } from '../../lib/seo'
import { JsonLd } from './JsonLd'

type PageMetaProps = SeoInput & {
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export function PageMeta({ jsonLd, ...seo }: PageMetaProps) {
  useSeo(seo)
  return jsonLd ? <JsonLd data={jsonLd} /> : null
}
