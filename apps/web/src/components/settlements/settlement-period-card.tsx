import { ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { SettlementPeriod, Settlement } from '@/lib/db/settlement'
import { SettlementStatusBadge } from './settlement-status-badge'
import { calcSettlementOutcome } from '@/lib/utils/balance-calc'
import { formatCurrency } from '@/lib/utils/format-currency'
import { formatPeriodLabel } from '@/lib/utils/period-label'

interface Props {
  period: SettlementPeriod
  settlements: Settlement[]
  currentUserId: string
  partnerName: string
}

export function SettlementPeriodCard({ period, settlements, currentUserId, partnerName }: Props) {
  const { direction, amount } = calcSettlementOutcome(settlements, currentUserId)

  const outcomeText =
    period.status === 'open'
      ? 'Active period'
      : direction === 'none' && period.status === 'outstanding'
        ? 'Unsettled'
        : direction === 'none' || direction === 'even'
          ? 'All even'
          : direction === 'owed'
            ? `${partnerName} owed you ${formatCurrency(amount)}`
            : `You owed ${partnerName} ${formatCurrency(amount)}`

  const outcomeColor =
    direction === 'owed'
      ? 'text-positive'
      : direction === 'owes'
        ? 'text-negative'
        : 'text-muted-foreground'

  return (
    <Link
      to="/settlement/$id"
      params={{ id: period.id }}
      className="rounded-xl border bg-card p-4 flex items-center gap-4 hover:bg-accent transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm">{formatPeriodLabel(period)}</p>
          <SettlementStatusBadge type="period" status={period.status} />
        </div>
        <p className={`text-xs mt-1 ${outcomeColor}`}>{outcomeText}</p>
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </Link>
  )
}
