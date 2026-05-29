import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Toaster } from '@/components/ui/sonner'
import { DevUserSwitcher } from '@/components/dev/DevUserSwitcher'

const IS_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function AppShell() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
      <Toaster position="bottom-right" />
      {IS_MOCK && <DevUserSwitcher />}
    </div>
  )
}
