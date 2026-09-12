import { site } from '../data/site'

export type SeoInput = {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}

export function applySeo({
  title,
  description,
  path,
  image = '/og-image.jpg',
  imageAlt = site.name,
  type = 'website',
  noIndex = false,
  publishedTime,
  modifiedTime,
}: SeoInput): void {
  const fullTitle =
    title === site.name ? site.name : `${title} | ${site.name}`
  const url = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)

  document.title = fullTitle
  setMeta('description', description)
  setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow')
  setLink('canonical', url)
  setMeta('og:title', fullTitle, 'property')
  setMeta('og:description', description, 'property')
  setMeta('og:type', type, 'property')
  setMeta('og:url', url, 'property')
  setMeta('og:image', imageUrl, 'property')
  setMeta('og:image:alt', imageAlt, 'property')
  setMeta('og:locale', site.locale, 'property')
  setMeta('og:site_name', site.name, 'property')
  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', fullTitle)
  setMeta('twitter:description', description)
  setMeta('twitter:image', imageUrl)
  setMeta('twitter:image:alt', imageAlt)
  setMeta('geo.region', `${site.contact.countryCode}-${site.contact.region.slice(0, 2).toUpperCase()}`)
  setMeta('geo.placename', `${site.contact.city}, ${site.contact.region}`)
  if (type === 'article' && publishedTime) {
    setMeta('article:published_time', publishedTime, 'property')
  }
  if (type === 'article' && modifiedTime) {
    setMeta('article:modified_time', modifiedTime, 'property')
  }
}

function setMeta(
  name: string,
  content: string,
  attribute: 'name' | 'property' = 'name',
): void {
  let element = document.head.querySelector(
    `meta[${attribute}="${name}"]`,
  ) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setLink(rel: string, href: string): void {
  let element = document.head.querySelector(
    `link[rel="${rel}"]`,
  ) as HTMLLinkElement | null
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}
