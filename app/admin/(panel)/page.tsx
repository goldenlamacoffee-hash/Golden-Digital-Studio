import Link from 'next/link'
import {
  Briefcase,
  FolderKanban,
  Package,
  ImageIcon,
  Inbox,
  ArrowUpRight,
} from 'lucide-react'
import { getCounts, countNewInquiries } from '@/lib/admin/queries'

export const dynamic = 'force-dynamic'

const cards = [
  { key: 'services', label: 'Services', href: '/admin/services', icon: Briefcase },
  { key: 'projects', label: 'Portfolio', href: '/admin/projects', icon: FolderKanban },
  { key: 'packages', label: 'Packages', href: '/admin/packages', icon: Package },
  { key: 'media', label: 'Media', href: '/admin/media', icon: ImageIcon },
  { key: 'inquiries', label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
] as const

export default async function AdminDashboard() {
  const [counts, newInquiries] = await Promise.all([
    getCounts(),
    countNewInquiries(),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage content across all markets from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          const count = counts[card.key as keyof typeof counts]
          return (
            <Link
              key={card.key}
              href={card.href}
              className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-gold/50"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                  <Icon className="size-5" />
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-gold" />
              </div>
              <div>
                <p className="font-heading text-3xl font-semibold text-foreground">
                  {count}
                </p>
                <p className="text-sm text-muted-foreground">
                  {card.label}
                  {card.key === 'inquiries' && newInquiries > 0 ? (
                    <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-medium text-gold">
                      {newInquiries} new
                    </span>
                  ) : null}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
