'use server'

import { del } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  services,
  projects,
  packages,
  sections,
  siteSettings,
  inquiries,
  media,
} from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin/guard'
import { isLocale, defaultLocale, type Locale } from '@/lib/i18n/config'
import { assertValidLocale } from '@/lib/admin/locale'
import { parseGallery } from '@/lib/portfolio'

/* ------------------------------- helpers ------------------------------- */

function str(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : ''
}
function optStr(v: FormDataEntryValue | null): string | null {
  const s = str(v)
  return s.length ? s : null
}
function bool(v: FormDataEntryValue | null): boolean {
  return v === 'on' || v === 'true' || v === '1'
}
function int(v: FormDataEntryValue | null): number {
  const n = Number.parseInt(str(v), 10)
  return Number.isFinite(n) ? n : 0
}
/** Parse a textarea of newline-separated values into a string[]. */
function lines(v: FormDataEntryValue | null): string[] {
  return str(v)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}
function localeOf(v: FormDataEntryValue | null): Locale {
  const s = str(v)
  return isLocale(s) ? s : defaultLocale
}

function revalidateSite() {
  revalidatePath('/', 'layout')
}

/* ------------------------------- services ------------------------------ */

export async function saveService(formData: FormData) {
  await requireAdmin()
  const id = int(formData.get('id'))
  const values = {
    locale: localeOf(formData.get('locale')),
    slug: str(formData.get('slug')),
    title: str(formData.get('title')),
    summary: optStr(formData.get('summary')),
    description: optStr(formData.get('description')),
    features: lines(formData.get('features')),
    icon: optStr(formData.get('icon')),
    sortOrder: int(formData.get('sortOrder')),
    isPublished: bool(formData.get('isPublished')),
    updatedAt: new Date(),
  }
  if (id) {
    await db.update(services).set(values).where(eq(services.id, id))
  } else {
    await db.insert(services).values(values)
  }
  revalidateSite()
}

export async function deleteService(id: number) {
  await requireAdmin()
  await db.delete(services).where(eq(services.id, id))
  revalidateSite()
}

/* ------------------------------- projects ------------------------------ */

export async function saveProject(formData: FormData) {
  await requireAdmin()
  const id = int(formData.get('id'))
  const values = {
    locale: localeOf(formData.get('locale')),
    slug: str(formData.get('slug')),
    name: str(formData.get('name')),
    category: optStr(formData.get('category')),
    description: optStr(formData.get('description')),
    excerpt: optStr(formData.get('excerpt')),
    body: optStr(formData.get('body')),
    imageUrl: optStr(formData.get('imageUrl')),
    // Re-parse on the server so only valid, normalized gallery entries persist.
    gallery: parseGallery(str(formData.get('gallery'))),
    url: optStr(formData.get('url')),
    sortOrder: int(formData.get('sortOrder')),
    isPublished: bool(formData.get('isPublished')),
    updatedAt: new Date(),
  }
  if (id) {
    await db.update(projects).set(values).where(eq(projects.id, id))
  } else {
    await db.insert(projects).values(values)
  }
  revalidateSite()
}

export async function deleteProject(id: number) {
  await requireAdmin()
  await db.delete(projects).where(eq(projects.id, id))
  revalidateSite()
}

/* ------------------------------- packages ------------------------------ */

export async function savePackage(formData: FormData) {
  await requireAdmin()
  const id = int(formData.get('id'))
  const values = {
    locale: localeOf(formData.get('locale')),
    slug: str(formData.get('slug')),
    name: str(formData.get('name')),
    price: optStr(formData.get('price')),
    description: optStr(formData.get('description')),
    features: lines(formData.get('features')),
    isFeatured: bool(formData.get('isFeatured')),
    ctaLabel: optStr(formData.get('ctaLabel')),
    sortOrder: int(formData.get('sortOrder')),
    isPublished: bool(formData.get('isPublished')),
    updatedAt: new Date(),
  }
  if (id) {
    await db.update(packages).set(values).where(eq(packages.id, id))
  } else {
    await db.insert(packages).values(values)
  }
  revalidateSite()
}

export async function deletePackage(id: number) {
  await requireAdmin()
  await db.delete(packages).where(eq(packages.id, id))
  revalidateSite()
}

/* ------------------------------- sections ------------------------------ */

export async function saveSection(formData: FormData) {
  await requireAdmin()
  const id = int(formData.get('id'))
  const values = {
    locale: localeOf(formData.get('locale')),
    key: str(formData.get('key')),
    eyebrow: optStr(formData.get('eyebrow')),
    title: optStr(formData.get('title')),
    subtitle: optStr(formData.get('subtitle')),
    body: optStr(formData.get('body')),
    sortOrder: int(formData.get('sortOrder')),
    isPublished: bool(formData.get('isPublished')),
    updatedAt: new Date(),
  }
  if (id) {
    await db.update(sections).set(values).where(eq(sections.id, id))
  } else {
    await db.insert(sections).values(values)
  }
  revalidateSite()
}

