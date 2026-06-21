import type { MetadataRoute } from 'next'
import { getLocale } from '@/lib/i18n/server'
import { localeOrigin } from '@/lib/i18n/config'

/**
 * Robots policy: allow public pages, disallow the admin and auth API. The
 * sitemap reference points at the canonical domain for the current market.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const locale = await getLocale()
  const origin = localeOrigin(locale)

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  }
}
