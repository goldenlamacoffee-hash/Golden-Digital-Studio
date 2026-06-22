export const locales = ['en', 'cs-CZ', 'sk-SK'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const LOCALE_COOKIE = 'gds_locale'

/**
 * EVERY domain we own renders the full Golden Digital Studio website — there
 * are NO redirect-only aliases. Domains are grouped by the locale they serve.
 * The host's TLD decides the language: `.cz` → Czech, `.sk` → Slovak,
 * `.online` → English. `www.` variants are added automatically below.
 */
export const ownedDomainsByLocale: Record<Locale, readonly string[]> = {
  'cs-CZ': ['goldendigital.cz', 'goldendigitalstudio.cz', 'goldenstudio.cz'],
  'sk-SK': ['goldendigital.sk', 'goldendigitalstudio.sk', 'goldenstudio.sk'],
  en: ['goldenstudio.online', 'gdstudio.online'],
}

/**
 * The single SEO-representative domain per locale. Used for hreflang, the
 * sitemap and the default canonical when the request host is unknown
 * (localhost / preview). It does NOT cause any redirect — the other owned
 * domains still render and self-canonicalize.
 */
export const representativeDomain: Record<Locale, string> = {
  en: 'goldenstudio.online',
  'cs-CZ': 'goldendigital.cz',
  'sk-SK': 'goldendigital.sk',
}

/** `x-default` hreflang + global fallback target. */
export const xDefaultOrigin = `https://${representativeDomain.en}`

/**
 * Maps every owned hostname (bare + `www.`) to its locale. Derived from
 * `ownedDomainsByLocale` so there is a single source of truth. Used for
 * host-based locale resolution on every owned domain.
 */
export const domainLocaleMap: Record<string, Locale> = (() => {
  const map: Record<string, Locale> = {}
  for (const [locale, hosts] of Object.entries(ownedDomainsByLocale) as [
    Locale,
    readonly string[],
  ][]) {
    for (const host of hosts) {
      map[host] = locale
      map[`www.${host}`] = locale
    }
  }
  return map
})()

/**
 * Every owned hostname (bare + `www.`), flat list. Single source of truth for
 * both locale resolution and auth trusted origins so the two never drift apart.
 */
export const ownedHosts: readonly string[] = Object.keys(domainLocaleMap)

/**
 * `https://` origins for every owned domain. Used to populate Better Auth's
 * `trustedOrigins` so admin login works on ALL owned production domains.
 */
export const ownedOrigins: readonly string[] = ownedHosts.map(
  (host) => `https://${host}`,
)

/** Normalize a raw Host header: drop the port, lowercase. */
function normalizeHost(host: string | undefined | null): string | null {
  if (!host) return null
  return host.split(':')[0].toLowerCase()
}

/** True when the host is one of our owned production domains (bare or www). */
export function isOwnedHost(host: string | undefined | null): boolean {
  return localeFromHost(host) !== null
}

/**
 * The origin to use for THIS request's canonical/OG URL. Every owned domain
 * self-canonicalizes to its own host (so the domain stays live and indexable);
 * unknown hosts (localhost / preview) fall back to the locale's representative.
 */
export function originForHost(host: string | undefined | null): string {
  const normalized = normalizeHost(host)
  if (normalized && isOwnedHost(normalized)) return `https://${normalized}`
  const { locale } = resolveLocale(host, null)
  return `https://${representativeDomain[locale]}`
}

export const localeMeta: Record<
  Locale,
  {
    label: string
    shortLabel: string
    /** Market name shown in the admin (e.g. "Online", "CZ", "SK"). */
    market: string
    htmlLang: string
    domain: string
  }
> = {
  en: {
    label: 'English',
    shortLabel: 'EN',
    market: 'Online',
    htmlLang: 'en',
    domain: 'goldenstudio.online',
  },
  'cs-CZ': {
    label: 'Čeština',
    shortLabel: 'CZ',
    market: 'CZ',
    htmlLang: 'cs',
    domain: 'goldendigital.cz',
  },
  'sk-SK': {
    label: 'Slovenčina',
    shortLabel: 'SK',
    market: 'SK',
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

/**
 * Full domain diagnosis for a request host — powers the admin debug panel and
 * keeps SEO consistent. There are no app-level redirects: every owned host
 * renders the site and self-canonicalizes, while hreflang/sitemap reference the
 * locale's representative domain.
 */
export function resolveHost(host: string | undefined | null): {
  host: string | null
  owned: boolean
  locale: Locale
  localeSource: LocaleSource
  representativeDomain: string
  representativeUrl: string
  canonicalUrl: string
  appRedirectDisabled: true
} {
  const normalized = normalizeHost(host)
  const owned = isOwnedHost(host)
  const { locale, source } = resolveLocale(host, null)
  const repDomain = representativeDomain[locale]

  return {
    host: normalized,
    owned,
    locale,
    localeSource: source,
    representativeDomain: repDomain,
    representativeUrl: `https://${repDomain}`,
    canonicalUrl: originForHost(host),
    // App-level redirects are intentionally disabled so every owned domain
    // stays live. Apex↔www normalization (if any) is handled by Vercel DNS.
    appRedirectDisabled: true,
  }
}
