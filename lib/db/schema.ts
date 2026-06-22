import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

/* ----------------------------- Better Auth ----------------------------- */

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

/* ------------------------------- CMS tables ------------------------------ */

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  locale: text('locale').notNull().unique(),
  brandName: text('brand_name').notNull().default('Golden Digital Studio'),
  tagline: text('tagline'),
  parent: text('parent'),
  email: text('email'),
  phone: text('phone'),
  regions: jsonb('regions').notNull().default([]),
  social: jsonb('social').notNull().default({}),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const sections = pgTable(
  'sections',
  {
    id: serial('id').primaryKey(),
    locale: text('locale').notNull(),
    key: text('key').notNull(),
    eyebrow: text('eyebrow'),
    title: text('title'),
    subtitle: text('subtitle'),
    body: text('body'),
    data: jsonb('data').notNull().default({}),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(true),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => ({ uniqLocaleKey: unique().on(t.locale, t.key) }),
)

export const services = pgTable(
  'services',
  {
    id: serial('id').primaryKey(),
    locale: text('locale').notNull(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary'),
    description: text('description'),
    features: jsonb('features').notNull().default([]),
    icon: text('icon'),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(true),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => ({ uniqLocaleSlug: unique().on(t.locale, t.slug) }),
)

export const projects = pgTable(
  'projects',
  {
    id: serial('id').primaryKey(),
    locale: text('locale').notNull(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    category: text('category'),
    description: text('description'),
    /** Short preview text shown on cards/homepage. */
    excerpt: text('excerpt'),
    /** Full case-study body (markdown), shown only on /portfolio/[slug]. */
    body: text('body'),
    imageUrl: text('image_url'),
    /** Ordered gallery images (see GalleryImage in lib/portfolio.ts). */
    gallery: jsonb('gallery').notNull().default([]),
    url: text('url'),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(true),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => ({ uniqLocaleSlug: unique().on(t.locale, t.slug) }),
)

export const packages = pgTable(
  'packages',
  {
    id: serial('id').primaryKey(),
    locale: text('locale').notNull(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    price: text('price'),
    description: text('description'),
    features: jsonb('features').notNull().default([]),
    isFeatured: boolean('is_featured').notNull().default(false),
    ctaLabel: text('cta_label'),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(true),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => ({ uniqLocaleSlug: unique().on(t.locale, t.slug) }),
)

export const pages = pgTable(
  'pages',
  {
    id: serial('id').primaryKey(),
    locale: text('locale').notNull(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    body: text('body'),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    isPublished: boolean('is_published').notNull().default(true),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => ({ uniqLocaleSlug: unique().on(t.locale, t.slug) }),
)

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  pathname: text('pathname').notNull(),
  filename: text('filename').notNull(),
  contentType: text('content_type'),
  size: integer('size'),
  alt: text('alt'),
  caption: text('caption'),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  locale: text('locale'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  budget: text('budget'),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
