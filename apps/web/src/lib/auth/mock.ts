import type { User } from '@/lib/db/user'

export const USER_KEY = 'atlas_mock_user'
export const AUTH_KEY = 'atlas_mock_authed'

export const MOCK_USERS: Record<string, User> = {
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
  return localStorage.getItem(USER_KEY) ?? 'user-1'
}

export function setActiveMockUserId(id: string): void {
  localStorage.setItem(USER_KEY, id)
}
