import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'
import { FoxWatermark } from '@/components/fox-watermark'
import { projects as seedProjects } from '@/lib/content'
import type { ProjectItem } from '@/lib/cms/queries'
import { getProjectImage, isValidExternalUrl } from '@/lib/portfolio'
import { cn } from '@/lib/utils'

type PortfolioSectionProps = {
  flush?: boolean
  items?: ProjectItem[]
  heading?: { eyebrow?: string; title?: string; description?: string }
}

/** Luxury fallback when a project has no image: gold gradient + fox watermark. */
function ProjectPlaceholder({ featured }: { featured?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden bg-gradient-to-br from-espresso via-card to-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.18),transparent_60%)]" />
      <FoxWatermark
        position={featured ? 'right-[-6%] top-1/2 -translate-y-1/2' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}
        size={featured ? 'h-[360px] w-[360px]' : 'h-[220px] w-[220px]'}
        opacity="opacity-[0.08]"
        glow={false}
      />
    </div>
  )
}

export function PortfolioSection({
  flush,
  items,
  heading,
}: PortfolioSectionProps) {
  const projects: ProjectItem[] =
    items ??
    seedProjects.map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      description: p.description,
      imageUrl: null,
      url: null,
    }))

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
          eyebrow={heading?.eyebrow ?? 'Portfolio'}
          title={heading?.title ?? 'Proof in real systems and brands.'}
          description={
            heading?.description ??
            'Selected work across websites, portals and apps. Built to perform and ready for the next phase.'
          }
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => {
            const featured = index === 0
            const image = getProjectImage(project)
            const showLink = isValidExternalUrl(project.url)
            return (
              <article
                key={project.slug}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-gold/15 bg-card/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/45 hover:bg-card hover:shadow-[0_30px_80px_-50px_rgba(212,175,55,0.6)]',
                  featured && 'md:col-span-2',
                )}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />

                {/* Visual area — image if present, otherwise luxury placeholder */}
                <div
                  className={cn(
                    'relative w-full overflow-hidden border-b border-gold/10',
                    featured ? 'aspect-[16/7]' : 'aspect-[16/10]',
                  )}
                >
                  {image ? (
                    <Image
                      src={image || '/placeholder.svg'}
                      alt={project.name}
                      fill
                      sizes={featured ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <ProjectPlaceholder featured={featured} />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-gold/25 bg-espresso/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
                    {featured ? 'Signature work' : project.category}
                  </span>
                  <span className="absolute right-4 top-4 font-mono text-xs text-sand/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-8">
                  {featured && project.category ? (
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold/70">
                      {project.category}
                    </span>
                  ) : null}
                  <h3
                    className={cn(
                      'font-heading font-semibold text-sand',
                      featured ? 'text-3xl sm:text-4xl' : 'text-2xl',
                    )}
                  >
                    {project.name}
                  </h3>
                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  {showLink ? (
                    <a
                      href={project.url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 font-mono text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:text-warm-gold"
                    >
                      View project →
                    </a>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
