import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAdminSession, isBootstrap } from '@/lib/admin/guard'
import { AdminAuthForm } from '@/components/admin/admin-auth-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin login',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  const session = await getAdminSession()
  if (session) redirect('/admin')

  const bootstrap = await isBootstrap()

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <AdminAuthForm bootstrap={bootstrap} />
    </main>
  )
}
