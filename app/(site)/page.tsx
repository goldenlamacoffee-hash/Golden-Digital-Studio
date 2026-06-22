import { Hero } from '@/components/sections/hero'
import { Positioning } from '@/components/sections/positioning'
import { ServicesSection } from '@/components/sections/services'
import { WhyUs } from '@/components/sections/why-us'
import { PortfolioSection } from '@/components/sections/portfolio'
import { Process } from '@/components/sections/process'
import { Packages } from '@/components/sections/packages'
import { AiTraining } from '@/components/sections/ai-training'
import { CtaSection } from '@/components/sections/cta-section'
import { getLocale } from '@/lib/i18n/server'
import { getServices, getProjects, getPackages } from '@/lib/cms/queries'
import { getSectionHeading, SECTION_KEYS } from '@/lib/cms/section-content'

export default async function HomePage() {
  const locale = await getLocale()
  const [services, projects, packages, servicesHeading, portfolioHeading, packagesHeading] =
    await Promise.all([
      getServices(locale),
      getProjects(locale),
      getPackages(locale),
      getSectionHeading(locale, SECTION_KEYS.homeServices),
      getSectionHeading(locale, SECTION_KEYS.homePortfolio),
      getSectionHeading(locale, SECTION_KEYS.homePackages),
    ])

  return (
    <>
      <Hero locale={locale} />
      <Positioning locale={locale} />
      <ServicesSection items={services} heading={servicesHeading} />
      <WhyUs locale={locale} />
      <PortfolioSection items={projects} heading={portfolioHeading} locale={locale} />
      <Process locale={locale} />
      <Packages items={packages} heading={packagesHeading} />
      <AiTraining locale={locale} />
      <CtaSection locale={locale} />
    </>
  )
}
