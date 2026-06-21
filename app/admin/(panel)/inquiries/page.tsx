import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { InquiryRow } from '@/components/admin/inquiry-row'
import { listInquiries } from '@/lib/admin/queries'
import { defaultLocale } from '@/lib/i18n/config'

export const dynamic = 'force-dynamic'

export default async function AdminInquiriesPage() {
  const rows = await listInquiries()

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Inquiries"
        description="Messages submitted through the contact form across all markets."
        locale={defaultLocale}
        showLocales={false}
      />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No inquiries yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <InquiryRow key={row.id} inquiry={row} />
          ))}
        </div>
      )}
    </div>
  )
}
