import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: () => <h1 className="font-display text-3xl">Login</h1>,
})
