import type { Settlement } from '@/lib/db/settlement'
import type { Expense } from '@/lib/db/expense'
import { calcBalance, calcNetBalance, calcSettlementOutcome } from '@/lib/utils/balance-calc'
import { formatCurrency } from '@/lib/utils/format-currency'

interface Props {
  confirmed: Settlement[]
  expenses: Expense[]
  currentUserId: string
  partnerName: string
  variant?: 'settled' | 'outstanding'
}

export function SettlementSummaryBar({ confirmed, expenses, currentUserId, partnerName, variant = 'settled' }: Props) {
  const { totalShared, userShare } = calcBalance(expenses, currentUserId)

  let outcomeDirection: ReturnType<typeof calcSettlementOutcome>['direction']
  let outcomeAmount: number

  if (variant === 'outstanding') {
    const net = calcNetBalance(expenses, currentUserId, confirmed)
    outcomeDirection = net.direction
    outcomeAmount = net.balanceAmount
  } else {
    const outcome = calcSettlementOutcome(confirmed, currentUserId)
    outcomeDirection = outcome.direction
    outcomeAmount = outcome.amount
  }

  const thirdCardTitle = variant === 'outstanding' ? 'Balance' : 'Settlement'

  const outcomeColor =
    outcomeDirection === 'owed'
      ? 'text-positive'
      : outcomeDirection === 'owes'
        ? 'text-negative'
        : 'text-muted-foreground'

  const outcomeLabel =
    outcomeDirection === 'none' || outcomeDirection === 'even'
      ? 'All even'
      : outcomeDirection === 'owed'
        ? variant === 'outstanding' ? `${partnerName} owes you` : `${partnerName} owed you`
        : variant === 'outstanding' ? `You owe ${partnerName}` : `You owed ${partnerName}`

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Total shared
        </p>
        <p className="text-2xl font-semibold font-mono tabular-nums">{formatCurrency(totalShared)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Each share
        </p>
        <p className="text-2xl font-semibold font-mono tabular-nums">{formatCurrency(userShare)}</p>
        <p className="text-xs text-muted-foreground mt-1">50 / 50 split</p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          {thirdCardTitle}
        </p>
        <p className={`text-2xl font-semibold font-mono tabular-nums ${outcomeColor}`}>
          {outcomeDirection === 'even' || outcomeDirection === 'none'
            ? formatCurrency(0)
            : formatCurrency(outcomeAmount)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{outcomeLabel}</p>
      </div>
    </div>
  )
}
