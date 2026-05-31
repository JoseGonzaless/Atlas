import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Expense } from '@/lib/db/expense'
import type { Settlement, SettlementPeriod } from '@/lib/db/settlement'
import { calcNetBalance } from '@/lib/utils/balance-calc'
import { formatCurrency } from '@/lib/utils/format-currency'
import { formatPeriodLabel } from '@/lib/utils/period-label'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  period: SettlementPeriod
  expenses: Expense[]
  currentUserId: string
  partnerName: string
  confirmedSettlements?: Settlement[]
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export function SettlePeriodDialog({
  open,
  onOpenChange,
  period,
  expenses,
  currentUserId,
  partnerName,
  confirmedSettlements,
  onConfirm,
  isLoading,
}: Props) {
  const { userPaid, partnerPaid, totalShared, userShare, balanceAmount, direction } = calcNetBalance(
    expenses,
    currentUserId,
    confirmedSettlements ?? [],
  )

  const outcomeLabel =
    direction === 'none' || direction === 'even'
      ? 'Outcome'
      : direction === 'owes'
        ? `You owe ${partnerName}`
        : `${partnerName} owes you`

  const outcomeValue =
    direction === 'none' || direction === 'even' ? 'All even' : formatCurrency(balanceAmount)

  const outcomeClass =
    direction === 'owes'
      ? 'text-negative'
      : direction === 'owed'
        ? 'text-positive'
        : 'text-muted-foreground'

  return (
    <Dialog open={open} onOpenChange={open => { if (!isLoading) onOpenChange(open) }}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Settle {formatPeriodLabel(period)}?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This sends a settlement request to {partnerName}. Once they confirm, the net balance
          resets — but all expenses stay visible for the rest of the period.
        </p>

        <div className="rounded-lg border bg-muted/30 p-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">You paid</span>
            <span className="font-mono tabular-nums">{formatCurrency(userPaid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{partnerName} paid</span>
            <span className="font-mono tabular-nums">{formatCurrency(partnerPaid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-mono tabular-nums">{formatCurrency(totalShared)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Your share</span>
            <span className="font-mono tabular-nums">{formatCurrency(userShare)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>{outcomeLabel}</span>
            <span className={`font-mono tabular-nums ${outcomeClass}`}>{outcomeValue}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Sending…' : 'Send request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
