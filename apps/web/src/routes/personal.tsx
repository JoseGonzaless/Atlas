import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/personal')({
  component: () => <h1 className="font-display text-3xl">Personal Ledger</h1>,
})
