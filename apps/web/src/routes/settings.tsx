import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  useCurrentUser,
  usePartnership,
  useUser,
  useUpdateUser,
  useDissolvePartnership,
  useCreateInvite,
  useSentInvite,
  usePendingInvite,
  useUpdateInviteStatus,
} from '@/lib/hooks'
import { useAuth } from '@/lib/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { SettingsProfile } from '@/components/settings/settings-profile'
import { SettingsPartnerLink } from '@/components/settings/settings-partner-link'
import { SettingsTelegram } from '@/components/settings/settings-telegram'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { user: authUser } = useAuth()

  const { data: currentUser, isLoading: userLoading } = useCurrentUser()
  const { data: partnership, isLoading: partnershipLoading } = usePartnership()
  const partnerUserId = partnership?.userIds.find(id => id !== authUser?.id)
  const { data: partnerUser } = useUser(partnerUserId)
  const { data: sentInvite = null } = useSentInvite()
  const { data: pendingInvite = null } = usePendingInvite()
  const { data: pendingInviteFromUser } = useUser(pendingInvite?.fromUserId)

  const updateUser = useUpdateUser()
  const updateTelegram = useUpdateUser()
  const dissolvePartnership = useDissolvePartnership()
  const createInvite = useCreateInvite()
  const updateInviteStatus = useUpdateInviteStatus()

  const isLoading = userLoading || partnershipLoading

  async function handleSaveDisplayName(name: string) {
    if (!authUser?.id) return
    try {
      await updateUser.mutateAsync({ id: authUser.id, data: { displayName: name } })
      toast.success('Display name updated.')
    } catch {
      toast.error("Couldn't update display name. Try again.")
    }
  }

  async function handleSendInvite(email: string) {
    if (!authUser?.id) return
    try {
      await createInvite.mutateAsync({ fromUserId: authUser.id, toEmail: email })
      toast.success('Invite sent.')
    } catch {
      toast.error("Couldn't send invite. Try again.")
    }
  }

  async function handleCancelInvite(inviteId: string) {
    try {
      await updateInviteStatus.mutateAsync({ id: inviteId, status: 'expired' })
      toast.success('Invite cancelled.')
    } catch {
      toast.error("Couldn't cancel invite. Try again.")
    }
  }

  async function handleAcceptInvite(inviteId: string) {
    try {
      await updateInviteStatus.mutateAsync({ id: inviteId, status: 'accepted' })
      toast.success('Invite accepted.')
    } catch {
      toast.error("Couldn't accept invite. Try again.")
    }
  }

  async function handleDeclineInvite(inviteId: string) {
    try {
      await updateInviteStatus.mutateAsync({ id: inviteId, status: 'declined' })
      toast.success('Invite declined.')
    } catch {
      toast.error("Couldn't decline invite. Try again.")
    }
  }

  async function handleUnlink() {
    if (!partnership) return
    try {
      await dissolvePartnership.mutateAsync({ id: partnership.id, userIds: partnership.userIds })
      toast.success('Unlinked from partner.')
    } catch {
      toast.error("Couldn't unlink. Try again.")
    }
  }

  async function handleTelegramDisconnect() {
    if (!authUser?.id) return
    try {
      await updateTelegram.mutateAsync({ id: authUser.id, data: { telegramHandle: undefined } })
      toast.success('Telegram disconnected.')
    } catch {
      toast.error("Couldn't disconnect Telegram. Try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <h1 className="font-display text-3xl">Settings</h1>
        <Skeleton className="h-[220px] rounded-xl" />
        <Skeleton className="h-[140px] rounded-xl" />
        <Skeleton className="h-[100px] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="font-display text-3xl">Settings</h1>

      <SettingsProfile
        displayName={currentUser?.displayName ?? ''}
        email={currentUser?.email ?? ''}
        onSaveDisplayName={handleSaveDisplayName}
        isSaving={updateUser.isPending}
      />

      <SettingsPartnerLink
        isLinked={!!partnership}
        partnerName={partnerUser?.displayName}
        partnerEmail={partnerUser?.email}
        linkedSince={partnership?.createdAt}
        currentUserEmail={currentUser?.email}
        sentInvite={sentInvite}
        pendingInvite={pendingInvite}
        pendingInviteFromName={pendingInviteFromUser?.displayName}
        onSendInvite={handleSendInvite}
        onCancelInvite={handleCancelInvite}
        onAcceptInvite={handleAcceptInvite}
        onDeclineInvite={handleDeclineInvite}
        onUnlink={handleUnlink}
        isMutating={
          createInvite.isPending || updateInviteStatus.isPending || dissolvePartnership.isPending
        }
      />

      <SettingsTelegram
        telegramHandle={currentUser?.telegramHandle}
        onDisconnect={handleTelegramDisconnect}
        isMutating={updateTelegram.isPending}
      />
    </div>
  )
}
