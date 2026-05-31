import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import {
  usePartnership,
  useSettlementPeriods,
  useSettlements,
  useUser,
} from '@/lib/hooks'
import { useAuth } from '@/lib/use-auth'
import type { Settlement } from '@/lib/db/settlement'
import { SettlementPeriodCard } from '@/components/settlements/settlement-period-card'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/settlements')({
  component: SettlementsPage,
})

function SettlementsPage() {
  const { user: authUser } = useAuth()

  const { data: partnership } = usePartnership()
  const { data: periods = [], isLoading: periodsLoading } = useSettlementPeriods()
  const { data: allSettlements = [], isLoading: settlementsLoading } = useSettlements()

  const partnerUserId = partnership?.userIds.find(id => id !== authUser?.id)
  const { data: partnerUser } = useUser(partnerUserId)

  const isLoading = periodsLoading || settlementsLoading

  // Group settlements by their periodId so cards don't fetch individually
  const settlementsByPeriod = useMemo(() => {
    const map = new Map<string, Settlement[]>()
    for (const s of allSettlements) {
      const list = map.get(s.periodId) ?? []
      list.push(s)
      map.set(s.periodId, list)
    }
    return map
  }, [allSettlements])

  const sortedPeriods = useMemo(
    () => [...periods].sort((a, b) => b.startDate.getTime() - a.startDate.getTime()),
    [periods],
  )

  // Loading skeleton — wait for periods and settlements to resolve
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl">Settlements</h1>
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map(i => (
            <Skeleton key={i} className="h-[72px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  // Unlinked — no partnership yet
  if (!partnership) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl">Settlements</h1>
        <div className="rounded-xl border bg-card p-8 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">
            You're not linked to a partner yet. Link a partner to start tracking shared expenses.
          </p>
          <Link
            to="/settings"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Go to Settings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <h1 className="font-display text-3xl">Settlements</h1>

      {/* Period list */}
      {sortedPeriods.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No settlements yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedPeriods.map(period => (
            <SettlementPeriodCard
              key={period.id}
              period={period}
              settlements={settlementsByPeriod.get(period.id) ?? []}
              currentUserId={authUser?.id ?? ''}
              partnerName={partnerUser?.displayName ?? 'Partner'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

