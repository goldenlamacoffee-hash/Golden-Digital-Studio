import Link from 'next/link'
import { FoxLogo } from '@/components/fox-logo'
import { services, site } from '@/lib/content'

const footerCols: { title: string; links: { label: string; href: string }[] }[] =
  [
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
  ]

export function SiteFooter() {
  void services
  return (
    <footer className="border-t border-gold/15 bg-espresso">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-5">
            <FoxLogo size="md" subtitle={`by ${site.parent}`} className="w-fit" />
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Practical digital systems — websites, portals, apps and AI
              workflows — for ambitious small businesses across{' '}
              {site.regions.join(', ')}.
            </p>
          </div>

          {footerCols.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-sand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-gold/10 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.2em]">
            {site.shortTagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
