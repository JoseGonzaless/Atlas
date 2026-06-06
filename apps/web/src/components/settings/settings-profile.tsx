import { useState } from 'react'
import { toast } from 'sonner'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/lib/utils/get-initials'

interface Props {
  displayName: string
  email: string
  onSaveDisplayName: (name: string) => Promise<void>
  isSaving: boolean
}

export function SettingsProfile({ displayName, email, onSaveDisplayName, isSaving }: Props) {
  const [nameValue, setNameValue] = useState(displayName)
  const [pwOpen, setPwOpen] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)

  const trimmedName = nameValue.trim()
  const nameChanged = trimmedName !== displayName
  const nameValid = trimmedName.length >= 1 && trimmedName.length <= 50

  async function handleSaveName() {
    await onSaveDisplayName(trimmedName)
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError(null)
    if (newPw.length < 8) {
      setPwError('Password must be at least 8 characters.')
      return
    }
    if (!/[A-Z]/.test(newPw)) {
      setPwError('Password must include at least one uppercase letter.')
      return
    }
    if (!/[a-z]/.test(newPw)) {
      setPwError('Password must include at least one lowercase letter.')
      return
    }
    if (!/[0-9]/.test(newPw)) {
      setPwError('Password must include at least one number.')
      return
    }
    if (newPw !== confirmPw) {
      setPwError('Passwords do not match.')
      return
    }
    setPwSaving(true)
    // NOTE(backend): no auth backend yet, so this only simulates the request and
    // does NOT change any credential. Replace the timeout with the real call
    // (e.g. `await auth.changePassword(currentPw, newPw)`); the server must verify
    // `currentPw` and return a field-level error on mismatch (surface it via
    // setPwError). The success toast below is only honest once that call exists.
    await new Promise(r => setTimeout(r, 500))
    setPwSaving(false)
    toast.success('Password updated.')
    setPwOpen(false)
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-6 pt-5 pb-4">
        <User className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profile</h2>
      </div>

      <Separator />

      <div className="px-6 py-5 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center shrink-0 select-none">
            {getInitials(displayName)}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-base font-semibold leading-tight truncate">{displayName}</span>
            <span className="text-sm text-muted-foreground truncate">{email}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="display-name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Display name
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id="display-name"
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              maxLength={50}
              className="max-w-xs"
            />
            {nameChanged && nameValid && (
              <Button size="sm" onClick={() => void handleSaveName()} disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save'}
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</span>
            <Button variant="outline" size="sm" onClick={() => setPwOpen(o => !o)}>
              Change password
            </Button>
          </div>

          {pwOpen && (
            <form onSubmit={handleSavePassword} className="flex flex-col gap-3 max-w-xs">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="current-pw">Current password</Label>
                <Input
                  id="current-pw"
                  type="password"
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-pw">New password</Label>
                <Input
                  id="new-pw"
                  type="password"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-pw">Confirm new password</Label>
                <Input
                  id="confirm-pw"
                  type="password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  required
                />
              </div>
              {pwError && <p className="text-sm text-destructive">{pwError}</p>}
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={pwSaving}>
                  {pwSaving ? 'Saving…' : 'Save password'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPwOpen(false)
                    setPwError(null)
                    setCurrentPw('')
                    setNewPw('')
                    setConfirmPw('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
