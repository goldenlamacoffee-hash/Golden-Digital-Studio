'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FoxWatermark } from '@/components/fox-watermark'
import { cn } from '@/lib/utils'
import {
  aspectRatioClass,
  isValidImageUrl,
  objectPositionClass,
  type GalleryAspectRatio,
  type GalleryDisplayMode,
  type GalleryPosition,
} from '@/lib/portfolio'

type PortfolioImageProps = {
  url: string | null | undefined
  alt: string
  displayMode?: GalleryDisplayMode
  aspectRatio?: GalleryAspectRatio
  position?: GalleryPosition
  sizes?: string
  priority?: boolean
  /** Extra classes for the outer box (e.g. rounding, min-height). */
  className?: string
  /**
   * Force a fixed box ratio (e.g. `aspect-[16/10]`) regardless of the image's
   * own aspectRatio. Used by cards for consistent layout while still honoring
   * cover/contain so tall mobile screenshots letterbox instead of cropping.
   */
  boxRatioClass?: string
  /** Enable the subtle hover zoom used on cards. */
  hoverZoom?: boolean
}

/** Luxury fallback when no/broken image: gold gradient + fox watermark. */
function ImagePlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-br from-espresso via-card to-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.18),transparent_60%)]" />
      <FoxWatermark
        position="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        size="h-[60%] w-[60%]"
        opacity="opacity-[0.08]"
        glow={false}
      />
    </div>
  )
}

/**
 * Safe, reusable portfolio image renderer. Honors admin display settings
 * (cover/contain, aspect ratio, focal position), letterboxes `contain` images
 * on an espresso backdrop so mobile screenshots look intentional, and falls
 * back to the luxury placeholder if the URL is missing or fails to load.
 */
export function PortfolioImage({
  url,
  alt,
  displayMode = 'cover',
  aspectRatio = '16:9',
  position = 'center',
  sizes = '100vw',
  priority,
  className,
  boxRatioClass,
  hoverZoom,
}: PortfolioImageProps) {
  const [errored, setErrored] = useState(false)
  const ratio = boxRatioClass ?? aspectRatioClass(aspectRatio)
  const fit = displayMode === 'contain' ? 'object-contain' : 'object-cover'
  const pos = objectPositionClass(position)
  const valid = isValidImageUrl(url) && !errored
  // Use next/image `fill` whenever the box has a fixed ratio; only fall back to
  // a natural-height <img> for `auto` with no forced box ratio.
  const useFill = Boolean(boxRatioClass) || aspectRatio !== 'auto'

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        ratio,
        !useFill && 'min-h-[220px]',
        displayMode === 'contain' && 'bg-espresso',
        className,
      )}
    >
      {valid ? (
        !useFill ? (
          // Natural height: a plain image avoids the fixed-ratio requirement
          // that next/image `fill` needs. Images are served unoptimized.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={(url as string) || '/placeholder.svg'}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setErrored(true)}
            className={cn('h-auto w-full', fit, pos)}
          />
        ) : (
          <Image
            src={(url as string) || '/placeholder.svg'}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            onError={() => setErrored(true)}
            className={cn(
              fit,
              pos,
              hoverZoom && 'transition-transform duration-500 group-hover:scale-[1.03]',
            )}
          />
        )
      ) : (
        <ImagePlaceholder />
      )}
    </div>
  )
}
