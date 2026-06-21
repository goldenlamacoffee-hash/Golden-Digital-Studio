'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TextField, AreaField } from '@/components/admin/form-fields'
import { saveSettings } from '@/app/actions/admin'
import type { Locale } from '@/lib/i18n/config'

type Settings = {
  brandName: string
  tagline: string | null
  parent: string | null
  email: string | null
  phone: string | null
  regions: string[]
  seoTitle: string | null
  seoDescription: string | null
}

export function SettingsForm({
  locale,
  settings,
}: {
  locale: Locale
  settings: Settings | null
}) {
  const [pending, startTransition] = useTransition()

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          try {
            await saveSettings(formData)
            toast.success('Settings saved')
          } catch (err) {
            toast.error((err as Error).message || 'Could not save')
          }
        })
      }
      className="flex max-w-2xl flex-col gap-5 rounded-xl border border-border bg-card p-6"
    >
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="brandName" label="Brand name" defaultValue={settings?.brandName ?? 'Golden Digital Studio'} required />
        <TextField name="parent" label="Parent company" defaultValue={settings?.parent} />
        <TextField name="email" label="Email" defaultValue={settings?.email} />
        <TextField name="phone" label="Phone" defaultValue={settings?.phone} />
      </div>
      <AreaField name="tagline" label="Tagline" defaultValue={settings?.tagline} rows={2} />
      <AreaField
        name="regions"
        label="Regions served"
        defaultValue={settings?.regions?.join('\n')}
        rows={3}
        hint="One region per line"
      />
      <TextField name="seoTitle" label="SEO title" defaultValue={settings?.seoTitle} />
      <AreaField name="seoDescription" label="SEO description" defaultValue={settings?.seoDescription} rows={2} />
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </form>
  )
}
