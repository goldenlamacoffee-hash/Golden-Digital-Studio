import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { type NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/guard'
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
} from '@/lib/admin/media-constants'

/**
 * Token endpoint for client-side (direct browser → Blob) uploads.
 *
 * Why client uploads: a Server Action / route body is capped (1 MB for actions,
 * ~4.5 MB for functions). Routing the file through the server is exactly what
 * crashed the admin on larger images. With `handleUpload`, the browser uploads
 * straight to Blob using a short-lived token we mint here after auth + checks.
 *
 * Every failure path returns clean JSON (never an unhandled throw), so the
 * admin page stays usable and the client can show an inline error.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Environment check — clear, non-crashing message when Blob isn't configured.
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log('[v0] media upload blocked: BLOB_READ_WRITE_TOKEN is missing')
    return NextResponse.json(
      { error: 'Media upload is not configured. Missing BLOB_READ_WRITE_TOKEN.' },
      { status: 503 },
    )
  }

  // 2. Auth check — only signed-in admins may mint upload tokens.
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Please sign in again to upload media.' },
      { status: 401 },
    )
  }

  let body: HandleUploadBody
  try {
    body = (await request.json()) as HandleUploadBody
  } catch {
    return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 })
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ by: session.email }),
      }),
      // Fires in production (needs a public callback URL). The DB row is written
      // by the client via `saveMediaRecord` so persistence works on localhost too;
      // this is just a server-side audit log.
      onUploadCompleted: async ({ blob }) => {
        console.log('[v0] media upload completed:', blob.pathname)
      },
    })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.'
    console.log('[v0] media upload token error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
