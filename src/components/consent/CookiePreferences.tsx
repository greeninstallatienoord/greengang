import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import {
  categoryExamples,
  consentCopy,
  consumePreferencesOpener,
  hasOptionalScripts,
  visibleConsentCategories,
} from '../../lib/consentManager'
import type { ConsentCategory, ConsentPreferences } from '../../types'
import { Button } from '../Button'

type CookiePreferencesProps = {
  value: ConsentPreferences
  onClose: () => void
  onSave: (next: ConsentPreferences) => void
  onAcceptAll: () => void
  onNecessaryOnly: () => void
  onWithdraw: () => void
}

function CategoryRow({
  category,
  checked,
  onChange,
}: {
  category: ConsentCategory
  checked: boolean
  onChange: (next: boolean) => void
}) {
  const titleId = `cookie-cat-${category}-title`
  const helpId = `cookie-cat-${category}-help`
  const examples = categoryExamples(category)
  const copy = consentCopy[category]
  const locked = category === 'necessary'
  const inactiveOptional = category !== 'necessary' && !copy.active

  return (
    <div className="border border-line px-3.5 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink" id={titleId}>
            {copy.title}
            {locked ? (
              <span className="ml-2 text-xs font-semibold tracking-[0.06em] text-ink-muted uppercase">
                Altijd aan
              </span>
            ) : null}
            {inactiveOptional ? (
              <span className="ml-2 text-xs font-semibold tracking-[0.06em] text-ink-muted uppercase">
                Niet actief
              </span>
            ) : null}
          </h3>
          <p id={helpId} className="mt-1 text-sm leading-relaxed text-ink-muted">
            {copy.description}
          </p>
        </div>
        <input
          id={`cookie-cat-${category}`}
          type="checkbox"
          className="mt-1 size-5 shrink-0 accent-brand"
          checked={locked ? true : inactiveOptional ? false : checked}
          disabled={locked || inactiveOptional}
          aria-labelledby={titleId}
          aria-describedby={helpId}
          onChange={(event) => onChange(event.target.checked)}
        />
      </div>
      {examples.length > 0 ? (
        <ul className="mt-3 grid gap-1.5 border-t border-line pt-3">
          {examples.map((item) => (
            <li key={item.id} className="text-xs leading-snug text-ink-muted">
              <span className="font-semibold text-ink">{item.name}</span>
              {' · '}
              {item.provider}
              {' — '}
              {item.purpose}
              {item.privacyUrl ? (
                <>
                  {' '}
                  <a
                    href={item.privacyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-dark underline underline-offset-2"
                  >
                    Privacyverklaring
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : category !== 'necessary' ? (
        <p className="mt-3 border-t border-line pt-3 text-xs text-ink-muted">
          Er is op dit moment geen actieve technologie in deze categorie aangesloten.
        </p>
      ) : null}
    </div>
  )
}

export function CookiePreferences({
  value,
  onClose,
  onSave,
  onAcceptAll,
  onNecessaryOnly,
  onWithdraw,
}: CookiePreferencesProps) {
  const [draft, setDraft] = useState(value)
  const [restoreFocus] = useState(() => consumePreferencesOpener())
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const categories = visibleConsentCategories()
  useFocusTrap(true, dialogRef, restoreFocus)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const main = document.getElementById('main-content')
    if (main) main.inert = true
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (main) main.inert = false
    }
  }, [onClose])

  const optional = hasOptionalScripts()

  return (
    <div
      className="cookie-preferences-overlay fixed inset-0 z-[60] flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-4"
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
        className="flex max-h-[min(92dvh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-[0.75rem] border border-line bg-paper shadow-lift outline-none sm:rounded-sm"
      >
        <div className="border-b border-line px-4 py-4 sm:px-5">
          <h2 id={titleId} className="text-lg font-semibold tracking-[-0.015em]">
            Privacyvoorkeuren
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            {optional
              ? 'Zet alleen aan wat u wilt. Noodzakelijk blijft altijd aan. Extra scripts starten pas na toestemming.'
              : 'Op dit moment is alleen de noodzakelijke categorie actief. Analytisch, marketing en voorkeuren zijn niet aangesloten en starten dus niet.'}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="grid gap-3">
            {categories.map((key) => (
              <CategoryRow
                key={key}
                category={key}
                checked={draft[key]}
                onChange={(next) =>
                  setDraft((current) => ({
                    ...current,
                    [key]: next,
                    necessary: true,
                  }))
                }
              />
            ))}
          </div>
          <p className="mt-4 text-sm">
            <Link to="/cookies" className="underline underline-offset-2" onClick={onClose}>
              Meer in het cookiebeleid
            </Link>
          </p>
        </div>

        <div className="grid gap-2 border-t border-line px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5">
          {optional ? (
            <div className="grid gap-2 min-[420px]:grid-cols-3">
              <Button variant="secondary" className="min-h-11" onClick={onNecessaryOnly}>
                Alleen noodzakelijk
              </Button>
              <Button variant="ghost" className="min-h-11" onClick={onAcceptAll}>
                Alles accepteren
              </Button>
              <Button className="min-h-11" onClick={() => onSave({ ...draft, necessary: true })}>
                Keuze opslaan
              </Button>
            </div>
          ) : (
            <div className="grid gap-2 min-[420px]:grid-cols-2">
              <Button variant="secondary" className="min-h-11" onClick={onNecessaryOnly}>
                Alleen noodzakelijk
              </Button>
              <Button className="min-h-11" onClick={() => onSave({ ...draft, necessary: true })}>
                Keuze opslaan
              </Button>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-ink-muted underline-offset-2 hover:underline"
              onClick={onWithdraw}
            >
              Toestemming intrekken
            </button>
            <Button variant="ghost" className="min-h-11" onClick={onClose}>
              Sluiten
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
