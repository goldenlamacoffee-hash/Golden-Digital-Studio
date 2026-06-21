import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// The Neon/Vercel integration may expose the connection string under
// different env var names depending on how it was provisioned.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL

if (!connectionString) {
  // Surface a clear error instead of pg silently dialing localhost:5432.
  console.error(
    '[v0] No Postgres connection string found. Checked DATABASE_URL, POSTGRES_URL, DATABASE_URL_UNPOOLED, POSTGRES_URL_NON_POOLING, POSTGRES_PRISMA_URL.',
  )
}

export const pool = new Pool({ connectionString })

export const db = drizzle(pool, { schema })
