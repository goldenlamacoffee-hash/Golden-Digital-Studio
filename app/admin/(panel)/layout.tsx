import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { requireAdmin } from '@/lib/admin/guard'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdmin()

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar email={session.email} />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
      </div>
      <Toaster />
    </div>
  )
}
