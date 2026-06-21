'use client'

import { useRef, useState, useTransition, type DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { upload } from '@vercel/blob/client'
import { Upload, ImageIcon, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveMediaRecord } from '@/app/actions/media'
import {
  ALLOWED_TYPES_LABEL,
  MAX_UPLOAD_LABEL,
  validateImageFile,
} from '@/lib/admin/media-constants'

/** Read natural dimensions in the browser; resolves to null on any failure. */
function readDimensions(
  file: File,
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      resolve(null)
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}

export function MediaUploader() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [alt, setAlt] = useState('')
  const [caption, setCaption] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const busy = isUploading || isPending

  function selectFile(next: File | null) {
    setError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (!next) {
      setFile(null)
      setPreviewUrl(null)
      return
    }
    const validationError = validateImageFile(next)
    if (validationError) {
      setFile(null)
      setPreviewUrl(null)
      setError(validationError)
      return
    }
    setFile(next)
    setPreviewUrl(URL.createObjectURL(next))
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (busy) return
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) selectFile(dropped)
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setAlt('')
    setCaption('')
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleUpload() {
    console.log('[v0] handleUpload invoked. file?', !!file, 'busy?', busy)
    if (!file || busy) return
    const validationError = validateImageFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsUploading(true)
    try {
      const dimensions = await readDimensions(file)
      console.log('[v0] starting blob upload', file.name, file.size, file.type)

      const blob = await upload(`media/${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/media/upload',
        contentType: file.type,
      })
      console.log('[v0] blob upload done', blob.url)

      setIsUploading(false)

      startTransition(async () => {
        const result = await saveMediaRecord({
          url: blob.url,
          pathname: blob.pathname,
          filename: file.name,
          contentType: file.type || null,
          size: file.size,
          alt,
          caption,
          width: dimensions?.width ?? null,
          height: dimensions?.height ?? null,
        })

        if (result.ok) {
          toast.success('Image uploaded')
          reset()
          router.refresh()
        } else {
          setError(result.error)
          toast.error(result.error)
        }
      })
    } catch (err) {
      setIsUploading(false)
      // Covers token route failures (missing token → 503, auth → 401), network
      // errors, aborted uploads, and Blob-side rejections (size/type).
      const message =
        err instanceof Error ? err.message : 'Upload failed. Please try again.'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <label
        htmlFor="media-file"
        onDragOver={(e) => {
          e.preventDefault()
          if (!busy) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-gold bg-gold/5'
            : 'border-border hover:border-gold/50'
        } ${busy ? 'pointer-events-none opacity-60' : ''}`}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl || '/placeholder.svg'}
            alt="Selected preview"
            className="max-h-40 rounded-md object-contain"
          />
        ) : (
          <ImageIcon className="size-8 text-muted-foreground" aria-hidden="true" />
        )}
        <span className="text-sm font-medium text-foreground">
          {file ? file.name : 'Drag & drop an image, or click to browse'}
        </span>
        <span className="text-xs text-muted-foreground">
          {ALLOWED_TYPES_LABEL} · up to {MAX_UPLOAD_LABEL}
        </span>
        <Input
          ref={fileInputRef}
          id="media-file"
          name="file"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          className="sr-only"
          disabled={busy}
          onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="media-alt">Alt text</Label>
          <Input
            id="media-alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image for accessibility"
            disabled={busy}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="media-caption">Caption (optional)</Label>
          <Input
            id="media-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption"
            disabled={busy}
          />
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleUpload} disabled={!file || busy} className="gap-2">
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="size-4" aria-hidden="true" />
          )}
          {busy ? 'Uploading…' : 'Upload'}
        </Button>
        {file && !busy ? (
          <Button type="button" variant="ghost" onClick={reset}>
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  )
}
