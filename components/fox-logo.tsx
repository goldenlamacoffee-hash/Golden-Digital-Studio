import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Official Golden Digital Studio fox assets. These are the uploaded brand
 * files used as-is (object-contain only — never cropped, stretched, masked,
 * rotated, or recolored). The full curled-tail fox is always visible.
 */
const ASSETS = {
  // Header — full-color horizontal fox + wordmark lockup
  lockup: { src: '/brand/fox-lockup.png', width: 751, height: 371, alt: 'Golden Digital Studio' },
  // Footer / monochrome contexts — black fox + wordmark lockup
  'mono-lockup': { src: '/brand/fox-mono-lockup.png', width: 421, height: 212, alt: 'Golden Digital Studio' },
  // Hero / brand sections — full vertical primary logo (fox + stacked wordmark)
  primary: { src: '/brand/fox-primary.png', width: 676, height: 686, alt: 'Golden Digital Studio' },
  // Large emblem placements — gold fox emblem on transparent
  emblem: { src: '/brand/fox-emblem.png', width: 690, height: 690, alt: 'Golden Digital Studio fox emblem' },
  // Favicon / app icon / social — compact fox icon tile
  'compact-icon': { src: '/brand/fox-compact-icon.png', width: 173, height: 187, alt: 'Golden Digital Studio' },
} as const

type FoxVariant = keyof typeof ASSETS

type FoxLogoProps = {
  variant?: FoxVariant
  priority?: boolean
  className?: string
  imageClassName?: string
  /** Render without the wrapping home link (e.g. when already inside a link). */
  asLink?: boolean
}

export function FoxLogo({
  variant = 'lockup',
  priority = false,
  className,
  imageClassName,
  asLink = true,
}: FoxLogoProps) {
  const asset = ASSETS[variant]

  const sizeClass =
    variant === 'lockup'
      ? 'h-12 w-auto sm:h-14'
      : variant === 'mono-lockup'
        ? 'h-10 w-auto sm:h-12'
        : variant === 'compact-icon'
          ? 'size-10'
          : 'h-auto w-full'

  const content = (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={cn('object-contain', sizeClass, imageClassName)}
    />
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
