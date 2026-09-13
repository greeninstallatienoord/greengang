import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { workCategoryLabels, type WorkShot } from '../../data/media'
import { useFocusTrap } from '../../hooks/useFocusTrap'

type LightboxProps = {
  items: WorkShot[]
  index: number
  onClose: () => void
  onIndex: (index: number) => void
}

export function Lightbox({ items, index, onClose, onIndex }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const startX = useRef<number | null>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const current = items[index]
  useFocusTrap(true, dialogRef)

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus.current?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (event.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, items.length, onClose, onIndex])

  if (!current) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="werk-lightbox-title"
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex flex-col bg-ink/94 p-3 text-white outline-none sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/70">
          {index + 1} / {items.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={onClose}
        >
          <X size={22} strokeWidth={1.6} />
          <span className="sr-only">Sluiten</span>
        </button>
      </div>
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-10 sm:px-14"
        onTouchStart={(event) => {
          startX.current = event.changedTouches[0]?.clientX ?? null
        }}
        onTouchEnd={(event) => {
          const end = event.changedTouches[0]?.clientX
          if (startX.current == null || end == null) return
          const delta = end - startX.current
          if (delta > 50) onIndex((index - 1 + items.length) % items.length)
          if (delta < -50) onIndex((index + 1) % items.length)
          startX.current = null
        }}
      >
        <button
          type="button"
          className="absolute left-0 inline-flex size-11 items-center justify-center rounded-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-12"
          onClick={() => onIndex((index - 1 + items.length) % items.length)}
        >
          <ChevronLeft size={28} strokeWidth={1.5} />
          <span className="sr-only">Vorige foto</span>
        </button>
        <img
          key={current.id}
          src={current.asset.src}
          alt={current.asset.alt}
          width={current.asset.width}
          height={current.asset.height}
          className="lightbox-image max-h-[min(72dvh,100%)] w-auto max-w-full object-contain"
        />
        <button
          type="button"
          className="absolute right-0 inline-flex size-11 items-center justify-center rounded-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-12"
          onClick={() => onIndex((index + 1) % items.length)}
        >
          <ChevronRight size={28} strokeWidth={1.5} />
          <span className="sr-only">Volgende foto</span>
        </button>
      </div>
      <div className="mx-auto max-w-xl px-2 pb-[max(1rem,env(safe-area-inset-bottom))] text-center sm:pb-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/55">
          {workCategoryLabels[current.category]}
        </p>
        <p id="werk-lightbox-title" className="mt-1 font-semibold leading-snug">
          {current.title}
        </p>
      </div>
    </div>
  )
}
