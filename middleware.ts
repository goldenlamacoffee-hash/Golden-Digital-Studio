import { NextResponse, type NextRequest } from 'next/server'
import { LOCALE_COOKIE, localeFromHost } from '@/lib/i18n/config'

/**
 * Domain strategy: EVERY owned domain serves the website. There are NO
 * app-level redirects between owned domains — `.cz`, `.sk` and `.online`
 * variants all render directly and resolve their language from the host.
 *
 *  1. On any owned production domain, pin the locale cookie to the host's
 *     locale so a client-side switcher stays consistent and a stale cookie can
 *     never override the domain language.
 *  2. On preview / localhost there is no domain match, so the switcher cookie
 *     wins instead.
 *
 * Note: apex↔www canonicalization, if desired, is configured at the Vercel
 * domain level — never here — so no owned domain is hidden behind a redirect.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host')
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
