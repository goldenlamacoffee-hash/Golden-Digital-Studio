import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ResourceForm } from '@/components/admin/resource-form'
import { DeleteButton } from '@/components/admin/delete-button'
import { TextField, AreaField, ToggleField } from '@/components/admin/form-fields'
import { LocaleEmptyState } from '@/components/admin/locale-empty-state'
import { listServices, getEntityCountsByLocale } from '@/lib/admin/queries'
import { saveService, deleteService } from '@/app/actions/admin'
import { getAdminLocale } from '@/lib/admin/locale'

export const dynamic = 'force-dynamic'

type Row = Awaited<ReturnType<typeof listServices>>[number]

function Fields({ row }: { row?: Row }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField name="title" label="Title" defaultValue={row?.title} required />
      <TextField name="slug" label="Slug" defaultValue={row?.slug} required hint="Unique per locale, e.g. websites-cms" />
      <div className="sm:col-span-2">
        <AreaField name="summary" label="Summary" defaultValue={row?.summary} rows={2} />
      </div>
      <div className="sm:col-span-2">
        <AreaField
          name="features"
          label="Features"
          defaultValue={(row?.features as string[] | undefined)?.join('\n')}
          rows={4}
          hint="One feature per line"
        />
      </div>
      <TextField name="icon" label="Icon" defaultValue={row?.icon} hint="Optional lucide icon name" />
      <TextField name="sortOrder" label="Sort order" defaultValue={String(row?.sortOrder ?? 0)} />
      <ToggleField name="isPublished" label="Published" defaultChecked={row?.isPublished ?? true} />
    </div>
  )
}

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>
}) {
  const { locale: localeParam } = await searchParams
  const { locale } = await getAdminLocale(localeParam)
  const [rows, localeCounts] = await Promise.all([
    listServices(locale),
    getEntityCountsByLocale('services'),
  ])

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Services"
        description="The services shown on the homepage and Services page."
        locale={locale}
        action={
          <ResourceForm action={saveService} locale={locale} title="New service" addLabel="Add service">
            <Fields />
          </ResourceForm>
        }
      />

      {rows.length === 0 ? (
        <LocaleEmptyState entity="services" label="services" current={locale} counts={localeCounts} />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">
                    {row.title}
                    {!row.isPublished ? (
                      <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                        Draft
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-muted-foreground">{row.summary}</p>
                </div>
                <div className="flex items-center gap-1">
                  <ResourceForm
                    action={saveService}
                    locale={locale}
                    editingId={row.id}
                    title={`Edit ${row.title}`}
                    addLabel="Edit"
                  >
                    <Fields row={row} />
                  </ResourceForm>
                  <DeleteButton id={row.id} action={deleteService} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
