import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { cn } from '../lib/cn'

type RevealProps = {
  className?: string
  children: ReactNode
  delay?: number
  /** Soft scale on nested images when the block enters view. */
  image?: boolean
}

export function Reveal({ className, children, delay = 0, image = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('reveal-block', image && 'reveal-image', className)}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
