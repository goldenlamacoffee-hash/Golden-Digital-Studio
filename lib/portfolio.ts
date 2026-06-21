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
 * Single source of truth for resolving a project's display image. Returns the
 * trimmed URL when present and usable, otherwise null so callers can fall back
 * to the luxury placeholder treatment.
 */
export function getProjectImage(project: Pick<ProjectItem, 'imageUrl'>): string | null {
  const value = project.imageUrl?.trim()
  return value && hasImageUrl(value) ? value : null
}
