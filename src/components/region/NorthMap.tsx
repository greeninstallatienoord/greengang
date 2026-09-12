import { useState } from 'react'
import { business, formatAddress } from '../../data/business'
import { Button } from '../Button'

const MARKER_LAT = '53.1047'
const MARKER_LNG = '7.0136'
const OSM_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=5.15%2C52.65%2C7.25%2C53.55&layer=mapnik&marker=${MARKER_LAT}%2C${MARKER_LNG}`
const OSM_OPEN = `https://www.openstreetmap.org/?mlat=${MARKER_LAT}&mlon=${MARKER_LNG}#map=8/53.15/6.40`

export function NorthMap() {
  const [open, setOpen] = useState(false)

  return (
    <figure className="overflow-hidden border border-line bg-stone">
      {open ? (
        <iframe
          title="Kaart van Noord-Nederland, vestiging in Oude Pekela"
          src={OSM_EMBED}
          className="block h-64 w-full border-0 sm:h-80"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-64 flex-col items-start justify-end bg-[linear-gradient(180deg,#d7e4d8_0%,#ebe4d8_100%)] px-5 py-5 sm:h-80 sm:px-6">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
            Noord-Nederland
          </p>
          <p className="mt-2 max-w-md font-display text-[1.45rem] leading-tight tracking-[-0.02em]">
            Groningen, Drenthe en Friesland. Vestiging in Oude Pekela.
          </p>
          <Button className="mt-4" size="sm" onClick={() => setOpen(true)}>
            Toon kaart
          </Button>
        </div>
      )}
      <figcaption className="flex flex-col gap-2 border-t border-line bg-paper px-4 py-3 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <span>
          {formatAddress()}. De kaart is een oriëntatie, geen belofte per postcode.
        </span>
        <span className="flex flex-wrap gap-x-4 gap-y-1 font-semibold text-ink">
          <a
            href={OSM_OPEN}
            className="underline underline-offset-2"
            rel="noopener noreferrer"
            target="_blank"
          >
            OpenStreetMap
          </a>
          {business.googleBusinessProfile ? (
            <a
              href={business.googleBusinessProfile}
              className="underline underline-offset-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google
            </a>
          ) : null}
        </span>
      </figcaption>
    </figure>
  )
}
