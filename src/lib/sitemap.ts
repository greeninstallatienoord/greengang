/** Published copy: `public/sitemap.xml`. Keep that file in sync when routes change. */
import { blogCategoryOrder, blogPosts } from '../data/blog'
import { areas, areaHasServiceCopy, localServicePaths } from '../data/areas'
import { site } from '../data/site'
import { absoluteUrl } from './seo'

export type SitemapEntry = {
  path: string
  lastmod: string
  changefreq: 'weekly' | 'monthly'
  priority: string
}

const today = '2026-09-13'

const staticIndexable: SitemapEntry[] = [
  { path: '/', lastmod: today, changefreq: 'weekly', priority: '1.0' },
  { path: '/cv-ketel', lastmod: today, changefreq: 'monthly', priority: '0.9' },
  { path: '/airco', lastmod: today, changefreq: 'monthly', priority: '0.9' },
  { path: '/warmtepomp', lastmod: today, changefreq: 'monthly', priority: '0.9' },
  { path: '/service-onderhoud', lastmod: today, changefreq: 'monthly', priority: '0.9' },
  { path: '/over-ons', lastmod: today, changefreq: 'monthly', priority: '0.6' },
  { path: '/werk', lastmod: today, changefreq: 'monthly', priority: '0.7' },
  { path: '/werkgebied', lastmod: today, changefreq: 'monthly', priority: '0.6' },
  { path: '/blog', lastmod: today, changefreq: 'weekly', priority: '0.7' },
  { path: '/contact', lastmod: today, changefreq: 'monthly', priority: '0.7' },
  { path: '/offerte-aanvragen', lastmod: today, changefreq: 'monthly', priority: '0.8' },
  { path: '/afspraak-maken', lastmod: today, changefreq: 'monthly', priority: '0.7' },
  { path: '/veelgestelde-vragen', lastmod: today, changefreq: 'monthly', priority: '0.6' },
]

export function getIndexableEntries(): SitemapEntry[] {
  const categories = blogCategoryOrder.map((slug) => ({
    path: `/blog/categorie/${slug}`,
    lastmod: today,
    changefreq: 'monthly' as const,
    priority: '0.6',
  }))

  const articles = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: post.updatedAt,
    changefreq: 'monthly' as const,
    priority: '0.6',
  }))

  const localPages = areas.flatMap((area) => {
    const cityPage: SitemapEntry = {
      path: `/werkgebied/${area.slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
    }
    const servicePages = localServicePaths
      .filter((service) => areaHasServiceCopy(area, service))
      .map((service) => ({
        path: `/werkgebied/${area.slug}/${service}`,
        lastmod: today,
        changefreq: 'monthly' as const,
        priority: '0.7',
      }))
    return [cityPage, ...servicePages]
  })

  return [...staticIndexable, ...categories, ...articles, ...localPages]
}

export function sitemapXml(): string {
  const urls = getIndexableEntries()
    .map((entry) => {
      return `  <url>
    <loc>${absoluteUrl(entry.path)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export const sitemapOrigin = site.url
