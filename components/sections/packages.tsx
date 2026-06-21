import { Check } from 'lucide-react'
import { CtaLink } from '@/components/cta-link'
import { SectionHeading } from '@/components/section-heading'
import { getPackagesSeed, type PackageItem } from '@/lib/cms/queries'
import { cn } from '@/lib/utils'

type PackagesProps = {
  flush?: boolean
  items?: PackageItem[]
  heading?: { eyebrow?: string; title?: string; description?: string }
}

export function Packages({ flush, items, heading }: PackagesProps) {
  const packages: PackageItem[] = items ?? getPackagesSeed()

  return (
    <section
      id="packages"
      className={cn('bg-background', !flush && 'border-t border-gold/10')}
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow={heading?.eyebrow ?? 'Packages'}
          title={heading?.title ?? 'Engagements scoped to where you are.'}
          description={
            heading?.description ??
            'Clear starting points, tailored to your goals. Final pricing is shared in a proposal after a short discovery call.'
          }
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.slug}
              className={cn(
                'relative flex flex-col gap-6 rounded-2xl border p-8 transition-all hover:-translate-y-1',
                pkg.isFeatured
                  ? 'border-gold/60 bg-card shadow-[0_20px_60px_-30px_rgba(212,175,55,0.6)]'
                  : 'border-gold/15 bg-card/60 hover:border-gold/40',
              )}
            >
              {pkg.isFeatured ? (
                <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-gold px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-espresso">
                  Most popular
                </span>
              ) : null}

              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-xl font-semibold text-sand">
                  {pkg.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {pkg.description}
                </p>
              </div>

              {pkg.price ? (
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                  {pkg.price}
                </p>
              ) : null}

              <ul className="flex flex-col gap-3 border-t border-gold/10 pt-6">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <CtaLink
                href="/contact"
                variant={pkg.isFeatured ? 'primary' : 'outline'}
                className="mt-auto w-full"
              >
                {pkg.ctaLabel ?? 'Start a project'}
              </CtaLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
