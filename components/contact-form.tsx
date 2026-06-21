'use client'

import { useActionState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { submitInquiry, type InquiryState } from '@/app/actions/inquiry'
import type { Dictionary } from '@/lib/i18n/dictionaries'

const inputClass =
  'w-full rounded-xl border border-gold/20 bg-espresso/50 px-4 py-3 text-sm text-sand placeholder:text-muted-foreground/70 transition-colors focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/30'

const labelClass =
  'font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground'

const initialState: InquiryState = { status: 'idle' }

export function ContactForm({ t }: { t: Dictionary['contact'] }) {
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState,
  )

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-gold/30 bg-card p-8">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check className="size-6" aria-hidden="true" />
        </span>
        <p className="text-pretty font-heading text-xl font-medium leading-relaxed text-sand">
          {t.success}
        </p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 rounded-2xl border border-gold/15 bg-card/60 p-7 sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            {t.name} *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="company" className={labelClass}>
            {t.company}
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            {t.email} *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="budget" className={labelClass}>
            {t.budget}
          </label>
          <input
            id="budget"
            name="budget"
            type="text"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          {t.message} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={cn(inputClass, 'resize-y')}
        />
      </div>

      {state.status === 'error' ? (
        <p className="text-sm text-red-400" role="alert">
          {state.message ?? t.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex h-12 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold tracking-wide text-espresso shadow-[0_8px_30px_-12px_rgba(212,175,55,0.7)] transition-all hover:bg-warm-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  )
}
