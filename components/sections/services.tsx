import { ArrowUpRight, Check } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { services } from '@/lib/content'
import { cn } from '@/lib/utils'

type ServicesSectionProps = {
  /** Show the per-service detail bullet lists (used on the Services page). */
  detailed?: boolean
  /** Render without the top border (used when first on a page). */
  flush?: boolean
}

export function ServicesSection({ detailed, flush }: ServicesSectionProps) {
  return (
    <section
      id="services"
      className={cn('bg-background', !flush && 'border-t border-gold/10')}
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow="Services"
          title="Everything you need to run a modern digital business."
          description="One studio for the systems that matter — built to work together and easy to maintain."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.slug}
              id={service.slug}
              className="group relative flex scroll-mt-24 flex-col gap-4 overflow-hidden rounded-[1.25rem] border border-gold/15 bg-card/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/45 hover:bg-card hover:shadow-[0_30px_80px_-55px_rgba(212,175,55,0.6)]"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <ArrowUpRight className="size-4 text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-sand">
                {service.title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {service.summary}
              </p>

              {detailed ? (
                <ul className="mt-2 flex flex-col gap-2.5 border-t border-gold/10 pt-4">
                  {service.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
