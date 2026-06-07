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
import { DashboardSummaryBar } from '@/components/dashboard/dashboard-summary-bar'
import { DashboardPeriodCard } from '@/components/dashboard/dashboard-period-card'
import { DashboardRecentShared } from '@/components/dashboard/dashboard-recent-shared'
import { DashboardRecentPersonal } from '@/components/dashboard/dashboard-recent-personal'
import { DashboardSettlementHistory } from '@/components/dashboard/dashboard-settlement-history'
import { PendingSettlementBanner } from '@/components/expenses/pending-settlement-banner'
import { Skeleton } from '@/components/ui/skeleton'
import { calcNetBalance } from '@/lib/utils/balance-calc'
import { formatCurrency } from '@/lib/utils/format-currency'
import { groupSettlementsByPeriod } from '@/lib/utils/group-settlements'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user: authUser } = useAuth()

  const { data: partnership, isLoading: partnershipLoading } = usePartnership()

  const ownId = authUser?.id ?? ''
  // Fetch only what the dashboard renders. Personal expenses are private to their
  // owner, so scope the personal query to the current user instead of pulling the
  // whole partnership's expenses (which includes the partner's personal rows) and
  // filtering in the browser.
  // NOTE(backend): the API must enforce this — never return another user's
  // personal expenses regardless of the requested filter.
  const { data: sharedExpenses = [], isLoading: sharedLoading } = useExpenses({ scope: 'shared' })
  const { data: personalExpenses = [], isLoading: personalLoading } = useExpenses({
    scope: 'personal',
    paidBy: ownId,
  })
  const { data: activePeriod, isLoading: periodLoading } = useActiveSettlementPeriod()
  const { data: periodExpenses = [], isLoading: periodExpensesLoading } = useSharedPeriodExpenses(activePeriod?.id)
  const { data: pendingSettlement = null } = usePendingSettlement(activePeriod?.id)
  const { data: confirmedSettlements = [] } = useConfirmedSettlements(activePeriod?.id)
  const { data: allPeriods = [], isLoading: periodsLoading } = useSettlementPeriods()
  const { data: allSettlements = [], isLoading: settlementsLoading } = useSettlements()

  const respondToSettlement = useRespondToSettlement()

  const partnerUserId = partnership?.userIds.find(id => id !== authUser?.id)
  const { data: partnerUser, isLoading: partnerLoading } = useUser(partnerUserId)

  const isLoading =
    partnershipLoading ||
    partnerLoading ||
    sharedLoading ||
    personalLoading ||
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

  const settlementsByPeriod = useMemo(
    () => groupSettlementsByPeriod(allSettlements),
    [allSettlements],
  )

  const recentShared = useMemo(
    () => [...sharedExpenses].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5),
    [sharedExpenses],
  )

  const recentPersonal = useMemo(
    () => [...personalExpenses].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5),
    [personalExpenses],
  )

  const thisMonthStats = useMemo(() => {
    const now = new Date()
    const start = startOfMonth(now)
    const end = endOfMonth(now)
    const sharedThisMonth = sharedExpenses.filter(e => isWithinInterval(e.date, { start, end }))
    const personalThisMonth = personalExpenses.filter(e => isWithinInterval(e.date, { start, end }))
    const totalSharedThisMonth = sharedThisMonth.reduce((sum, e) => sum + e.amount, 0)
    const personalTotal = personalThisMonth.reduce((sum, e) => sum + e.amount, 0)
    return {
      totalThisMonth: personalTotal + totalSharedThisMonth / 2,
      personalTotal,
      personalCount: personalThisMonth.length,
    }
  }, [sharedExpenses, personalExpenses])

  // calcNetBalance returns the gross fields (totalShared/userPaid/userShare) too,
  // so one memoized call covers both the summary balance and the period card.
  const periodNet = useMemo(
    () => calcNetBalance(periodExpenses, ownId, confirmedSettlements),
    [periodExpenses, ownId, confirmedSettlements],
  )

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
        balanceAmount={periodNet.balanceAmount}
        direction={periodNet.direction}
        partnerName={partnerUser?.displayName ?? 'Partner'}
        activePeriod={activePeriod ?? null}
      />

      {activePeriod ? (
        <div className="flex flex-col gap-3">
          <DashboardPeriodCard
            period={activePeriod}
            totalShared={periodNet.totalShared}
            userPaid={periodNet.userPaid}
            userShare={periodNet.userShare}
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
