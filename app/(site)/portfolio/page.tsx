import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { PortfolioSection } from '@/components/sections/portfolio'
import { WhyUs } from '@/components/sections/why-us'
import { CtaSection } from '@/components/sections/cta-section'
import { getLocale } from '@/lib/i18n/server'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getProjects } from '@/lib/cms/queries'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Selected work from Golden Digital Studio — websites, B2B portals, mobile apps and loyalty systems built for real businesses.',
  openGraph: {
    title: 'Portfolio · Golden Digital Studio',
    description:
      'Selected work — websites, B2B portals, mobile apps and loyalty systems.',
  },
}

export default async function PortfolioPage() {
  const locale = await getLocale()
  const t = getDictionary(locale)
  const projects = await getProjects(locale)

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Work that turns into momentum."
        description="A selection of systems and brands we've shaped. Each one is built to perform today and ready to grow into its next phase."
      />
      <PortfolioSection flush items={projects} heading={t.sections.portfolio} />
      <WhyUs />
      <CtaSection />
    </>
  )
}
