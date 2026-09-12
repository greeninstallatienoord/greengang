export function formatNlDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long' }).format(date)
}
