import { cookies, headers } from 'next/headers'
import {
  LOCALE_COOKIE,
  originForHost,
  resolveHost,
  resolveLocale,
  type Locale,
  type LocaleSource,
} from './config'

/**
 * Resolve the active locale for the current request using the single canonical
 * resolver. Priority: production domain → locale cookie (preview/localhost) →
 * default. A production domain always wins over the cookie.
 */
export async function getLocale(): Promise<Locale> {
  const { locale } = await getLocaleDebug()
  return locale
}

/**
 * Same resolution as `getLocale`, but also returns the detected host and which
 * source decided the locale. Used by the admin-only debug panel and server logs.
 */
export async function getLocaleDebug(): Promise<{
  host: string | null
  locale: Locale
  source: LocaleSource
}> {
  const headerList = await headers()
  const host = headerList.get('host')
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(LOCALE_COOKIE)?.value
  const { locale, source } = resolveLocale(host, cookieValue)

  if (process.env.LOCALE_DEBUG === '1') {
    console.log(
      `[v0] locale resolve host=${host ?? 'null'} cookie=${cookieValue ?? 'none'} -> ${locale} (${source})`,
    )
  }

  return { host, locale, source }
}

/**
 * Full domain + locale diagnosis for the current request. Wraps `resolveHost`
 * with the live Host header. Powers the admin localization debug panel:
 * detected host, whether it is owned, resolved locale + source, the SEO
 * representative domain, and confirmation that app-level redirects are disabled.
 */
export async function getHostDebug() {
  const headerList = await headers()
  const host = headerList.get('host')
  return resolveHost(host)
}

/**
 * The origin for the current request's canonical / OG URL. Every owned domain
 * self-canonicalizes to its own host; localhost / preview falls back to the
 * locale's representative domain.
 */
export async function getRequestOrigin(): Promise<string> {
  const headerList = await headers()
  return originForHost(headerList.get('host'))
}
