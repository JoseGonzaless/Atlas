import { useMemo } from 'react'
import { startOfWeek, startOfMonth, isWithinInterval, differenceInCalendarDays } from 'date-fns'
import type { Expense } from '@/lib/db/expense'
import { formatCurrency } from '@/lib/utils/format-currency'

interface Props {
  expenses: Expense[]
  allExpenses: Expense[]
}

export function PersonalSummaryBar({ expenses, allExpenses }: Props) {
  const { totalSpent, thisWeekTotal, weeklyAvg } = useMemo(() => {
    const now = new Date()
    const total = expenses.reduce((sum, e) => sum + e.amount, 0)

    // Week-to-date and month-to-date both cap at `now` so future-dated entries
    // don't inflate the current window.
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const week = allExpenses
      .filter(e => isWithinInterval(e.date, { start: weekStart, end: now }))
      .reduce((sum, e) => sum + e.amount, 0)

    const monthStart = startOfMonth(now)
    const monthTotal = allExpenses
      .filter(e => isWithinInterval(e.date, { start: monthStart, end: now }))
      .reduce((sum, e) => sum + e.amount, 0)
    // Fractional elapsed weeks (min 1) so the average isn't overstated by
    // integer truncation early/mid-month.
    const elapsedWeeks = Math.max(1, differenceInCalendarDays(now, monthStart) / 7)
    const avg = monthTotal / elapsedWeeks

    return { totalSpent: total, thisWeekTotal: week, weeklyAvg: avg }
  }, [expenses, allExpenses])

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
        <p className="text-xs text-muted-foreground mt-1">Week to date</p>
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
