'use client'

import { useTransition } from 'react'
import { Check, Trash2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateInquiryStatus, deleteInquiry } from '@/app/actions/admin'

type Inquiry = {
  id: number
  name: string
  email: string
  company: string | null
  budget: string | null
  message: string
  status: string
  locale: string | null
  createdAt: Date
}

export function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const [pending, startTransition] = useTransition()
  const isNew = inquiry.status === 'new'

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-medium text-foreground">
            {inquiry.name}
            {isNew ? (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-medium text-gold">
                New
              </span>
            ) : (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {inquiry.status}
              </span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {inquiry.email}
            {inquiry.company ? ` · ${inquiry.company}` : ''}
            {inquiry.budget ? ` · ${inquiry.budget}` : ''}
            {inquiry.locale ? ` · ${inquiry.locale}` : ''}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(inquiry.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="whitespace-pre-wrap text-sm text-foreground/90">
        {inquiry.message}
      </p>

      <div className="flex items-center gap-2">
        <a
          href={`mailto:${inquiry.email}`}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Mail className="size-4" />
          Reply
        </a>
        {isNew ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await updateInquiryStatus(inquiry.id, 'handled')
              })
            }
          >
            <Check className="size-4" />
            Mark handled
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          disabled={pending}
          className="text-muted-foreground hover:text-destructive"
          onClick={() => {
            if (typeof window !== 'undefined' && !window.confirm('Delete this inquiry?')) return
            startTransition(async () => {
              await deleteInquiry(inquiry.id)
            })
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}
