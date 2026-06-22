import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ServicesSection } from '@/components/sections/services'
import { Process } from '@/components/sections/process'
import { Packages } from '@/components/sections/packages'
import { AiTraining } from '@/components/sections/ai-training'
import { CtaSection } from '@/components/sections/cta-section'
import { getLocale } from '@/lib/i18n/server'
import { getServices, getPackages } from '@/lib/cms/queries'
import {
  getSectionContent,
  getSectionHeading,
  SECTION_KEYS,
} from '@/lib/cms/section-content'

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
  const [services, packages, hero, servicesHeading, packagesHeading] =
    await Promise.all([
      getServices(locale),
      getPackages(locale),
      getSectionContent(locale, SECTION_KEYS.servicesHero),
      getSectionHeading(locale, SECTION_KEYS.homeServices),
      getSectionHeading(locale, SECTION_KEYS.homePackages),
    ])

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow ?? ''}
        title={hero.title ?? ''}
        description={hero.body ?? ''}
      />
      <ServicesSection detailed flush items={services} heading={servicesHeading} />
      <Process locale={locale} />
      <Packages items={packages} heading={packagesHeading} />
      <AiTraining locale={locale} />
      <CtaSection locale={locale} />
    </>
  )
}
