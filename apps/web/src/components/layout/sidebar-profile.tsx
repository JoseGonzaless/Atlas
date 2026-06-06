import { useAuth } from '@/lib/use-auth'
import { useCurrentUser, usePartnership, useUser } from '@/lib/hooks'
import { getInitials } from '@/lib/utils/get-initials'

interface Props {
  collapsed: boolean
}

export function SidebarProfile({ collapsed }: Props) {
  const { user: authUser } = useAuth()
  const { data: currentUser } = useCurrentUser()
  const { data: partnership } = usePartnership()
  const partnerUserId = partnership?.userIds.find(id => id !== authUser?.id)
  const { data: partnerUser } = useUser(partnerUserId)

  const displayName = currentUser?.displayName ?? authUser?.displayName ?? 'You'
  const subtitle = partnerUser?.displayName
    ? `Linked with ${partnerUser.displayName}`
    : (currentUser?.email ?? authUser?.email ?? '')
  const initials = getInitials(displayName)

  if (collapsed) {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
        {initials}
      </span>
    )
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 px-1">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
        {initials}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium leading-tight text-sidebar-foreground">
          {displayName}
        </span>
        {subtitle && (
          <span className="truncate text-xs text-sidebar-foreground/60 leading-tight">
            {subtitle}
          </span>
        )}
      </span>
    </div>
  )
}
