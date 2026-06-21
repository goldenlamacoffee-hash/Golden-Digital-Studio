import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getLocale } from '@/lib/i18n/server'
import { getDictionary } from '@/lib/i18n/dictionaries'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} dict={dict} />
    </div>
  )
}
