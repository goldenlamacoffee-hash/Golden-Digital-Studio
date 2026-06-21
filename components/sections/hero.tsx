import { CtaLink } from '@/components/cta-link'
import { BrandLogo } from '@/components/brand-logo'
import { site } from '@/lib/content'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ghosted luxury fox watermark — pushed far right/lower, mostly off-canvas,
          intentionally behind everything and never directly behind the logo. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute right-[-22%] top-[62%] h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-gold/8 blur-[150px]" />
        <BrandLogo
          variant="emblem"
          decorative
          className="absolute right-[-20%] top-[64%] h-[760px] w-[760px] -translate-y-1/2 object-contain opacity-[0.035]"
        />
      </div>
      {/* Thin gold top accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32 lg:min-h-[90vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left: copy */}
        <div className="flex flex-col gap-8">
          <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-gold/30 bg-espresso/60 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-gold backdrop-blur">
            <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
            A digital studio by {site.parent}
          </span>

          <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.04] tracking-tight text-balance text-sand sm:text-5xl lg:text-[4rem]">
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

          <div className="mt-2 flex items-center gap-4">
            <span className="h-px w-10 bg-gold/40" aria-hidden="true" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {site.tagline}
            </p>
          </div>
        </div>

        {/* Right: primary logo as the hero brand element — soft halo, no hard card */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative flex w-full max-w-md items-center justify-center">
            <div
              className="pointer-events-none absolute inset-0 rounded-full bg-gold/15 blur-[90px]"
              aria-hidden="true"
            />
            <BrandLogo
              variant="primary"
              priority
              sizes="(min-width: 1024px) 420px, 80vw"
              className="relative h-auto w-[82%] drop-shadow-[0_20px_70px_rgba(212,175,55,0.22)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
