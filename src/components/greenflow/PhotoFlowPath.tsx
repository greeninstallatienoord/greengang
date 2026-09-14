import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { gsap, registerGreenFlowGsap, ScrollTrigger } from './gsapSetup'

type PhotoFlowPathProps = {
  className?: string
}

/**
 * Visible technical connector between About project photos (desktop).
 * GSAP: draw on enter, then looping traveler pulse.
 */
export function PhotoFlowPath({ className }: PhotoFlowPathProps) {
  const rootRef = useRef<SVGSVGElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    registerGreenFlowGsap()

    const path = root.querySelector<SVGPathElement>('.photo-flow__path')
    const node = root.querySelector<SVGCircleElement>('.photo-flow__node')
    const traveler = root.querySelector<SVGCircleElement>('.photo-flow__traveler')
    if (!path || !node || !traveler) return

    const length = path.getTotalLength()
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0, opacity: 1 })
        gsap.set([node, traveler], { opacity: 0.85 })
        return
      }

      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 })
      gsap.set(node, { opacity: 0, scale: 0.5 })
      gsap.set(traveler, { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 75%',
          once: true,
        },
      })

      tl.to(path, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out' })
        .to(node, { opacity: 1, scale: 1, duration: 0.35 }, '-=0.35')
        .add(() => {
          gsap.set(traveler, { opacity: 0.95 })
          gsap.to(traveler, {
            motionPath: {
              path,
              align: path,
              alignOrigin: [0.5, 0.5],
            },
            duration: 7.5,
            ease: 'none',
            repeat: -1,
          })
          gsap.set(path, {
            strokeDasharray: `${Math.max(40, length * 0.12)} ${length}`,
          })
          gsap.to(path, {
            strokeDashoffset: -length,
            duration: 14,
            ease: 'none',
            repeat: -1,
          })
        })
    }, root)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === root) trigger.kill()
      })
    }
  }, [reduced])

  return (
    <svg
      ref={rootRef}
      className={cn(
        'photo-flow pointer-events-none absolute inset-x-[6%] top-[40%] z-[1] hidden h-28 w-[88%] text-brand-dark lg:block',
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
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle className="photo-flow__node" cx="400" cy="48" r="5" fill="currentColor" />
      <circle className="photo-flow__traveler" r="4.5" cx="40" cy="28" fill="currentColor" />
    </svg>
  )
}
