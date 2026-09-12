type EmptyStateProps = {
  title: string
  text: string
}

export function EmptyState({ title, text }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-line bg-paper px-4 py-8 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-ink-muted">{text}</p>
    </div>
  )
}
