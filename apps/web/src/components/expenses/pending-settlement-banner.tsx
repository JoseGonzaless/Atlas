import { Clock, HandshakeIcon } from 'lucide-react'
import type { Settlement } from '@/lib/db/settlement'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils/format-currency'

interface Props {
  settlement: Settlement
  currentUserId: string
  partnerName: string
  onCancel: () => void
  onConfirm: () => void
  onReject: () => void
  isLoading: boolean
}

export function PendingSettlementBanner({
  settlement,
  currentUserId,
  partnerName,
  onCancel,
  onConfirm,
  onReject,
  isLoading,
}: Props) {
  const iInitiated = settlement.initiatedBy === currentUserId
  const amountLabel = settlement.amount > 0
    ? formatCurrency(settlement.amount)
    : 'an even split'

  if (iInitiated) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium">Settlement request sent</p>
            <p className="text-xs text-muted-foreground">
              Waiting for {partnerName} to confirm {amountLabel}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
          className="shrink-0 text-muted-foreground"
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <HandshakeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium">{partnerName} wants to settle</p>
          <p className="text-xs text-muted-foreground">
            Requested {amountLabel} — confirm to reset the net balance
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onReject} disabled={isLoading}>
          Reject
        </Button>
        <Button size="sm" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Confirming…' : 'Confirm'}
        </Button>
      </div>
    </div>
  )
}
