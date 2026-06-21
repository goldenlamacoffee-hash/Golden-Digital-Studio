'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ImageOff, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ASPECT_RATIOS,
  DISPLAY_MODES,
  GALLERY_POSITIONS,
  GALLERY_SIZES,
  isValidImageUrl,
  parseGallery,
  type GalleryAspectRatio,
  type GalleryDisplayMode,
  type GalleryImage,
  type GalleryPosition,
  type GallerySize,
} from '@/lib/portfolio'

let idCounter = 0
function newId() {
  idCounter += 1
  return `g-${Date.now()}-${idCounter}`
}

function emptyImage(order: number): GalleryImage {
  return {
    id: newId(),
    url: '',
    alt: '',
    caption: '',
    order,
    displayMode: 'cover',
    aspectRatio: '16:9',
    size: 'medium',
    position: 'center',
  }
}

/** Compact native select styled to match the admin inputs. */
function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:border-gold focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}

/**
 * Gallery editor for a portfolio project. Holds an ordered GalleryImage[] in
 * state and serializes it into a hidden `gallery` input (JSON) so it submits
 * with the existing ResourceForm. Supports add/edit/reorder/delete, per-image
 * display controls, a live thumbnail, and graceful handling of broken URLs.
 */
export function GalleryEditor({
  name = 'gallery',
  defaultValue,
}: {
  name?: string
  defaultValue?: unknown
}) {
  const [images, setImages] = useState<GalleryImage[]>(() =>
    parseGallery(defaultValue),
  )

  const serialized = useMemo(
    () => JSON.stringify(images.map((img, i) => ({ ...img, order: i }))),
    [images],
  )

  function update(id: string, patch: Partial<GalleryImage>) {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, ...patch } : img)))
  }
  function add() {
    setImages((prev) => [...prev, emptyImage(prev.length)])
  }
  function remove(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }
  function move(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>Gallery images</Label>
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={add}>
          <Plus className="size-3.5" />
          Add image
        </Button>
      </div>

      {/* Hidden field that actually submits with the form */}
      <input type="hidden" name={name} value={serialized} />

      {images.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No gallery images yet. Add URLs from the Media Library.
        </p>
      ) : (
        <ol className="flex flex-col gap-4">
          {images.map((img, index) => {
            const valid = isValidImageUrl(img.url)
            return (
              <li
                key={img.id}
                className="grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-[7rem_1fr]"
              >
                {/* Thumbnail preview */}
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                  {valid ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.url || '/placeholder.svg'}
                      alt={img.alt || 'Preview'}
                      className={
                        img.displayMode === 'contain'
                          ? 'h-full w-full object-contain'
                          : 'h-full w-full object-cover'
                      }
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <ImageOff className="size-6 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className="absolute left-1 top-1 rounded bg-espresso/80 px-1.5 py-0.5 font-mono text-[10px] text-gold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs sm:col-span-2">
                      <span className="text-muted-foreground">Image URL</span>
                      <Input
                        value={img.url}
                        placeholder="https://…"
                        onChange={(e) => update(img.id, { url: e.target.value })}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs">
                      <span className="text-muted-foreground">Alt text</span>
                      <Input
                        value={img.alt ?? ''}
                        placeholder="Describe the image"
                        onChange={(e) => update(img.id, { alt: e.target.value })}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs">
                      <span className="text-muted-foreground">Caption</span>
                      <Input
                        value={img.caption ?? ''}
                        placeholder="Optional caption"
                        onChange={(e) => update(img.id, { caption: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <SelectField
                      label="Display"
                      value={img.displayMode}
                      options={DISPLAY_MODES}
                      onChange={(v: GalleryDisplayMode) => update(img.id, { displayMode: v })}
                    />
                    <SelectField
                      label="Aspect"
                      value={img.aspectRatio}
                      options={ASPECT_RATIOS}
                      onChange={(v: GalleryAspectRatio) => update(img.id, { aspectRatio: v })}
                    />
                    <SelectField
                      label="Size"
                      value={img.size}
                      options={GALLERY_SIZES}
                      onChange={(v: GallerySize) => update(img.id, { size: v })}
                    />
                    <SelectField
                      label="Position"
                      value={img.position ?? 'center'}
                      options={GALLERY_POSITIONS}
                      onChange={(v: GalleryPosition) => update(img.id, { position: v })}
                    />
                  </div>

                  {img.url && !valid ? (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Enter a full image URL (https://…) — this value won&apos;t be saved.
                    </p>
                  ) : null}

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      aria-label="Move up"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === images.length - 1}
                      onClick={() => move(index, 1)}
                      aria-label="Move down"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-auto text-destructive hover:text-destructive"
                      onClick={() => remove(img.id)}
                      aria-label="Delete image"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
