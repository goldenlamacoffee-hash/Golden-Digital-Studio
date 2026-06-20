import Image from 'next/image'
import { CtaLink } from '@/components/cta-link'
import { site } from '@/lib/content'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background emblem */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/fox-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-right opacity-40 sm:opacity-55 lg:opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-5 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32 lg:min-h-[88vh] lg:justify-center">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-espresso/60 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-gold backdrop-blur">
          <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
          A digital studio by {site.parent}
        </span>

        <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-balance text-sand sm:text-5xl lg:text-6xl">
          Websites, apps and AI systems for{' '}
          <span className="text-gold">ambitious small businesses.</span>
        </h1>

        <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {site.description}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <CtaLink href="/contact" size="lg">
            Start a project
          </CtaLink>
          <CtaLink href="/services" size="lg" variant="outline">
            See what we build
          </CtaLink>
        </div>

        <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {site.tagline}
        </p>
      </div>
    </section>
  )
}
