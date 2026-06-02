import { formatCurrency } from '@/lib/utils/format-currency'

export function SplitAmount({ amount }: { amount: number }) {
  const formatted = formatCurrency(amount)
  const dotIndex = formatted.indexOf('.')
  if (dotIndex === -1) return <span className="text-sm font-semibold tabular-nums">{formatted}</span>
  return (
    <span className="text-sm tabular-nums">
      <span className="font-semibold">{formatted.slice(0, dotIndex)}</span>
      <span className="text-muted-foreground">{formatted.slice(dotIndex)}</span>
    </span>
  )
}
