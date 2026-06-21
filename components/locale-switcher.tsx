'use client'

import { useTransition } from 'react'
import { Check, Globe } from 'lucide-react'
import { setLocale } from '@/app/actions/locale'
import {
  locales,
  localeMeta,
  localeOrigin,
  isProductionHost,
  type Locale,
} from '@/lib/i18n/config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function LocaleSwitcher({ current }: { current: Locale }) {
  const [isPending, startTransition] = useTransition()

  function handleSelect(locale: Locale) {
    if (locale === current) return

    // In production, locale is owned by the domain — switch by navigating to the
    // equivalent domain, preserving the current path + query.
    if (typeof window !== 'undefined' && isProductionHost(window.location.hostname)) {
      const { pathname, search } = window.location
      window.location.href = `${localeOrigin(locale)}${pathname}${search}`
      return
    }

    // Localhost / preview: no domain mapping, so fall back to the cookie.
    startTransition(() => {
      void setLocale(locale)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-sand/80 transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-50"
        disabled={isPending}
        aria-label="Change language"
      >
        <Globe className="size-3.5" />
        {localeMeta[current].shortLabel}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleSelect(locale)}
            className="flex items-center justify-between gap-3"
          >
            <span>{localeMeta[locale].label}</span>
            <Check
              className={cn(
                'size-4 text-gold',
                locale === current ? 'opacity-100' : 'opacity-0',
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
