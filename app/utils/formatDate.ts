/** `2026-11-27` → `27 de novembro de 2026` in the given locale. Dates are calendar dates, so UTC. */
export function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date))
}
