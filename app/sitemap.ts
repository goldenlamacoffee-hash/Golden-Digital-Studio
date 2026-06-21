import type { MetadataRoute } from 'next'
import { canonicalHostLocale, localeOrigin } from '@/lib/i18n/config'

/** Public, indexable paths shared across every market. */
const paths = ['', '/services', '/portfolio', '/contact'] as const

/**
 * Sitemap contains ONLY the three canonical market domains — never an alias or
 * `www.` host. Each entry advertises its localized alternates via hreflang so
 * search engines treat the three domains as one cross-linked, non-duplicate set.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    en: localeOrigin('en'),
    'cs-CZ': localeOrigin('cs-CZ'),
    'sk-SK': localeOrigin('sk-SK'),
  }

  const entries: MetadataRoute.Sitemap = []

  for (const locale of Object.values(canonicalHostLocale)) {
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
