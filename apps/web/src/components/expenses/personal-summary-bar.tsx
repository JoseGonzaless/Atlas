import { startOfWeek, endOfWeek, startOfMonth, isWithinInterval, differenceInWeeks } from 'date-fns'
import type { Expense } from '@/lib/db/expense'
import { formatCurrency } from '@/lib/utils/format-currency'

interface Props {
  expenses: Expense[]
  allExpenses: Expense[]
}

export function PersonalSummaryBar({ expenses, allExpenses }: Props) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
  const thisWeekTotal = allExpenses
    .filter(e => isWithinInterval(e.date, { start: weekStart, end: weekEnd }))
    .reduce((sum, e) => sum + e.amount, 0)

  const monthStart = startOfMonth(now)
  const monthTotal = allExpenses
    .filter(e => isWithinInterval(e.date, { start: monthStart, end: now }))
    .reduce((sum, e) => sum + e.amount, 0)
  const completedWeeks = Math.max(1, differenceInWeeks(now, monthStart))
  const weeklyAvg = monthTotal / completedWeeks

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Total spent
        </p>
        <p className="text-2xl font-semibold font-mono tabular-nums">
          {formatCurrency(totalSpent)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          This week
        </p>
        <p className="text-2xl font-semibold font-mono tabular-nums">
          {formatCurrency(thisWeekTotal)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Mon – Sun</p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Weekly avg
        </p>
        <p className="text-2xl font-semibold font-mono tabular-nums">
          {formatCurrency(weeklyAvg)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">this month</p>
      </div>
    </div>
  )
}
