import type { ReactNode } from 'react'
import { AdminLocaleTabs } from '@/components/admin/admin-locale-tabs'
import type { Locale } from '@/lib/i18n/config'

export function AdminPageHeader({
  title,
  description,
  locale,
  showLocales = true,
  action,
}: {
  title: string
  description?: string
  locale: Locale
  showLocales?: boolean
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {showLocales ? <AdminLocaleTabs current={locale} /> : null}
    </div>
  )
}
