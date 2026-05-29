import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import {
  useCurrentUser,
  useUser,
  usePartnership,
  useActiveSettlementPeriod,
  useSharedPeriodExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteWithUndo,
  useExpenseFilters,
  useInitiateSettlement,
  useRespondToSettlement,
  usePendingSettlement,
  useConfirmedSettlements,
} from '@/lib/hooks'
import { toast } from 'sonner'
import { useAuth } from '@/lib/useAuth'
import type { Expense } from '@/lib/db/expense'
import { ExpenseSummaryBar } from '@/components/expenses/ExpenseSummaryBar'
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters'
import { ExpenseTable } from '@/components/expenses/ExpenseTable'
import { AddExpenseDialog } from '@/components/expenses/AddExpenseDialog'
import { ExpenseForm, type ExpenseFormValues } from '@/components/expenses/ExpenseForm'
import { SettlePeriodDialog } from '@/components/expenses/SettlePeriodDialog'
import { PendingSettlementBanner } from '@/components/expenses/PendingSettlementBanner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { calcNetBalance } from '@/lib/utils/balanceCalc'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { formatPeriodLabel, formatTimeRemaining } from '@/lib/utils/periodLabel'

export const Route = createFileRoute('/shared')({
  component: SharedLedger,
})

function SharedLedger() {
  const { user: authUser } = useAuth()

  const { data: currentUser } = useCurrentUser()
  const { data: partnership } = usePartnership()
  const { data: activePeriod, isLoading: periodLoading } = useActiveSettlementPeriod()

  const { data: expenses = [], isLoading: expensesLoading } = useSharedPeriodExpenses(activePeriod?.id)
  const { data: pendingSettlement = null } = usePendingSettlement(activePeriod?.id)
  const { data: confirmedSettlements = [] } = useConfirmedSettlements(activePeriod?.id)

  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const initiateSettlement = useInitiateSettlement()
  const respondToSettlement = useRespondToSettlement()

  const [addOpen, setAddOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [settleOpen, setSettleOpen] = useState(false)
  const { pendingDeleteIds, handleDelete } = useDeleteWithUndo(expenses)
  const { filters, setFilters, filtered, hasActiveFilters, resetFilters } = useExpenseFilters(expenses, pendingDeleteIds)

  // Resolve partner
  const partnerUserId = partnership?.userIds.find(id => id !== authUser?.id)
  const { data: partnerUser } = useUser(partnerUserId)

  const users = useMemo(() => {
    const list: { id: string; displayName: string }[] = []
    if (currentUser) list.push({ id: currentUser.id, displayName: currentUser.displayName })
    if (partnerUser) list.push({ id: partnerUser.id, displayName: partnerUser.displayName })
    return list
  }, [currentUser, partnerUser])

  const userMap = useMemo<Record<string, string>>(
    () => Object.fromEntries(users.map(u => [u.id, u.displayName])),
    [users],
  )

  async function handleAdd(values: ExpenseFormValues) {
    if (!partnership || !activePeriod) return
    const date = parseISO(values.date)
    await createExpense.mutateAsync({
      partnershipId: partnership.id,
      scope: 'shared',
      amount: Number(values.amount),
      description: values.description.trim(),
      category: values.category,
      paidBy: values.paidBy,
      source: 'manual',
      date,
      settlementPeriodId: activePeriod.id,
    })
    setAddOpen(false)
  }

  async function handleEdit(values: ExpenseFormValues) {
    if (!editingExpense || !activePeriod) return
    const date = parseISO(values.date)
    await updateExpense.mutateAsync({
      id: editingExpense.id,
      data: {
        amount: Number(values.amount),
        description: values.description.trim(),
        category: values.category,
        date,
      },
    })
    setEditingExpense(null)
  }

  async function handleInitiateSettle() {
    if (!activePeriod || !partnership || !authUser?.id || !partnerUserId) return

    const { balanceAmount, direction } = calcNetBalance(expenses, authUser.id, confirmedSettlements)

    const fromUserId = direction === 'owes' ? authUser.id : partnerUserId
    const toUserId = direction === 'owes' ? partnerUserId : authUser.id

    try {
      await initiateSettlement.mutateAsync({
        periodId: activePeriod.id,
        partnershipId: partnership.id,
        fromUserId,
        toUserId,
        amount: balanceAmount,
        initiatedBy: authUser.id,
        partnerDisplayNameSnapshot: partnerUser?.displayName ?? 'Partner',
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

  const editInitialValues: ExpenseFormValues | undefined = editingExpense
    ? {
        amount: String(editingExpense.amount),
        description: editingExpense.description,
        category: editingExpense.category,
        paidBy: editingExpense.paidBy,
        date: format(editingExpense.date, 'yyyy-MM-dd'),
        notes: editingExpense.notes ?? '',
      }
    : undefined

  const respondLoading = respondToSettlement.isPending

  // Loading skeleton — wait for the period to resolve before deciding what to render
  if (periodLoading || (!!activePeriod && expensesLoading)) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl">Shared Ledger</h1>
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  // Unlinked — no partnership yet
  if (!partnership) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl">Shared Ledger</h1>
        <div className="rounded-xl border bg-card p-8 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">
            You're not linked to a partner yet. Link a partner to start a Shared Ledger.
          </p>
          <Link to="/settings" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            Go to Settings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <h1 className="font-display text-3xl">Shared Ledger</h1>

      {/* No active period */}
      {!activePeriod ? (
        <div className="rounded-xl border bg-card p-8 flex flex-col items-center gap-2 text-center">
          <p className="font-medium">No active settlement period</p>
          <p className="text-sm text-muted-foreground">
            A new period will start automatically.
          </p>
        </div>
      ) : (
        <>
          {/* Period header */}
          <div className="rounded-xl border bg-card p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Current period
              </p>
              <p className="font-semibold">{formatPeriodLabel(activePeriod)}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {formatTimeRemaining(activePeriod.endDate)} remaining
              </p>
            </div>
            {/* Settle now — hidden when there's nothing to settle or a request is pending */}
            {expenses.length > 0 && !pendingSettlement && (
              <Button size="sm" variant="outline" onClick={() => setSettleOpen(true)}>
                Settle now
              </Button>
            )}
          </div>

          {/* Pending settlement handshake banner */}
          {pendingSettlement && authUser?.id && (
            <PendingSettlementBanner
              settlement={pendingSettlement}
              currentUserId={authUser.id}
              partnerName={partnerUser?.displayName ?? 'Partner'}
              onCancel={handleCancelSettle}
              onConfirm={handleConfirmSettle}
              onReject={handleRejectSettle}
              isLoading={respondLoading}
            />
          )}

          {/* Totals strip — gross amounts + net adjusted for confirmed settlements */}
          <ExpenseSummaryBar
            expenses={filtered}
            currentUserId={authUser?.id ?? ''}
            partnerName={partnerUser?.displayName ?? 'Partner'}
            confirmedSettlements={confirmedSettlements}
          />

          {/* Filters + expense table */}
          <div className="flex flex-col gap-3">
            <ExpenseFilters filters={filters} users={users} onChange={setFilters} periodStart={activePeriod.startDate} periodEnd={activePeriod.endDate}>
              <AddExpenseDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                users={users}
                onSubmit={handleAdd}
                isLoading={createExpense.isPending}
                periodStart={activePeriod.startDate}
                periodEnd={activePeriod.endDate}
              />
            </ExpenseFilters>
            {expenses.length === 0 ? (
              <div className="rounded-xl border bg-card flex flex-col items-center justify-center py-16 gap-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No shared expenses logged yet this period.
                </p>
                <Button size="sm" onClick={() => setAddOpen(true)}>
                  Add expense
                </Button>
              </div>
            ) : filtered.length === 0 && hasActiveFilters ? (
              <div className="rounded-xl border bg-card flex flex-col items-center justify-center py-16 gap-4">
                <p className="text-sm text-muted-foreground">
                  No expenses match your filters.
                </p>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <ExpenseTable
                expenses={filtered}
                userMap={userMap}
                currentUserId={authUser?.id ?? ''}
                onEdit={setEditingExpense}
                onDelete={handleDelete}
              />
            )}
          </div>
        </>
      )}

      {/* Initiate settlement dialog */}
      {activePeriod && (
        <SettlePeriodDialog
          open={settleOpen}
          onOpenChange={setSettleOpen}
          period={activePeriod}
          expenses={expenses}
          currentUserId={authUser?.id ?? ''}
          partnerName={partnerUser?.displayName ?? 'Partner'}
          onConfirm={handleInitiateSettle}
          isLoading={initiateSettlement.isPending}
        />
      )}

      {/* Edit expense dialog */}
      <Dialog
        open={!!editingExpense}
        onOpenChange={open => {
          if (!open) setEditingExpense(null)
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Edit expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              initialValues={editInitialValues}
              users={users}
              onSubmit={handleEdit}
              onCancel={() => setEditingExpense(null)}
              isLoading={updateExpense.isPending}
              editMode
              periodStart={activePeriod?.startDate}
              periodEnd={activePeriod?.endDate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
