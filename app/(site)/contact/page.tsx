import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact-form'
import { faqs, site } from '@/lib/content'
import { getLocale } from '@/lib/i18n/server'
import { getDictionary } from '@/lib/i18n/dictionaries'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a project with Golden Digital Studio. Tell us about your business and book a consultation for websites, portals, apps and AI workflows.',
  openGraph: {
    title: 'Contact · Golden Digital Studio',
    description:
      'Start a project or book a consultation with Golden Digital Studio.',
  },
}

const details = [
  {
    icon: Mail,
    label: 'Email',
    value: site.email,
    note: 'Placeholder — replace with your studio inbox.',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: site.phone,
    note: 'Placeholder — add your business number.',
  },
  {
    icon: MapPin,
    label: 'Regions',
    value: site.regions.join(' · '),
    note: `Serving small businesses, by ${site.parent}.`,
  },
]

export default async function ContactPage() {
  const locale = await getLocale()
  const t = getDictionary(locale)
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Start a project. Build something golden."
        description="Tell us where your business is today and what you want to build. We'll come back with a clear, practical next step — no jargon, no pressure."
      />

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-2xl border border-gold/15 bg-card/60 p-5"
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <item.icon className="size-5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                      {item.label}
                    </span>
                    <span className="text-sand">{item.value}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ContactForm t={t.contact} />
        </div>
      </section>

      <section className="border-t border-gold/10 bg-card/40">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-sand sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-10 flex flex-col gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-gold/15 bg-background p-6 transition-colors open:border-gold/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-medium text-sand marker:hidden">
                  {faq.question}
                  <span
                    className="font-mono text-xl text-gold transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
