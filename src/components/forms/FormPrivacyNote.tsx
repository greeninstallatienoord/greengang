import { Link } from 'react-router-dom'

type FormPrivacyNoteProps = {
  purpose: string
}

/** Short purpose note + links to privacy and terms (reachable before any later contract). */
export function FormPrivacyNote({ purpose }: FormPrivacyNoteProps) {
  return (
    <div className="border border-line bg-surface px-3 py-3 text-sm text-ink-muted">
      <p>{purpose}</p>
      <p className="mt-2">
        Meer staat in de{' '}
        <Link to="/privacy" className="font-semibold text-ink underline underline-offset-2">
          privacyverklaring
        </Link>
        . Onze{' '}
        <Link
          to="/algemene-voorwaarden"
          className="font-semibold text-ink underline underline-offset-2"
        >
          algemene voorwaarden
        </Link>{' '}
        gelden pas wanneer later een overeenkomst tot stand komt (niet door dit verzoek alleen).
        U kunt die voorwaarden nu al lezen en bewaren.
      </p>
    </div>
  )
}
