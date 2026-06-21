import { BrandLogo } from '@/components/brand-logo'
import { cn } from '@/lib/utils'

/**
 * Luxury background identity — the fox emblem used as an oversized, low-opacity
 * watermark with a soft golden aura behind it. Used selectively (hero,
 * portfolio, closing CTA, footer), never tiled like wallpaper.
 *
 * The emblem itself always uses object-contain and is never cropped or masked;
 * if it sits off-canvas the parent simply clips with overflow-hidden while the
 * full image is preserved.
 */
type FoxWatermarkProps = {
  /** Tailwind position classes for the emblem wrapper. */
  position?: string
  /** Emblem size (Tailwind width/height utilities). */
  size?: string
  /** Low-opacity Tailwind utility for the emblem (kept subtle, 0.04–0.10). */
  opacity?:
    | 'opacity-[0.04]'
    | 'opacity-[0.05]'
    | 'opacity-[0.06]'
    | 'opacity-[0.08]'
    | 'opacity-[0.1]'
  /** Show the soft radial gold glow behind the emblem. */
  glow?: boolean
  className?: string
}

export function FoxWatermark({
  position = 'right-[-6%] top-1/2 -translate-y-1/2',
  size = 'h-[560px] w-[560px]',
  opacity = 'opacity-[0.06]',
  glow = true,
  className,
}: FoxWatermarkProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
      aria-hidden="true"
    >
      {glow ? (
        <div
          className={cn(
            'absolute rounded-full bg-gold/10 blur-[120px]',
            position,
            'h-[420px] w-[420px]',
          )}
        />
      ) : null}
      <BrandLogo
        variant="emblem"
        decorative
        className={cn('absolute object-contain', position, size, opacity)}
      />
    </div>
  )
}
