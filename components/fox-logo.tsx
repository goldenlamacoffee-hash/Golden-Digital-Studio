import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type FoxLogoProps = {
  /**
   * Which official asset to render.
   * - "lockup": horizontal fox + "Golden Digital Studio" wordmark (header / footer)
   * - "emblem": fox head emblem only (compact / icon placements)
   */
  variant?: 'lockup' | 'emblem'
  /** Show the small tagline under an emblem-only mark. */
  withTagline?: boolean
  className?: string
  imageClassName?: string
  /** Render without the wrapping home link (e.g. when already inside a link). */
  asLink?: boolean
}

export function FoxLogo({
  variant = 'lockup',
  withTagline = false,
  className,
  imageClassName,
  asLink = true,
}: FoxLogoProps) {
  const content =
    variant === 'lockup' ? (
      <Image
        src="/brand/fox-lockup.png"
        alt="Golden Digital Studio"
        width={751}
        height={371}
        priority
        className={cn('h-12 w-auto object-contain sm:h-14', imageClassName)}
      />
    ) : (
      <span className="inline-flex items-center gap-3">
        <Image
          src="/brand/fox-emblem.png"
          alt="Golden Digital Studio"
          width={690}
          height={690}
          priority
          className={cn('size-10 object-contain', imageClassName)}
        />
        {withTagline ? (
          <span className="flex flex-col leading-none">
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-sand">
              Golden
            </span>
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              Digital Studio
            </span>
          </span>
        ) : null}
      </span>
    )

  if (!asLink) {
    return <span className={cn('inline-flex items-center', className)}>{content}</span>
  }

  return (
    <Link
      href="/"
      aria-label="Golden Digital Studio — home"
      className={cn('group inline-flex items-center transition-opacity hover:opacity-90', className)}
    >
      {content}
    </Link>
  )
}
