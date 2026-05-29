import { createFileRoute } from '@tanstack/react-router'

// TODO (SRS §9): Outstanding periods table, past settlements, Settle Outstanding, receipt subpage.
// Shared Ledger outstanding banner links here.

export const Route = createFileRoute('/settlements')({
  component: () => <h1 className="font-display text-3xl">Settlements</h1>,
})
