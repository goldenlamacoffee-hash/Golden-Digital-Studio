import { SectionHeading } from '@/components/section-heading'
import type { Locale } from '@/lib/i18n/config'
import { defaultLocale } from '@/lib/i18n/config'
import {
  getSectionContent,
  sectionItems,
  SECTION_KEYS,
} from '@/lib/cms/section-content'

export async function Positioning({
  locale = defaultLocale,
}: {
  locale?: Locale
}) {
  const section = await getSectionContent(locale, SECTION_KEYS.homePositioning)
  const stats = sectionItems(section) as { value: string; label: string }[]

  return (
    <section className="border-t border-gold/10 bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          eyebrow={section.eyebrow ?? undefined}
          title={section.title ?? ''}
          description={section.body ?? undefined}
        />

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gold/15 bg-espresso/50 p-6"
            >
              <p className="font-heading text-2xl font-semibold text-gold">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
