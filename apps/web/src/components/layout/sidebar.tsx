import { useState } from 'react'
import { toast } from 'sonner'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  LayoutGrid,
  Link as LinkIcon,
  User,
  ArrowLeftRight,
  Settings,
  PanelLeft,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTheme } from '@/lib/use-theme'
import { useAuth } from '@/lib/use-auth'
import { SidebarProfile } from './sidebar-profile'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid },
  { to: '/shared', label: 'Shared Ledger', icon: LinkIcon },
  { to: '/personal', label: 'Personal Ledger', icon: User },
  { to: '/settlements', label: 'Settlements', icon: ArrowLeftRight },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

function getInitialCollapsed(): boolean {
  try {
    return localStorage.getItem('atlas.sidebar.collapsed') === 'true'
  } catch {
    return false
  }
}

export function Sidebar() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(getInitialCollapsed)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()
  const { signOut } = useAuth()

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev
      try { localStorage.setItem('atlas.sidebar.collapsed', String(next)) } catch {}
      return next
    })
  }

  async function handleLogOut() {
    setIsLoggingOut(true)
    try {
      // signOut() clears the React Query cache so the next account can't see
      // the previous user's data.
      await signOut()
      void navigate({ to: '/login' })
    } catch {
      // Keep the dialog open and re-enable the buttons so the user isn't trapped.
      toast.error("Couldn't log out. Try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <nav
        className={`${collapsed ? 'w-16' : 'w-56'} h-full bg-sidebar border-r border-sidebar-border flex flex-col gap-1 p-4 transition-[width] duration-200 ease-in-out shrink-0 overflow-hidden`}
      >
        {/* Header row */}
        <div className={`mb-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <>
              <img src="/assets/atlas-logo-light.png" alt="Atlas" className="h-8 w-auto dark:hidden" />
              <img src="/assets/atlas-logo-dark.png" alt="Atlas" className="h-8 w-auto hidden dark:block" />
            </>
          )}
          <button
            onClick={toggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="cursor-pointer p-1 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.to} disabled={!collapsed}>
                <TooltipTrigger render={<span className="block" />}>
                  <Link
                    to={item.to}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${collapsed ? 'justify-center' : ''}`}
                    activeProps={{
                      className: 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground',
                    }}
                    activeOptions={{ exact: item.to === '/' }}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-200 ease-in-out ${collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-xs opacity-100 ml-2'}`}>
                      {item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* Theme toggle */}
        <Tooltip disabled={!collapsed}>
          <TooltipTrigger render={<span className="block" />}>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`cursor-pointer flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              {theme === 'dark'
                ? <Sun className="h-4 w-4 shrink-0" />
                : <Moon className="h-4 w-4 shrink-0" />}
              <span className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-200 ease-in-out ${collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-xs opacity-100 ml-2'}`}>
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </TooltipContent>
        </Tooltip>

        {/* Footer: profile card + logout */}
        <div className={`mt-2 pt-2 border-t border-sidebar-border flex items-center gap-1 ${collapsed ? 'flex-col' : ''}`}>
          <SidebarProfile collapsed={collapsed} />

          <Tooltip>
            <TooltipTrigger render={<span className="block shrink-0" />}>
              <button
                onClick={() => setConfirmOpen(true)}
                aria-label="Log out"
                className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        </div>
      </nav>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to log in again to view your ledgers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogOut} disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging out…' : 'Log Out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
