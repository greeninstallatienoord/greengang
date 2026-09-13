import { useEffect, useId, useRef, useState } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import { business } from '../../data/business'
import {
  mapsDirectionsUrl,
  openStreetMapPlaceUrl,
  serviceArea,
  serviceAreaMap,
} from '../../data/region'
import northProvinces from '../../data/north-provinces.json'
import { cn } from '../../lib/cn'

type ServiceAreaLeafletMapProps = {
  className?: string
  onReady?: () => void
  onError?: () => void
}

function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}

export function ServiceAreaLeafletMap({
  className,
  onReady,
  onError,
}: ServiceAreaLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const [interactionUnlocked, setInteractionUnlocked] = useState(() => !isCoarsePointer())
  const titleId = useId()

  useEffect(() => {
    const el = containerRef.current
    if (!el || mapRef.current) return

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    let tileErrorTimer: number | undefined

    async function init() {
      try {
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')
        if (cancelled || !containerRef.current) return

        const map = L.map(containerRef.current, {
          center: [serviceAreaMap.lat, serviceAreaMap.lng],
          zoom: 8,
          minZoom: serviceAreaMap.minZoom,
          maxZoom: serviceAreaMap.maxZoom,
          maxBounds: L.latLngBounds(
            serviceAreaMap.maxBounds.southWest,
            serviceAreaMap.maxBounds.northEast,
          ),
          maxBoundsViscosity: 0.85,
          scrollWheelZoom: false,
          zoomControl: false,
          attributionControl: false,
          preferCanvas: true,
        })

        mapRef.current = map

        L.control
          .zoom({
            position: 'topright',
            zoomInTitle: 'Inzoomen',
            zoomOutTitle: 'Uitzoomen',
          })
          .addTo(map)

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: serviceAreaMap.maxZoom,
          attribution: '',
        })

        let gotTile = false
        tiles.on('tileload', () => {
          if (gotTile) return
          gotTile = true
          onReady?.()
        })
        tiles.on('tileerror', () => {
          window.clearTimeout(tileErrorTimer)
          tileErrorTimer = window.setTimeout(() => {
            if (!gotTile) onError?.()
          }, 4000)
        })
        tiles.addTo(map)

        const provinceLayer = L.geoJSON(northProvinces as GeoJSON.GeoJSON, {
          style: {
            color: '#14692a',
            weight: 1.5,
            opacity: 0.72,
            fillColor: '#1a8a34',
            fillOpacity: 0.13,
          },
          interactive: false,
        }).addTo(map)

        const labelLayer = L.layerGroup()
        for (const label of serviceAreaMap.provinceLabels) {
          L.marker([label.lat, label.lng], {
            interactive: false,
            keyboard: false,
            icon: L.divIcon({
              className: 'gin-map-province-label',
              html: `<span>${label.name}</span>`,
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            }),
          }).addTo(labelLayer)
        }

        const syncLabels = () => {
          if (map.getZoom() >= 8 && map.getSize().x >= 420) {
            if (!map.hasLayer(labelLayer)) labelLayer.addTo(map)
          } else if (map.hasLayer(labelLayer)) {
            map.removeLayer(labelLayer)
          }
        }
        map.on('zoomend resize', syncLabels)
        syncLabels()

        const bounds = provinceLayer.getBounds()
        if (bounds.isValid()) {
          map.fitBounds(bounds.pad(0.08), {
            animate: false,
            maxZoom: 9,
          })
        }

        const addressLines = `${business.address.street}<br />${business.address.postalCode} ${business.address.city}`
        const routeUrl = mapsDirectionsUrl()
        const popupHtml = `
          <div class="gin-map-popup">
            <p class="gin-map-popup__eyebrow">Vestiging</p>
            <p class="gin-map-popup__title">${business.businessName}</p>
            <p class="gin-map-popup__sub">Oude Pekela</p>
            <p class="gin-map-popup__address">${addressLines}</p>
            <div class="gin-map-popup__actions">
              <a class="gin-map-popup__link" href="${routeUrl}" target="_blank" rel="noopener noreferrer">Route bekijken</a>
              <a class="gin-map-popup__link" href="/contact">Contact</a>
            </div>
          </div>
        `

        const marker = L.marker([serviceAreaMap.lat, serviceAreaMap.lng], {
          title: `${business.businessName}, Oude Pekela`,
          riseOnHover: true,
          icon: L.divIcon({
            className: 'gin-map-marker',
            html: `
              <span class="gin-map-marker__pin" aria-hidden="true">
                <span class="gin-map-marker__dot"></span>
              </span>
            `,
            iconSize: [28, 36],
            iconAnchor: [14, 34],
            popupAnchor: [0, -28],
          }),
        }).addTo(map)

        marker.bindPopup(popupHtml, {
          maxWidth: 280,
          minWidth: 200,
          className: 'gin-map-popup-wrap',
          autoPanPadding: [48, 48],
          autoPanPaddingBottomRight: [72, 96],
        })

        // Open once on desktop so the base is immediately clear.
        if (!isCoarsePointer()) {
          marker.openPopup()
        }

        const applyInteraction = (enabled: boolean) => {
          if (enabled) {
            map.dragging.enable()
            map.touchZoom.enable()
            map.doubleClickZoom.enable()
            map.boxZoom.enable()
            map.keyboard.enable()
          } else {
            map.dragging.disable()
            map.touchZoom.disable()
            map.doubleClickZoom.disable()
            map.boxZoom.disable()
            map.keyboard.disable()
          }
        }

        applyInteraction(!isCoarsePointer())

        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize({ animate: false })
          syncLabels()
        })
        resizeObserver.observe(containerRef.current)

        // Fallback ready if tiles are cached and no tileload fires quickly.
        window.setTimeout(() => {
          if (!cancelled) onReady?.()
        }, 1200)
      } catch {
        if (!cancelled) onError?.()
      }
    }

    void init()

    return () => {
      cancelled = true
      window.clearTimeout(tileErrorTimer)
      resizeObserver?.disconnect()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [onError, onReady])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (interactionUnlocked) {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.boxZoom.enable()
      map.keyboard.enable()
    }
  }, [interactionUnlocked])

  return (
    <div className={cn('relative h-full w-full', className)}>
      <div
        ref={containerRef}
        id={titleId}
        className="gin-service-map h-full w-full"
        role="region"
        aria-label={`Kaart van ${serviceArea.regionName}: vestiging in Oude Pekela, werkgebied Groningen, Drenthe en Friesland`}
      />
      {!interactionUnlocked ? (
        <button
          type="button"
          className="absolute inset-x-3 top-3 z-[500] min-h-11 border border-line bg-paper/95 px-3 text-sm font-semibold text-ink shadow-[var(--shadow-card)] sm:inset-x-auto sm:right-14 sm:left-auto sm:min-w-[12rem]"
          onClick={() => setInteractionUnlocked(true)}
        >
          Tik om de kaart te bedienen
        </button>
      ) : null}
      <a
        href={openStreetMapPlaceUrl()}
        className="sr-only"
        rel="noopener noreferrer"
        target="_blank"
      >
        Open vestiging op OpenStreetMap
      </a>
    </div>
  )
}
