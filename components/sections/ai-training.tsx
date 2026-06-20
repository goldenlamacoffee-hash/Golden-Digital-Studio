import { SectionHeading } from '@/components/section-heading'
import { CtaLink } from '@/components/cta-link'
import { aiTopics } from '@/lib/content'

export function AiTraining() {
  return (
    <section className="border-t border-gold/10 bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="AI training"
            title="We can also train your team to work with AI."
            description="Beyond building systems, Golden Digital Studio runs practical, hands-on training so your team can use modern AI tools with confidence — from everyday assistants to repeatable content and automation workflows."
          />
          <div className="w-fit">
            <CtaLink href="/contact" variant="outline">
              Ask about training
            </CtaLink>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {aiTopics.map((topic) => (
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
