import type { MetadataRoute } from 'next'
import { locales, localeOrigin } from '@/lib/i18n/config'

/** Public, indexable paths shared across every market. */
const paths = ['', '/services', '/portfolio', '/contact'] as const

/**
 * Sitemap lists the representative domain for each locale (Option A) — every
 * owned domain still renders the site, but we advertise one clean URL set per
 * language and cross-link them with hreflang so search engines treat them as a
 * single, non-duplicate set.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    en: localeOrigin('en'),
    'cs-CZ': localeOrigin('cs-CZ'),
    'sk-SK': localeOrigin('sk-SK'),
  }

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    const origin = localeOrigin(locale)
    for (const path of paths) {
      entries.push({
        url: `${origin}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(languages).map(([lang, base]) => [lang, `${base}${path}`]),
          ),
        },
      })
    }
  }

  return entries
}
