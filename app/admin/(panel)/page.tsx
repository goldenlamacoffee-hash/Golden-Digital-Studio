import Link from 'next/link'
import {
  Briefcase,
  FolderKanban,
  Package,
  ImageIcon,
  Inbox,
  ArrowUpRight,
} from 'lucide-react'
import {
  getCounts,
  countNewInquiries,
  getLocaleContentCounts,
} from '@/lib/admin/queries'
import { getHostDebug } from '@/lib/i18n/server'
import { locales, localeMeta } from '@/lib/i18n/config'

export const dynamic = 'force-dynamic'

const cards = [
  { key: 'services', label: 'Services', href: '/admin/services', icon: Briefcase },
  { key: 'projects', label: 'Portfolio', href: '/admin/projects', icon: FolderKanban },
  { key: 'packages', label: 'Packages', href: '/admin/packages', icon: Package },
  { key: 'media', label: 'Media', href: '/admin/media', icon: ImageIcon },
  { key: 'inquiries', label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
] as const

export default async function AdminDashboard() {
  const [counts, newInquiries, hostDebug, localeCounts] = await Promise.all([
    getCounts(),
    countNewInquiries(),
    getHostDebug(),
    Promise.all(
      locales.map(async (l) => ({ locale: l, counts: await getLocaleContentCounts(l) })),
    ),
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

      <section
        aria-label="Localization debug"
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Localization debug
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Admin-only diagnostics. Not shown on the public site.
        </p>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Detected host
            </dt>
            <dd className="mt-1 font-mono text-sm text-foreground">
              {hostDebug.host ?? 'unknown'}
            </dd>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Host type
            </dt>
            <dd className="mt-1 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-xs ${
                  hostDebug.kind === 'canonical'
                    ? 'bg-gold/15 text-gold'
                    : hostDebug.kind === 'alias'
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {hostDebug.kind}
              </span>
            </dd>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Canonical domain
            </dt>
            <dd className="mt-1 font-mono text-sm text-foreground">
              {hostDebug.canonicalHost ?? '—'}
            </dd>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Resolved locale
            </dt>
            <dd className="mt-1 font-mono text-sm text-foreground">
              {hostDebug.locale}
            </dd>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Locale source
            </dt>
            <dd className="mt-1 font-mono text-sm text-foreground">
              {hostDebug.localeSource}
            </dd>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Redirect target
            </dt>
            <dd className="mt-1 font-mono text-sm text-foreground break-all">
              {hostDebug.redirectTarget ?? 'none (canonical)'}
            </dd>
          </div>
        </dl>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Locale</th>
                <th className="py-2 pr-4 font-medium">Domain</th>
                <th className="py-2 pr-4 font-medium">Services</th>
                <th className="py-2 pr-4 font-medium">Projects</th>
                <th className="py-2 pr-4 font-medium">Packages</th>
                <th className="py-2 pr-4 font-medium">Sections</th>
                <th className="py-2 font-medium">Settings</th>
              </tr>
            </thead>
            <tbody>
              {localeCounts.map(({ locale, counts: c }) => (
                <tr key={locale} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-mono text-foreground">{locale}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">
                    {localeMeta[locale].domain}
                  </td>
                  <td className="py-2 pr-4 text-foreground">{c.services}</td>
                  <td className="py-2 pr-4 text-foreground">{c.projects}</td>
                  <td className="py-2 pr-4 text-foreground">{c.packages}</td>
                  <td className="py-2 pr-4 text-foreground">{c.sections}</td>
                  <td className="py-2 text-foreground">{c.settings}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">
            A locale with 0 rows for a content type falls back to English/seed
            content on its domain. Sections fall back to built-in copy when empty.
          </p>
        </div>
      </section>
    </div>
  )
}
