import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import {
  useUser,
  usePartnership,
  useExpenses,
  useActiveSettlementPeriod,
  useSharedPeriodExpenses,
  usePendingSettlement,
  useConfirmedSettlements,
  useSettlementPeriods,
  useSettlements,
  useRespondToSettlement,
} from '@/lib/hooks'
import { toast } from 'sonner'
import { useAuth } from '@/lib/use-auth'
import type { Settlement } from '@/lib/db/settlement'
import { DashboardSummaryBar } from '@/components/dashboard/dashboard-summary-bar'
import { DashboardPeriodCard } from '@/components/dashboard/dashboard-period-card'
import { DashboardRecentShared } from '@/components/dashboard/dashboard-recent-shared'
import { DashboardRecentPersonal } from '@/components/dashboard/dashboard-recent-personal'
import { DashboardSettlementHistory } from '@/components/dashboard/dashboard-settlement-history'
import { PendingSettlementBanner } from '@/components/expenses/pending-settlement-banner'
import { Skeleton } from '@/components/ui/skeleton'
import { calcBalance, calcNetBalance } from '@/lib/utils/balance-calc'
import { formatCurrency } from '@/lib/utils/format-currency'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user: authUser } = useAuth()

  const { data: partnership } = usePartnership()

  const { data: allExpenses = [], isLoading: expensesLoading } = useExpenses()
  const { data: activePeriod, isLoading: periodLoading } = useActiveSettlementPeriod()
  const { data: periodExpenses = [], isLoading: periodExpensesLoading } = useSharedPeriodExpenses(activePeriod?.id)
  const { data: pendingSettlement = null } = usePendingSettlement(activePeriod?.id)
  const { data: confirmedSettlements = [] } = useConfirmedSettlements(activePeriod?.id)
  const { data: allPeriods = [], isLoading: periodsLoading } = useSettlementPeriods()
  const { data: allSettlements = [], isLoading: settlementsLoading } = useSettlements()

  const respondToSettlement = useRespondToSettlement()

  const partnerUserId = partnership?.userIds.find(id => id !== authUser?.id)
  const { data: partnerUser } = useUser(partnerUserId)

  const isLoading =
    expensesLoading ||
    periodLoading ||
    periodsLoading ||
    settlementsLoading ||
    (!!activePeriod && periodExpensesLoading)

  const recentClosedPeriods = useMemo(
    () =>
      [...allPeriods]
        .filter(p => p.status === 'settled' || p.status === 'outstanding')
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
        .slice(0, 3),
    [allPeriods],
  )

  const settlementsByPeriod = useMemo(() => {
    const map = new Map<string, Settlement[]>()
    for (const s of allSettlements) {
      const list = map.get(s.periodId) ?? []
      list.push(s)
      map.set(s.periodId, list)
    }
    return map
  }, [allSettlements])

  const recentShared = useMemo(
    () =>
      [...allExpenses]
        .filter(e => e.scope === 'shared')
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5),
    [allExpenses],
  )

  const recentPersonal = useMemo(
    () =>
      [...allExpenses]
        .filter(e => e.scope === 'personal' && e.paidBy === authUser?.id)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5),
    [allExpenses, authUser?.id],
  )

  const thisMonthStats = useMemo(() => {
    const now = new Date()
    const thisMonthExpenses = allExpenses.filter(e =>
      isWithinInterval(e.date, { start: startOfMonth(now), end: endOfMonth(now) }),
    )
    const sharedThisMonth = thisMonthExpenses.filter(e => e.scope === 'shared')
    const personalThisMonth = thisMonthExpenses.filter(
      e => e.scope === 'personal' && e.paidBy === authUser?.id,
    )
    const totalSharedThisMonth = sharedThisMonth.reduce((sum, e) => sum + e.amount, 0)
    const personalTotal = personalThisMonth.reduce((sum, e) => sum + e.amount, 0)
    return {
      totalThisMonth: personalTotal + totalSharedThisMonth / 2,
      personalTotal,
      personalCount: personalThisMonth.length,
    }
  }, [allExpenses, authUser?.id])

  const { balanceAmount, direction } = useMemo(
    () => calcNetBalance(periodExpenses, authUser?.id ?? '', confirmedSettlements),
    [periodExpenses, authUser?.id, confirmedSettlements],
  )

  const periodBalance = calcBalance(periodExpenses, authUser?.id ?? '')

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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-28 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-52 rounded-xl" />
          <Skeleton className="h-52 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl">Dashboard</h1>

      <DashboardSummaryBar
        totalThisMonth={thisMonthStats.totalThisMonth}
        personalTotal={thisMonthStats.personalTotal}
        personalCount={thisMonthStats.personalCount}
        balanceAmount={balanceAmount}
        direction={direction}
        partnerName={partnerUser?.displayName ?? 'Partner'}
        activePeriod={activePeriod ?? null}
      />

      {activePeriod ? (
        <div className="flex flex-col gap-3">
          <DashboardPeriodCard
            period={activePeriod}
            totalShared={periodBalance.totalShared}
            userPaid={periodBalance.userPaid}
            userShare={periodBalance.userShare}
          />
          {pendingSettlement && authUser?.id && (
            <PendingSettlementBanner
              settlement={pendingSettlement}
              currentUserId={authUser.id}
              partnerName={partnerUser?.displayName ?? 'Partner'}
              onCancel={handleCancelSettle}
              onConfirm={handleConfirmSettle}
              onReject={handleRejectSettle}
              isLoading={respondToSettlement.isPending}
            />
          )}
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">No active settlement period.</p>
          <Link
            to="/shared"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Go to Shared Ledger →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardRecentShared
          expenses={recentShared}
          currentUserId={authUser?.id ?? ''}
          partnerName={partnerUser?.displayName ?? 'Partner'}
        />
        <DashboardRecentPersonal expenses={recentPersonal} />
      </div>

      <DashboardSettlementHistory
        recentClosedPeriods={recentClosedPeriods}
        settlementsByPeriod={settlementsByPeriod}
        currentUserId={authUser?.id ?? ''}
      />
    </div>
  )
}
