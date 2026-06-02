import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import type { Expense } from '@/lib/db/expense'
import { cn } from '@/lib/utils'
import { getCategoryIconColor } from '@/lib/utils/category-colors'
import { getCategoryIcon } from '@/lib/utils/category-icons'
import { SplitAmount } from '@/components/ui/split-amount'

interface Props {
  expenses: Expense[]
  currentUserId: string
  partnerName: string
}

export function DashboardRecentShared({ expenses, currentUserId, partnerName }: Props) {
  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col">
      <div className="flex items-start justify-between gap-2 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Recent Shared
            </h2>
            <span className="flex items-center gap-1 rounded-full bg-shared/10 px-2 py-0.5 text-xs font-medium text-shared">
              <span className="h-1.5 w-1.5 rounded-full bg-shared" />
              Recent
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Both of you can see this</p>
        </div>
        <Link
          to="/shared"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
        >
          View all →
        </Link>
      </div>

      {expenses.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">No shared expenses yet.</p>
      ) : (
        <div className="divide-y divide-border -mx-4">
          {expenses.map(e => {
            const Icon = getCategoryIcon(e.category)
            const iconColor = getCategoryIconColor(e.category)
            const paidByLabel = e.paidBy === currentUserId ? 'You paid' : `${partnerName} paid`
            return (
              <div key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                <div
                  className={cn(
                    'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                    iconColor,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{e.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(e.date, "MMM d '·' h:mma")} · {paidByLabel}
                  </p>
                </div>
                <SplitAmount amount={e.amount} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
