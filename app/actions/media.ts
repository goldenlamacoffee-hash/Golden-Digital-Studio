'use server'

import { del } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { media } from '@/lib/db/schema'
import { getAdminSession } from '@/lib/admin/guard'
import { isAllowedImageType, MAX_UPLOAD_BYTES } from '@/lib/admin/media-constants'

export type SaveMediaResult = { ok: true } | { ok: false; error: string }

export type SaveMediaInput = {
  url: string
  pathname: string
  filename: string
  contentType?: string | null
  size?: number | null
  alt?: string | null
  caption?: string | null
  width?: number | null
  height?: number | null
}

/**
 * Persist metadata for a file that the browser already uploaded directly to
 * Blob. The payload is tiny JSON (no file bytes), so it is nowhere near any
 * body-size limit. Every failure returns a structured error — it never throws —
 * so the admin UI can show a clean inline message instead of crashing.
 */
export async function saveMediaRecord(
  input: SaveMediaInput,
): Promise<SaveMediaResult> {
  // Auth — return a clean error instead of redirecting/throwing inside an action.
  const session = await getAdminSession()
  if (!session) {
    return { ok: false, error: 'Please sign in again to save this upload.' }
  }

  // Defensive validation (the token route already validated, but never trust).
  if (!input?.url || !input?.pathname || !input?.filename) {
    return { ok: false, error: 'Upload metadata was incomplete. Please try again.' }
  }
  if (input.contentType && !isAllowedImageType(input.contentType)) {
    await safeDelete(input.url)
    return { ok: false, error: 'Unsupported file type.' }
  }
  if (typeof input.size === 'number' && input.size > MAX_UPLOAD_BYTES) {
    await safeDelete(input.url)
    return { ok: false, error: 'File is too large.' }
  }

  try {
    await db.insert(media).values({
      url: input.url,
      pathname: input.pathname,
      filename: input.filename,
      contentType: input.contentType ?? null,
      size: typeof input.size === 'number' ? input.size : null,
      alt: input.alt?.trim() || null,
      caption: input.caption?.trim() || null,
      width: typeof input.width === 'number' ? input.width : null,
      height: typeof input.height === 'number' ? input.height : null,
    })
    revalidatePath('/admin/media')
    return { ok: true }
  } catch (err) {
    // Blob upload succeeded but DB insert failed — remove the orphaned blob so
    // storage and the library stay consistent, then report a friendly error.
    const message = err instanceof Error ? err.message : 'Unknown database error'
    console.log(
      `[v0] media DB insert failed for "${input.filename}" (${input.contentType ?? 'unknown type'}, ${input.size ?? '?'} bytes): ${message}`,
    )
    await safeDelete(input.url)
    return {
      ok: false,
      error: 'Saved file but could not record it. The upload was rolled back — please try again.',
    }
  }
}

/** Best-effort blob deletion that never throws. */
async function safeDelete(url: string): Promise<void> {
  try {
    await del(url)
  } catch (err) {
    console.log('[v0] media cleanup (del) failed:', (err as Error).message)
  }
}
