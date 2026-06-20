import { SectionHeading } from '@/components/section-heading'
import { processSteps } from '@/lib/content'

export function Process() {
  return (
    <section className="border-t border-gold/10 bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow="Process"
          title="A clear path from idea to a system you can run."
          description="Five focused stages keep the work transparent, fast and easy to follow."
        />

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step) => (
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
