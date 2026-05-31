import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import {
  useCurrentUser,
  useInitiateSettlement,
  usePartnership,
  usePendingSettlement,
  useRespondToSettlement,
  useSettlementPeriods,
  useSettlements,
  useSharedPeriodExpenses,
  useUser,
} from '@/lib/hooks'
import { useAuth } from '@/lib/use-auth'
import { toast } from 'sonner'
import { SettlementSummaryBar } from '@/components/settlements/settlement-summary-bar'
import { SettlementStatusBadge } from '@/components/settlements/settlement-status-badge'
import { PendingSettlementBanner } from '@/components/expenses/pending-settlement-banner'
import { SettlePeriodDialog } from '@/components/expenses/settle-period-dialog'
import { ExpenseTable } from '@/components/expenses/expense-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { calcNetBalance } from '@/lib/utils/balance-calc'
import { formatCurrency } from '@/lib/utils/format-currency'
import { formatPeriodLabel } from '@/lib/utils/period-label'

export const Route = createFileRoute('/settlement/$id')({
  component: SettlementPeriodPage,
})

function SettlementPeriodPage() {
  const { id } = Route.useParams()
  const { user: authUser } = useAuth()

  const { data: currentUser } = useCurrentUser()
  const { data: partnership } = usePartnership()
  const { data: allPeriods = [], isLoading: periodsLoading } = useSettlementPeriods()
  const { data: allSettlements = [], isLoading: settlementsLoading } = useSettlements()
  const { data: allPeriodExpenses = [], isLoading: expensesLoading } = useSharedPeriodExpenses(id)
  const { data: pendingSettlement = null } = usePendingSettlement(id)
  const initiateSettlement = useInitiateSettlement()
  const respondToSettlement = useRespondToSettlement()

  const partnerUserId = partnership?.userIds.find(uid => uid !== authUser?.id)
  const { data: partnerUser } = useUser(partnerUserId)

  const [settleOpen, setSettleOpen] = useState(false)

  const isLoading = periodsLoading || settlementsLoading || expensesLoading

  const period = useMemo(() => allPeriods.find(p => p.id === id), [allPeriods, id])

  const periodSettlements = useMemo(
    () => allSettlements.filter(s => s.periodId === id),
    [allSettlements, id],
  )

  const confirmed = useMemo(
    () =>
      periodSettlements
        .filter(s => s.status === 'confirmed')
        .sort((a, b) => (a.confirmedAt?.getTime() ?? 0) - (b.confirmedAt?.getTime() ?? 0)),
    [periodSettlements],
  )

  // Union of expenseIds across all confirmed settlements — the frozen snapshot
  const snapshotIds = useMemo(
    () => new Set(confirmed.flatMap(s => s.expenseIds)),
    [confirmed],
  )

  const snapshotExpenses = useMemo(
    () => (snapshotIds.size > 0 ? allPeriodExpenses.filter(e => snapshotIds.has(e.id)) : allPeriodExpenses),
    [allPeriodExpenses, snapshotIds],
  )

  const userMap = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    if (authUser?.id) map[authUser.id] = currentUser?.displayName ?? 'You'
    if (partnerUserId && partnerUser?.displayName) map[partnerUserId] = partnerUser.displayName
    return map
  }, [authUser?.id, currentUser?.displayName, partnerUserId, partnerUser?.displayName])

  const currentUserId = authUser?.id ?? ''
  const partnerName = partnerUser?.displayName ?? 'Partner'

  const backLink = (
    <Link
      to="/settlements"
      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-fit -ml-2 gap-1.5')}
    >
      <ArrowLeft className="h-4 w-4" />
      Settlements
    </Link>
  )

  async function handleInitiateSettle() {
    if (!period || !partnership || !authUser?.id || !partnerUserId) return
    const { balanceAmount, direction } = calcNetBalance(allPeriodExpenses, authUser.id, confirmed)
    const fromUserId = direction === 'owes' ? authUser.id : partnerUserId
    const toUserId = direction === 'owes' ? partnerUserId : authUser.id
    try {
      await initiateSettlement.mutateAsync({
        periodId: period.id,
        partnershipId: partnership.id,
        fromUserId,
        toUserId,
        amount: balanceAmount,
        initiatedBy: authUser.id,
        partnerDisplayNameSnapshot: partnerName,
      })
      setSettleOpen(false)
      toast.success('Settlement request sent — waiting for confirmation.')
    } catch {
      toast.error("Couldn't send the settlement request. Try again.")
    }
  }

  async function handleCancelSettle() {
    if (!pendingSettlement || !authUser?.id) return
    try {
      await respondToSettlement.mutateAsync({
        settlementId: pendingSettlement.id,
        response: 'rejected',
        respondedBy: authUser.id,
      })
      toast.success('Settlement request cancelled.')
    } catch {
      toast.error("Couldn't cancel the request. Try again.")
    }
  }

  async function handleConfirmSettle() {
    if (!pendingSettlement || !authUser?.id) return
    try {
      await respondToSettlement.mutateAsync({
        settlementId: pendingSettlement.id,
        response: 'confirmed',
        respondedBy: authUser.id,
      })
      toast.success(
        pendingSettlement.amount > 0
          ? `Settled — ${formatCurrency(pendingSettlement.amount)}`
          : 'Settled — all even',
      )
    } catch {
      toast.error("Couldn't confirm the settlement. Try again.")
    }
  }

  async function handleRejectSettle() {
    if (!pendingSettlement || !authUser?.id) return
    try {
      await respondToSettlement.mutateAsync({
        settlementId: pendingSettlement.id,
        response: 'rejected',
        respondedBy: authUser.id,
      })
      toast.success('Settlement request rejected.')
    } catch {
      toast.error("Couldn't reject the request. Try again.")
    }
  }

  // Loading skeleton — wait for period, settlements, and expense snapshot to resolve
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {backLink}
        <Skeleton className="h-9 w-72 rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!period) {
    return (
      <div className="flex flex-col gap-6">
        {backLink}
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-muted-foreground">Settlement period not found.</p>
        </div>
      </div>
    )
  }

  const lastConfirmed = confirmed[confirmed.length - 1]
  const auditLine =
    lastConfirmed?.confirmedAt
      ? `Last settled on ${format(lastConfirmed.confirmedAt, 'MMM d, yyyy')}`
      : null

  const pageTitle = (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl">{formatPeriodLabel(period)}</h1>
        <SettlementStatusBadge type="period" status={period.status} />
      </div>
      {auditLine && <p className="text-sm text-muted-foreground">{auditLine}</p>}
    </div>
  )

  // Outstanding — period ended without settling; show full expense view with settle action
  if (period.status === 'outstanding') {
    return (
      <div className="flex flex-col gap-6">
        {backLink}
        {/* Header — title, badge, and settle button all on one line */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl">{formatPeriodLabel(period)}</h1>
            <SettlementStatusBadge type="period" status={period.status} />
            {!pendingSettlement && allPeriodExpenses.length > 0 && (
              <Button
                size="sm"
                className="ml-auto bg-shared text-shared-foreground hover:bg-shared/90"
                onClick={() => setSettleOpen(true)}
              >
                Settle now
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            This period ended without a settlement — review the expenses below and settle when ready.
          </p>
        </div>
        {/* Pending settlement handshake banner */}
        {pendingSettlement && authUser?.id && (
          <PendingSettlementBanner
            settlement={pendingSettlement}
            currentUserId={currentUserId}
            partnerName={partnerName}
            onCancel={handleCancelSettle}
            onConfirm={handleConfirmSettle}
            onReject={handleRejectSettle}
            isLoading={respondToSettlement.isPending}
          />
        )}
        {/* Summary cards */}
        <SettlementSummaryBar
          confirmed={confirmed}
          expenses={allPeriodExpenses}
          currentUserId={currentUserId}
          partnerName={partnerName}
          variant="outstanding"
        />
        {/* Expense list */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Expenses
          </p>
          <ExpenseTable
            expenses={allPeriodExpenses}
            userMap={userMap}
            currentUserId={currentUserId}
            hiddenColumns={['status']}
            readOnly
          />
        </div>
        <SettlePeriodDialog
          open={settleOpen}
          onOpenChange={setSettleOpen}
          period={period}
          expenses={allPeriodExpenses}
          currentUserId={currentUserId}
          partnerName={partnerName}
          confirmedSettlements={confirmed}
          onConfirm={handleInitiateSettle}
          isLoading={initiateSettlement.isPending}
        />
      </div>
    )
  }

  if (confirmed.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {backLink}
        {pageTitle}
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            No settlements have been recorded for this period.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {backLink}
      {pageTitle}
      {/* Summary cards */}
      <SettlementSummaryBar
        confirmed={confirmed}
        expenses={snapshotExpenses}
        currentUserId={currentUserId}
        partnerName={partnerName}
      />

      {/* Expense snapshot */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Expense Snapshot
        </p>
        {snapshotExpenses.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">No expense snapshot available.</p>
          </div>
        ) : (
          <ExpenseTable
            expenses={snapshotExpenses}
            userMap={userMap}
            currentUserId={currentUserId}
            hiddenColumns={['status']}
            readOnly
          />
        )}
      </div>
    </div>
  )
}
