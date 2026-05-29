import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: () => <h1 className="font-display text-3xl">Signup</h1>,
})
