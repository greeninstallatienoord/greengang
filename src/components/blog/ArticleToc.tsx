import { useEffect, useState, type RefObject } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/cn'

type ArticleReadingProgressProps = {
  /** Element that defines the reading range (usually the article body). */
  targetRef: RefObject<HTMLDivElement | null>
}

/**
 * Thin green progress line under the sticky site header.
 * Decorative only — does not convey required information.
 */
export function ArticleReadingProgress({ targetRef }: ArticleReadingProgressProps) {
  const reduced = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (reduced) return

    const update = () => {
      const target = targetRef.current
      if (!target) return
      const rect = target.getBoundingClientRect()
      const total = target.offsetHeight - window.innerHeight * 0.35
      if (total <= 0) {
        setProgress(rect.bottom <= window.innerHeight ? 1 : 0)
        return
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      setProgress(scrolled / total)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [reduced, targetRef])

  if (reduced) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[35] h-0.5 bg-transparent"
      style={{ top: 'var(--header-offset)' }}
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-brand transition-[transform] duration-100 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

type ArticleTocProps = {
  sections: { id: string; heading: string }[]
  className?: string
  /** Compact chips for mobile placement. */
  variant?: 'sidebar' | 'mobile'
}

export function ArticleToc({
  sections,
  className,
  variant = 'sidebar',
}: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null)

  useEffect(() => {
    if (sections.length === 0) return

    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node))

    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]
        if (top?.target.id) setActiveId(top.target.id)
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [sections])

  if (sections.length <= 1) return null

  if (variant === 'mobile') {
    return (
      <nav
        aria-label="Inhoudsopgave"
        className={cn('article-toc article-toc--mobile', className)}
      >
        <p className="article-toc__label">In dit artikel</p>
        <ol className="article-toc__chips">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={cn(
                  'article-toc__chip',
                  activeId === section.id && 'is-active',
                )}
              >
                {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  return (
    <nav
      aria-label="Inhoudsopgave"
      className={cn('article-toc article-toc--sidebar', className)}
    >
      <p className="article-toc__label">Inhoud</p>
      <ol className="article-toc__list">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={cn(
                'article-toc__link',
                activeId === section.id && 'is-active',
              )}
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
