'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

/**
 * Short-description field with a live character counter and a soft over-limit
 * warning. The recommended range keeps card/preview text elegant and uniform.
 */
export function ExcerptField({
  name,
  label,
  defaultValue,
  hint,
  recommendedMax = 260,
  rows = 3,
}: {
  name: string
  label: string
  defaultValue?: string | null
  hint?: string
  recommendedMax?: number
  rows?: number
}) {
  const [value, setValue] = useState(defaultValue ?? '')
  const count = value.length
  const over = count > recommendedMax

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={name}>{label}</Label>
        <span
          className={cn(
            'font-mono text-xs',
            over ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {count}/{recommendedMax}
        </span>
      </div>
      <Textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(over && 'border-destructive focus-visible:ring-destructive')}
      />
      {over ? (
        <p className="text-xs text-destructive">
          A bit long for a preview card — aim for under {recommendedMax} characters.
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
