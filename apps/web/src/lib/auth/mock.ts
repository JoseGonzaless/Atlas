import type { AuthState } from './types'
import type { User } from '@/lib/db/user'

const MOCK_USER: User = {
  id: 'user-1',
  displayName: 'Jose',
  email: 'jose@atlas.app',
  onboardingComplete: true,
  partnershipId: 'p-1',
  createdAt: new Date('2026-04-18'),
}

const AUTH_STATE: AuthState = {
  user: MOCK_USER,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
}

export function useAuth(): AuthState {
  return AUTH_STATE
}
