import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Raleway, Geist_Mono } from 'next/font/google'
import { getLocale, getRequestOrigin } from '@/lib/i18n/server'
import { localeMeta, localeOrigin, xDefaultOrigin } from '@/lib/i18n/config'
import './globals.css'

const ogLocaleMap: Record<string, string> = {
  en: 'en_US',
  'cs-CZ': 'cs_CZ',
  'sk-SK': 'sk_SK',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  // Canonical reflects the CURRENT owned host (each domain stays live and
  // self-canonical); hreflang points at the representative domains.
  const canonical = await getRequestOrigin()

  return {
    metadataBase: new URL(canonical),
    title: {
      default: 'Golden Digital Studio — Digital systems. AI workflows. Impact.',
      template: '%s · Golden Digital Studio',
    },
    description:
      'Golden Digital Studio builds practical digital systems — websites with CMS, B2B portals, mobile apps, automations and AI workflows — for ambitious small businesses. A digital studio by LMVK Group.',
    generator: 'v0.app',
    keywords: [
      'digital studio',
      'web development',
      'CMS',
      'B2B portals',
      'mobile apps',
      'AI workflows',
      'business automation',
      'LMVK Group',
    ],
    authors: [{ name: 'Golden Digital Studio' }],
    creator: 'Golden Digital Studio',
    alternates: {
      canonical,
      languages: {
        en: localeOrigin('en'),
        'cs-CZ': localeOrigin('cs-CZ'),
        'sk-SK': localeOrigin('sk-SK'),
        'x-default': xDefaultOrigin,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[locale],
      url: canonical,
      siteName: 'Golden Digital Studio',
      title: 'Golden Digital Studio — Digital systems. AI workflows. Impact.',
      description:
        'Websites, apps and AI systems for ambitious small businesses. A digital studio by LMVK Group.',
      images: [
        {
          url: '/brand/gds-fox-og-image.png',
          width: 1200,
          height: 630,
          alt: 'Golden Digital Studio — Digital systems. AI workflows. Impact.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Golden Digital Studio — Digital systems. AI workflows. Impact.',
      description:
        'Websites, apps and AI systems for ambitious small businesses. A digital studio by LMVK Group.',
      images: ['/brand/gds-fox-og-image.png'],
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#16130f',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html
      lang={localeMeta[locale].htmlLang}
      className={`${inter.variable} ${raleway.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
