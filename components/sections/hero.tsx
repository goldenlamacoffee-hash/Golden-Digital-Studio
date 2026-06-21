import Image from 'next/image'
import { CtaLink } from '@/components/cta-link'
import { FOX_MARK_SRC } from '@/components/fox-logo'
import { site } from '@/lib/content'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32 lg:min-h-[88vh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Left: copy */}
        <div className="flex flex-col gap-8">
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

        {/* Right: fox emblem as the brand signature — no white card, blends into the dark theme */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative flex aspect-square w-full max-w-md items-center justify-center">
            {/* Soft gold glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full bg-gold/20 blur-3xl"
              aria-hidden="true"
            />
            {/* Subtle dark glass panel */}
            <div
              className="pointer-events-none absolute inset-4 rounded-[2rem] border border-gold/10 bg-espresso/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <Image
              src={FOX_MARK_SRC}
              alt="Golden Digital Studio fox emblem"
              width={690}
              height={690}
              priority
              className="relative h-auto w-[78%] object-contain drop-shadow-[0_8px_40px_rgba(212,175,55,0.25)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
