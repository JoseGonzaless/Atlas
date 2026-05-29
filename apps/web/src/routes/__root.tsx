import { useEffect } from 'react'
import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/app-shell'
import { Skeleton } from '@/components/ui/skeleton'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAuth } from '../lib/use-auth'

function RootComponent() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  useEffect(() => {
    if (!loading && user === null && !isAuthPage) {
      void navigate({ to: '/login' })
    }
  }, [loading, user, isAuthPage, navigate])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
  }

  if (!user && !isAuthPage) {
    return null
  }

  if (isAuthPage) {
    return <Outlet />
  }

  return (
    <TooltipProvider>
      <AppShell />
    </TooltipProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
