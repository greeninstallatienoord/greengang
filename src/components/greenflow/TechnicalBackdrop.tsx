import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { gsap, registerGreenFlowGsap, ScrollTrigger } from './gsapSetup'

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
  /** Continuous ambient loops after entry. Default true. */
  ambient?: boolean
  /** Soften pattern behind text. */
  mask?: 'left' | 'right' | 'center' | 'none'
  /** Stronger presence for signature sections. */
  intensity?: 'standard' | 'strong'
}

/**
 * Decorative GreenFlow SVG — installation-inspired technical line art + GSAP motion.
 * Never carries meaning; always aria-hidden.
 */
export function TechnicalBackdrop({
  variant,
  className,
  draw = true,
  ambient = true,
  mask = 'left',
  intensity = 'standard',
}: TechnicalBackdropProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const uid = useId().replace(/:/g, '')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    registerGreenFlowGsap()

    const paths = Array.from(
      root.querySelectorAll<SVGPathElement>('.greenflow-path'),
    )
    const nodes = Array.from(
      root.querySelectorAll<SVGCircleElement>('.greenflow-node'),
    )
    const travelers = Array.from(
      root.querySelectorAll<SVGCircleElement>('.greenflow-traveler'),
    )
    const check = root.querySelector<SVGPathElement>('.greenflow-check')
    const hub = root.querySelector<SVGCircleElement>('.greenflow-node--hub')

    const ctx = gsap.context(() => {
      // Prepare draw state
      paths.forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: draw && !reduced ? length : 0,
          opacity: 1,
        })
      })
      gsap.set(nodes, { opacity: reduced ? 0.85 : 0, scale: reduced ? 1 : 0.6 })
      gsap.set(travelers, { opacity: 0, visibility: 'hidden' })
      if (check) gsap.set(check, { opacity: reduced ? 0.9 : 0 })

      if (reduced) {
        gsap.set(paths, { strokeDashoffset: 0 })
        return
      }

      const isMobile = window.matchMedia('(max-width: 767px)').matches
      const travelerCount = isMobile
        ? Math.min(2, travelers.length)
        : travelers.length
      const activeTravelers = travelers.slice(0, travelerCount)

      const entry = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          once: true,
        },
      })

      paths.forEach((path, index) => {
        entry.to(
          path,
          {
            strokeDashoffset: 0,
            duration: 1.25,
            ease: 'power2.out',
          },
          index * 0.12,
        )
      })

      entry.to(
        nodes,
        {
          opacity: 0.9,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.55',
      )

      if (check) {
        entry.to(check, { opacity: 1, duration: 0.35 }, '-=0.2')
      }

      if (!ambient) return

      const startAmbient = () => {
        paths.forEach((path, index) => {
          const length = path.getTotalLength()
          const dash = Math.max(36, length * 0.1)
          gsap.set(path, {
            strokeDasharray: `${dash} ${length}`,
            strokeDashoffset: 0,
          })
          gsap.to(path, {
            strokeDashoffset: -length,
            duration: variant === 'airflow' ? 12 + index * 1.4 : 10 + index * 1.2,
            ease: 'none',
            repeat: -1,
          })
        })

        activeTravelers.forEach((dot, index) => {
          const path = paths[index % paths.length]
          if (!path) return
          gsap.set(dot, {
            opacity: intensity === 'strong' ? 0.9 : 0.75,
            visibility: 'visible',
          })
          gsap.to(dot, {
            motionPath: {
              path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration:
              variant === 'service'
                ? 8 + index * 1.5
                : variant === 'airflow'
                  ? 11 + index * 1.8
                  : 9 + index * 1.4,
            ease: 'none',
            repeat: -1,
            delay: index * 0.9,
          })
        })

        if (hub) {
          gsap.to(hub, {
            scale: 1.5,
            opacity: 0.4,
            duration: 1.7,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            transformOrigin: '50% 50%',
          })
        }

        if (check && variant === 'service') {
          gsap.to(check, {
            opacity: 0.4,
            duration: 1.15,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
          })
        }
      }

      entry.eventCallback('onComplete', startAmbient)
    }, root)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === root) trigger.kill()
      })
    }
  }, [ambient, draw, intensity, reduced, variant])

  return (
    <div
      ref={rootRef}
      className={cn(
        'greenflow pointer-events-none absolute inset-0 overflow-hidden',
        `greenflow--${variant}`,
        intensity === 'strong' && 'greenflow--strong',
        mask !== 'none' && `greenflow-mask-${mask}`,
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
        <VariantArt variant={variant} uid={uid} />
      </svg>
    </div>
  )
}

function VariantArt({ variant, uid }: { variant: GreenFlowVariant; uid: string }) {
  switch (variant) {
    case 'airflow':
      return (
        <g>
          <g className="greenflow-grid" stroke="currentColor" strokeWidth="0.6">
            <path d="M80 40 V600" opacity="0.35" />
            <path d="M280 40 V600" opacity="0.25" />
            <path d="M480 40 V600" opacity="0.2" />
            <path d="M680 40 V600" opacity="0.25" />
            <path d="M880 40 V600" opacity="0.2" />
            <path d="M40 160 H1160" opacity="0.2" />
            <path d="M40 360 H1160" opacity="0.15" />
            <path d="M40 520 H1160" opacity="0.18" />
          </g>
          <g className="greenflow-paths" stroke="currentColor" strokeLinecap="round" fill="none">
            <path
              className="greenflow-path greenflow-path--a"
              d="M-60 160 C 160 20, 340 300, 560 140 S 880 20, 1260 200"
              strokeWidth="2.2"
            />
            <path
              className="greenflow-path greenflow-path--b"
              d="M-40 280 C 200 160, 380 400, 640 240 S 980 120, 1280 320"
              strokeWidth="1.8"
            />
            <path
              className="greenflow-path greenflow-path--c"
              d="M20 420 C 260 320, 460 540, 720 380 S 1040 260, 1300 460"
              strokeWidth="1.7"
            />
            <path
              className="greenflow-path greenflow-path--d max-md:hidden"
              d="M100 100 C 300 180, 440 60, 640 160 S 940 260, 1200 100"
              strokeWidth="1.5"
            />
            <path
              className="greenflow-path greenflow-path--e max-md:hidden"
              d="M60 520 C 240 460, 420 580, 640 500 S 960 420, 1220 540"
              strokeWidth="1.4"
            />
          </g>
          <g className="greenflow-travelers" fill="currentColor">
            <circle className="greenflow-traveler" r="4.5" cx="0" cy="0" />
            <circle className="greenflow-traveler" r="3.5" cx="0" cy="0" />
            <circle className="greenflow-traveler max-md:hidden" r="3.2" cx="0" cy="0" />
            <circle className="greenflow-traveler max-md:hidden" r="2.8" cx="0" cy="0" />
            <circle className="greenflow-traveler max-md:hidden" r="3" cx="0" cy="0" />
          </g>
        </g>
      )
    case 'hydronic':
      return (
        <g>
          <g className="greenflow-grid" stroke="currentColor" strokeWidth="0.55">
            <path d="M120 80 H1080" opacity="0.25" />
            <path d="M120 560 H1080" opacity="0.2" />
            <path d="M160 80 V560" opacity="0.2" />
            <path d="M1040 80 V560" opacity="0.18" />
          </g>
          <g className="greenflow-paths" stroke="currentColor" strokeLinecap="square" fill="none">
            <path
              className="greenflow-path greenflow-path--a"
              d="M60 100 H400 V260 H700 V160 H980 V340 H1180"
              strokeWidth="2.2"
            />
            <path
              className="greenflow-path greenflow-path--b"
              d="M100 400 H340 V520 H620 V440 H900 V560 H1140"
              strokeWidth="1.8"
            />
            <path
              className="greenflow-path greenflow-path--c max-md:hidden"
              d="M180 180 H300 V320 H540 V220"
              strokeWidth="1.5"
            />
          </g>
          <g fill="currentColor">
            <circle className="greenflow-node" cx="400" cy="100" r="4.2" />
            <circle className="greenflow-node" cx="700" cy="260" r="4.2" />
            <circle className="greenflow-node" cx="980" cy="160" r="3.6" />
            <circle className="greenflow-node" cx="620" cy="520" r="3.6" />
            <circle className="greenflow-node" cx="340" cy="400" r="3.4" />
          </g>
          <g className="greenflow-travelers" fill="currentColor">
            <circle className="greenflow-traveler" r="5" cx="0" cy="0" />
            <circle className="greenflow-traveler" r="3.8" cx="0" cy="0" />
            <circle className="greenflow-traveler max-md:hidden" r="3.2" cx="0" cy="0" />
          </g>
        </g>
      )
    case 'thermal':
      return (
        <g>
          <g className="greenflow-grid" stroke="currentColor" strokeWidth="0.55">
            <circle cx="600" cy="320" r="120" opacity="0.18" fill="none" />
            <circle cx="600" cy="320" r="200" opacity="0.12" fill="none" />
          </g>
          <g className="greenflow-paths" stroke="currentColor" strokeLinecap="round" fill="none">
            <path
              className="greenflow-path greenflow-path--a"
              d="M40 420 C 180 560, 320 200, 500 360 S 760 560, 940 280 S 1120 140, 1260 260"
              strokeWidth="2.2"
            />
            <path
              className="greenflow-path greenflow-path--b"
              d="M80 220 C 240 140, 380 300, 560 180 S 840 60, 1100 180"
              strokeWidth="1.7"
            />
            <path
              className="greenflow-path greenflow-path--c"
              d="M160 500 C 360 440, 520 580, 720 460 S 1000 380, 1220 500"
              strokeWidth="1.6"
            />
            <path
              className="greenflow-path greenflow-path--d max-md:hidden"
              d="M520 120 C 560 220, 640 220, 680 120 C 640 40, 560 40, 520 120"
              strokeWidth="1.8"
            />
          </g>
          <g fill="currentColor">
            <circle className="greenflow-node" cx="500" cy="360" r="4" />
            <circle className="greenflow-node" cx="940" cy="280" r="4" />
            <circle className="greenflow-node" cx="600" cy="120" r="3.5" />
          </g>
          <g className="greenflow-travelers" fill="currentColor">
            <circle className="greenflow-traveler" r="4.8" cx="0" cy="0" />
            <circle className="greenflow-traveler" r="3.6" cx="0" cy="0" />
            <circle className="greenflow-traveler max-md:hidden" r="3.2" cx="0" cy="0" />
            <circle className="greenflow-traveler max-md:hidden" r="2.8" cx="0" cy="0" />
          </g>
        </g>
      )
    case 'service':
      return (
        <g>
          <g className="greenflow-paths" stroke="currentColor" strokeLinecap="round" fill="none">
            <path
              className="greenflow-path greenflow-path--a"
              d="M140 140 V260 H380 V380 H660 V280 H940 V400 H1160"
              strokeWidth="2.1"
            />
            <path
              className="greenflow-path greenflow-path--b max-md:hidden"
              d="M220 460 H500 V540 H820 V480"
              strokeWidth="1.6"
            />
            <path
              className="greenflow-path greenflow-path--c"
              d="M380 260 V380"
              strokeWidth="1.5"
            />
          </g>
          <g fill="currentColor">
            <circle className="greenflow-node" cx="140" cy="140" r="4.5" />
            <circle className="greenflow-node" cx="380" cy="260" r="4.2" />
            <circle className="greenflow-node" cx="660" cy="380" r="4.2" />
            <circle className="greenflow-node" cx="940" cy="280" r="4.2" />
            <circle className="greenflow-node max-md:hidden" cx="500" cy="540" r="3.5" />
          </g>
          <path
            className="greenflow-check"
            d="M926 270 l8 9 16-18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            id={`${uid}-check`}
          />
          <g className="greenflow-travelers" fill="currentColor">
            <circle className="greenflow-traveler" r="4.6" cx="0" cy="0" />
            <circle className="greenflow-traveler" r="3.4" cx="0" cy="0" />
            <circle className="greenflow-traveler max-md:hidden" r="3" cx="0" cy="0" />
          </g>
        </g>
      )
    case 'regional':
      return (
        <g>
          <g className="greenflow-grid" stroke="currentColor" strokeWidth="0.5">
            <circle cx="620" cy="340" r="90" opacity="0.2" fill="none" />
            <circle cx="620" cy="340" r="170" opacity="0.12" fill="none" />
          </g>
          <g className="greenflow-paths" stroke="currentColor" strokeLinecap="round" fill="none">
            <path
              className="greenflow-path greenflow-path--a"
              d="M620 340 C 540 250, 450 180, 360 120"
              strokeWidth="2"
            />
            <path
              className="greenflow-path greenflow-path--b"
              d="M620 340 C 700 430, 790 500, 900 540"
              strokeWidth="2"
            />
            <path
              className="greenflow-path greenflow-path--c"
              d="M620 340 C 500 380, 360 400, 220 370"
              strokeWidth="2"
            />
            <path
              className="greenflow-path greenflow-path--d max-md:hidden"
              d="M620 340 C 680 280, 760 250, 860 220"
              strokeWidth="1.5"
            />
          </g>
          <g fill="currentColor">
            <circle className="greenflow-node greenflow-node--hub" cx="620" cy="340" r="6.5" />
            <circle className="greenflow-node" cx="360" cy="120" r="4.2" />
            <circle className="greenflow-node" cx="900" cy="540" r="4.2" />
            <circle className="greenflow-node" cx="220" cy="370" r="4.2" />
            <circle className="greenflow-node max-md:hidden" cx="860" cy="220" r="3.5" />
          </g>
          <g className="greenflow-travelers" fill="currentColor">
            <circle className="greenflow-traveler" r="4.5" cx="0" cy="0" />
            <circle className="greenflow-traveler" r="3.5" cx="0" cy="0" />
            <circle className="greenflow-traveler" r="3.2" cx="0" cy="0" />
            <circle className="greenflow-traveler max-md:hidden" r="2.8" cx="0" cy="0" />
          </g>
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
  intensity?: TechnicalBackdropProps['intensity']
}

/** Relative section wrapper that hosts a TechnicalBackdrop behind children. */
export function GreenFlowSection({
  variant,
  children,
  className,
  ambient = true,
  mask = 'left',
  intensity = 'standard',
}: SectionShellProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <TechnicalBackdrop
        variant={variant}
        ambient={ambient}
        mask={mask}
        intensity={intensity}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
