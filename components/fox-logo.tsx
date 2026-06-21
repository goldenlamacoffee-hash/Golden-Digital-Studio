import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Canonical Golden Digital Studio fox mark — gold fox emblem on a transparent
 * background (no box, no text lockup, no border). Used as-is with object-contain
 * only: never cropped, stretched, masked, rotated, or recolored. The full
 * curled-tail fox is always visible.
 */
export const FOX_MARK_SRC = '/brand/golden-digital-studio-fox-mark.png'
const FOX_MARK_SIZE = 690

type FoxLogoProps = {
  /** Visual size of the lockup. */
  size?: 'sm' | 'md' | 'lg'
  /** Render only the fox mark, with no wordmark text. */
  markOnly?: boolean
  /** Optional small line beneath the wordmark, e.g. "by LMVK Group". */
  subtitle?: string
  priority?: boolean
  className?: string
  /** Wrap the lockup in a link to the homepage. Defaults to true. */
  asLink?: boolean
}

const MARK_SIZE: Record<NonNullable<FoxLogoProps['size']>, string> = {
  sm: 'size-8',
  md: 'size-10 sm:size-11',
  lg: 'size-12 sm:size-14',
}

const WORDMARK_SIZE: Record<NonNullable<FoxLogoProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
}

export function FoxLogo({
  size = 'md',
  markOnly = false,
  subtitle,
  priority = false,
  className,
  asLink = true,
}: FoxLogoProps) {
  const mark = (
    <Image
      src={FOX_MARK_SRC}
      alt="Golden Digital Studio fox emblem"
      width={FOX_MARK_SIZE}
      height={FOX_MARK_SIZE}
      priority={priority}
      className={cn('object-contain', MARK_SIZE[size])}
    />
  )

  const content = (
    <span className="inline-flex items-center gap-3">
      {mark}
      {!markOnly ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-heading font-semibold tracking-tight text-sand',
              WORDMARK_SIZE[size],
            )}
          >
            Golden Digital Studio
          </span>
          {subtitle ? (
            <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
              {subtitle}
            </span>
          ) : null}
        </span>
      ) : (
        <span className="sr-only">Golden Digital Studio</span>
      )}
    </span>
  )

  if (!asLink) {
    return <span className={cn('inline-flex items-center', className)}>{content}</span>
  }

  return (
    <Link
      href="/"
      aria-label="Golden Digital Studio — home"
      className={cn(
        'group inline-flex items-center transition-opacity hover:opacity-90',
        className,
      )}
    >
      {content}
    </Link>
  )
}
