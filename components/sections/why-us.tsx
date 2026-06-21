import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { advantages } from '@/lib/content'

export function WhyUs() {
  return (
    <section className="border-t border-gold/10 bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow="Why us"
          title="A studio built for outcomes, not just deliverables."
          description="We combine speed, real business sense and a modern toolkit — backed by the standards of LMVK Group."
        />

        <div className="mt-12 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="group flex flex-col gap-3 rounded-2xl border border-gold/15 bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-card hover:shadow-[0_24px_60px_-45px_rgba(212,175,55,0.6)]"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold text-sand">
                  {item.title}
                </h3>
                <ArrowUpRight className="size-4 text-gold opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
