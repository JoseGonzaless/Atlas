import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { SettlementPeriod } from '@/lib/db/settlement'
import type { BalanceResult } from '@/lib/utils/balance-calc'
import { formatCurrency } from '@/lib/utils/format-currency'
import { formatPeriodLabel } from '@/lib/utils/period-label'

interface Props {
  totalThisMonth: number
  personalTotal: number
  personalCount: number
  balanceAmount: number
  direction: BalanceResult['direction']
  partnerName: string
  activePeriod: SettlementPeriod | null
}

export function DashboardSummaryBar({
  totalThisMonth,
  personalTotal,
  personalCount,
  balanceAmount,
  direction,
  partnerName,
  activePeriod,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Total Spent This Month
        </p>
        <p className="text-2xl font-semibold font-mono tabular-nums">
          {formatCurrency(totalThisMonth)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">personal + your share</p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Shared Balance
        </p>
        {direction === 'none' || direction === 'even' ? (
          <>
            <p className="text-2xl font-semibold font-mono tabular-nums flex items-center gap-1.5">
              <Minus className="h-5 w-5 text-muted-foreground shrink-0" />
              {formatCurrency(0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {activePeriod ? formatPeriodLabel(activePeriod) : 'No active period'}
            </p>
          </>
        ) : direction === 'owed' ? (
          <>
            <p className="text-2xl font-semibold font-mono tabular-nums text-positive flex items-center gap-1.5">
              <TrendingUp className="h-5 w-5 shrink-0" />
              {formatCurrency(balanceAmount)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">you are owed</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-semibold font-mono tabular-nums text-negative flex items-center gap-1.5">
              <TrendingDown className="h-5 w-5 shrink-0" />
              {formatCurrency(balanceAmount)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">you owe {partnerName}</p>
          </>
        )}
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Personal This Month
        </p>
        <p className="text-2xl font-semibold font-mono tabular-nums">
          {formatCurrency(personalTotal)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {personalCount} transaction{personalCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
