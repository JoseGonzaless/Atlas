// --- Core Types ---

export type SettlementStatus = 'open' | 'outstanding' | 'settled'

export interface SettlementPeriod {
  id: string
  partnershipId: string
  startDate: Date
  endDate: Date                     // the scheduled settlement deadline
  status: SettlementStatus
  createdAt: Date
}

export type SettlementPaymentStatus = 'on-time' | 'early' | 'settled-late'

export interface Settlement {
  id: string
  periodId: string
  partnershipId: string
  fromUserId: string                     // who owes (pays)
  toUserId: string                       // who receives
  amount: number                         // net balance — the amount transferred
  status: SettlementPaymentStatus
  daysOverdue: number | null             // null unless status is 'settled-late'
  settledAt: Date
  partnerDisplayNameSnapshot: string     // partner's displayName at settlement time
  expenseIds: string[]                   // which Expense records are included
  notes?: string
}

// --- Filters ---

export interface SettlementPeriodFilters {
  status?: SettlementStatus
}

// --- Input Types ---

export type CreateSettlementPeriodInput = Omit<SettlementPeriod, 'id' | 'createdAt' | 'status'>

export type CreateSettlementInput = Omit<Settlement, 'id' | 'settledAt'>

export interface SettlePeriodInput {
  periodId: string
  partnershipId: string
  fromUserId: string
  toUserId: string
  amount: number
  status: SettlementPaymentStatus
  daysOverdue: number | null
  partnerDisplayNameSnapshot: string
  notes?: string
}
