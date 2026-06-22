import Link from 'next/link'
import { Images } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { FoxWatermark } from '@/components/fox-watermark'
import { PortfolioImage } from '@/components/portfolio-image'
import { projects as seedProjects } from '@/lib/content'
import type { ProjectItem } from '@/lib/cms/queries'
import {
  resolveCardImage,
  isValidExternalUrl,
  getPortfolioExcerpt,
  resolveProjectContent,
} from '@/lib/portfolio'
import type { Locale } from '@/lib/i18n/config'
import { defaultLocale } from '@/lib/i18n/config'
import { getSectionContent, SECTION_KEYS } from '@/lib/cms/section-content'
import { cn } from '@/lib/utils'

type PortfolioSectionProps = {
  flush?: boolean
  items?: ProjectItem[]
  heading?: { eyebrow?: string; title?: string; description?: string }
  locale?: Locale
}

export async function PortfolioSection({
  flush,
  items,
  heading,
  locale = defaultLocale,
}: PortfolioSectionProps) {
  const labelSection = await getSectionContent(
    locale,
    SECTION_KEYS.portfolioLabels,
  )
  const labels = labelSection.data as {
    signatureWork?: string
    viewCaseStudy?: string
    visitSite?: string
  }
  const projects: ProjectItem[] =
    items ??
    seedProjects.map((p) => {
      const { excerpt, body } = resolveProjectContent({ description: p.description })
      return {
        slug: p.slug,
        name: p.name,
        category: p.category,
        description: p.description,
        excerpt,
        body,
        imageUrl: null,
        gallery: [],
        url: null,
      }
    })

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
            const card = resolveCardImage(project)
            const showLink = isValidExternalUrl(project.url)
            const galleryCount = project.gallery.length

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

                {/* Stretched link makes the whole card open the case study. */}
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="absolute inset-0 z-10 rounded-[1.25rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span className="sr-only">View {project.name} case study</span>
                </Link>

                {/* Visual area — gallery/cover image, or luxury placeholder */}
                <div className="relative w-full overflow-hidden border-b border-gold/10">
                  <PortfolioImage
                    url={card?.url ?? null}
                    alt={project.name}
                    displayMode={card?.displayMode ?? 'cover'}
                    position={card?.position ?? 'center'}
                    boxRatioClass={featured ? 'aspect-[16/8]' : 'aspect-[16/10]'}
                    sizes={featured ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                    hoverZoom={card?.displayMode !== 'contain'}
                    priority={featured}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-gold/25 bg-espresso/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
                    {featured
                      ? labels.signatureWork ?? 'Signature work'
                      : project.category}
                  </span>
                  <span className="absolute right-4 top-4 font-mono text-xs text-sand/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {galleryCount > 1 ? (
                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-espresso/70 px-2.5 py-1 font-mono text-[11px] text-sand/80 backdrop-blur-sm">
                      <Images className="size-3.5 text-gold" aria-hidden="true" />
                      {galleryCount}
                    </span>
                  ) : null}
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
                  <p className="line-clamp-3 text-pretty leading-relaxed text-muted-foreground">
                    {getPortfolioExcerpt(project)}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-4">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-gold transition-colors group-hover:text-warm-gold">
                      {labels.viewCaseStudy ?? 'View case study →'}
                    </span>
                    {showLink ? (
                      <a
                        href={project.url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20 inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-sand/60 transition-colors hover:text-gold"
                      >
                        {labels.visitSite ?? 'Visit site ↗'}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
