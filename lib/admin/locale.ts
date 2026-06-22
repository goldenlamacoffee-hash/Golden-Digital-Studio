import { cookies, headers } from 'next/headers'
import { defaultLocale, resolveLocale, type Locale } from '@/lib/i18n/config'
import {
  ADMIN_LOCALE_COOKIE,
  normalizeLocale,
  type AdminLocaleSource,
} from '@/lib/admin/locale-shared'

// Re-export the client-safe pieces so server callers can keep importing from
// a single place.
export {
  ADMIN_LOCALE_COOKIE,
  normalizeLocale,
  assertValidLocale,
  type AdminLocaleSource,
} from '@/lib/admin/locale-shared'

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
