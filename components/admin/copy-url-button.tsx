'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          toast.success('URL copied')
          setTimeout(() => setCopied(false), 1500)
        } catch {
          toast.error('Could not copy')
        }
      }}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      <span className="sr-only">Copy URL</span>
    </Button>
  )
}
