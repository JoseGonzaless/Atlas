import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils/format-currency'

interface Props {
  amount: number
  /** Sign or symbol rendered before the dollars (e.g. '+' / '-'). */
  prefix?: string
  /** Applied to the outer span (e.g. a color). */
  className?: string
  /** Applied to the fractional ("cents") part. */
  fractionClassName?: string
}

export function SplitAmount({ amount, prefix = '', className, fractionClassName = 'text-muted-foreground' }: Props) {
  const formatted = formatCurrency(amount)
  const dotIndex = formatted.indexOf('.')
  if (dotIndex === -1)
    return <span className={cn('text-sm font-semibold tabular-nums', className)}>{prefix}{formatted}</span>
  return (
    <span className={cn('text-sm tabular-nums', className)}>
      <span className="font-semibold">{prefix}{formatted.slice(0, dotIndex)}</span>
      <span className={fractionClassName}>{formatted.slice(dotIndex)}</span>
    </span>
  )
}
