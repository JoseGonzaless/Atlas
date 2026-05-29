export function formatAmountInput(raw: string): string {
  if (!raw) return ''
  const [int, dec] = raw.split('.')
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec !== undefined ? `${formatted}.${dec}` : formatted
}
