// --- Core Types ---

export type PartnershipInviteStatus = 'pending' | 'accepted' | 'declined' | 'expired'

export interface Partnership {
  id: string
  userIds: [string, string]  // tuple — exactly 2
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
