import { Hero } from '@/components/sections/hero'
import { Positioning } from '@/components/sections/positioning'
import { ServicesSection } from '@/components/sections/services'
import { WhyUs } from '@/components/sections/why-us'
import { PortfolioSection } from '@/components/sections/portfolio'
import { Process } from '@/components/sections/process'
import { Packages } from '@/components/sections/packages'
import { AiTraining } from '@/components/sections/ai-training'
import { CtaSection } from '@/components/sections/cta-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Positioning />
      <ServicesSection />
      <WhyUs />
      <PortfolioSection />
      <Process />
      <Packages />
      <AiTraining />
      <CtaSection />
    </>
  )
}
