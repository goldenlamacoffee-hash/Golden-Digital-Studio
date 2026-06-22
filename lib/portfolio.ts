import type { ProjectItem } from '@/lib/cms/queries'

/**
 * True only for a usable external link: an absolute http(s) URL with a real
 * hostname. Rejects empty strings, the bare `https://` placeholder, relative
 * paths and anything unparseable so we never render a dead "View project" link.
 */
export function isValidExternalUrl(url: string | null | undefined): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (!trimmed || trimmed === 'https://' || trimmed === 'http://') return false
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false
    // Hostname must contain a dot (a real domain) or be localhost.
    return parsed.hostname.includes('.') || parsed.hostname === 'localhost'
  } catch {
    return false
  }
}

/**
 * True when a value is a non-empty image reference — either an absolute URL
 * (e.g. a Blob URL) or a root-relative path (e.g. `/images/x.png`).
 */
export function hasImageUrl(value: string | null | undefined): boolean {
  if (!value) return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('/')) return true
  return isValidExternalUrl(trimmed)
}

/**
 * Stricter check for an image we will actually render in an <img>/next Image.
 * Requires an https(s) URL or a root-relative path. Used by PortfolioImage and
 * the admin editor so a malformed URL can never crash the page.
 */
export function isValidImageUrl(value: string | null | undefined): boolean {
  return hasImageUrl(value)
}

/* --------------------------- text / markdown --------------------------- */

/**
 * Strip common markdown syntax to produce clean plain text for previews,
 * meta descriptions and excerpts. Never throws; returns '' for empty input.
 */
export function stripMarkdown(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // headings
    .replace(/^\s{0,3}>\s?/gm, '') // blockquotes
    .replace(/^\s*[-*+]\s+/gm, '') // bullet markers
    .replace(/^\s*\d+\.\s+/gm, '') // numbered markers
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/~~(.*?)~~/g, '$1') // strikethrough
    .replace(/^\s*([-*_]\s*){3,}\s*$/gm, ' ') // horizontal rules
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Derive a short, clean excerpt from any text (markdown or plain). Prefers the
 * first paragraph; truncates on a word boundary around `max` characters.
 */
export function deriveExcerpt(
  text: string | null | undefined,
  max = 200,
): string {
  const firstParagraph = (text ?? '').split(/\n\s*\n/)[0] ?? ''
  const plain = stripMarkdown(firstParagraph) || stripMarkdown(text)
  if (plain.length <= max) return plain
  const slice = plain.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  return `${(lastSpace > 60 ? slice.slice(0, lastSpace) : slice).trim()}…`
}

/**
 * Heuristic: does this text look like a full case-study body rather than a
 * one-line summary? True if it has markdown headings, bullet/numbered lists,
 * multiple paragraphs, or is simply long. Used for backward-compatible
 * migration of legacy `description` content into `body`.
 */
