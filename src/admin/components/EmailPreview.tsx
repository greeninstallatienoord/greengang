import { useState } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { Button } from '../../components/Button'
import { business } from '../../data/business'
import { cn } from '../../lib/cn'

type EmailPreviewProps = {
  html: string
  compact?: boolean
  subject?: string
  to?: string
}

export function EmailPreview({ html, compact = false, subject, to }: EmailPreviewProps) {
  const [mode, setMode] = useState<'mobile' | 'desktop'>('mobile')

  return (
    <div>
      <div className="mb-3 flex gap-2" role="group" aria-label="Voorbeeldformaat">
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
      </div>
      <div className="overflow-x-auto border border-[var(--admin-line)] bg-[#eceee9] p-3 sm:p-4">
        <div
          className={cn(
            'mx-auto overflow-hidden border border-[#d5d8d1] bg-white shadow-[0_8px_24px_rgb(16_36_24_/_0.08)]',
            mode === 'mobile' ? 'max-w-[360px]' : 'max-w-[640px]',
          )}
        >
          <div className="border-b border-[#e6e8e3] bg-[#f7f8f5] px-3 py-2.5">
            <p className="truncate text-[11px] font-semibold text-[var(--admin-ink)]">
              {business.businessName}
            </p>
            {to ? (
              <p className="mt-0.5 truncate text-[11px] text-[var(--admin-muted)]">Aan: {to}</p>
            ) : null}
            {subject ? (
              <p className="mt-0.5 truncate text-[11px] text-[var(--admin-muted)]">{subject}</p>
            ) : (
              <p className="mt-0.5 text-[11px] text-[var(--admin-muted)]">Inbox</p>
            )}
          </div>
          <iframe
            title="E-mailvoorbeeld"
            sandbox=""
            srcDoc={html}
            className={cn('w-full bg-white', compact ? 'h-[22rem]' : 'h-[32rem]')}
          />
        </div>
      </div>
    </div>
  )
}
