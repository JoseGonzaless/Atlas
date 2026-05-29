import type { Expense } from '../db/expense'
import type { Settlement } from '../db/settlement'

export interface BalanceResult {
  userPaid: number
  partnerPaid: number
  totalShared: number
  userShare: number      // totalShared / 2
  balanceAmount: number  // Math.abs(userShare - userPaid)
  direction: 'owes' | 'owed' | 'even' | 'none'
  // 'owes'  = current user owes partner  (userPaid < userShare)
  // 'owed'  = partner owes current user  (userPaid > userShare)
  // 'even'  = userPaid === userShare and totalShared > 0
  // 'none'  = no expenses at all
}

export function calcBalance(expenses: Expense[], currentUserId: string): BalanceResult {
  const shared = expenses.filter(e => e.scope === 'shared')

  if (shared.length === 0) {
    return { userPaid: 0, partnerPaid: 0, totalShared: 0, userShare: 0, balanceAmount: 0, direction: 'none' }
  }

  let userPaid = 0
  let partnerPaid = 0

  for (const expense of shared) {
    if (expense.paidBy === currentUserId) {
      userPaid += expense.amount
    } else {
      partnerPaid += expense.amount
    }
  }

  const totalShared = userPaid + partnerPaid
  const userShare = totalShared / 2
  const balanceAmount = Math.abs(userShare - userPaid)

  let direction: BalanceResult['direction']
  if (userPaid < userShare) {
    direction = 'owes'
  } else if (userPaid > userShare) {
    direction = 'owed'
  } else {
    direction = 'even'
  }

  return { userPaid, partnerPaid, totalShared, userShare, balanceAmount, direction }
}

// Returns the running net balance after subtracting confirmed mid-period settlements.
// "You paid" and "Total spent" are always gross; only "Net balance" adjusts.
export function calcNetBalance(
  expenses: Expense[],
  currentUserId: string,
  confirmedSettlements: Settlement[],
): BalanceResult {
  const gross = calcBalance(expenses, currentUserId)

  if (gross.direction === 'none' || confirmedSettlements.length === 0) return gross

  // signed net: positive = partner owes user, negative = user owes partner
  let signedNet = (gross.userPaid - gross.partnerPaid) / 2

  for (const s of confirmedSettlements) {
    if (s.fromUserId === currentUserId) {
      signedNet += s.amount  // user paid partner — reduces user's debt
    } else {
      signedNet -= s.amount  // partner paid user — reduces partner's debt
    }
  }

  const balanceAmount = Math.abs(signedNet)
  let direction: BalanceResult['direction']

  if (balanceAmount < 0.005) {
    direction = 'even'
  } else if (signedNet > 0) {
    direction = 'owed'
  } else {
    direction = 'owes'
  }

  return { ...gross, balanceAmount, direction }
}
