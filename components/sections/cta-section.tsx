import { CtaLink } from '@/components/cta-link'
import { FoxWatermark } from '@/components/fox-watermark'
import type { Locale } from '@/lib/i18n/config'
import { defaultLocale } from '@/lib/i18n/config'
import { getSectionContent, SECTION_KEYS } from '@/lib/cms/section-content'

export async function CtaSection({
  locale = defaultLocale,
}: {
  locale?: Locale
}) {
  const section = await getSectionContent(locale, SECTION_KEYS.homeFinalCta)
  const data = section.data as {
    titleHighlight?: string
    primaryCta?: string
    secondaryCta?: string
  }

  return (
    <section className="border-t border-gold/10 bg-background">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="relative overflow-hidden rounded-[2rem] border border-gold/25 bg-espresso px-6 py-16 shadow-[0_40px_120px_-50px_rgba(212,175,55,0.45)] sm:px-14 sm:py-24">
          {/* Luxury fox watermark behind the message */}
          <FoxWatermark
            position="right-[-4%] top-1/2 -translate-y-1/2"
            size="h-[520px] w-[520px]"
            opacity="opacity-[0.08]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-espresso via-espresso/85 to-transparent"
            aria-hidden="true"
          />

          <div className="relative flex max-w-2xl flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
              {section.eyebrow}
            </span>
            <h2 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-balance text-sand sm:text-5xl lg:text-[3.5rem]">
              {section.title}{' '}
              <span className="text-gold">{data.titleHighlight}</span>
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              {section.body}
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <CtaLink href="/contact" size="lg">
                {data.primaryCta}
              </CtaLink>
              <CtaLink href="/portfolio" size="lg" variant="outline">
                {data.secondaryCta}
              </CtaLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
