import { SectionHeading } from '@/components/section-heading'
import type { Locale } from '@/lib/i18n/config'
import { defaultLocale } from '@/lib/i18n/config'
import {
  getSectionContent,
  sectionItems,
  SECTION_KEYS,
} from '@/lib/cms/section-content'

export async function Process({ locale = defaultLocale }: { locale?: Locale }) {
  const section = await getSectionContent(locale, SECTION_KEYS.homeProcess)
  const steps = sectionItems(section) as {
    step: string
    title: string
    body: string
  }[]

  return (
    <section className="border-t border-gold/10 bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow={section.eyebrow ?? undefined}
          title={section.title ?? ''}
          description={section.body ?? undefined}
        />

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <li
              key={step.step}
              className="relative flex flex-col gap-3 rounded-2xl border border-gold/15 bg-background p-6"
            >
              <span className="font-heading text-3xl font-semibold text-gold/80">
                {step.step}
              </span>
              <h3 className="font-heading text-lg font-semibold text-sand">
                {step.title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
