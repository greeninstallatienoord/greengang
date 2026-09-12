import { useState } from 'react'
import { Button } from '../../components/Button'

type EmailPreviewProps = {
  html: string
}

export function EmailPreview({ html }: EmailPreviewProps) {
  const [mode, setMode] = useState<'mobile' | 'desktop'>('mobile')

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <Button
          size="sm"
          variant={mode === 'mobile' ? 'primary' : 'secondary'}
          onClick={() => setMode('mobile')}
        >
          Mobiel
        </Button>
        <Button
          size="sm"
          variant={mode === 'desktop' ? 'primary' : 'secondary'}
          onClick={() => setMode('desktop')}
        >
          Desktop
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border border-line bg-surface p-3">
        <iframe
          title="E-mailvoorbeeld"
          sandbox=""
          srcDoc={html}
          className={
            mode === 'mobile'
              ? 'mx-auto h-[28rem] w-full max-w-[360px] rounded-md border border-line bg-paper'
              : 'h-[28rem] w-full rounded-md border border-line bg-paper'
          }
        />
      </div>
    </div>
  )
}
