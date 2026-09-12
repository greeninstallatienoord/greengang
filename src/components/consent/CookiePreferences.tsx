import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { consentCopy } from '../../lib/consentManager'
import type { ConsentPreferences } from '../../types'
import { Button } from '../Button'

type CookiePreferencesProps = {
  value: ConsentPreferences
  onClose: () => void
  onSave: (next: ConsentPreferences) => void
  onAcceptAll: () => void
  onRejectOptional: () => void
}

export function CookiePreferences({
  value,
  onClose,
  onSave,
  onAcceptAll,
  onRejectOptional,
}: CookiePreferencesProps) {
  const [draft, setDraft] = useState(value)
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
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
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-4 sm:items-center"
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
        className="max-h-[90dvh] w-full max-w-lg overflow-auto rounded-lg bg-paper p-5 shadow-card outline-none"
      >
        <h2 id={titleId} className="text-xl font-semibold">
          Cookie-instellingen
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Zet alleen aan wat u wilt. Noodzakelijk blijft altijd aan. U kunt dit
          later wijzigen via “Cookie-instellingen” onderaan de pagina.
        </p>
        <div className="mt-5 grid gap-4">
          {(Object.keys(consentCopy) as Array<keyof ConsentPreferences>).map(
            (key) => (
              <label
                key={key}
                className="flex items-start justify-between gap-4 rounded-md border border-line p-3"
              >
                <span>
                  <span className="block font-semibold" id={`cookie-cat-${key}-title`}>
                    {consentCopy[key].title}
                  </span>
                  <span
                    id={`cookie-cat-${key}-help`}
                    className="mt-1 block text-sm text-ink-muted"
                  >
                    {consentCopy[key].description}
                  </span>
                </span>
                <input
                  id={`cookie-cat-${key}`}
                  type="checkbox"
                  className="mt-1 size-5 accent-brand"
                  checked={draft[key]}
                  disabled={key === 'necessary'}
                  aria-describedby={`cookie-cat-${key}-help`}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: event.target.checked,
                    }))
                  }
                />
              </label>
            ),
          )}
        </div>
        <p className="mt-4 text-sm">
          <Link to="/cookies" className="underline" onClick={onClose}>
            Uitleg over cookies
          </Link>
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Sluiten
          </Button>
          <Button
            variant="secondary"
            onClick={onRejectOptional}
            aria-label="Optionele cookies weigeren. Alleen noodzakelijke blijven aan."
          >
            Optionele weigeren
          </Button>
          <Button variant="secondary" onClick={onAcceptAll}>
            Alles accepteren
          </Button>
          <Button onClick={() => onSave({ ...draft, necessary: true })}>
            Voorkeuren opslaan
          </Button>
        </div>
      </div>
    </div>
  )
}
