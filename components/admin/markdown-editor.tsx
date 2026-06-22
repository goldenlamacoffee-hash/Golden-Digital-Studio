'use client'

import { useRef, useState } from 'react'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Eye,
  Pencil,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { cn } from '@/lib/utils'

type Tool =
  | { kind: 'wrap'; before: string; after: string; label: string; icon: typeof Bold; title: string }
  | { kind: 'line'; prefix: string; label: string; icon: typeof Bold; title: string }
  | { kind: 'link'; label: string; icon: typeof Bold; title: string }

const TOOLS: Tool[] = [
  { kind: 'line', prefix: '## ', label: 'H2', icon: Heading2, title: 'Heading 2' },
  { kind: 'line', prefix: '### ', label: 'H3', icon: Heading3, title: 'Heading 3' },
  { kind: 'wrap', before: '**', after: '**', label: 'Bold', icon: Bold, title: 'Bold' },
  { kind: 'wrap', before: '*', after: '*', label: 'Italic', icon: Italic, title: 'Italic' },
  { kind: 'line', prefix: '- ', label: 'Bullet', icon: List, title: 'Bullet list' },
  { kind: 'line', prefix: '1. ', label: 'Numbered', icon: ListOrdered, title: 'Numbered list' },
  { kind: 'link', label: 'Link', icon: Link2, title: 'Insert link' },
]

/**
 * Lightweight markdown editor: formatting toolbar + textarea + preview toggle.
 * The textarea carries the form `name`, so the raw markdown string is submitted
 * directly with the form (no extra wiring needed).
 */
export function MarkdownEditor({
  name,
  label,
  defaultValue,
  hint,
  rows = 12,
}: {
  name: string
  label: string
  defaultValue?: string | null
  hint?: string
  rows?: number
}) {
  const [value, setValue] = useState(defaultValue ?? '')
  const [preview, setPreview] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)

  function applyTool(tool: Tool) {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)
    let next = value
    let caret = end

    if (tool.kind === 'wrap') {
      const inner = selected || 'text'
      const insert = `${tool.before}${inner}${tool.after}`
      next = value.slice(0, start) + insert + value.slice(end)
      caret = start + insert.length
    } else if (tool.kind === 'line') {
      // Find start of the current line and prepend the marker.
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      next = value.slice(0, lineStart) + tool.prefix + value.slice(lineStart)
      caret = end + tool.prefix.length
    } else {
      // link
      const text = selected || 'link text'
      const insert = `[${text}](https://)`
      next = value.slice(0, start) + insert + value.slice(end)
      caret = start + insert.length
    }

    setValue(next)
    // Restore focus + caret after React updates the value.
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(caret, caret)
    })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={name}>{label}</Label>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
        >
          {preview ? <Pencil className="size-3.5" /> : <Eye className="size-3.5" />}
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {!preview ? (
        <>
          <div className="flex flex-wrap items-center gap-1 rounded-md border border-border bg-card/60 p-1">
            {TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <button
                  key={tool.label}
                  type="button"
                  title={tool.title}
                  aria-label={tool.title}
                  onClick={() => applyTool(tool)}
                  className="inline-flex size-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
                >
                  <Icon className="size-4" />
                </button>
              )
            })}
          </div>
          <Textarea
            id={name}
            name={name}
            ref={ref}
            rows={rows}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write the full case study. Use the toolbar for headings, bold, lists and links."
            className="font-mono text-sm leading-relaxed"
          />
        </>
      ) : (
        <>
          {/* Keep the value submittable while previewing. */}
          <input type="hidden" name={name} value={value} />
          <div
            className={cn(
              'min-h-40 rounded-md border border-border bg-background p-5',
              !value.trim() && 'flex items-center justify-center',
            )}
          >
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
            )}
          </div>
        </>
      )}

      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
