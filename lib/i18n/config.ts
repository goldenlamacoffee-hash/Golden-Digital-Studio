export const locales = ['en', 'cs-CZ', 'sk-SK'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const LOCALE_COOKIE = 'gds_locale'

/**
 * Maps a production hostname to its locale. The registrable domain is the
 * source of truth in production. `www.` is handled by `localeFromHost`, but we
 * list both forms explicitly for clarity and exact matching.
 */
export const domainLocaleMap: Record<string, Locale> = {
  'goldendigital.cz': 'cs-CZ',
  'www.goldendigital.cz': 'cs-CZ',
  'goldendigital.sk': 'sk-SK',
  'www.goldendigital.sk': 'sk-SK',
  'goldendigital.online': 'en',
  'www.goldendigital.online': 'en',
}

export const localeMeta: Record<
  Locale,
  { label: string; shortLabel: string; htmlLang: string; domain: string }
> = {
  en: {
    label: 'English',
    shortLabel: 'EN',
    htmlLang: 'en',
    domain: 'goldendigital.online',
  },
  'cs-CZ': {
    label: 'Čeština',
    shortLabel: 'CZ',
    htmlLang: 'cs',
    domain: 'goldendigital.cz',
  },
  'sk-SK': {
    label: 'Slovenčina',
    shortLabel: 'SK',
    htmlLang: 'sk',
    domain: 'goldendigital.sk',
  },
}

/** Absolute origin for a locale's production domain, e.g. https://goldendigital.cz */
export function localeOrigin(locale: Locale): string {
  return `https://${localeMeta[locale].domain}`
}

/** True when the hostname is one of the known production domains. */
export function isProductionHost(host: string | undefined | null): boolean {
  return localeFromHost(host) !== null
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

/** Resolve a locale from an admin page's `?locale=` search param. */
export function localeFromParam(value: string | string[] | undefined): Locale {
  const v = Array.isArray(value) ? value[0] : value
  return isLocale(v) ? v : defaultLocale
}

/** Resolve a locale from a hostname using the domain map (handles www. and ports). */
export function localeFromHost(host: string | undefined | null): Locale | null {
  if (!host) return null
  const raw = host.split(':')[0].toLowerCase()
  // Try exact (incl. www.) first, then the bare registrable domain.
  return domainLocaleMap[raw] ?? domainLocaleMap[raw.replace(/^www\./, '')] ?? null
}

export type LocaleSource = 'domain' | 'cookie' | 'default'

/**
 * THE canonical locale resolver. Priority:
 *   1. Production domain mapping (wins on .cz / .sk / .online)
 *   2. Cookie (localhost / preview fallback only)
 *   3. Default `en`
 *
 * A production domain ALWAYS wins, so a stale `gds_locale=en` cookie can never
 * force English on goldendigital.cz. Use this everywhere locale is needed.
 */
export function resolveLocale(
  host: string | undefined | null,
  cookieValue: string | undefined | null,
): { locale: Locale; source: LocaleSource } {
  const fromHost = localeFromHost(host)
  if (fromHost) return { locale: fromHost, source: 'domain' }

  if (isLocale(cookieValue)) return { locale: cookieValue, source: 'cookie' }

  return { locale: defaultLocale, source: 'default' }
}
