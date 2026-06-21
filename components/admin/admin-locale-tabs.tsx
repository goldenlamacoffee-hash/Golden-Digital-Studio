'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { locales, localeMeta, type Locale } from '@/lib/i18n/config'
import { cn } from '@/lib/utils'

export function AdminLocaleTabs({ current }: { current: Locale }) {
  const pathname = usePathname()
  const params = useSearchParams()

  function hrefFor(locale: Locale) {
    const sp = new URLSearchParams(params.toString())
    sp.set('locale', locale)
    return `${pathname}?${sp.toString()}`
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={hrefFor(locale)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            locale === current
              ? 'bg-gold text-espresso'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {localeMeta[locale].label}
        </Link>
      ))}
    </div>
  )
}
