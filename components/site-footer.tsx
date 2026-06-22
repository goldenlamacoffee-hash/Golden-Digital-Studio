import Link from 'next/link'
import { BrandLogo } from '@/components/brand-logo'
import { FoxWatermark } from '@/components/fox-watermark'
import { site } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { getSectionContent, SECTION_KEYS } from '@/lib/cms/section-content'

type FooterColumn = { title: string; links: { label: string; href: string }[] }

export async function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale
  dict: Dictionary
}) {
  const section = await getSectionContent(locale, SECTION_KEYS.footer)
  const data = section.data as {
    columns?: FooterColumn[]
    parentLine?: string
    slogan?: string
  }
  const columns = Array.isArray(data.columns) ? data.columns : []
  const blurb = section.body ?? ''

  return (
    <footer className="relative overflow-hidden border-t border-gold/15 bg-espresso">
      <FoxWatermark
        position="right-[-8%] bottom-[-20%]"
        size="h-[420px] w-[420px]"
        opacity="opacity-[0.05]"
        glow={false}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              aria-label="Golden Digital Studio — home"
              className="w-fit transition-opacity hover:opacity-90"
            >
              <BrandLogo variant="horizontal" className="h-12 w-auto" />
            </Link>
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              {blurb}
            </p>
            {data.parentLine ? (
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-gold/70">
                {data.parentLine}
              </p>
            ) : null}
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-sand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-gold/10 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. {dict.footer.rights}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold/70">
            {data.slogan ?? site.shortTagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
