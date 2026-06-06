import { useState } from 'react'
import { format } from 'date-fns'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { PartnershipInvite } from '@/lib/db/partnership'
import { getInitials } from '@/lib/utils/get-initials'

interface Props {
  isLinked: boolean
  partnerName?: string
  partnerEmail?: string
  linkedSince?: Date
  currentUserEmail?: string
  sentInvite: PartnershipInvite | null
  pendingInvite: PartnershipInvite | null
  pendingInviteFromName?: string
  onSendInvite: (email: string) => Promise<void>
  onCancelInvite: (inviteId: string) => Promise<void>
  onAcceptInvite: (inviteId: string) => Promise<void>
  onDeclineInvite: (inviteId: string) => Promise<void>
  onUnlink: () => Promise<void>
  isMutating: boolean
}

export function SettingsPartnerLink({
  isLinked,
  partnerName,
  partnerEmail,
  linkedSince,
  currentUserEmail,
  sentInvite,
  pendingInvite,
  pendingInviteFromName,
  onSendInvite,
  onCancelInvite,
  onAcceptInvite,
  onDeclineInvite,
  onUnlink,
  isMutating,
}: Props) {
  const [unlinkOpen, setUnlinkOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteEmailError, setInviteEmailError] = useState('')

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault()
    // Normalize so casing/whitespace never causes the invite to miss the
    // recipient's account on lookup (emails are case-insensitive).
    const normalized = inviteEmail.trim().toLowerCase()
    if (!normalized) {
      setInviteEmailError("Partner's email is required.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setInviteEmailError('Please enter a valid email address.')
      return
    }
    if (currentUserEmail && normalized === currentUserEmail.toLowerCase()) {
      setInviteEmailError("You can't invite yourself.")
      return
    }
    setInviteEmailError('')
    await onSendInvite(normalized)
    setInviteEmail('')
  }

  async function handleUnlink() {
    await onUnlink()
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Partner</h2>
        </div>
        {isLinked && (
          <span className="rounded-full bg-positive/10 px-2.5 py-0.5 text-xs font-medium text-positive">
            Linked
          </span>
        )}
        {!isLinked && pendingInvite && (
          <span className="rounded-full bg-shared/10 px-2.5 py-0.5 text-xs font-medium text-shared">
            Invite pending
          </span>
        )}
        {!isLinked && sentInvite && !pendingInvite && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Awaiting response
          </span>
        )}
      </div>

      <Separator />

      <div className="px-6 py-5">
        {isLinked ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-12 w-12 rounded-full bg-shared/10 text-shared text-sm font-semibold flex items-center justify-center shrink-0 select-none">
                {getInitials(partnerName ?? '')}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-base font-semibold leading-tight">{partnerName}</span>
                <span className="text-sm text-muted-foreground">{partnerEmail}</span>
                {linkedSince && (
                  <span className="text-xs text-muted-foreground mt-0.5">
                    Linked since {format(linkedSince, 'MMMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>

            <AlertDialog open={unlinkOpen} onOpenChange={setUnlinkOpen}>
              <AlertDialogTrigger
                render={<Button variant="destructive" size="sm" className="shrink-0" disabled={isMutating} />}
              >
                Unlink
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unlink from {partnerName}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Unlinking will stop all shared expense tracking. Any unsettled shared expenses
                    will become Outstanding under both accounts. Already-settled history is preserved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleUnlink}
                    disabled={isMutating}
                  >
                    Unlink
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : pendingInvite ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {pendingInviteFromName ?? pendingInvite.fromUserId}
              </span>{' '}
              invited you to link accounts.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => void onAcceptInvite(pendingInvite.id)}
                disabled={isMutating}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void onDeclineInvite(pendingInvite.id)}
                disabled={isMutating}
              >
                Decline
              </Button>
            </div>
          </div>
        ) : sentInvite ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Invite sent to{' '}
              <span className="font-medium text-foreground">{sentInvite.toEmail}</span>. Waiting for
              them to accept.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => void onCancelInvite(sentInvite.id)}
              disabled={isMutating}
            >
              Cancel invite
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Invite your partner to link accounts and start tracking shared expenses.
            </p>
            <div className="flex flex-col gap-1.5 max-w-xs">
              <Label
                htmlFor="invite-email"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Partner's email
              </Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={e => {
                  setInviteEmail(e.target.value)
                  if (inviteEmailError) setInviteEmailError('')
                }}
                placeholder="partner@example.com"
              />
              {inviteEmailError && (
                <p className="text-xs text-destructive">{inviteEmailError}</p>
              )}
            </div>
            <Button type="submit" size="sm" className="self-start" disabled={isMutating}>
              Send invite
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
