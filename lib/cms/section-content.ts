import { cache } from 'react'
import type { Locale } from '@/lib/i18n/config'
import { getSection } from '@/lib/cms/queries'
import * as seed from '@/lib/content'

/**
 * Resolver for editable marketing SECTIONS (hero, positioning, why-us, process,
 * AI training, CTAs, page heroes, footer, shared labels).
 *
 * Each section is keyed by a stable `section_key` and stored per-locale in the
 * `sections` table. Public components call `getSectionContent(locale, key)`,
 * which returns the DB row merged over the in-repo English defaults below — so
 * the site always renders, even before any rows are seeded, and admins can edit
 * every string per locale without touching code.
 *
 * Structured lists (cards / steps / footer columns) live in the JSON `data`
 * field. The admin "Sections" editor exposes `data` as JSON so these stay
 * editable too.
 */

export type SectionItem = Record<string, string>

export type ResolvedSection = {
  key: string
  eyebrow: string | null
  title: string | null
  subtitle: string | null
  body: string | null
  data: Record<string, unknown>
}

type SectionDefault = {
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  body?: string | null
  data?: Record<string, unknown>
}

/* ----------------------------- section keys ----------------------------- */

export const SECTION_KEYS = {
  homeHero: 'home.hero',
  homePositioning: 'home.positioning',
  homeServices: 'home.services',
  homeWhyUs: 'home.why_us',
  homePortfolio: 'home.portfolio',
  homeProcess: 'home.process',
  homePackages: 'home.packages',
  homeAiTraining: 'home.ai_training',
  homeFinalCta: 'home.final_cta',
  servicesHero: 'page.services.hero',
  portfolioHero: 'page.portfolio.hero',
  contactHero: 'page.contact.hero',
  footer: 'layout.footer',
  portfolioLabels: 'portfolio.shared_labels',
} as const

/** Friendly labels + descriptions for the admin section list / hints. */
export const SECTION_CATALOG: { key: string; label: string }[] = [
  { key: SECTION_KEYS.homeHero, label: 'Home — Hero' },
  { key: SECTION_KEYS.homePositioning, label: 'Home — Positioning' },
  { key: SECTION_KEYS.homeServices, label: 'Home — Services intro' },
  { key: SECTION_KEYS.homeWhyUs, label: 'Home — Why us' },
  { key: SECTION_KEYS.homePortfolio, label: 'Home — Portfolio intro' },
  { key: SECTION_KEYS.homeProcess, label: 'Home — Process' },
  { key: SECTION_KEYS.homePackages, label: 'Home — Packages intro' },
  { key: SECTION_KEYS.homeAiTraining, label: 'Home — AI training' },
  { key: SECTION_KEYS.homeFinalCta, label: 'Home — Final CTA' },
  { key: SECTION_KEYS.servicesHero, label: 'Page — Services hero' },
  { key: SECTION_KEYS.portfolioHero, label: 'Page — Portfolio hero' },
  { key: SECTION_KEYS.contactHero, label: 'Page — Contact hero' },
  { key: SECTION_KEYS.footer, label: 'Layout — Footer' },
  { key: SECTION_KEYS.portfolioLabels, label: 'Portfolio — Shared labels' },
]

/* --------------------------- English defaults --------------------------- */

