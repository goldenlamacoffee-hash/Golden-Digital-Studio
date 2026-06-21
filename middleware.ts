import { NextResponse, type NextRequest } from 'next/server'
import { LOCALE_COOKIE, localeFromHost } from '@/lib/i18n/config'

/**
 * On production domains, pin the locale cookie to the domain's locale so the
 * rest of the app (and any client switcher) stays consistent. On preview /
 * localhost there is no domain match, so the cookie set by the switcher wins.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const host = request.headers.get('host')
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
