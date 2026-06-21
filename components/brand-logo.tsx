import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Official Golden Digital Studio fox logo system.
 *
 * Renders the exact brand-kit PNG files directly. Per the brand manual, every
 * logo image MUST use object-contain and is never cropped, stretched, rotated,
 * masked, recolored, or regenerated. The full curled-tail fox is always shown.
 *
 * Variant → file map (from /public/brand):
 *  - horizontal : header / footer / horizontal lockups
 *  - primary    : hero cards and large identity moments
 *  - emblem     : background watermark + hero atmosphere
 *  - compact    : square icon / avatar placements
 *  - mono       : restrained / monochrome contexts
 */
export type BrandLogoVariant =
  | 'horizontal'
  | 'primary'
  | 'emblem'
  | 'compact'
  | 'mono'

type LogoAsset = { src: string; alt: string; width: number; height: number }

const LOGOS: Record<BrandLogoVariant, LogoAsset> = {
  horizontal: {
    src: '/brand/gds-fox-horizontal-lockup-transparent.png',
    alt: 'Golden Digital Studio',
    width: 728,
    height: 328,
  },
  primary: {
    src: '/brand/gds-fox-primary-logo-transparent.png',
    alt: 'Golden Digital Studio',
    width: 600,
    height: 672,
  },
  emblem: {
    src: '/brand/gds-fox-emblem-transparent.png',
    alt: 'Golden Digital Studio fox emblem',
    width: 517,
    height: 414,
  },
  compact: {
    src: '/brand/gds-fox-compact-icon.png',
    alt: 'Golden Digital Studio',
    width: 195,
    height: 193,
  },
  mono: {
    src: '/brand/gds-fox-mono-lockup-transparent.png',
    alt: 'Golden Digital Studio',
    width: 436,
    height: 177,
  },
}

type BrandLogoProps = {
  variant?: BrandLogoVariant
  className?: string
  priority?: boolean
  /** Decorative usage (e.g. watermark) — hides the image from screen readers. */
  decorative?: boolean
  sizes?: string
}

export function BrandLogo({
  variant = 'horizontal',
  className,
  priority = false,
  decorative = false,
  sizes,
}: BrandLogoProps) {
  const logo = LOGOS[variant]
  return (
    <Image
      src={logo.src || '/placeholder.svg'}
      alt={decorative ? '' : logo.alt}
      aria-hidden={decorative || undefined}
      width={logo.width}
      height={logo.height}
      priority={priority}
      sizes={sizes}
      className={cn('object-contain', className)}
    />
  )
}

/**
 * Linked brand lockup for navigation (header/footer). Uses the official
 * horizontal lockup, which already includes the wordmark and tagline.
 */
export function BrandLockupLink({
  className,
  imageClassName,
  variant = 'horizontal',
  priority = false,
}: {
  className?: string
  imageClassName?: string
  variant?: 'horizontal' | 'mono'
  priority?: boolean
}) {
  return (
    <Link
      href="/"
      aria-label="Golden Digital Studio — home"
      className={cn(
        'inline-flex items-center transition-opacity hover:opacity-90',
        className,
      )}
    >
      <BrandLogo
        variant={variant}
        priority={priority}
        className={cn('h-auto w-auto', imageClassName)}
      />
    </Link>
  )
}
