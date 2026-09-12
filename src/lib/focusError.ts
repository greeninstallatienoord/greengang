export function focusFirstError(
  errors: Record<string, string | undefined>,
): void {
  const id = Object.keys(errors).find((key) => Boolean(errors[key]))
  if (!id) return
  window.requestAnimationFrame(() => {
    document.getElementById(id)?.focus()
  })
}
