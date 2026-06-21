import { cookies, headers } from 'next/headers'
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  localeFromHost,
  type Locale,
} from './config'

/**
 * Resolve the active locale for the current request.
 * Priority: production domain → locale cookie (preview/localhost) → default.
 */
export async function getLocale(): Promise<Locale> {
  const headerList = await headers()
  const host = headerList.get('host')
  const fromHost = localeFromHost(host)
  if (fromHost) return fromHost

  const cookieStore = await cookies()
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value
  if (isLocale(fromCookie)) return fromCookie

  return defaultLocale
}
