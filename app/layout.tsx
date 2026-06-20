import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Raleway, Geist_Mono } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

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

const siteUrl = 'https://goldendigitalstudio.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  openGraph: {
    type: 'website',
    locale: 'en',
    url: siteUrl,
    siteName: 'Golden Digital Studio',
    title: 'Golden Digital Studio — Digital systems. AI workflows. Impact.',
    description:
      'Websites, apps and AI systems for ambitious small businesses. A digital studio by LMVK Group.',
    images: [
      {
        url: '/brand/fox-lockup.png',
        width: 751,
        height: 371,
        alt: 'Golden Digital Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golden Digital Studio — Digital systems. AI workflows. Impact.',
    description:
      'Websites, apps and AI systems for ambitious small businesses. A digital studio by LMVK Group.',
    images: ['/brand/fox-lockup.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#16130f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${raleway.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
