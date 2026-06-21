/** Shared media-upload rules used by BOTH the client uploader and the server. */

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10 MB
export const MAX_UPLOAD_LABEL = '10 MB'

/** Image MIME types we accept. SVG is intentionally excluded (XSS risk). */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
] as const

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number]

export function isAllowedImageType(type: string | undefined | null): boolean {
  return !!type && (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type)
}

/** Human-readable list for UI hints, e.g. "JPG, PNG, WEBP, GIF, AVIF". */
export const ALLOWED_TYPES_LABEL = 'JPG, PNG, WEBP, GIF, AVIF'

/** Validate a file's type + size. Returns an error string, or null when valid. */
export function validateImageFile(file: {
  type?: string
  size?: number
  name?: string
}): string | null {
  if (!file || !file.name) return 'Please choose a file to upload.'
  if (!isAllowedImageType(file.type)) {
    return `Unsupported file type. Allowed: ${ALLOWED_TYPES_LABEL}.`
  }
  if (typeof file.size === 'number' && file.size > MAX_UPLOAD_BYTES) {
    return `File is too large (max ${MAX_UPLOAD_LABEL}).`
  }
  return null
}
