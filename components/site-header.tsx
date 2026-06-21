'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { BrandLockupLink } from '@/components/brand-logo'
import { CtaLink } from '@/components/cta-link'
import { LocaleSwitcher } from '@/components/locale-switcher'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils'

export function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale
  dict: Dictionary
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const nav = [
    { label: dict.nav.services, href: '/services' },
    { label: dict.nav.portfolio, href: '/portfolio' },
    { label: dict.nav.contact, href: '/contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors',
        scrolled
          ? 'border-gold/15 bg-background/85 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <BrandLockupLink priority imageClassName="h-11 sm:h-12" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-gold'
                    : 'text-muted-foreground hover:text-sand',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher current={locale} />
          <CtaLink href="/contact" size="sm">
            {dict.cta.primary}
          </CtaLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-gold/20 text-sand md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-gold/15 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <nav
            className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8"
            aria-label="Mobile"
          >
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                    active
                      ? 'bg-gold/10 text-gold'
                      : 'text-muted-foreground hover:bg-muted hover:text-sand',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <CtaLink href="/contact" className="mt-2 w-full">
              {dict.cta.primary}
            </CtaLink>
            <div className="mt-3 flex justify-center">
              <LocaleSwitcher current={locale} />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
