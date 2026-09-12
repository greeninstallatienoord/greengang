import { Button } from '../../components/Button'
import { AdminDialog } from './AdminDialog'

type ConfirmDialogProps = {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Bevestigen',
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AdminDialog
      title={title}
      description={message}
      busy={busy}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Annuleren
          </Button>
          <Button
            className={danger ? 'bg-danger hover:bg-danger' : undefined}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Bezig…' : confirmLabel}
          </Button>
        </>
      }
    />
  )
}
