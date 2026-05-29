// --- Core Types ---

export type SettlementPeriodStatus = 'open' | 'outstanding' | 'settled'

export interface SettlementPeriod {
  id: string
  partnershipId: string
  startDate: Date
  endDate: Date                     // the scheduled settlement deadline
  status: SettlementPeriodStatus
  createdAt: Date
}

export type SettlementStatus = 'pending' | 'confirmed' | 'rejected'

export interface Settlement {
  id: string
  periodId: string
  partnershipId: string
  fromUserId: string                     // who owes (pays)
  toUserId: string                       // who receives
  amount: number                         // net balance at time of initiation
  status: SettlementStatus
  initiatedBy: string                    // userId who sent the request
  confirmedBy: string | null             // userId who confirmed/rejected; null while pending
  initiatedAt: Date
  confirmedAt: Date | null
  partnerDisplayNameSnapshot: string     // partner's displayName at initiation time
  expenseIds: string[]                   // expense snapshot at initiation time
  notes?: string
}

// --- Filters ---

export interface SettlementPeriodFilters {
  status?: SettlementPeriodStatus
}

// --- Input Types ---

export type CreateSettlementPeriodInput = Omit<SettlementPeriod, 'id' | 'createdAt' | 'status'>

export interface InitiateSettlementInput {
  periodId: string
  partnershipId: string
  fromUserId: string
  toUserId: string
  amount: number
  initiatedBy: string
  partnerDisplayNameSnapshot: string
  notes?: string
}

export interface RespondToSettlementInput {
  settlementId: string
  response: 'confirmed' | 'rejected'
  respondedBy: string
}
