import { cookies, headers } from 'next/headers'
import {
  isLocale,
  defaultLocale,
  resolveLocale,
  type Locale,
} from '@/lib/i18n/config'

/**
 * Admin-only cookie that remembers which market/locale the operator is
 * currently editing. This is completely independent from the PUBLIC locale
 * (which is decided by the request domain). It lets an admin open `/admin` on
 * any owned domain — or localhost — and still edit CZ / SK / EN content.
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

/**
 * Resolve which locale the admin is editing. Priority:
 *   1. Explicit `?locale=` search param (the locale switcher / current page)
 *   2. The `gds_admin_locale` admin cookie (persists across navigation)
 *   3. The public host locale (sensible default on a real .cz/.sk/.online domain)
 *   4. `en`
 *
 * Crucially this does NOT let the public host LOCK the admin: the param and
 * cookie always win, so editing CZ content from an `.online` domain works.
 */
export async function getAdminLocale(
  searchParamValue?: string | string[] | undefined,
): Promise<{
  locale: Locale
  source: AdminLocaleSource
  hostLocale: Locale
  host: string | null
}> {
  const headerList = await headers()
  const host = headerList.get('host')
  const cookieStore = await cookies()

  const param = Array.isArray(searchParamValue)
    ? searchParamValue[0]
    : searchParamValue
  const cookieValue = cookieStore.get(ADMIN_LOCALE_COOKIE)?.value
  const { locale: hostLocale } = resolveLocale(host, null)

  const fromParam = normalizeLocale(param)
  if (fromParam) return { locale: fromParam, source: 'param', hostLocale, host }

  const fromCookie = normalizeLocale(cookieValue)
  if (fromCookie) return { locale: fromCookie, source: 'cookie', hostLocale, host }

  if (hostLocale) return { locale: hostLocale, source: 'host', hostLocale, host }

  return { locale: defaultLocale, source: 'default', hostLocale, host }
}
