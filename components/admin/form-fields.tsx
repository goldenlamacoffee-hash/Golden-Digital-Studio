import type { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string
  htmlFor?: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function TextField({
  name,
  label,
  defaultValue,
  required,
  placeholder,
  hint,
}: {
  name: string
  label: string
  defaultValue?: string | null
  required?: boolean
  placeholder?: string
  hint?: string
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint}>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        placeholder={placeholder}
      />
    </Field>
  )
}

export function AreaField({
  name,
  label,
  defaultValue,
  rows = 3,
  placeholder,
  hint,
}: {
  name: string
  label: string
  defaultValue?: string | null
  rows?: number
  placeholder?: string
  hint?: string
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint}>
      <Textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
      />
    </Field>
  )
}

export function ToggleField({
  name,
  label,
  defaultChecked = true,
}: {
  name: string
  label: string
  defaultChecked?: boolean
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 rounded border-border accent-gold"
      />
      {label}
    </label>
  )
}
