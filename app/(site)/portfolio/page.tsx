import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { PortfolioSection } from '@/components/sections/portfolio'
import { WhyUs } from '@/components/sections/why-us'
import { CtaSection } from '@/components/sections/cta-section'
import { getLocale } from '@/lib/i18n/server'
import { getProjects } from '@/lib/cms/queries'
import {
  getSectionContent,
  getSectionHeading,
  SECTION_KEYS,
} from '@/lib/cms/section-content'

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
  const [projects, hero, portfolioHeading] = await Promise.all([
    getProjects(locale),
    getSectionContent(locale, SECTION_KEYS.portfolioHero),
    getSectionHeading(locale, SECTION_KEYS.homePortfolio),
  ])

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow ?? ''}
        title={hero.title ?? ''}
        description={hero.body ?? ''}
      />
      <PortfolioSection flush items={projects} heading={portfolioHeading} locale={locale} />
      <WhyUs locale={locale} />
      <CtaSection locale={locale} />
    </>
  )
}
