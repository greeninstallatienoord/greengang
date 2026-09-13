import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export type GreenFlowVariant =
  | 'airflow'
  | 'hydronic'
  | 'thermal'
  | 'service'
  | 'regional'

type TechnicalBackdropProps = {
  variant: GreenFlowVariant
  className?: string
  /** Draw paths once when entering view. */
  draw?: boolean
  /** Extremely slow ambient dash movement (desktop only). */
  ambient?: boolean
  /** Soften pattern on the left (text) side. */
  mask?: 'left' | 'right' | 'center' | 'none'
}

/**
 * Decorative GreenFlow SVG — installation-inspired technical line art.
 * Never carries meaning; always aria-hidden.
 */
export function TechnicalBackdrop({
  variant,
  className,
  draw = true,
  ambient = false,
  mask = 'left',
}: TechnicalBackdropProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(!draw || reduced)
  const uid = useId().replace(/:/g, '')

  useEffect(() => {
    if (!draw || reduced) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [draw, reduced])

  return (
    <div
      ref={ref}
      className={cn(
        'greenflow pointer-events-none absolute inset-0 overflow-hidden',
        `greenflow--${variant}`,
        mask !== 'none' && `greenflow-mask-${mask}`,
        visible && 'is-visible',
        ambient && !reduced && 'greenflow--ambient',
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <VariantPaths variant={variant} uid={uid} />
      </svg>
    </div>
  )
}

function VariantPaths({ variant, uid }: { variant: GreenFlowVariant; uid: string }) {
  switch (variant) {
    case 'airflow':
      return (
        <g className="greenflow-paths" stroke="currentColor" strokeLinecap="round" fill="none">
          <path
            className="greenflow-path greenflow-path--a"
            d="M-40 180 C 180 40, 360 320, 560 160 S 900 40, 1240 220"
            strokeWidth="1.1"
            pathLength={1}
          />
          <path
            className="greenflow-path greenflow-path--b"
            d="M-20 300 C 220 180, 400 420, 640 260 S 980 140, 1260 340"
            strokeWidth="0.9"
            pathLength={1}
          />
          <path
            className="greenflow-path greenflow-path--c"
            d="M40 460 C 280 360, 480 560, 720 400 S 1040 280, 1280 480"
            strokeWidth="0.85"
            pathLength={1}
          />
          <path
            className="greenflow-path greenflow-path--d max-md:hidden"
            d="M120 120 C 300 200, 420 80, 620 180 S 920 280, 1180 120"
            strokeWidth="0.7"
            pathLength={1}
          />
        </g>
      )
    case 'hydronic':
      return (
        <g className="greenflow-paths" stroke="currentColor" strokeLinecap="square" fill="none">
          <path
            className="greenflow-path greenflow-path--a"
            d="M80 120 H420 V280 H720 V180 H980 V360 H1180"
            strokeWidth="1.05"
            pathLength={1}
          />
          <path
            className="greenflow-path greenflow-path--b"
            d="M140 420 H360 V520 H640 V440 H900 V560 H1120"
            strokeWidth="0.9"
            pathLength={1}
          />
          <path
            className="greenflow-path greenflow-path--c max-md:hidden"
            d="M200 200 H320 V340 H560"
            strokeWidth="0.75"
            pathLength={1}
          />
          <circle className="greenflow-node" cx="420" cy="120" r="3.2" />
          <circle className="greenflow-node" cx="720" cy="280" r="3.2" />
          <circle className="greenflow-node" cx="980" cy="180" r="2.8" />
          <circle className="greenflow-node" cx="640" cy="520" r="2.8" />
          <circle className="greenflow-pulse" cx="720" cy="280" r="2" />
        </g>
      )
    case 'thermal':
      return (
        <g className="greenflow-paths" stroke="currentColor" strokeLinecap="round" fill="none">
          <path
            className="greenflow-path greenflow-path--a"
            d="M60 400 C 200 520, 320 220, 480 360 S 740 540, 920 300 S 1120 160, 1240 280"
            strokeWidth="1.05"
            pathLength={1}
          />
          <path
            className="greenflow-path greenflow-path--b"
            d="M100 240 C 260 160, 380 300, 540 200 S 820 80, 1080 200"
            strokeWidth="0.85"
            pathLength={1}
          />
          <path
            className="greenflow-path greenflow-path--c max-md:hidden"
            d="M180 520 C 360 460, 500 580, 700 480 S 1000 400, 1200 520"
            strokeWidth="0.75"
            pathLength={1}
          />
          <circle className="greenflow-node" cx="480" cy="360" r="3" />
          <circle className="greenflow-node" cx="920" cy="300" r="3" />
        </g>
      )
    case 'service':
      return (
        <g className="greenflow-paths" stroke="currentColor" strokeLinecap="round" fill="none">
          <path
            className="greenflow-path greenflow-path--a"
            d="M160 160 V280 H400 V400 H680 V300 H960 V420 H1140"
            strokeWidth="1"
            pathLength={1}
          />
          <path
            className="greenflow-path greenflow-path--b max-md:hidden"
            d="M240 480 H520 V560 H820"
            strokeWidth="0.8"
            pathLength={1}
          />
          <circle className="greenflow-node" cx="160" cy="160" r="3.4" />
          <circle className="greenflow-node" cx="400" cy="280" r="3.2" />
          <circle className="greenflow-node" cx="680" cy="400" r="3.2" />
          <circle className="greenflow-node" cx="960" cy="300" r="3.2" />
          <path
            className="greenflow-check"
            d="M948 292 l6 7 12-14"
            strokeWidth="1.2"
            id={`${uid}-check`}
            pathLength={1}
          />
        </g>
      )
    case 'regional':
      return (
        <g className="greenflow-paths" stroke="currentColor" strokeLinecap="round" fill="none">
          <circle className="greenflow-node greenflow-node--hub" cx="620" cy="340" r="4.5" />
          <path
            className="greenflow-path greenflow-path--a"
            d="M620 340 C 560 260, 480 200, 400 150"
            strokeWidth="1"
            pathLength={1}
          />
          <path
            className="greenflow-path greenflow-path--b"
            d="M620 340 C 680 420, 760 480, 860 520"
            strokeWidth="1"
            pathLength={1}
          />
          <path
            className="greenflow-path greenflow-path--c"
            d="M620 340 C 520 360, 400 380, 280 360"
            strokeWidth="1"
            pathLength={1}
          />
          <circle className="greenflow-node" cx="400" cy="150" r="3" />
          <circle className="greenflow-node" cx="860" cy="520" r="3" />
          <circle className="greenflow-node" cx="280" cy="360" r="3" />
        </g>
      )
    default:
      return null
  }
}

type SectionShellProps = {
  variant: GreenFlowVariant
  children: ReactNode
  className?: string
  ambient?: boolean
  mask?: TechnicalBackdropProps['mask']
}

/** Relative section wrapper that hosts a TechnicalBackdrop behind children. */
export function GreenFlowSection({
  variant,
  children,
  className,
  ambient = false,
  mask = 'right',
}: SectionShellProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <TechnicalBackdrop variant={variant} ambient={ambient} mask={mask} />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
