import { SectionHeading } from '@/components/section-heading'
import { projects } from '@/lib/content'
import { cn } from '@/lib/utils'

type PortfolioSectionProps = {
  flush?: boolean
}

export function PortfolioSection({ flush }: PortfolioSectionProps) {
  return (
    <section
      id="portfolio"
      className={cn('bg-background', !flush && 'border-t border-gold/10')}
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow="Portfolio"
          title="Proof in real systems and brands."
          description="Selected work across websites, portals and apps. Built to perform and ready for the next phase."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.slug}
              className={cn(
                'group flex flex-col justify-between gap-6 rounded-2xl border border-gold/15 bg-card/60 p-8 transition-all hover:-translate-y-1 hover:border-gold/40 hover:bg-card',
                index === 0 && 'md:col-span-2',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center rounded-full border border-gold/25 bg-espresso/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                  {project.category}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-heading text-2xl font-semibold text-sand">
                  {project.name}
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>

              <p className="border-t border-gold/10 pt-4 text-sm text-sand/80">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                  Outcome —{' '}
                </span>
                {project.outcome}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
