'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadMedia, type UploadState } from '@/app/actions/media'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      <Upload className="size-4" />
      {pending ? 'Uploading…' : 'Upload'}
    </Button>
  )
}

export function MediaUploader() {
  const [state, formAction] = useActionState<UploadState, FormData>(uploadMedia, {})
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok) {
      toast.success('File uploaded')
      formRef.current?.reset()
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="file">File</Label>
          <Input id="file" name="file" type="file" accept="image/*" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="alt">Alt text</Label>
          <Input id="alt" name="alt" placeholder="Describe the image" />
        </div>
      </div>
      <SubmitButton />
    </form>
  )
}
