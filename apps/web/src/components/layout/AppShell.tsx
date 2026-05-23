import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
