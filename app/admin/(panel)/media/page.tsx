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
  const rows = await listMedia()

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Media"
        description="Upload images to Vercel Blob and reuse their URLs across content."
        locale={defaultLocale}
        showLocales={false}
      />

      <MediaUploader />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No media uploaded yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <Image
                  src={row.url || '/placeholder.svg'}
                  alt={row.alt ?? row.filename}
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm text-foreground" title={row.filename}>
                  {row.filename}
                </p>
                <div className="flex items-center gap-1">
                  <CopyUrlButton url={row.url} />
                  <DeleteButton id={row.id} action={deleteMedia} confirmText="Delete this media record?" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
