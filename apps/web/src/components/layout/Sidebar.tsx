import { Link } from '@tanstack/react-router'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/shared', label: 'Shared Ledger' },
  { to: '/personal', label: 'Personal Ledger' },
  { to: '/settlements', label: 'Settlements' },
  { to: '/settings', label: 'Settings' },
] as const

export function Sidebar() {
  return (
    <nav className="w-56 h-full border-r flex flex-col gap-1 p-4">
      <span className="text-xl font-bold mb-6">Atlas</span>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="px-3 py-2 rounded-md text-sm hover:bg-accent"
          activeProps={{ className: 'px-3 py-2 rounded-md text-sm bg-accent font-medium' }}
          activeOptions={{ exact: item.to === '/' }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
