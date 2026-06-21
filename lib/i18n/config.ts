export const locales = ['en', 'cs-CZ', 'sk-SK'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const LOCALE_COOKIE = 'gds_locale'

/**
 * The three official market domains. Each is the ONE canonical host for its
 * locale — every alias and `www.` variant redirects (308) here, and canonical
 * URLs / hreflang / sitemap only ever reference these hosts.
 */
export const canonicalHostLocale = {
  'goldendigital.cz': 'cs-CZ',
  'goldendigital.sk': 'sk-SK',
  'goldendigital.online': 'en',
} as const satisfies Record<string, Locale>

export type CanonicalHost = keyof typeof canonicalHostLocale

/**
 * Alias / defensive domains (bare form, `www.` stripped) → their canonical host.
 * These must never render as independent sites; they 308-redirect to canonical.
 * `www.` of a canonical host is handled implicitly (see `canonicalHostFor`).
 */
export const aliasHostToCanonical: Record<string, CanonicalHost> = {
  'goldendigitalstudio.cz': 'goldendigital.cz',
  'goldendigitalstudio.sk': 'goldendigital.sk',
  'goldenstudio.cz': 'goldendigital.cz',
  'goldenstudio.sk': 'goldendigital.sk',
  'goldenstudio.online': 'goldendigital.online',
  'gdstudio.online': 'goldendigital.online',
}

/**
 * Maps every known production hostname (canonical + alias, with and without
 * `www.`) to its locale. Derived from the canonical + alias tables so there is
 * a single source of truth. Used for locale resolution on any owned domain.
 */
export const domainLocaleMap: Record<string, Locale> = (() => {
  const map: Record<string, Locale> = {}
  for (const [host, locale] of Object.entries(canonicalHostLocale)) {
    map[host] = locale
    map[`www.${host}`] = locale
  }
  for (const [alias, canonical] of Object.entries(aliasHostToCanonical)) {
    const locale = canonicalHostLocale[canonical]
    map[alias] = locale
    map[`www.${alias}`] = locale
  }
  return map
})()

/** Normalize a raw Host header: drop the port, lowercase. */
function normalizeHost(host: string | undefined | null): string | null {
  if (!host) return null
  return host.split(':')[0].toLowerCase()
}

/**
 * The canonical host for any owned domain (canonical or alias, www or not).
 * Returns null for unknown hosts (localhost / preview).
 */
export function canonicalHostFor(
  host: string | undefined | null,
): CanonicalHost | null {
  const raw = normalizeHost(host)
  if (!raw) return null
  const bare = raw.replace(/^www\./, '')
  if (bare in canonicalHostLocale) return bare as CanonicalHost
  if (bare in aliasHostToCanonical) return aliasHostToCanonical[bare]
  return null
}

/**
 * True only when the host is EXACTLY a canonical market domain (bare, no www,
 * not an alias). Canonical hosts render directly; everything else redirects.
 */
export function isCanonicalHost(host: string | undefined | null): boolean {
  const raw = normalizeHost(host)
  return !!raw && raw in canonicalHostLocale
}

/**
 * Resolve the 308 redirect target for an alias/www host, preserving path+query.
 * Returns null when the host is already canonical or is unknown (localhost).
 * Example: goldenstudio.cz/services?x=1 → https://goldendigital.cz/services?x=1
 */
export function getRedirectTarget(
  host: string | undefined | null,
  pathname: string,
  search: string,
): string | null {
  const canonical = canonicalHostFor(host)
  if (!canonical) return null
  if (isCanonicalHost(host)) return null
  return `https://${canonical}${pathname}${search}`
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

export type HostKind = 'canonical' | 'alias' | 'non-production'

/**
 * Full domain diagnosis for a request host — powers the admin debug panel and
 * keeps middleware + SEO consistent. Combines locale resolution with the
 * canonical/alias classification and (for aliases) the redirect target.
 */
export function resolveHost(
  host: string | undefined | null,
  pathname = '/',
  search = '',
): {
  host: string | null
  kind: HostKind
  canonicalHost: CanonicalHost | null
  canonicalUrl: string | null
  locale: Locale
  localeSource: LocaleSource
  redirectTarget: string | null
} {
  const normalized = normalizeHost(host)
  const canonicalHost = canonicalHostFor(host)
  const { locale, source } = resolveLocale(host, null)

  let kind: HostKind = 'non-production'
  if (canonicalHost) kind = isCanonicalHost(host) ? 'canonical' : 'alias'

  return {
    host: normalized,
    kind,
    canonicalHost,
    canonicalUrl: canonicalHost ? `https://${canonicalHost}` : null,
    locale,
    localeSource: source,
    redirectTarget: getRedirectTarget(host, pathname, search),
  }
}
