'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DeleteButton({
  id,
  action,
  label = 'Delete',
  confirmText = 'Delete this item? This cannot be undone.',
}: {
  id: number
  action: (id: number) => Promise<void>
  label?: string
  confirmText?: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      className="text-muted-foreground hover:text-destructive"
      onClick={() => {
        if (typeof window !== 'undefined' && !window.confirm(confirmText)) return
        startTransition(async () => {
          await action(id)
        })
      }}
    >
      <Trash2 className="size-4" />
      <span className="sr-only">{label}</span>
    </Button>
  )
}
