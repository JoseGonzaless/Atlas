import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: () => <h1 className="font-display text-3xl">Settings</h1>,
})
