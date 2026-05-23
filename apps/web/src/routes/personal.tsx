import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/personal')({
  component: () => <h1>Personal Ledger</h1>,
})
