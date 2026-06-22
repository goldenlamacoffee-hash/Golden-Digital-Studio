'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Languages } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { locales, localeMeta, type Locale } from '@/lib/i18n/config'
import { copyLocaleContent, type CopyableEntity } from '@/app/actions/admin'

/**
 * Professional empty state shown when the selected locale has no content for a
 * section. Instead of silently falling back to English (and risking an
 * accidental overwrite), it offers to copy content from any OTHER locale that
 * already has rows, or to simply create a new localized entry.
 */
export function LocaleEmptyState({
  entity,
  label,
  current,
  counts,
}: {
  entity: CopyableEntity
  /** Human label, e.g. "services", "projects". */
  label: string
  current: Locale
  /** Row counts per locale so we only offer non-empty sources. */
  counts: Record<Locale, number>
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const sources = locales.filter((l) => l !== current && (counts[l] ?? 0) > 0)

  function copyFrom(from: Locale) {
    startTransition(async () => {
      try {
        const n = await copyLocaleContent(entity, from, current)
        if (n > 0) {
          toast.success(
            `Copied ${n} ${label} from ${localeMeta[from].label} to ${localeMeta[current].label}.`,
          )
          router.refresh()
        } else {
          toast.info('Nothing to copy — everything already exists for this market.')
        }
      } catch (err) {
        toast.error((err as Error).message || 'Copy failed')
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border p-10 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-gold/10 text-gold">
        <Languages className="size-5" />
      </span>
      <div>
        <p className="font-medium text-foreground">
          No {label} for {localeMeta[current].label} ({localeMeta[current].market}) yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new localized entry, or copy existing content from another market
          as a starting point. Copying never overwrites — it only fills in what is
          missing here.
        </p>
      </div>

      {sources.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {sources.map((from) => (
            <Button
              key={from}
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => copyFrom(from)}
              className="gap-2"
            >
              <Copy className="size-3.5" />
              Copy from {localeMeta[from].label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
