import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'

export type AdminSession = {
  id: string
  email: string
  name: string
  role: string
}

/**
 * Require an authenticated admin user. Redirects to the login page when there
 * is no valid session. Use at the top of every admin server component/action.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect('/admin/login')
  }
  const u = session.user as {
    id: string
    email: string
    name?: string | null
    role?: string | null
  }
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? '',
    role: u.role ?? 'admin',
  }
}

/** True when no users exist yet — used to allow first-admin bootstrap sign-up. */
export async function isBootstrap(): Promise<boolean> {
  const rows = await db.select({ c: sql<number>`count(*)::int` }).from(user)
  return (rows[0]?.c ?? 0) === 0
}

/** Returns the current session without redirecting (nullable). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const u = session.user as {
    id: string
    email: string
    name?: string | null
    role?: string | null
  }
  return { id: u.id, email: u.email, name: u.name ?? '', role: u.role ?? 'admin' }
}
