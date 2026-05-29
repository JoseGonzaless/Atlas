import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <h1 className="font-display text-3xl">Dashboard</h1>,
})
