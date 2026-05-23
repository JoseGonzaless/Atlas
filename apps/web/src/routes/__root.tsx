import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'

function RootComponent() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  const isAuthPage = path === '/login' || path === '/signup'

  if (isAuthPage) {
    return <Outlet />
  }

  return <AppShell />
}

export const Route = createRootRoute({
  component: RootComponent,
})
