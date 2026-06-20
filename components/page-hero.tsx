type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-gold/10 bg-card/40">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-20 sm:px-8 sm:py-28">
        <span className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-gold">
          <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
          {eyebrow}
        </span>
        <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-balance text-sand sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </section>
  )
}
