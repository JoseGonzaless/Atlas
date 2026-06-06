import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthState } from './types'
import type { User } from '@/lib/db/user'
import { queryClient } from '@/lib/query-client'
import { MOCK_USERS, USER_KEY, AUTH_KEY } from './mock'

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authed = localStorage.getItem(AUTH_KEY) === 'true'
    if (authed) {
      const id = localStorage.getItem(USER_KEY) ?? 'user-1'
      setUser(MOCK_USERS[id] ?? MOCK_USERS['user-1'])
    }
    setLoading(false)
  }, [])

  // NOTE(backend): mock auth — the password is ignored and "authed" is just a
  // localStorage flag, so this is trivially bypassable. Replace with the real
  // sign-in endpoint and verify credentials (and normalize the email) server-side.
  async function signIn(email: string, _password: string): Promise<void> {
    const normalized = email.trim().toLowerCase()
    const found = Object.values(MOCK_USERS).find(u => u.email === normalized)
    if (!found) throw new Error('Invalid email or password')
    localStorage.setItem(AUTH_KEY, 'true')
    localStorage.setItem(USER_KEY, found.id)
    setUser(found)
  }

  // NOTE(backend): replace the localStorage teardown with real session/token
  // invalidation. Clearing the query cache here guarantees no previous-user data
  // survives logout regardless of which UI triggers it.
  async function signOut(): Promise<void> {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(USER_KEY)
    queryClient.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
