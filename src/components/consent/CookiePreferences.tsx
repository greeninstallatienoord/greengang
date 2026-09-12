import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import {
  consentCopy,
  hasOptionalScripts,
  visibleConsentCategories,
} from '../../lib/consentManager'
import type { ConsentPreferences } from '../../types'
import { Button } from '../Button'

type CookiePreferencesProps = {
  value: ConsentPreferences
  onClose: () => void
  onSave: (next: ConsentPreferences) => void
}

export function CookiePreferences({
  value,
  onClose,
  onSave,
}: CookiePreferencesProps) {
  const [draft, setDraft] = useState(value)
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const categories = visibleConsentCategories()
  useFocusTrap(true, dialogRef)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/45 p-3 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="max-h-[min(90dvh,36rem)] w-full max-w-md overflow-auto rounded-t-2xl border border-line bg-paper p-5 shadow-lift outline-none sm:rounded-2xl sm:p-6"
      >
        <h2 id={titleId} className="text-lg font-semibold">
          Cookievoorkeuren
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          {hasOptionalScripts()
            ? 'Zet alleen aan wat u wilt. Noodzakelijk blijft altijd aan.'
            : 'Op dit moment is alleen de noodzakelijke categorie actief. Analytisch en marketing zijn niet aangesloten.'}
        </p>
        <div className="mt-5 grid gap-3">
          {categories.map((key) => {
            const title = `cookie-cat-${key}-title`
            const help = `cookie-cat-${key}-help`
            return (
              <div
                key={key}
                className="flex items-start justify-between gap-4 border border-line px-3.5 py-3"
              >
                <div>
                  <p className="font-semibold" id={title}>
                    {consentCopy[key].title}
                  </p>
                  <p id={help} className="mt-1 text-sm text-ink-muted">
                    {consentCopy[key].description}
                  </p>
                </div>
                <input
                  id={`cookie-cat-${key}`}
                  type="checkbox"
                  className="mt-1 size-5 shrink-0 accent-brand"
                  checked={draft[key]}
                  disabled={key === 'necessary'}
                  aria-labelledby={title}
                  aria-describedby={help}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: event.target.checked,
                    }))
                  }
                />
              </div>
            )
          })}
        </div>
        <p className="mt-4 text-sm">
          <Link to="/cookies" className="underline underline-offset-2" onClick={onClose}>
            Cookiebeleid
          </Link>
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 min-[400px]:flex-row min-[400px]:justify-end">
          <Button variant="ghost" onClick={onClose}>
            Sluiten
          </Button>
          <Button onClick={() => onSave({ ...draft, necessary: true })}>
            Voorkeuren opslaan
          </Button>
        </div>
      </div>
    </div>
  )
}
