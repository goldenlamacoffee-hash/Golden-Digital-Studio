import { SectionHeading } from '@/components/section-heading'
import { CtaLink } from '@/components/cta-link'
import type { Locale } from '@/lib/i18n/config'
import { defaultLocale } from '@/lib/i18n/config'
import {
  getSectionContent,
  sectionItems,
  SECTION_KEYS,
} from '@/lib/cms/section-content'

export async function AiTraining({
  locale = defaultLocale,
}: {
  locale?: Locale
}) {
  const section = await getSectionContent(locale, SECTION_KEYS.homeAiTraining)
  const topics = sectionItems(section) as { title: string; body: string }[]
  const ctaLabel = (section.data as { ctaLabel?: string }).ctaLabel

  return (
    <section className="border-t border-gold/10 bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow={section.eyebrow ?? undefined}
            title={section.title ?? ''}
            description={section.body ?? undefined}
          />
          {ctaLabel ? (
            <div className="w-fit">
              <CtaLink href="/contact" variant="outline">
                {ctaLabel}
              </CtaLink>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-2xl border border-gold/15 bg-espresso/50 p-6"
            >
              <h3 className="font-heading text-base font-semibold text-sand">
                {topic.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {topic.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
