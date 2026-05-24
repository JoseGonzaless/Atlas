// --- Core Types ---

export interface User {
  id: string
  displayName: string
  email: string
  onboardingComplete: boolean
  telegramHandle?: string       // set after Telegram pairing (§2d Step 1, §11d)
  partnershipId?: string        // set once the user has an active partnership
  createdAt: Date
}

// --- Input Types ---

export type UpdateUserInput = Partial<
  Pick<User, 'displayName' | 'onboardingComplete' | 'telegramHandle' | 'partnershipId'>
>
