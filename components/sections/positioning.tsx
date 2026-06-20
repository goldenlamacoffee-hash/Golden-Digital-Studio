import { SectionHeading } from '@/components/section-heading'

const stats: { value: string; label: string }[] = [
  { value: 'CMS-first', label: 'You own and edit your content' },
  { value: 'Weeks', label: 'Typical time to a first launch' },
  { value: 'AI-assisted', label: 'Faster builds without cut corners' },
]

export function Positioning() {
  return (
    <section className="border-t border-gold/10 bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          eyebrow="Positioning"
          title="From outdated websites and manual work to modern digital systems."
          description="Most small businesses are held back by a slow website and a stack of manual tasks. Golden Digital Studio replaces that with clean, connected systems — built around how your business actually works, not around hype. The result is software that is faster to use, easier to maintain and ready to grow with you."
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
