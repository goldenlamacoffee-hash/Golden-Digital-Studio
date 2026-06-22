import type { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import { AdminLocaleTabs } from '@/components/admin/admin-locale-tabs'
import { localeMeta, localeOrigin, type Locale } from '@/lib/i18n/config'

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
  const meta = localeMeta[locale]

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

      {showLocales ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <AdminLocaleTabs current={locale} />
            <span className="text-sm text-muted-foreground">
              Editing:{' '}
              <span className="font-medium text-gold">
                {meta.label} / {meta.market}
              </span>
            </span>
          </div>
          <a
            href={localeOrigin(locale)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
            Preview {meta.market} site
          </a>
        </div>
      ) : null}
    </div>
  )
}
