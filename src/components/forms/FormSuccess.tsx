import { useEffect, useRef, type ReactNode } from 'react'
import { Button } from '../Button'
import { ButtonLink } from '../ButtonLink'

type FormSuccessProps = {
  title: string
  confirmedByServer: boolean
  previewText: string
  confirmedText: string
  warning?: string
  summary?: ReactNode
  onReset?: () => void
  contactHref?: string
}

export function FormSuccess({
  title,
  confirmedByServer,
  previewText,
  confirmedText,
  warning,
  summary,
  onReset,
  contactHref = '/contact',
}: FormSuccessProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      node.focus({ preventScroll: true })
    })
  }, [])

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="scroll-mt-[calc(var(--header-offset)+0.75rem)] border border-line bg-paper p-5 outline-none sm:p-7"
    >
      <p className="text-sm font-semibold text-brand">
        {confirmedByServer ? 'Aanvraag ontvangen' : 'Gegevens gecontroleerd'}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{title}</h2>
      <p className="mt-3 text-ink-muted">
        {confirmedByServer ? confirmedText : previewText}
      </p>
      {summary}
      {warning ? <p className="mt-3 text-sm text-ink-muted">{warning}</p> : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <ButtonLink to="/">{confirmedByServer ? 'Naar home' : 'Terug naar home'}</ButtonLink>
        <ButtonLink to={contactHref} variant="secondary">
          Contact opnemen
        </ButtonLink>
        {onReset ? (
          <Button variant="ghost" onClick={onReset}>
            Nieuwe aanvraag
          </Button>
        ) : null}
      </div>
    </div>
  )
}