export function looksLikeRichBody(text: string | null | undefined): boolean {
  if (!text) return false
  const t = text.trim()
  if (t.length > 280) return true
  if (/^\s{0,3}#{1,6}\s+/m.test(t)) return true // headings
  if (/^\s*[-*+]\s+/m.test(t)) return true // bullet list
  if (/^\s*\d+\.\s+/m.test(t)) return true // numbered list
  if (t.split(/\n\s*\n/).length > 1) return true // multiple paragraphs
  return false
}

/**
 * Resolve the clean { excerpt, body } pair for a project from its raw DB
 * fields, with backward compatibility for legacy `description`-only rows.
 * - body: explicit `body`, else the legacy `description` if it looks rich.
 * - excerpt: explicit `excerpt`, else derived from body/description.
 */
export function resolveProjectContent(raw: {
  excerpt?: string | null
  body?: string | null
  description?: string | null
}): { excerpt: string; body: string } {
  const rawExcerpt = (raw.excerpt ?? '').trim()
  const rawBody = (raw.body ?? '').trim()
  const rawDescription = (raw.description ?? '').trim()

  const body = rawBody || (looksLikeRichBody(rawDescription) ? rawDescription : '')
  const excerpt =
    rawExcerpt ||
    // If description is a short plain summary, use it directly as the excerpt.
    (!rawBody && rawDescription && !looksLikeRichBody(rawDescription)
      ? rawDescription
      : deriveExcerpt(body || rawDescription))

  return { excerpt, body }
}

/* ------------------------------- gallery ------------------------------- */

export type GalleryDisplayMode = 'cover' | 'contain'
export type GalleryAspectRatio = '16:9' | '4:3' | '1:1' | '3:4' | '9:16' | 'auto'
export type GallerySize = 'small' | 'medium' | 'large' | 'wide' | 'hero'
export type GalleryPosition = 'center' | 'top' | 'bottom' | 'left' | 'right'

export type GalleryImage = {
  id: string
  url: string
  alt?: string
  caption?: string
  order: number
  displayMode: GalleryDisplayMode
  aspectRatio: GalleryAspectRatio
  size: GallerySize
  position?: GalleryPosition
}

export const DISPLAY_MODES: GalleryDisplayMode[] = ['cover', 'contain']
export const ASPECT_RATIOS: GalleryAspectRatio[] = ['16:9', '4:3', '1:1', '3:4', '9:16', 'auto']
export const GALLERY_SIZES: GallerySize[] = ['small', 'medium', 'large', 'wide', 'hero']
export const GALLERY_POSITIONS: GalleryPosition[] = ['center', 'top', 'bottom', 'left', 'right']

const DISPLAY_MODE_SET = new Set<string>(DISPLAY_MODES)
const ASPECT_RATIO_SET = new Set<string>(ASPECT_RATIOS)
const GALLERY_SIZE_SET = new Set<string>(GALLERY_SIZES)
const GALLERY_POSITION_SET = new Set<string>(GALLERY_POSITIONS)

/** Map an aspect ratio token to a Tailwind class. `auto` returns '' (natural). */
export function aspectRatioClass(ratio: GalleryAspectRatio): string {
  switch (ratio) {
    case '16:9':
      return 'aspect-video'
    case '4:3':
      return 'aspect-[4/3]'
    case '1:1':
      return 'aspect-square'
    case '3:4':
      return 'aspect-[3/4]'
    case '9:16':
      return 'aspect-[9/16]'
    case 'auto':
    default:
      return ''
  }
}

/** Map a focal position to a Tailwind object-position class. */
export function objectPositionClass(position: GalleryPosition | undefined): string {
  switch (position) {
    case 'top':
      return 'object-top'
    case 'bottom':
      return 'object-bottom'
    case 'left':
      return 'object-left'
    case 'right':
      return 'object-right'
    case 'center':
    default:
      return 'object-center'
  }
}

/** Map a gallery size to a column span for the editorial detail grid (md+). */
export function sizeSpanClass(size: GallerySize): string {
  switch (size) {
    case 'hero':
      return 'md:col-span-6'
    case 'wide':
      return 'md:col-span-4'
    case 'large':
      return 'md:col-span-3'
    case 'medium':
      return 'md:col-span-3'
    case 'small':
    default:
      return 'md:col-span-2'
  }
}

/**
 * Defensively parse the `gallery` JSONB value from the DB (or a form payload)
 * into a clean, ordered GalleryImage[]. Drops entries without a usable URL and
 * coerces every field to a safe default so malformed data can never crash a
 * render.
 */
export function parseGallery(value: unknown): GalleryImage[] {
  let raw: unknown = value
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw)
    } catch {
      return []
    }
  }
  if (!Array.isArray(raw)) return []

  const items: GalleryImage[] = []
  raw.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') return
    const e = entry as Record<string, unknown>
    const url = typeof e.url === 'string' ? e.url.trim() : ''
    if (!isValidImageUrl(url)) return

    const displayMode = DISPLAY_MODE_SET.has(String(e.displayMode))
      ? (e.displayMode as GalleryDisplayMode)
      : 'cover'
    const aspectRatio = ASPECT_RATIO_SET.has(String(e.aspectRatio))
      ? (e.aspectRatio as GalleryAspectRatio)
      : '16:9'
    const size = GALLERY_SIZE_SET.has(String(e.size))
      ? (e.size as GallerySize)
      : 'medium'
    const position = GALLERY_POSITION_SET.has(String(e.position))
      ? (e.position as GalleryPosition)
      : 'center'
    const order = Number.isFinite(Number(e.order)) ? Number(e.order) : index

    items.push({
      id: typeof e.id === 'string' && e.id ? e.id : `img-${index}`,
      url,
      alt: typeof e.alt === 'string' ? e.alt : undefined,
      caption: typeof e.caption === 'string' ? e.caption : undefined,
      order,
      displayMode,
      aspectRatio,
      size,
      position,
    })
  })

  return items.sort((a, b) => a.order - b.order)
}

/**
 * Single source of truth for resolving a project's cover/display image. Returns
 * the trimmed cover URL when present and usable, otherwise null so callers can
 * fall back to the luxury placeholder treatment.
 */
export function getProjectImage(project: Pick<ProjectItem, 'imageUrl'>): string | null {
  const value = project.imageUrl?.trim()
  return value && hasImageUrl(value) ? value : null
}

/**
 * Card-safe excerpt for a project. Uses the resolved `excerpt` when present,
 * otherwise derives a clean one from body/description. Always plain text.
 */
export function getPortfolioExcerpt(
  project: Pick<ProjectItem, 'excerpt' | 'body' | 'description'>,
  max = 200,
): string {
  const explicit = (project.excerpt ?? '').trim()
  if (explicit) return stripMarkdown(explicit)
  return deriveExcerpt(project.body || project.description, max)
}

/**
 * Resolve the best image to show on a portfolio card: the cover image if set,
 * otherwise the first valid gallery image. Returns the URL + its display
 * settings so cards can honor admin-chosen cropping for gallery-only projects.
 */
export function resolveCardImage(
  project: Pick<ProjectItem, 'imageUrl' | 'gallery'>,
): { url: string; displayMode: GalleryDisplayMode; aspectRatio: GalleryAspectRatio; position: GalleryPosition } | null {
  const cover = getProjectImage(project)
  if (cover) {
    return { url: cover, displayMode: 'cover', aspectRatio: 'auto', position: 'center' }
  }
  const gallery = parseGallery(project.gallery)
  const first = gallery[0]
  if (first) {
    return {
      url: first.url,
      displayMode: first.displayMode,
      aspectRatio: first.aspectRatio,
      position: first.position ?? 'center',
    }
  }
  return null
}
