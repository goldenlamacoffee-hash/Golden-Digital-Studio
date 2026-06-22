import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ResourceForm } from '@/components/admin/resource-form'
import { DeleteButton } from '@/components/admin/delete-button'
import { TextField, AreaField, ToggleField } from '@/components/admin/form-fields'
import { MarkdownEditor } from '@/components/admin/markdown-editor'
import { SectionDataField } from '@/components/admin/section-data-field'
import { LocaleEmptyState } from '@/components/admin/locale-empty-state'
import { listSections, getEntityCountsByLocale } from '@/lib/admin/queries'
import { saveSection, deleteSection } from '@/app/actions/admin'
import { getAdminLocale } from '@/lib/admin/locale'
import { SECTION_DATA_HINTS } from '@/lib/cms/section-content'

export const dynamic = 'force-dynamic'

type Row = Awaited<ReturnType<typeof listSections>>[number]

function Fields({ row }: { row?: Row }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField name="key" label="Key" defaultValue={row?.key} required hint="e.g. hero, positioning, why-us" />
      <TextField name="eyebrow" label="Eyebrow" defaultValue={row?.eyebrow} />
      <div className="sm:col-span-2">
        <TextField name="title" label="Title" defaultValue={row?.title} />
      </div>
      <div className="sm:col-span-2">
        <AreaField name="subtitle" label="Subtitle" defaultValue={row?.subtitle} rows={2} />
      </div>
      <div className="sm:col-span-2 border-t border-border pt-4">
        <MarkdownEditor
          name="body"
          label="Body"
          defaultValue={row?.body}
          rows={8}
          hint="Supports headings, bold, lists and links. Rendered as formatted text on the site."
        />
      </div>
      <div className="sm:col-span-2 border-t border-border pt-4">
        <SectionDataField
          defaultValue={row?.data}
          hint={row?.key ? SECTION_DATA_HINTS[row.key] : undefined}
        />
      </div>
      <TextField name="sortOrder" label="Sort order" defaultValue={String(row?.sortOrder ?? 0)} />
      <ToggleField name="isPublished" label="Published" defaultChecked={row?.isPublished ?? true} />
    </div>
  )
}

export default async function AdminSectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>
}) {
  const { locale: localeParam } = await searchParams
  const { locale } = await getAdminLocale(localeParam)
  const [rows, localeCounts] = await Promise.all([
    listSections(locale),
    getEntityCountsByLocale('sections'),
  ])

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Sections"
        description="Editable headings and copy for homepage and page sections."
        locale={locale}
        action={
          <ResourceForm action={saveSection} locale={locale} title="New section" addLabel="Add section">
            <Fields />
          </ResourceForm>
        }
      />

      {rows.length === 0 ? (
        <LocaleEmptyState entity="sections" label="sections" current={locale} counts={localeCounts} />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-gold">{row.key}</p>
                <p className="font-medium text-foreground">{row.title}</p>
                <p className="line-clamp-1 text-sm text-muted-foreground">{row.subtitle}</p>
              </div>
              <div className="flex items-center gap-1">
                <ResourceForm action={saveSection} locale={locale} editingId={row.id} title={`Edit ${row.key}`} addLabel="Edit">
                  <Fields row={row} />
                </ResourceForm>
                <DeleteButton id={row.id} action={deleteSection} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
