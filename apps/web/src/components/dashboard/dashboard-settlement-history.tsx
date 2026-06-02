import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { CircleCheck, ClockAlert } from 'lucide-react'
import type { SettlementPeriod, Settlement } from '@/lib/db/settlement'
import { cn } from '@/lib/utils'
import { calcSettlementOutcome } from '@/lib/utils/balance-calc'
import { formatCurrency } from '@/lib/utils/format-currency'
import { formatPeriodLabel } from '@/lib/utils/period-label'

interface Props {
  recentClosedPeriods: SettlementPeriod[]
  settlementsByPeriod: Map<string, Settlement[]>
  currentUserId: string
}

function OutcomeAmount({ direction, amount }: { direction: string; amount: number }) {
  if (direction === 'even' || direction === 'none') {
    return <span className="text-sm text-muted-foreground tabular-nums">—</span>
  }

  const formatted = formatCurrency(amount)
  const dotIndex = formatted.indexOf('.')
  const prefix = direction === 'owed' ? '+' : '-'
  const colorClass = direction === 'owed' ? 'text-positive' : 'text-negative'

  if (dotIndex === -1)
    return <span className={cn('text-sm font-semibold tabular-nums', colorClass)}>{prefix}{formatted}</span>

  return (
    <span className={cn('text-sm font-semibold tabular-nums', colorClass)}>
      {prefix}{formatted.slice(0, dotIndex)}
      <span className="font-normal opacity-70">{formatted.slice(dotIndex)}</span>
    </span>
  )
}

export function DashboardSettlementHistory({
  recentClosedPeriods,
  settlementsByPeriod,
  currentUserId,
}: Props) {
  if (recentClosedPeriods.length === 0) return null

  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-0">
      <div className="flex items-start justify-between gap-2 pb-3">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Settlement History
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Past periods</p>
        </div>
        <Link
          to="/settlements"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
        >
          View all →
        </Link>
      </div>

      <div className="divide-y divide-border -mx-4">
        {recentClosedPeriods.map(period => {
          const isOutstanding = period.status === 'outstanding'
          const periodSettlements = settlementsByPeriod.get(period.id) ?? []
          const { direction, amount } = calcSettlementOutcome(periodSettlements, currentUserId)

          const confirmedAt = periodSettlements
            .filter(s => s.status === 'confirmed' && s.confirmedAt)
            .map(s => s.confirmedAt as Date)
            .sort((a, b) => b.getTime() - a.getTime())[0]

          const directionLabel =
            direction === 'owed' ? 'you were owed' :
            direction === 'owes' ? 'you owed' :
            'all even'

          const subText = isOutstanding
            ? 'Overdue · Needs settlement'
            : confirmedAt
              ? `Settled ${format(confirmedAt, 'MMM d, yyyy')} · ${directionLabel}`
              : directionLabel

          return (
            <Link
              key={period.id}
              to="/settlement/$id"
              params={{ id: period.id }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
            >
              <div
                className={cn(
                  'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                  isOutstanding
                    ? 'bg-shared/10 text-shared'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {isOutstanding
                  ? <ClockAlert className="h-4 w-4" />
                  : <CircleCheck className="h-4 w-4" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{formatPeriodLabel(period)}</p>
                <p
                  className={cn(
                    'text-xs mt-0.5',
                    isOutstanding ? 'text-shared' : 'text-muted-foreground',
                  )}
                >
                  {subText}
                </p>
              </div>
              {isOutstanding
                ? <span className="text-xs font-medium text-shared shrink-0">Outstanding</span>
                : <OutcomeAmount direction={direction} amount={amount} />
              }
            </Link>
          )
        })}
      </div>
    </div>
  )
}
