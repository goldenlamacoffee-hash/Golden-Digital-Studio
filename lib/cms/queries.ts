import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  packages as packagesTable,
  projects as projectsTable,
  sections as sectionsTable,
  services as servicesTable,
  siteSettings as siteSettingsTable,
} from '@/lib/db/schema'
import type { Locale } from '@/lib/i18n/config'
import { defaultLocale } from '@/lib/i18n/config'
import * as seed from '@/lib/content'

/**
 * CMS read layer. Each getter returns published rows for the active locale.
 * If the locale has no rows yet, it falls back to the default locale, then to
 * the in-repo seed content so the site always renders.
 */

export type SiteSettings = {
  brandName: string
  tagline: string
  parent: string
  email: string
  phone: string
  regions: string[]
  description: string
  seoTitle: string | null
  seoDescription: string | null
}

function seedSettings(): SiteSettings {
  return {
    brandName: seed.site.name,
    tagline: seed.site.tagline,
    parent: seed.site.parent,
    email: seed.site.email,
    phone: seed.site.phone,
    regions: [...seed.site.regions],
    description: seed.site.description,
    seoTitle: null,
    seoDescription: null,
  }
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  try {
    const rows = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.locale, locale))
      .limit(1)
    const row = rows[0]
    if (!row) return seedSettings()
    return {
      brandName: row.brandName,
      tagline: row.tagline ?? seed.site.tagline,
      parent: row.parent ?? seed.site.parent,
      email: row.email ?? seed.site.email,
      phone: row.phone ?? seed.site.phone,
      regions: (row.regions as string[]) ?? [...seed.site.regions],
      description: row.seoDescription ?? seed.site.description,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
    }
  } catch {
    return seedSettings()
  }
}

export type ServiceItem = {
  slug: string
  title: string
  summary: string
  features: string[]
}

function seedServices(): ServiceItem[] {
  return seed.services.map((s) => ({
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    features: s.details,
  }))
}

export async function getServices(locale: Locale): Promise<ServiceItem[]> {
  try {
    const rows = await db
      .select()
      .from(servicesTable)
      .where(
        and(
          eq(servicesTable.locale, locale),
          eq(servicesTable.isPublished, true),
        ),
      )
      .orderBy(asc(servicesTable.sortOrder))
    if (rows.length === 0) return seedServices()
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      summary: r.summary ?? '',
      features: (r.features as string[]) ?? [],
    }))
  } catch {
    return seedServices()
  }
}

export type ProjectItem = {
  slug: string
  name: string
  category: string
  description: string
  imageUrl: string | null
  url: string | null
}

function seedProjects(): ProjectItem[] {
  return seed.projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    description: p.description,
    imageUrl: null,
    url: null,
  }))
}

export async function getProjects(locale: Locale): Promise<ProjectItem[]> {
  try {
    const rows = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.locale, locale),
          eq(projectsTable.isPublished, true),
        ),
      )
      .orderBy(asc(projectsTable.sortOrder))
    if (rows.length === 0) return seedProjects()
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      category: r.category ?? '',
      description: r.description ?? '',
      imageUrl: r.imageUrl,
      url: r.url,
    }))
  } catch {
    return seedProjects()
  }
}

export type PackageItem = {
  slug: string
  name: string
  price: string
  description: string
  features: string[]
  isFeatured: boolean
  ctaLabel: string | null
}

function seedPackages(): PackageItem[] {
  return seed.packages.map((p, i) => ({
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: p.name,
    price: p.fromPrice,
    description: p.best,
    features: p.features,
    isFeatured: Boolean(p.highlighted),
    ctaLabel: null,
  }))
}

export async function getPackages(locale: Locale): Promise<PackageItem[]> {
  try {
    const rows = await db
      .select()
      .from(packagesTable)
      .where(
        and(
          eq(packagesTable.locale, locale),
          eq(packagesTable.isPublished, true),
        ),
      )
      .orderBy(asc(packagesTable.sortOrder))
    if (rows.length === 0) return seedPackages()
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      price: r.price ?? '',
      description: r.description ?? '',
      features: (r.features as string[]) ?? [],
      isFeatured: r.isFeatured,
      ctaLabel: r.ctaLabel,
    }))
  } catch {
    return seedPackages()
  }
}

export type SectionContent = {
  eyebrow: string | null
  title: string | null
  subtitle: string | null
  body: string | null
  data: Record<string, unknown>
}

export async function getSection(
  locale: Locale,
  key: string,
): Promise<SectionContent | null> {
  try {
    const rows = await db
      .select()
      .from(sectionsTable)
      .where(and(eq(sectionsTable.locale, locale), eq(sectionsTable.key, key)))
      .limit(1)
    let row = rows[0]
    if (!row && locale !== defaultLocale) {
      const fb = await db
        .select()
        .from(sectionsTable)
        .where(
          and(
            eq(sectionsTable.locale, defaultLocale),
            eq(sectionsTable.key, key),
          ),
        )
        .limit(1)
      row = fb[0]
    }
    if (!row) return null
    return {
      eyebrow: row.eyebrow,
      title: row.title,
      subtitle: row.subtitle,
      body: row.body,
      data: (row.data as Record<string, unknown>) ?? {},
    }
  } catch {
    return null
  }
}
