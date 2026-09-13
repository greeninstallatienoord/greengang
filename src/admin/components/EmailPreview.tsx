import { useMemo, useState } from 'react'
import { Monitor, Smartphone, X } from 'lucide-react'
import { Button } from '../../components/Button'
import { business } from '../../data/business'
import { cn } from '../../lib/cn'

type EmailPreviewProps = {
  html: string
  compact?: boolean
  subject?: string
  to?: string
  from?: string
  fullscreen?: boolean
  onClose?: () => void
}

function sanitizePreviewHtml(html: string): string {
  return html
    .replace(/<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<\s*iframe[\s\S]*?>[\s\S]*?<\s*\/\s*iframe\s*>/gi, '')
}

export function EmailPreview({
  html,
  compact = false,
  subject,
  to,
  from,
  fullscreen = false,
  onClose,
}: EmailPreviewProps) {
  const [mode, setMode] = useState<'mobile' | 'desktop'>(fullscreen ? 'mobile' : 'desktop')
  const safeHtml = useMemo(() => sanitizePreviewHtml(html), [html])
  const fromLine = from || `Green Installatie Noord <${business.email}>`

  const panel = (
    <div className={fullscreen ? 'flex h-full flex-col' : ''}>
      <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Voorbeeldformaat">
        <Button
          size="sm"
          variant={mode === 'mobile' ? 'primary' : 'secondary'}
          onClick={() => setMode('mobile')}
        >
          <Smartphone size={15} strokeWidth={1.75} aria-hidden="true" />
          Mobiel
        </Button>
        <Button
          size="sm"
          variant={mode === 'desktop' ? 'primary' : 'secondary'}
          onClick={() => setMode('desktop')}
        >
          <Monitor size={15} strokeWidth={1.75} aria-hidden="true" />
          Desktop
        </Button>
        {fullscreen && onClose ? (
          <button
            type="button"
            className="ml-auto inline-flex size-11 items-center justify-center border border-[var(--admin-line)]"
            aria-label="Voorbeeld sluiten"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        ) : null}
      </div>
      <div
        className={cn(
          'overflow-x-auto border border-[var(--admin-line)] bg-[#eceee9] p-3 sm:p-4',
          fullscreen && 'min-h-0 flex-1 overflow-y-auto',
        )}
      >
        <div
          className={cn(
            'mx-auto overflow-hidden border border-[#d5d8d1] bg-white shadow-[0_8px_24px_rgb(16_36_24_/_0.08)]',
            mode === 'mobile' ? 'max-w-[360px]' : 'max-w-[640px]',
          )}
        >
          <div className="border-b border-[#e6e8e3] bg-[#f7f8f5] px-3 py-2.5">
            <p className="truncate text-[11px] text-[var(--admin-muted)]">
              <span className="font-semibold text-[var(--admin-ink)]">Van:</span> {fromLine}
            </p>
            {to ? (
              <p className="mt-0.5 truncate text-[11px] text-[var(--admin-muted)]">
                <span className="font-semibold text-[var(--admin-ink)]">Aan:</span> {to}
              </p>
            ) : null}
            {subject ? (
              <p className="mt-0.5 truncate text-[11px] text-[var(--admin-muted)]">
                <span className="font-semibold text-[var(--admin-ink)]">Onderwerp:</span> {subject}
              </p>
            ) : (
              <p className="mt-0.5 text-[11px] text-[var(--admin-muted)]">Inbox</p>
            )}
          </div>
          <iframe
            title="E-mailvoorbeeld"
            sandbox=""
            referrerPolicy="no-referrer"
            srcDoc={safeHtml}
            className={cn(
              'w-full bg-white',
              fullscreen ? 'h-[min(70dvh,40rem)]' : compact ? 'h-[22rem]' : 'h-[32rem]',
            )}
          />
        </div>
      </div>
    </div>
  )

  if (!fullscreen) return panel

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--admin-panel)]">
      <div className="border-b border-[var(--admin-line)] px-4 py-3">
        <p className="text-base font-semibold">Voorbeeld</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {panel}
      </div>
    </div>
  )
}
