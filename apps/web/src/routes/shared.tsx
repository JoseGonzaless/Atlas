import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shared')({
  component: () => <h1>Shared Ledger</h1>,
})
