import Image from 'next/image'
import { CtaLink } from '@/components/cta-link'

export function CtaSection() {
  return (
    <section className="border-t border-gold/10 bg-background">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-espresso px-6 py-16 sm:px-12 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <Image
              src="/fox-hero.png"
              alt=""
              fill
              className="object-cover object-right opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/85 to-espresso/30" />
          </div>

          <div className="relative flex max-w-2xl flex-col gap-6">
            <h2 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-balance text-sand sm:text-5xl">
              Build fast. Build clean.{' '}
              <span className="text-gold">Build golden.</span>
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              Tell us where your business is today and where you want it to go.
              We&apos;ll map the highest-impact digital system to get you there.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CtaLink href="/contact" size="lg">
                Book a consultation
              </CtaLink>
              <CtaLink href="/portfolio" size="lg" variant="outline">
                View our work
              </CtaLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
