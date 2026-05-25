import type { Expense } from '../db/expense'

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
