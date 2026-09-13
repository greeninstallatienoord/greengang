import { blogCategoryLabels } from '../data/blog'
import { business, schemaOpeningHoursSpecification, verifiedSameAs } from '../data/business'
import { serviceArea } from '../data/region'
import { site } from '../data/site'
import { services } from '../data/services'
import type { BlogPost, ContentLink, FaqItem } from '../types'
import { absoluteUrl } from './seo'

export function businessEntityId(): string {
  return `${site.url}/#business`
}

function knownContact(): Record<string, unknown> {
  const extra: Record<string, unknown> = {
    telephone: business.phoneHref.replace('tel:', ''),
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      addressCountry: business.address.countryCode,
    },
    openingHoursSpecification: schemaOpeningHoursSpecification(),
    areaServed: serviceArea.provinces.map((province) => ({
      '@type': 'AdministrativeArea',
      name: province.name,
    })),
  }
  const sameAs = verifiedSameAs()
  if (sameAs.length > 0) extra.sameAs = sameAs
  return extra
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@type': ['LocalBusiness', 'HVACBusiness'],
    '@id': businessEntityId(),
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl('/logo.png'),
    image: absoluteUrl('/og-image.jpg'),
    description: site.shortDescription,
    identifier: {
      '@type': 'PropertyValue',
      name: 'KVK',
      value: business.kvk,
    },
    ...knownContact(),
  }
}

export function localBusinessJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    ...organizationJsonLd(),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Diensten',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          url: absoluteUrl(service.href),
          description: service.summary,
        },
      })),
    },
  }
}

export function serviceAreaPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Werkgebied | Installateur Groningen, Drenthe en Friesland',
    description: serviceArea.heroText,
    url: absoluteUrl('/werkgebied'),
    inLanguage: 'nl-NL',
    about: {
      '@id': businessEntityId(),
    },
    mentions: serviceArea.provinces.map((province) => ({
      '@type': 'AdministrativeArea',
      name: province.name,
    })),
    mainEntity: {
      '@type': 'Place',
      name: business.address.city,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.street,
        postalCode: business.address.postalCode,
        addressLocality: business.address.city,
        addressRegion: business.address.region,
        addressCountry: business.address.countryCode,
      },
    },
  }
}

export function contactPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact met Green Installatie Noord',
    url: absoluteUrl('/contact'),
    inLanguage: 'nl-NL',
    about: {
      '@id': businessEntityId(),
    },
    mainEntity: {
      '@id': businessEntityId(),
    },
  }
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: 'nl-NL',
    publisher: {
      '@id': businessEntityId(),
    },
  }
}

export function serviceJsonLd(name: string, path: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    provider: {
      '@id': businessEntityId(),
      ...organizationJsonLd(),
    },
  }
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function faqJsonLd(items: FaqItem[]): Record<string, unknown> | null {
  if (items.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function citationNodes(resources: ContentLink[] | undefined) {
  return (resources ?? [])
    .filter((item) => item.external)
    .map((item) => ({
      '@type': 'CreativeWork',
      name: item.label,
      url: item.href,
    }))
}

export function collectionPageJsonLd(input: {
  name: string
  description: string
  path: string
  items: { name: string; path: string }[]
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: 'nl',
    isPartOf: {
      '@type': 'WebSite',
      name: site.name,
      url: site.url,
    },
    about: {
      '@id': businessEntityId(),
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  }
}

export function articleJsonLd(post: BlogPost): Record<string, unknown> {
  const citations = citationNodes(post.resources)
  const path = `/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: 'nl',
    url: absoluteUrl(path),
    image: absoluteUrl('/og-image.jpg'),
    articleSection: blogCategoryLabels[post.category],
    keywords: post.tags.join(', '),
    author: {
      '@id': businessEntityId(),
    },
    publisher: {
      '@id': businessEntityId(),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(path),
    },
    isPartOf: {
      '@type': 'CollectionPage',
      '@id': absoluteUrl('/blog'),
      name: 'Advies & kennis',
    },
    about: post.relatedServiceSlugs.map((slug) => ({
      '@type': 'Service',
      url: absoluteUrl(`/${slug}`),
    })),
    ...(citations.length > 0 ? { citation: citations } : {}),
  }
}
