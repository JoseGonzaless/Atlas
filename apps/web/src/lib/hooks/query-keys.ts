import type { ExpenseFilters } from '@/lib/db/expense'

export const queryKeys = {
  users: {
    detail: (userId: string) => ['users', userId] as const,
  },
  partnerships: {
    detail: (partnershipId: string) => ['partnerships', partnershipId] as const,
  },
  invites: {
    sent: (userId: string) => ['invites', 'sent', userId] as const,
    pending: (email: string) => ['invites', 'pending', email] as const,
  },
  expenses: {
    all: (partnershipId: string) => ['expenses', partnershipId] as const,
    filtered: (partnershipId: string, filters: ExpenseFilters) => ['expenses', partnershipId, filters] as const,
  },
  settlementPeriods: {
    all: (partnershipId: string) => ['settlementPeriods', partnershipId] as const,
    active: (partnershipId: string) => ['settlementPeriods', partnershipId, 'active'] as const,
    detail: (periodId: string) => ['settlementPeriods', 'detail', periodId] as const,
  },
  settlements: {
    all: (partnershipId: string) => ['settlements', partnershipId] as const,
    detail: (settlementId: string) => ['settlements', 'detail', settlementId] as const,
    byPeriod: (partnershipId: string, periodId: string) =>
      ['settlements', partnershipId, 'period', periodId] as const,
    pending: (partnershipId: string, periodId: string) =>
      ['settlements', partnershipId, 'pending', periodId] as const,
  },
}
