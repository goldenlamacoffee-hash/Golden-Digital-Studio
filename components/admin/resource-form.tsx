'use client'

import { useRef, useState, useTransition, type ReactNode } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

/**
 * Collapsible create/edit form wrapper for admin resources.
 * Wraps a server action and shows toast feedback. The actual fields are
 * passed as children so each resource page defines its own inputs.
 */
export function ResourceForm({
  action,
  locale,
  editingId,
  children,
  title,
  addLabel = 'Add new',
  startOpen = false,
}: {
  action: (formData: FormData) => Promise<void>
  locale: string
  editingId?: number
  children: ReactNode
  title: string
  addLabel?: string
  startOpen?: boolean
}) {
  const [open, setOpen] = useState(startOpen)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="size-4" />
        {addLabel}
      </Button>
    )
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          try {
            await action(formData)
            toast.success('Saved')
            if (!editingId) formRef.current?.reset()
            setOpen(false)
          } catch (err) {
            toast.error((err as Error).message || 'Something went wrong')
          }
        })
      }}
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {title}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <input type="hidden" name="locale" value={locale} />
      {editingId ? (
        <input type="hidden" name="id" value={editingId} />
      ) : null}

      {children}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
