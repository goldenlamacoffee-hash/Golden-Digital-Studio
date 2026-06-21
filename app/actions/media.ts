'use server'

import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { media } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin/guard'

export type UploadState = { ok?: boolean; error?: string }

export async function uploadMedia(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  await requireAdmin()

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Please choose a file to upload.' }
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: 'File is too large (max 8MB).' }
  }

  const alt = typeof formData.get('alt') === 'string' ? (formData.get('alt') as string).trim() : ''

  try {
    const blob = await put(`media/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })
    await db.insert(media).values({
      url: blob.url,
      pathname: blob.pathname,
      filename: file.name,
      contentType: file.type || null,
      size: file.size,
      alt: alt || null,
    })
    revalidatePath('/admin/media')
    return { ok: true }
  } catch (err) {
    console.log('[v0] media upload failed:', (err as Error).message)
    return { error: 'Upload failed. Please try again.' }
  }
}
