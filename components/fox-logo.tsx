import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type FoxLogoProps = {
  /** Show the wordmark next to the emblem. */
  withWordmark?: boolean
  /** Show the small tagline under the wordmark. */
  withTagline?: boolean
  className?: string
  emblemClassName?: string
}

export function FoxLogo({
  withWordmark = true,
  withTagline = false,
  className,
  emblemClassName,
}: FoxLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Golden Digital Studio — home"
      className={cn('group inline-flex items-center gap-3', className)}
    >
      <span
        className={cn(
          'relative inline-flex size-10 items-center justify-center rounded-xl border border-gold/30 bg-espresso/60 transition-colors group-hover:border-gold/60',
          emblemClassName,
        )}
      >
        <Image
          src="/fox-emblem.png"
          alt=""
          width={40}
          height={40}
          className="size-8 object-contain"
          priority
        />
      </span>
      {withWordmark ? (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-sand">
            Golden
          </span>
          <span className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            Digital Studio
          </span>
          {withTagline ? (
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {'Digital systems. AI workflows. Impact.'}
            </span>
          ) : null}
        </span>
      ) : null}
    </Link>
  )
}
