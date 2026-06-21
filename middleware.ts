import { NextResponse, type NextRequest } from 'next/server'
import {
  LOCALE_COOKIE,
  getRedirectTarget,
  localeFromHost,
} from '@/lib/i18n/config'

/**
 * Domain strategy:
 *  1. Alias / `www.` / defensive domains 308-redirect to their canonical market
 *     domain, preserving path + query (e.g. goldenstudio.cz/services?x=1 →
 *     https://goldendigital.cz/services?x=1). This prevents duplicate SEO
 *     content across the owned domains.
 *  2. On a canonical production domain, pin the locale cookie to the domain's
 *     locale so any client switcher stays consistent.
 *  3. On preview / localhost there is no domain match, so the switcher cookie
 *     wins and no redirect happens.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  const { pathname, search } = request.nextUrl

  // 1. Permanent-redirect alias and www hosts to canonical.
  const redirectTarget = getRedirectTarget(host, pathname, search)
  if (redirectTarget) {
    return NextResponse.redirect(redirectTarget, 308)
  }

  // 2. Pin the locale cookie on canonical production domains.
  const response = NextResponse.next()
  const domainLocale = localeFromHost(host)
  if (domainLocale && request.cookies.get(LOCALE_COOKIE)?.value !== domainLocale) {
    response.cookies.set(LOCALE_COOKIE, domainLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|brand|.*\\.).*)'],
}
