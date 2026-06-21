import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ResourceForm } from '@/components/admin/resource-form'
import { DeleteButton } from '@/components/admin/delete-button'
import { TextField, AreaField, ToggleField } from '@/components/admin/form-fields'
import { listPackages } from '@/lib/admin/queries'
import { savePackage, deletePackage } from '@/app/actions/admin'
import { localeFromParam, type Locale } from '@/lib/i18n/config'

export const dynamic = 'force-dynamic'

type Row = Awaited<ReturnType<typeof listPackages>>[number]

function Fields({ row }: { row?: Row }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField name="name" label="Name" defaultValue={row?.name} required />
      <TextField name="slug" label="Slug" defaultValue={row?.slug} required />
      <TextField name="price" label="Price" defaultValue={row?.price} placeholder="From €2,500" />
      <TextField name="ctaLabel" label="CTA label" defaultValue={row?.ctaLabel} placeholder="Start a project" />
      <div className="sm:col-span-2">
        <AreaField name="description" label="Description" defaultValue={row?.description} rows={2} />
      </div>
      <div className="sm:col-span-2">
        <AreaField
          name="features"
          label="Features"
          defaultValue={(row?.features as string[] | undefined)?.join('\n')}
          rows={5}
          hint="One feature per line"
        />
      </div>
      <TextField name="sortOrder" label="Sort order" defaultValue={String(row?.sortOrder ?? 0)} />
      <div className="flex flex-col gap-2">
        <ToggleField name="isFeatured" label="Featured (highlighted)" defaultChecked={row?.isFeatured ?? false} />
        <ToggleField name="isPublished" label="Published" defaultChecked={row?.isPublished ?? true} />
      </div>
    </div>
  )
}

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>
}) {
  const { locale: localeParam } = await searchParams
  const locale: Locale = localeFromParam(localeParam)
  const rows = await listPackages(locale)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Packages"
        description="Pricing packages shown on the Services page."
        locale={locale}
        action={
          <ResourceForm action={savePackage} locale={locale} title="New package" addLabel="Add package">
            <Fields />
          </ResourceForm>
        }
      />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No packages for this locale yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5">
              <div>
                <p className="font-medium text-foreground">
                  {row.name}
                  {row.isFeatured ? (
                    <span className="ml-2 rounded bg-gold/15 px-1.5 py-0.5 text-xs text-gold">Featured</span>
                  ) : null}
                  {!row.isPublished ? (
                    <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Draft</span>
                  ) : null}
                </p>
                <p className="text-sm text-muted-foreground">{row.price}</p>
              </div>
              <div className="flex items-center gap-1">
                <ResourceForm action={savePackage} locale={locale} editingId={row.id} title={`Edit ${row.name}`} addLabel="Edit">
                  <Fields row={row} />
                </ResourceForm>
                <DeleteButton id={row.id} action={deletePackage} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
