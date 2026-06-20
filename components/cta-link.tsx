import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const ctaVariants = cva(
  'group inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gold text-espresso shadow-[0_8px_30px_-12px_rgba(212,175,55,0.7)] hover:bg-warm-gold hover:shadow-[0_10px_36px_-10px_rgba(230,193,102,0.8)]',
        outline:
          'border border-gold/40 text-sand hover:border-gold hover:bg-gold/10 hover:text-gold',
        ghost: 'text-sand hover:text-gold',
      },
      size: {
        default: 'h-12 px-7',
        sm: 'h-10 px-5 text-[0.8rem]',
        lg: 'h-14 px-9 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

type CtaLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof ctaVariants>

export function CtaLink({
  className,
  variant,
  size,
  ...props
}: CtaLinkProps) {
  return (
    <Link
      className={cn(ctaVariants({ variant, size, className }))}
      {...props}
    />
  )
}
