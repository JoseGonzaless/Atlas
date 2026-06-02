import { Link } from '@tanstack/react-router'
import type { SettlementPeriod } from '@/lib/db/settlement'
import { formatCurrency } from '@/lib/utils/format-currency'
import { formatPeriodLabel, formatTimeRemaining } from '@/lib/utils/period-label'

interface Props {
  period: SettlementPeriod
  totalShared: number
  userPaid: number
  userShare: number
}

export function DashboardPeriodCard({ period, totalShared, userPaid, userShare }: Props) {
  const timeLabel = formatTimeRemaining(period.endDate)
  const timeText = timeLabel === 'Overdue' ? 'Overdue' : `${timeLabel} until settlement`

  return (
    <div className="rounded-xl bg-primary text-primary-foreground p-5 relative overflow-hidden">
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full border border-primary-foreground/10" />
      <div className="pointer-events-none absolute -bottom-5 -right-5 h-28 w-28 rounded-full border border-primary-foreground/10" />
      <div className="pointer-events-none absolute bottom-1 right-1 h-14 w-14 rounded-full border border-primary-foreground/10" />

      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/60">
            Current Settlement Period
          </p>
          <p className="font-display italic text-2xl leading-snug">
            {formatPeriodLabel(period)}
          </p>
          <p className="text-sm text-primary-foreground/70 mt-0.5">{timeText}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 text-right shrink-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/60">
              Total Shared
            </p>
            <p className="font-mono tabular-nums font-semibold mt-0.5">
              {formatCurrency(totalShared)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/60">
              You Paid
            </p>
            <p className="font-mono tabular-nums font-semibold mt-0.5">
              {formatCurrency(userPaid)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/60">
              Your Share
            </p>
            <p className="font-mono tabular-nums font-semibold mt-0.5">
              {formatCurrency(userShare)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Link
          to="/shared"
          className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
        >
          Go to Shared Ledger →
        </Link>
      </div>
    </div>
  )
}
