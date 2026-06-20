'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const projectTypes = [
  'Website & CMS',
  'B2B portal',
  'Mobile app',
  'AI workflow',
  'Automation',
  'Not sure yet',
]

const inputClass =
  'w-full rounded-xl border border-gold/20 bg-espresso/50 px-4 py-3 text-sm text-sand placeholder:text-muted-foreground/70 transition-colors focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/30'

const labelClass =
  'font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // No backend yet — this is wired to be connected to a CMS / API later.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-gold/30 bg-card p-8">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check className="size-6" />
        </span>
        <h3 className="font-heading text-2xl font-semibold text-sand">
          Thank you — message received.
        </h3>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          This is a demo form. Once connected to your inbox or CRM, enquiries
          will arrive here automatically. We typically reply within two working
          days.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="font-mono text-xs uppercase tracking-[0.2em] text-gold hover:text-warm-gold"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-gold/15 bg-card/60 p-7 sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="company" className={labelClass}>
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Your business"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="projectType" className={labelClass}>
            Project type
          </label>
          <select
            id="projectType"
            name="projectType"
            defaultValue=""
            className={cn(inputClass, 'appearance-none')}
          >
            <option value="" disabled>
              Select a type
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type} className="bg-espresso">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          What do you want to build?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your business and what you need."
          className={cn(inputClass, 'resize-y')}
        />
      </div>

      <button
        type="submit"
        className="group inline-flex h-12 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold tracking-wide text-espresso shadow-[0_8px_30px_-12px_rgba(212,175,55,0.7)] transition-all hover:bg-warm-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Send message
      </button>
    </form>
  )
}
