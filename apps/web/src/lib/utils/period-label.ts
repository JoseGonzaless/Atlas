import { format, isPast, differenceInHours } from 'date-fns'
import type { SettlementPeriod } from '../db/settlement'

export function formatPeriodLabel(period: SettlementPeriod): string {
  const start = format(period.startDate, 'MMM d')
  const end = format(period.endDate, 'MMM d')
  return `Week of ${start} – ${end}`
}

export function formatTimeRemaining(endDate: Date): string {
  if (isPast(endDate)) return 'Overdue'

  const totalHours = differenceInHours(endDate, new Date())
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  return `${days} days, ${hours} hours`
}