export const SECTION_DEFAULTS: Record<string, SectionDefault> = {
  [SECTION_KEYS.homeHero]: {
    eyebrow: 'A digital studio by',
    title: 'Websites, apps and AI systems for',
    body: 'Golden Digital Studio builds practical digital systems — websites with CMS, B2B portals, mobile apps, automations and AI workflows — under LMVK Group.',
    data: {
      titleHighlight: 'ambitious small businesses.',
      tagline: 'Digital systems. AI workflows. Impact.',
      primaryCta: 'Start a project',
      secondaryCta: 'See our work',
    },
  },
  [SECTION_KEYS.homePositioning]: {
    eyebrow: 'Positioning',
    title: 'From outdated websites and manual work to modern digital systems.',
    body: 'Most small businesses are held back by a slow website and a stack of manual tasks. Golden Digital Studio replaces that with clean, connected systems — built around how your business actually works, not around hype. The result is software that is faster to use, easier to maintain and ready to grow with you.',
    data: {
      items: [
        { value: 'CMS-first', label: 'You own and edit your content' },
        { value: 'Weeks', label: 'Typical time to a first launch' },
        { value: 'AI-assisted', label: 'Faster builds without cut corners' },
      ],
    },
  },
  [SECTION_KEYS.homeServices]: {
    eyebrow: 'Services',
    title: 'Everything you need to run a modern digital business.',
    body: 'One studio for the systems that matter — built to work together and easy to maintain.',
  },
  [SECTION_KEYS.homeWhyUs]: {
    eyebrow: 'Why us',
    title: 'A studio built for outcomes, not just deliverables.',
    body: 'We combine speed, real business sense and a modern toolkit — backed by the standards of LMVK Group.',
    data: {
      items: seed.advantages.map((a) => ({ title: a.title, body: a.body })),
    },
  },
  [SECTION_KEYS.homePortfolio]: {
    eyebrow: 'Portfolio',
    title: 'Proof in real systems and brands.',
    body: 'Selected work across websites, portals and apps. Built to perform and ready for the next phase.',
  },
  [SECTION_KEYS.homeProcess]: {
    eyebrow: 'Process',
    title: 'A clear path from idea to a system you can run.',
    body: 'Five focused stages keep the work transparent, fast and easy to follow.',
    data: {
      items: seed.processSteps.map((s) => ({
        step: s.step,
        title: s.title,
        body: s.body,
      })),
    },
  },
  [SECTION_KEYS.homePackages]: {
    eyebrow: 'Packages',
    title: 'Engagements scoped to where you are.',
    body: 'Transparent starting points — every project is tailored after a short discovery call.',
  },
  [SECTION_KEYS.homeAiTraining]: {
    eyebrow: 'AI training',
    title: 'We can also train your team to work with AI.',
    body: 'Beyond building systems, Golden Digital Studio runs practical, hands-on training so your team can use modern AI tools with confidence — from everyday assistants to repeatable content and automation workflows.',
    data: {
      ctaLabel: 'Ask about training',
      items: seed.aiTopics.map((t) => ({ title: t.title, body: t.body })),
    },
  },
  [SECTION_KEYS.homeFinalCta]: {
    eyebrow: "Let's build",
    title: 'Build fast. Build clean.',
    body: "Tell us where your business is today and where you want it to go. We'll map the highest-impact digital system to get you there.",
    data: {
      titleHighlight: 'Build golden.',
      primaryCta: 'Book a consultation',
      secondaryCta: 'View our work',
    },
  },
  [SECTION_KEYS.servicesHero]: {
    eyebrow: 'Services',
    title: 'Digital systems, built to work together.',
    body: 'From your first modern website to portals, apps and AI workflows — Golden Digital Studio delivers the systems ambitious small businesses need, with a CMS-first, AI-assisted approach.',
  },
  [SECTION_KEYS.portfolioHero]: {
    eyebrow: 'Portfolio',
    title: 'Work that turns into momentum.',
    body: "A selection of systems and brands we've shaped. Each one is built to perform today and ready to grow into its next phase.",
  },
  [SECTION_KEYS.contactHero]: {
    eyebrow: 'Contact',
    title: 'Start a project. Build something golden.',
    body: "Tell us where your business is today and what you want to build. We'll come back with a clear, practical next step — no jargon, no pressure.",
  },
  [SECTION_KEYS.footer]: {
    body: 'Practical digital systems — websites, portals, apps and AI workflows — for ambitious small businesses across Czech Republic, Slovakia, Austria.',
    data: {
      parentLine: 'A digital studio by LMVK Group',
      slogan: 'Build fast. Build clean. Build golden.',
      columns: [
        {
          title: 'Services',
          links: [
            { label: 'Websites & CMS', href: '/services#websites-cms' },
            { label: 'B2B portals', href: '/services#b2b-portals' },
            { label: 'Mobile apps', href: '/services#mobile-apps' },
            { label: 'AI workflows', href: '/services#ai-workflows' },
          ],
        },
        {
          title: 'Studio',
          links: [
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'Contact', href: '/contact' },
            { label: 'Start a project', href: '/contact' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { label: 'Privacy policy', href: '/contact' },
            { label: 'Terms of service', href: '/contact' },
            { label: 'Imprint', href: '/contact' },
          ],
        },
      ],
    },
  },
  [SECTION_KEYS.portfolioLabels]: {
    data: {
      signatureWork: 'Signature work',
      viewCaseStudy: 'View case study →',
      visitSite: 'Visit site ↗',
      allWork: 'All work',
      visitLiveSite: 'Visit live site',
    },
  },
}

/* ------------------------------- resolver ------------------------------- */

function mergeData(
  def: Record<string, unknown> | undefined,
  row: Record<string, unknown> | undefined,
): Record<string, unknown> {
  // Row values win field-by-field; keys absent from the row keep their default
  // (so a partially-filled CMS row never wipes the structured `items`/columns).
  return { ...(def ?? {}), ...(row ?? {}) }
}

/**
 * Resolve a single section for a locale. The DB row (if present) is merged over
 * the English defaults; a missing locale row falls back to the default-locale
 * row inside `getSection`, then to the in-repo defaults here. Never throws.
 * Wrapped in React `cache` so repeated reads within one render are deduped.
 */
export const getSectionContent = cache(
  async (locale: Locale, key: string): Promise<ResolvedSection> => {
    const def = SECTION_DEFAULTS[key] ?? {}
    const row = await getSection(locale, key)
    return {
      key,
      eyebrow: row?.eyebrow ?? def.eyebrow ?? null,
      title: row?.title ?? def.title ?? null,
      subtitle: row?.subtitle ?? def.subtitle ?? null,
      body: row?.body ?? def.body ?? null,
      data: mergeData(def.data, row?.data),
    }
  },
)

/** Typed accessor for an array of structured items under `data.items`. */
export function sectionItems(section: ResolvedSection): SectionItem[] {
  const items = section.data?.items
  return Array.isArray(items) ? (items as SectionItem[]) : []
}

/** Adapt a resolved section to the `{ eyebrow, title, description }` heading
 * shape used by the Services / Portfolio / Packages section components. */
export function sectionHeading(section: ResolvedSection): {
  eyebrow?: string
  title?: string
  description?: string
} {
  return {
    eyebrow: section.eyebrow ?? undefined,
    title: section.title ?? undefined,
    description: section.body ?? undefined,
  }
}

/** Convenience: resolve a heading section directly to the heading shape. */
export async function getSectionHeading(locale: Locale, key: string) {
  return sectionHeading(await getSectionContent(locale, key))
}
