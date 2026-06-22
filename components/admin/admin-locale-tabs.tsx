'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { locales, localeMeta, type Locale } from '@/lib/i18n/config'
import { ADMIN_LOCALE_COOKIE } from '@/lib/admin/locale-shared'
import { cn } from '@/lib/utils'

/**
 * Admin market/locale switcher. Selecting a locale:
 *  - navigates to the same page with `?locale=<locale>` (server reads it), and
 *  - writes the `gds_admin_locale` cookie so the choice persists across every
 *    admin page even when a link doesn't carry the query param.
 */
export function AdminLocaleTabs({ current }: { current: Locale }) {
  const pathname = usePathname()
  const params = useSearchParams()

  function hrefFor(locale: Locale) {
    const sp = new URLSearchParams(params.toString())
    sp.set('locale', locale)
    return `${pathname}?${sp.toString()}`
  }

  function persist(locale: Locale) {
    // Year-long, lax, path=/ so it applies to the whole admin. Not HttpOnly —
    // it's a non-sensitive UI preference also read by the server.
    document.cookie = `${ADMIN_LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
  }

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1"
      role="group"
      aria-label="Editing market"
    >
      {locales.map((locale) => {
        const active = locale === current
        return (
          <Link
            key={locale}
            href={hrefFor(locale)}
            onClick={() => persist(locale)}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-gold text-espresso'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span>{localeMeta[locale].label}</span>
            <span
              className={cn(
                'rounded px-1 text-[10px] font-semibold uppercase tracking-wide',
                active ? 'bg-espresso/15 text-espresso' : 'bg-muted text-muted-foreground',
              )}
            >
              {localeMeta[locale].market}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
