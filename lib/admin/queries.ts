import { asc, desc, eq, sql } from 'drizzle-orm'
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
import type { Locale } from '@/lib/i18n/config'

export async function listServices(locale: Locale) {
  return db
    .select()
    .from(services)
    .where(eq(services.locale, locale))
    .orderBy(asc(services.sortOrder), asc(services.id))
}

export async function listProjects(locale: Locale) {
  return db
    .select()
    .from(projects)
    .where(eq(projects.locale, locale))
    .orderBy(asc(projects.sortOrder), asc(projects.id))
}

export async function listPackages(locale: Locale) {
  return db
    .select()
    .from(packages)
    .where(eq(packages.locale, locale))
    .orderBy(asc(packages.sortOrder), asc(packages.id))
}

export async function listSections(locale: Locale) {
  return db
    .select()
    .from(sections)
    .where(eq(sections.locale, locale))
    .orderBy(asc(sections.sortOrder), asc(sections.id))
}

export async function getSettings(locale: Locale) {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.locale, locale))
    .limit(1)
  return rows[0] ?? null
}

export async function listInquiries() {
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt))
}

export async function listMedia() {
  return db.select().from(media).orderBy(desc(media.createdAt))
}

export async function getCounts() {
  const [s, p, k, m, i] = await Promise.all([
    db.select({ c: sql<number>`count(*)::int` }).from(services),
    db.select({ c: sql<number>`count(*)::int` }).from(projects),
    db.select({ c: sql<number>`count(*)::int` }).from(packages),
    db.select({ c: sql<number>`count(*)::int` }).from(media),
    db.select({ c: sql<number>`count(*)::int` }).from(inquiries),
  ])
  return {
    services: s[0]?.c ?? 0,
    projects: p[0]?.c ?? 0,
    packages: k[0]?.c ?? 0,
    media: m[0]?.c ?? 0,
    inquiries: i[0]?.c ?? 0,
  }
}

export async function countNewInquiries() {
  const rows = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(eq(inquiries.status, 'new'))
  return rows[0]?.c ?? 0
}
