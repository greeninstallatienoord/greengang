import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { business, formatAddress } from '../../data/business'
import {
  googleBusinessOrMapsUrl,
  openStreetMapPlaceUrl,
  serviceArea,
} from '../../data/region'
import { cn } from '../../lib/cn'

const ServiceAreaLeafletMap = lazy(() =>
  import('./ServiceAreaLeafletMap').then((module) => ({
    default: module.ServiceAreaLeafletMap,
  })),
)

type NorthMapProps = {
  className?: string
}

type MapPhase = 'idle' | 'loading' | 'ready' | 'error'

function MapSkeleton({ label }: { label: string }) {
  return (
    <div
      className="flex h-full w-full flex-col justify-end bg-stone px-4 py-4 sm:px-5"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-2 w-24 animate-pulse bg-line/80" />
      <div className="mt-3 h-5 w-3/4 max-w-xs animate-pulse bg-line/70" />
      <p className="mt-4 text-sm font-medium text-ink-muted">{label}</p>
    </div>
  )
}

function MapFallback() {
  return (
    <div className="flex h-full w-full flex-col justify-end bg-surface px-4 py-5 sm:px-5">
      <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-brand-dark uppercase">
        {serviceArea.regionName}
      </p>
      <p className="mt-2 font-display text-[1.25rem] leading-tight tracking-[-0.02em] sm:text-[1.35rem]">
        Kaart kon niet worden geladen.
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
        Vestiging: {business.address.city}. Werkgebied: Groningen, Drenthe en
        Friesland.
      </p>
      <a
        href={googleBusinessOrMapsUrl()}
        className="mt-4 inline-flex min-h-11 w-fit items-center text-sm font-semibold underline-offset-2 hover:underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        Route bekijken
        <ExternalLink size={13} strokeWidth={1.75} className="ml-1.5" aria-hidden="true" />
      </a>
    </div>
  )
}

function MapConsentGate({ onLoad }: { onLoad: () => void }) {
  return (
    <div className="flex h-full w-full flex-col justify-end bg-surface px-4 py-5 sm:px-5">
      <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-brand-dark uppercase">
        {serviceArea.regionName}
      </p>
      <p className="mt-2 font-display text-[1.25rem] leading-tight tracking-[-0.02em] sm:text-[1.35rem]">
        Interactieve kaart
      </p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
        Vestiging in {business.address.city}. Werkgebied: Groningen, Drenthe en Friesland.
        Bij het laden van de kaart worden tegels van OpenStreetMap opgehaald; daarbij kan
        uw IP-adres bij de tegelprovider terechtkomen.
      </p>
      <button
        type="button"
        className="mt-4 inline-flex min-h-11 w-fit items-center bg-brand px-4 text-sm font-semibold text-white"
        onClick={onLoad}
      >
        Kaart laden
      </button>
      <a
        href={googleBusinessOrMapsUrl()}
        className="mt-3 inline-flex min-h-11 w-fit items-center text-sm font-semibold underline-offset-2 hover:underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        Route bekijken zonder kaart
        <ExternalLink size={13} strokeWidth={1.75} className="ml-1.5" aria-hidden="true" />
      </a>
    </div>
  )
}

export function NorthMap({ className }: NorthMapProps) {
  const rootRef = useRef<HTMLElement>(null)
  const [userRequested, setUserRequested] = useState(false)
  const [inView, setInView] = useState(false)
  const [phase, setPhase] = useState<MapPhase>('idle')

  const shouldLoad = userRequested && inView

  useEffect(() => {
    const node = rootRef.current
    if (!node || !userRequested) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          setPhase((current) => (current === 'idle' ? 'loading' : current))
          observer.disconnect()
        }
      },
      { rootMargin: '120px 0px', threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [userRequested])

  const handleReady = useCallback(() => {
    setPhase((current) => (current === 'error' ? current : 'ready'))
  }, [])

  const handleError = useCallback(() => {
    setPhase('error')
  }, [])

  return (
    <figure
      ref={rootRef}
      className={cn('overflow-hidden border border-line bg-paper', className)}
    >
      <div className="gin-service-map-frame relative h-[clamp(17.5rem,54vw,21.875rem)] w-full overflow-hidden bg-stone sm:h-[clamp(22.5rem,40vw,26.875rem)] lg:h-[clamp(26.25rem,28vw,31.25rem)]">
        {phase === 'error' ? (
          <MapFallback />
        ) : !userRequested ? (
          <MapConsentGate
            onLoad={() => {
              setUserRequested(true)
              setPhase('loading')
              // Immediate load if already in view / no IO.
              if (typeof IntersectionObserver === 'undefined') setInView(true)
              else {
                const rect = rootRef.current?.getBoundingClientRect()
                if (rect && rect.top < window.innerHeight + 120) setInView(true)
              }
            }}
          />
        ) : shouldLoad ? (
          <Suspense fallback={<MapSkeleton label="Kaart laden…" />}>
            <ServiceAreaLeafletMap onReady={handleReady} onError={handleError} />
          </Suspense>
        ) : (
          <MapSkeleton label="Kaart laden…" />
        )}
      </div>

      <figcaption className="border-t border-line bg-paper px-3.5 py-3 sm:px-4">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
          <li className="inline-flex items-center gap-2 font-medium text-ink">
            <span className="gin-map-legend-pin" aria-hidden="true" />
            Vestiging — {business.address.city}
          </li>
          {serviceArea.provinces.map((province) => (
            <li key={province.name} className="inline-flex items-center gap-2">
              <span
                className="size-2.5 border border-brand-dark/50 bg-brand/25"
                aria-hidden="true"
              />
              {province.name}
            </li>
          ))}
        </ul>
        <p className="sr-only">
          Green Installatie Noord is gevestigd in {business.address.city} op{' '}
          {formatAddress()}. Werkgebied: Groningen, Drenthe en Friesland.
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span>
            ©{' '}
            <a
              href="https://www.openstreetmap.org/copyright"
              className="underline-offset-2 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              OpenStreetMap
            </a>{' '}
            contributors
          </span>
          <a
            href={openStreetMapPlaceUrl()}
            className="inline-flex items-center gap-1 font-semibold text-ink underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Grotere kaart
            <ExternalLink size={11} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      </figcaption>
    </figure>
  )
}
