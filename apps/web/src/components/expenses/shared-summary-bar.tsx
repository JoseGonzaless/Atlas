import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Expense } from '@/lib/db/expense'
import type { Settlement } from '@/lib/db/settlement'
import { calcNetBalance } from '@/lib/utils/balance-calc'
import { formatCurrency } from '@/lib/utils/format-currency'

interface Props {
  expenses: Expense[]
  currentUserId: string
  partnerName: string
  confirmedSettlements?: Settlement[]
}

export function SharedSummaryBar({ expenses, currentUserId, partnerName, confirmedSettlements = [] }: Props) {
  // calcNetBalance returns the gross fields (userPaid/partnerPaid/totalShared)
  // alongside the settlement-adjusted net, so one call covers the whole strip.
  const { userPaid, partnerPaid, totalShared, balanceAmount, direction } = calcNetBalance(
    expenses,
    currentUserId,
    confirmedSettlements,
  )

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Total spent
        </p>
        <p className="text-2xl font-semibold font-mono tabular-nums">
          {formatCurrency(totalShared)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          You paid
        </p>
        <p className="text-2xl font-semibold font-mono tabular-nums">
          {formatCurrency(userPaid)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {partnerName} paid {formatCurrency(partnerPaid)}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Net balance
        </p>
        {direction === 'none' || direction === 'even' ? (
          <>
            <p className="text-2xl font-semibold font-mono tabular-nums flex items-center gap-1.5">
              <Minus className="h-5 w-5 text-muted-foreground shrink-0" />
              {formatCurrency(0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">All even</p>
          </>
        ) : direction === 'owed' ? (
          <>
            <p className="text-2xl font-semibold font-mono tabular-nums text-positive flex items-center gap-1.5">
              <TrendingUp className="h-5 w-5 shrink-0" />
              {formatCurrency(balanceAmount)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{partnerName} owes you</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-semibold font-mono tabular-nums text-negative flex items-center gap-1.5">
              <TrendingDown className="h-5 w-5 shrink-0" />
              {formatCurrency(balanceAmount)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">You owe {partnerName}</p>
          </>
        )}
      </div>
    </div>
  )
}
