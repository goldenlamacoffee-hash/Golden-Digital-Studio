import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { SettingsForm } from '@/components/admin/settings-form'
import { getSettings } from '@/lib/admin/queries'
import { localeFromParam, type Locale } from '@/lib/i18n/config'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>
}) {
  const { locale: localeParam } = await searchParams
  const locale: Locale = localeFromParam(localeParam)
  const settings = await getSettings(locale)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Site settings"
        description="Brand details, contact info and SEO defaults — per market."
        locale={locale}
      />
      <SettingsForm
        key={locale}
        locale={locale}
        settings={
          settings
            ? {
                brandName: settings.brandName,
                tagline: settings.tagline,
                parent: settings.parent,
                email: settings.email,
                phone: settings.phone,
                regions: (settings.regions as string[]) ?? [],
                seoTitle: settings.seoTitle,
                seoDescription: settings.seoDescription,
              }
            : null
        }
      />
    </div>
  )
}
