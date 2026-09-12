import { Link } from 'react-router-dom'

type FormPrivacyNoteProps = {
  purpose: string
}

export function FormPrivacyNote({ purpose }: FormPrivacyNoteProps) {
  return (
    <div className="border border-line bg-surface px-3 py-3 text-sm text-ink-muted">
      <p>{purpose}</p>
      <p className="mt-2">
        Meer staat in de{' '}
        <Link to="/privacy" className="underline underline-offset-2">
          privacyverklaring
        </Link>
        .
      </p>
    </div>
  )
}
