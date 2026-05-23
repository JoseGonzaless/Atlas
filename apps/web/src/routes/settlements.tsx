import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settlements')({
  component: () => <h1>Settlements</h1>,
})
