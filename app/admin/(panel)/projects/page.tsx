import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ResourceForm } from '@/components/admin/resource-form'
import { DeleteButton } from '@/components/admin/delete-button'
import { TextField, AreaField, ToggleField } from '@/components/admin/form-fields'
import { ImageUrlField } from '@/components/admin/image-url-field'
import { listProjects } from '@/lib/admin/queries'
import { saveProject, deleteProject } from '@/app/actions/admin'
import { localeFromParam, type Locale } from '@/lib/i18n/config'

export const dynamic = 'force-dynamic'

type Row = Awaited<ReturnType<typeof listProjects>>[number]

function Fields({ row }: { row?: Row }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField name="name" label="Name" defaultValue={row?.name} required />
      <TextField name="slug" label="Slug" defaultValue={row?.slug} required />
      <TextField name="category" label="Category" defaultValue={row?.category} />
      <TextField name="url" label="Project URL" defaultValue={row?.url} placeholder="https://" />
      <div className="sm:col-span-2">
        <AreaField name="description" label="Description" defaultValue={row?.description} rows={3} />
      </div>
      <div className="sm:col-span-2">
        <ImageUrlField name="imageUrl" label="Image URL" defaultValue={row?.imageUrl} hint="Paste a URL from the Media library" />
      </div>
      <TextField name="sortOrder" label="Sort order" defaultValue={String(row?.sortOrder ?? 0)} />
      <ToggleField name="isPublished" label="Published" defaultChecked={row?.isPublished ?? true} />
    </div>
  )
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>
}) {
  const { locale: localeParam } = await searchParams
  const locale: Locale = localeFromParam(localeParam)
  const rows = await listProjects(locale)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Portfolio"
        description="Case studies and projects shown in the portfolio."
        locale={locale}
        action={
          <ResourceForm action={saveProject} locale={locale} title="New project" addLabel="Add project">
            <Fields />
          </ResourceForm>
        }
      />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No projects for this locale yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5">
              <div>
                <p className="font-medium text-foreground">
                  {row.name}
                  {!row.isPublished ? (
                    <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Draft</span>
                  ) : null}
                </p>
                <p className="text-sm text-muted-foreground">{row.category}</p>
              </div>
              <div className="flex items-center gap-1">
                <ResourceForm action={saveProject} locale={locale} editingId={row.id} title={`Edit ${row.name}`} addLabel="Edit">
                  <Fields row={row} />
                </ResourceForm>
                <DeleteButton id={row.id} action={deleteProject} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
