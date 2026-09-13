import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type PhotoFlowPathProps = {
  className?: string
}

/**
 * Abstract editorial connector between two About project photos.
 * Desktop-only visual; hidden on small screens.
 */
export function PhotoFlowPath({ className }: PhotoFlowPathProps) {
  const ref = useRef<SVGSVGElement>(null)
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(reduced)

  useEffect(() => {
    if (reduced) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <svg
      ref={ref}
      className={cn(
        'photo-flow pointer-events-none absolute inset-x-[8%] top-[42%] z-[1] hidden h-24 w-[84%] text-brand-dark lg:block',
        visible && 'is-visible',
        className,
      )}
      viewBox="0 0 800 96"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="photo-flow__path"
        d="M40 28 C 180 8, 280 78, 400 48 S 620 8, 760 56"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        pathLength={1}
      />
      <circle className="photo-flow__node" cx="400" cy="48" r="3.5" fill="currentColor" />
    </svg>
  )
}
