export const locales = ['en', 'cs-CZ', 'sk-SK'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const LOCALE_COOKIE = 'gds_locale'

/** Maps a production hostname (registrable domain) to its locale. */
export const domainLocaleMap: Record<string, Locale> = {
  'goldenstudio.online': 'en',
  'goldenstudio.cz': 'cs-CZ',
  'goldenstudio.sk': 'sk-SK',
}

export const localeMeta: Record<
  Locale,
  { label: string; shortLabel: string; htmlLang: string; domain: string }
> = {
  en: {
    label: 'English',
    shortLabel: 'EN',
    htmlLang: 'en',
    domain: 'goldenstudio.online',
  },
  'cs-CZ': {
    label: 'Čeština',
    shortLabel: 'CZ',
    htmlLang: 'cs',
    domain: 'goldenstudio.cz',
  },
  'sk-SK': {
    label: 'Slovenčina',
    shortLabel: 'SK',
    htmlLang: 'sk',
    domain: 'goldenstudio.sk',
  },
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

/** Resolve a locale from a hostname using the domain map (handles www. and ports). */
export function localeFromHost(host: string | undefined | null): Locale | null {
  if (!host) return null
  const clean = host.split(':')[0].toLowerCase().replace(/^www\./, '')
  return domainLocaleMap[clean] ?? null
}
