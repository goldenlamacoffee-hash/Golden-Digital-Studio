'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Braces } from 'lucide-react'

/**
 * Structured-data editor for CMS sections. The `data` JSON column holds the
 * repeatable content for a section — cards, steps, footer columns, label maps,
 * etc. This field lets an operator edit that JSON directly with live
 * validation and pretty-printing, and submits it under the `data` form key.
 *
 * It intentionally stays schema-agnostic (a validated JSON textarea) so every
 * section type is editable without bespoke UI, while guarding against saving
 * malformed JSON.
 */
export function SectionDataField({
  defaultValue,
  hint,
}: {
  defaultValue?: unknown
  hint?: string
}) {
  const initial =
    defaultValue == null
      ? ''
      : JSON.stringify(defaultValue, null, 2)

  const [value, setValue] = useState(initial)

  const trimmed = value.trim()
  const isEmpty = trimmed.length === 0
  let error: string | null = null
  if (!isEmpty) {
    try {
      JSON.parse(trimmed)
    } catch (e) {
      error = e instanceof Error ? e.message : 'Invalid JSON'
    }
  }

  function format() {
    if (isEmpty || error) return
    setValue(JSON.stringify(JSON.parse(trimmed), null, 2))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="section-data"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          <Braces className="size-3.5 text-gold" />
          Structured content (data)
        </label>
        <button
          type="button"
          onClick={format}
          disabled={isEmpty || !!error}
          className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          Format JSON
        </button>
      </div>

      <textarea
        id="section-data"
        name="data"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={12}
        spellCheck={false}
        placeholder={'{\n  "items": [\n    { "title": "...", "description": "..." }\n  ]\n}'}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none transition-colors focus:border-gold/60"
        aria-invalid={!!error}
      />

      <div className="flex items-start gap-1.5 text-xs">
        {error ? (
          <>
            <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
            <span className="text-destructive">{error}</span>
          </>
        ) : isEmpty ? (
          <span className="text-muted-foreground">
            {hint ?? 'Optional. Repeatable content for this section (cards, steps, columns).'}
          </span>
        ) : (
          <>
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-gold" />
            <span className="text-muted-foreground">Valid JSON.</span>
          </>
        )}
      </div>
    </div>
  )
}
