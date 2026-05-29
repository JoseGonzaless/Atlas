import type { AuthState } from './types'
import type { User } from '@/lib/db/user'

const STORAGE_KEY = 'atlas_mock_user'

const MOCK_USERS: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    displayName: 'Jose',
    email: 'jose@atlas.app',
    onboardingComplete: true,
    partnershipId: 'p-1',
    createdAt: new Date('2026-04-18'),
  },
  'user-2': {
    id: 'user-2',
    displayName: 'Rose',
    email: 'rose@atlas.app',
    onboardingComplete: true,
    partnershipId: 'p-1',
    createdAt: new Date('2026-04-18'),
  },
}

export function getActiveMockUserId(): string {
  return localStorage.getItem(STORAGE_KEY) ?? 'user-1'
}

export function setActiveMockUserId(id: string): void {
  localStorage.setItem(STORAGE_KEY, id)
}

export function useAuth(): AuthState {
  const user = MOCK_USERS[getActiveMockUserId()] ?? MOCK_USERS['user-1']
  return {
    user,
    loading: false,
    signIn: async () => {},
    signOut: async () => {},
  }
}
