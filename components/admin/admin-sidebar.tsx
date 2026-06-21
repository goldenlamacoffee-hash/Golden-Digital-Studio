'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  LayoutTemplate,
  Wrench,
  FolderKanban,
  Package,
  ImageIcon,
  Settings,
  Inbox,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { BrandLogo } from '@/components/brand-logo'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Sections', href: '/admin/sections', icon: LayoutTemplate },
  { label: 'Services', href: '/admin/services', icon: Wrench },
  { label: 'Portfolio', href: '/admin/projects', icon: FolderKanban },
  { label: 'Packages', href: '/admin/packages', icon: Package },
  { label: 'Media', href: '/admin/media', icon: ImageIcon },
  { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    await authClient.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gold/15 bg-card/40 p-4">
      <Link href="/admin" className="mb-6 flex items-center gap-2.5 px-2 py-1">
        <BrandLogo variant="emblem" className="h-8 w-8" />
        <span className="font-heading text-sm font-semibold text-sand">
          Studio CMS
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
        {navItems.map((item) => {
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-gold/15 text-gold'
                  : 'text-muted-foreground hover:bg-muted hover:text-sand',
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-gold/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-sand"
        >
          <ExternalLink className="size-4" />
          View site
        </Link>
        <p
          className="truncate px-3 pt-2 text-xs text-muted-foreground"
          title={email}
        >
          {email}
        </p>
        <button
          type="button"
          onClick={signOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-sand"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
