import { isLocale, type Locale } from '@/lib/i18n/config'

/**
 * Client-safe admin locale constants & pure helpers. This module intentionally
 * imports NOTHING from `next/headers` so it can be used in client components
 * (the locale switcher, sidebar) as well as on the server.
 */

/**
 * Admin-only cookie that remembers which market/locale the operator is
 * currently editing. Independent from the PUBLIC locale (decided by the request
 * domain) so an admin can edit CZ / SK / EN content from any owned domain.
 */
export const ADMIN_LOCALE_COOKIE = 'gds_admin_locale'

export type AdminLocaleSource = 'param' | 'cookie' | 'host' | 'default'

/** Strict normalization: only exact, known locale codes are accepted. */
export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) return null
  const trimmed = value.trim()
  if (isLocale(trimmed)) return trimmed
  // Tolerate short forms coming from older links / manual input.
  const short = trimmed.toLowerCase()
  if (short === 'cs' || short === 'cz') return 'cs-CZ'
  if (short === 'sk') return 'sk-SK'
  if (short === 'en') return 'en'
  return null
}

/** Throwing variant — use in server actions where an invalid locale is a bug. */
export function assertValidLocale(value: string | null | undefined): Locale {
  const normalized = normalizeLocale(value)
  if (!normalized) {
    throw new Error(`Invalid locale: ${String(value)}`)
  }
  return normalized
}
