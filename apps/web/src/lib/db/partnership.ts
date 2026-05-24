// --- Core Types ---

export type SettlementFrequency = 'weekly' | 'monthly' | 'custom'

export type PartnershipInviteStatus = 'pending' | 'accepted' | 'declined' | 'expired'

export interface Partnership {
  id: string
  userIds: [string, string]                         // tuple — exactly 2
  settlementFrequency: SettlementFrequency
  settlementDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday; weekly only
  periodLengthDays?: number                         // 1–365; custom only
  customPeriodStartDate?: Date                      // custom only
  createdAt: Date
}

export interface PartnershipInvite {
  id: string
  fromUserId: string
  toEmail: string                              // the invited partner's email
  status: PartnershipInviteStatus
  createdAt: Date
  expiresAt: Date                              // createdAt + 7 days
}

// --- Input Types ---

export type CreatePartnershipInviteInput = Omit<PartnershipInvite, 'id' | 'createdAt' | 'expiresAt' | 'status'>

export type CreatePartnershipInput = Omit<Partnership, 'id' | 'createdAt'>

export type UpdatePartnershipInput = Partial<
  Pick<
    Partnership,
    | 'settlementFrequency'
    | 'settlementDayOfWeek'
    | 'periodLengthDays'
    | 'customPeriodStartDate'
  >
>
