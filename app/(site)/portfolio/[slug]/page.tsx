import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { PortfolioImage } from '@/components/portfolio-image'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { CtaSection } from '@/components/sections/cta-section'
import { FoxWatermark } from '@/components/fox-watermark'
import { getLocale } from '@/lib/i18n/server'
import { getProject } from '@/lib/cms/queries'
import { getProjectImage, isValidExternalUrl, sizeSpanClass } from '@/lib/portfolio'

type Params = { slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const project = await getProject(locale, slug)
  if (!project) return { title: 'Project not found' }
  return {
    title: `${project.name} · Portfolio`,
    description: project.excerpt || `${project.name} — a Golden Digital Studio case study.`,
    openGraph: {
      title: `${project.name} · Golden Digital Studio`,
      description: project.excerpt || undefined,
      images: getProjectImage(project) ? [getProjectImage(project) as string] : undefined,
    },
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const locale = await getLocale()
  const project = await getProject(locale, slug)
  if (!project) notFound()

  const cover = getProjectImage(project)
  const showLink = isValidExternalUrl(project.url)

  // Cover drives the hero; otherwise the first gallery image becomes the hero
  // and the remainder fills the editorial grid below.
  let hero: { url: string; displayMode: 'cover' | 'contain'; position: NonNullable<typeof project.gallery[number]['position']> } | null =
    cover ? { url: cover, displayMode: 'cover', position: 'center' } : null
  let gridImages = project.gallery
  if (!hero && project.gallery.length > 0) {
    const [first, ...rest] = project.gallery
    hero = { url: first.url, displayMode: first.displayMode, position: first.position ?? 'center' }
    gridImages = rest
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-gold/10 bg-card/40">
        <FoxWatermark
          position="right-[-6%] top-1/2 -translate-y-1/2"
          size="h-[440px] w-[440px]"
          opacity="opacity-[0.06]"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-5 py-16 sm:px-8 sm:py-20">
          <Link
            href="/portfolio"
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-sand/60 transition-colors hover:text-gold"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            All work
          </Link>

          {project.category ? (
            <span className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-gold">
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
              {project.category}
            </span>
          ) : null}

          <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-balance text-sand sm:text-5xl">
            {project.name}
          </h1>

          {project.excerpt ? (
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {project.excerpt}
            </p>
          ) : null}

          {showLink ? (
            <a
              href={project.url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/20"
            >
              Visit live site
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </section>

      <section className="relative overflow-hidden bg-background">
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          {/* Hero image */}
          <div className="overflow-hidden rounded-[1.5rem] border border-gold/15 bg-card/40 shadow-[0_40px_120px_-60px_rgba(212,175,55,0.5)]">
            <PortfolioImage
              url={hero?.url ?? null}
              alt={project.name}
              displayMode={hero?.displayMode ?? 'cover'}
              position={hero?.position ?? 'center'}
              boxRatioClass="aspect-[16/9]"
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
            />
          </div>

          {/* Full case-study body — markdown rendered as luxury prose */}
          {project.body ? (
            <div className="mx-auto mt-12 max-w-2xl sm:mt-16">
              <MarkdownRenderer content={project.body} />
            </div>
          ) : null}

          {/* Editorial gallery grid */}
          {gridImages.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-6">
              {gridImages.map((img) => (
                <figure
                  key={img.id}
                  className={`flex flex-col gap-3 ${sizeSpanClass(img.size)}`}
                >
                  <div className="overflow-hidden rounded-[1.25rem] border border-gold/15 bg-card/40">
                    <PortfolioImage
                      url={img.url}
                      alt={img.alt || project.name}
                      displayMode={img.displayMode}
                      aspectRatio={img.aspectRatio}
                      position={img.position}
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  {img.caption ? (
                    <figcaption className="px-1 font-mono text-xs leading-relaxed text-sand/60">
                      {img.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <CtaSection />
    </>
  )
}
