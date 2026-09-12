import { Link } from 'react-router-dom'

type FormPrivacyNoteProps = {
  purpose: string
}

export function FormPrivacyNote({ purpose }: FormPrivacyNoteProps) {
  return (
    <div className="rounded-md border border-line bg-surface px-3 py-3 text-sm text-ink-muted">
      <p>{purpose}</p>
      <p className="mt-2">
        Meer over gegevens staat op de{' '}
        <Link to="/privacy" className="underline">
          privacyverklaring
        </Link>
        {' '}
        (nu nog een tijdelijke tekst). U kunt ons ook bereiken via{' '}
        <Link to="/contact" className="underline">
          de contactpagina
        </Link>
        .
      </p>
    </div>
  )
}
