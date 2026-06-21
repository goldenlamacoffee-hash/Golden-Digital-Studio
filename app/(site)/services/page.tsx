import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ServicesSection } from '@/components/sections/services'
import { Process } from '@/components/sections/process'
import { Packages } from '@/components/sections/packages'
import { AiTraining } from '@/components/sections/ai-training'
import { CtaSection } from '@/components/sections/cta-section'
import { getLocale } from '@/lib/i18n/server'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getServices, getPackages } from '@/lib/cms/queries'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Websites & CMS, B2B portals, mobile apps, AI workflows, business automation and ongoing maintenance — built by Golden Digital Studio.',
  openGraph: {
    title: 'Services · Golden Digital Studio',
    description:
      'Websites & CMS, B2B portals, mobile apps, AI workflows, business automation and ongoing maintenance.',
  },
}

export default async function ServicesPage() {
  const locale = await getLocale()
  const t = getDictionary(locale)
  const [services, packages] = await Promise.all([
    getServices(locale),
    getPackages(locale),
  ])

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Digital systems, built to work together."
        description="From your first modern website to portals, apps and AI workflows — Golden Digital Studio delivers the systems ambitious small businesses need, with a CMS-first, AI-assisted approach."
      />
      <ServicesSection
        detailed
        flush
        items={services}
        heading={t.sections.services}
      />
      <Process />
      <Packages items={packages} heading={t.sections.packages} />
      <AiTraining />
      <CtaSection />
    </>
  )
}
