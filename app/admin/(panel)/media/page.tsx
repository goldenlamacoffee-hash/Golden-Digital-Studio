import Image from 'next/image'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { MediaUploader } from '@/components/admin/media-uploader'
import { DeleteButton } from '@/components/admin/delete-button'
import { CopyUrlButton } from '@/components/admin/copy-url-button'
import { listMedia } from '@/lib/admin/queries'
import { deleteMedia } from '@/app/actions/admin'
import { defaultLocale } from '@/lib/i18n/config'

export const dynamic = 'force-dynamic'

export default async function AdminMediaPage() {
  let rows: Awaited<ReturnType<typeof listMedia>> = []
  let loadError = false
  try {
    rows = await listMedia()
  } catch {
    loadError = true
  }

  // Defend against malformed rows (missing url/filename) so one bad record can
  // never blank out the whole gallery.
  const items = (rows ?? []).filter((r) => r && typeof r.url === 'string' && r.url.length > 0)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Media"
        description="Upload images to Vercel Blob and reuse their URLs across content."
        locale={defaultLocale}
        showLocales={false}
      />

      <MediaUploader />

      {loadError ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-10 text-center text-destructive">
          Could not load the media library. Please refresh the page.
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No media uploaded yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((row) => {
            const filename = row.filename || 'untitled'
            const altText = row.alt || row.caption || filename
            return (
              <div
                key={row.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={row.url || '/placeholder.svg'}
                    alt={altText}
                    fill
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground" title={filename}>
                      {filename}
                    </p>
                    {row.caption ? (
                      <p className="truncate text-xs text-muted-foreground" title={row.caption}>
                        {row.caption}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <CopyUrlButton url={row.url} />
                    <DeleteButton id={row.id} action={deleteMedia} confirmText="Delete this image? This also removes the stored file." />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
