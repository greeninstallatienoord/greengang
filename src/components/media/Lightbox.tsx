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
  const current = items[index]
  useFocusTrap(true, dialogRef)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (event.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
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
          className="inline-flex size-11 items-center justify-center hover:bg-white/10"
          onClick={onClose}
        >
          <X size={22} strokeWidth={1.6} />
          <span className="sr-only">Sluiten</span>
        </button>
      </div>
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center"
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
          className="absolute left-0 hidden size-12 items-center justify-center hover:bg-white/10 sm:inline-flex"
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
          className="lightbox-image max-h-[72dvh] w-auto max-w-full object-contain"
        />
        <button
          type="button"
          className="absolute right-0 hidden size-12 items-center justify-center hover:bg-white/10 sm:inline-flex"
          onClick={() => onIndex((index + 1) % items.length)}
        >
          <ChevronRight size={28} strokeWidth={1.5} />
          <span className="sr-only">Volgende foto</span>
        </button>
      </div>
      <div className="mx-auto max-w-xl px-2 pb-4 text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/55">
          {workCategoryLabels[current.category]}
        </p>
        <p id="werk-lightbox-title" className="mt-1 font-semibold">
          {current.title}
        </p>
      </div>
    </div>
  )
}
