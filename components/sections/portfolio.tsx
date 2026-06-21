import { SectionHeading } from '@/components/section-heading'
import { FoxWatermark } from '@/components/fox-watermark'
import { projects } from '@/lib/content'
import { cn } from '@/lib/utils'

type PortfolioSectionProps = {
  flush?: boolean
}

export function PortfolioSection({ flush }: PortfolioSectionProps) {
  return (
    <section
      id="portfolio"
      className={cn(
        'relative overflow-hidden bg-background',
        !flush && 'border-t border-gold/10',
      )}
    >
      <FoxWatermark
        position="left-[-12%] top-[6%]"
        size="h-[520px] w-[520px]"
        opacity="opacity-[0.04]"
        glow={false}
      />
      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
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
                'group relative flex flex-col justify-between gap-6 overflow-hidden rounded-[1.25rem] border border-gold/15 bg-card/60 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/45 hover:bg-card hover:shadow-[0_30px_80px_-50px_rgba(212,175,55,0.6)]',
                index === 0 && 'md:col-span-2',
              )}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center rounded-full border border-gold/25 bg-espresso/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                  {index === 0 ? 'Signature work' : project.category}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {index === 0 ? (
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold/70">
                    {project.category}
                  </span>
                ) : null}
                <h3
                  className={cn(
                    'font-heading font-semibold text-sand',
                    index === 0 ? 'text-3xl sm:text-4xl' : 'text-2xl',
                  )}
                >
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
