import { ArrowLeftRight } from 'lucide-react'
import { getActiveMockUserId, setActiveMockUserId } from '@/lib/auth/mock'

const USERS = [
  { id: 'user-1', label: 'Jose' },
  { id: 'user-2', label: 'Rose' },
]

export function DevUserSwitcher() {
  const currentId = getActiveMockUserId()
  const current = USERS.find(u => u.id === currentId) ?? USERS[0]
  const next = USERS.find(u => u.id !== currentId) ?? USERS[1]

  function switchUser() {
    setActiveMockUserId(next.id)
    window.location.reload()
  }

  return (
    <button
      onClick={switchUser}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-dashed border-muted-foreground/40 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-muted-foreground/70 hover:text-foreground"
    >
      <span className="font-mono font-medium">{current.label}</span>
      <ArrowLeftRight className="h-3 w-3" />
      <span className="font-mono text-muted-foreground/60">{next.label}</span>
    </button>
  )
}
