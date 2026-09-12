import { Button } from '../Button'
import { ButtonLink } from '../ButtonLink'

type FormSuccessProps = {
  title: string
  confirmedByServer: boolean
  previewText: string
  confirmedText: string
  warning?: string
  onReset?: () => void
}

export function FormSuccess({
  title,
  confirmedByServer,
  previewText,
  confirmedText,
  warning,
  onReset,
}: FormSuccessProps) {
  return (
    <div className="border border-line bg-paper p-7">
      <p className="text-sm font-semibold text-brand">
        {confirmedByServer ? 'Bevestigd' : 'Gegevens gecontroleerd'}
      </p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-ink-muted">
        {confirmedByServer ? confirmedText : previewText}
      </p>
      {warning ? <p className="mt-3 text-sm text-ink-muted">{warning}</p> : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <ButtonLink to="/">{confirmedByServer ? 'Naar home' : 'Terug naar home'}</ButtonLink>
        {onReset ? (
          <Button variant="secondary" onClick={onReset}>
            Nieuwe aanvraag
          </Button>
        ) : null}
      </div>
    </div>
  )
}
