import { Badge } from '@/components/ui/badge'
import type { SettlementPeriodStatus, SettlementStatus } from '@/lib/db/settlement'

type PeriodProps = { type: 'period'; status: SettlementPeriodStatus }
type SettlementProps = { type: 'settlement'; status: SettlementStatus }
type Props = PeriodProps | SettlementProps

const PERIOD_CONFIG: Record<SettlementPeriodStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-primary/10 text-primary border-primary/20' },
  outstanding: { label: 'Outstanding', className: 'bg-shared/10 text-shared border-shared/20' },
  settled: { label: 'Settled', className: 'bg-positive/10 text-positive border-positive/20' },
}

const SETTLEMENT_CONFIG: Record<SettlementStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-muted text-muted-foreground border-border' },
  confirmed: { label: 'Confirmed', className: 'bg-positive/10 text-positive border-positive/20' },
  rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20' },
}

export function SettlementStatusBadge(props: Props) {
  const config =
    props.type === 'period'
      ? PERIOD_CONFIG[props.status]
      : SETTLEMENT_CONFIG[props.status]

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
