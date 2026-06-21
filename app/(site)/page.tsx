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
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getServices, getProjects, getPackages } from '@/lib/cms/queries'

export default async function HomePage() {
  const locale = await getLocale()
  const t = getDictionary(locale)
  const [services, projects, packages] = await Promise.all([
    getServices(locale),
    getProjects(locale),
    getPackages(locale),
  ])

  return (
    <>
      <Hero locale={locale} />
      <Positioning />
      <ServicesSection items={services} heading={t.sections.services} />
      <WhyUs />
      <PortfolioSection items={projects} heading={t.sections.portfolio} />
      <Process />
      <Packages items={packages} heading={t.sections.packages} />
      <AiTraining />
      <CtaSection />
    </>
  )
}
