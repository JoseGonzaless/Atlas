import type { IDatabase } from './interface'
import { mockDb } from './mock'

let db: IDatabase

if (import.meta.env.VITE_USE_MOCK === 'true') {
  db = mockDb
} else {
  throw new Error(
    'Firestore IDatabase not yet implemented. Set VITE_USE_MOCK=true in .env.local (Phase 3 TODO).'
  )
}

export { db }
export type { IDatabase }