export async function deleteSection(id: number) {
  await requireAdmin()
  await db.delete(sections).where(eq(sections.id, id))
  revalidateSite()
}

/* --------------------------- locale cloning ---------------------------- */

export type CopyableEntity = 'services' | 'projects' | 'packages' | 'sections'

/**
 * Copy all rows of one content type from a source locale into a target locale.
 * Existing target rows are NEVER overwritten — rows whose unique key (slug, or
 * `key` for sections) already exists in the target are skipped. This powers the
 * "Copy from <locale>" empty-state action and keeps each market's data isolated.
 * Returns the number of rows inserted.
 */
export async function copyLocaleContent(
  entity: CopyableEntity,
  from: string,
  to: string,
): Promise<number> {
  await requireAdmin()
  const fromLocale = assertValidLocale(from)
  const toLocale = assertValidLocale(to)
  if (fromLocale === toLocale) return 0

  const now = () => new Date()
  let inserted = 0

  if (entity === 'sections') {
    const source = await db.select().from(sections).where(eq(sections.locale, fromLocale))
    const existing = await db
      .select({ key: sections.key })
      .from(sections)
      .where(eq(sections.locale, toLocale))
    const taken = new Set(existing.map((r) => r.key))
    const rows = source
      .filter((r) => !taken.has(r.key))
      .map(({ id, updatedAt, ...rest }) => ({ ...rest, locale: toLocale, updatedAt: now() }))
    if (rows.length) {
      await db.insert(sections).values(rows)
      inserted = rows.length
    }
  } else if (entity === 'services') {
    const source = await db.select().from(services).where(eq(services.locale, fromLocale))
    const existing = await db
      .select({ slug: services.slug })
      .from(services)
      .where(eq(services.locale, toLocale))
    const taken = new Set(existing.map((r) => r.slug))
    const rows = source
      .filter((r) => !taken.has(r.slug))
      .map(({ id, updatedAt, ...rest }) => ({ ...rest, locale: toLocale, updatedAt: now() }))
    if (rows.length) {
      await db.insert(services).values(rows)
      inserted = rows.length
    }
  } else if (entity === 'projects') {
    const source = await db.select().from(projects).where(eq(projects.locale, fromLocale))
    const existing = await db
      .select({ slug: projects.slug })
      .from(projects)
      .where(eq(projects.locale, toLocale))
    const taken = new Set(existing.map((r) => r.slug))
    const rows = source
      .filter((r) => !taken.has(r.slug))
      .map(({ id, updatedAt, ...rest }) => ({ ...rest, locale: toLocale, updatedAt: now() }))
    if (rows.length) {
      await db.insert(projects).values(rows)
      inserted = rows.length
    }
  } else {
    const source = await db.select().from(packages).where(eq(packages.locale, fromLocale))
    const existing = await db
      .select({ slug: packages.slug })
      .from(packages)
      .where(eq(packages.locale, toLocale))
    const taken = new Set(existing.map((r) => r.slug))
    const rows = source
      .filter((r) => !taken.has(r.slug))
      .map(({ id, updatedAt, ...rest }) => ({ ...rest, locale: toLocale, updatedAt: now() }))
    if (rows.length) {
      await db.insert(packages).values(rows)
      inserted = rows.length
    }
  }

  revalidateSite()
  return inserted
}

/* ----------------------------- site settings --------------------------- */

export async function saveSettings(formData: FormData) {
  await requireAdmin()
  const locale = localeOf(formData.get('locale'))
  const values = {
    locale,
    brandName: str(formData.get('brandName')) || 'Golden Digital Studio',
    tagline: optStr(formData.get('tagline')),
    parent: optStr(formData.get('parent')),
    email: optStr(formData.get('email')),
    phone: optStr(formData.get('phone')),
    regions: lines(formData.get('regions')),
    seoTitle: optStr(formData.get('seoTitle')),
    seoDescription: optStr(formData.get('seoDescription')),
    updatedAt: new Date(),
  }
  await db
    .insert(siteSettings)
    .values(values)
    .onConflictDoUpdate({ target: siteSettings.locale, set: values })
  revalidateSite()
}

/* ------------------------------ inquiries ------------------------------ */

export async function updateInquiryStatus(id: number, status: string) {
  await requireAdmin()
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id))
  revalidatePath('/admin/inquiries')
}

export async function deleteInquiry(id: number) {
  await requireAdmin()
  await db.delete(inquiries).where(eq(inquiries.id, id))
  revalidatePath('/admin/inquiries')
}

/* -------------------------------- media -------------------------------- */

export async function deleteMedia(id: number) {
  await requireAdmin()
  // Look up the row first so we can also remove the underlying blob.
  const [row] = await db
    .select({ url: media.url })
    .from(media)
    .where(eq(media.id, id))
    .limit(1)
  await db.delete(media).where(eq(media.id, id))
  if (row?.url) {
    try {
      await del(row.url)
    } catch (err) {
      console.log('[v0] media blob delete failed:', (err as Error).message)
    }
  }
  revalidatePath('/admin/media')
}
