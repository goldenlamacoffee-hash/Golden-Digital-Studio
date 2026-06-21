'use client'

import { useState } from 'react'
import { Field } from '@/components/admin/form-fields'
import { Input } from '@/components/ui/input'
import { hasImageUrl } from '@/lib/portfolio'

/**
 * Image URL text field with a live preview. Keeps the existing paste-a-URL
 * workflow (e.g. from the Media library) and shows a small thumbnail below the
 * input. A broken/unreachable image shows a friendly warning instead of a
 * broken-image icon — it never crashes the form.
 */
export function ImageUrlField({
  name,
  label,
  defaultValue,
  hint,
}: {
  name: string
  label: string
  defaultValue?: string | null
  hint?: string
}) {
  const [value, setValue] = useState(defaultValue ?? '')
  const [errored, setErrored] = useState(false)

  const trimmed = value.trim()
  const showPreview = hasImageUrl(trimmed)

  return (
    <Field label={label} htmlFor={name} hint={hint}>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ''}
        placeholder="https://…"
        onChange={(e) => {
          setValue(e.target.value)
          setErrored(false)
        }}
      />
      {trimmed ? (
        showPreview && !errored ? (
          <div className="mt-2 overflow-hidden rounded-lg border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={trimmed || '/placeholder.svg'}
              alt="Preview"
              className="h-32 w-full object-cover"
              onError={() => setErrored(true)}
            />
          </div>
        ) : (
          <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
            {showPreview
              ? 'This image could not be loaded. Double-check the URL.'
              : 'Enter a full image URL (https://…) to see a preview.'}
          </p>
        )
      ) : null}
    </Field>
  )
}
