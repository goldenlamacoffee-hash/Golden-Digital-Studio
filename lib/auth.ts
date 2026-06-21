import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'
import { ownedOrigins } from '@/lib/i18n/config'

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'admin',
        input: false,
      },
    },
  },
  // Auth must work on EVERY owned production domain (goldendigital/.cz/.sk,
  // goldenstudio.*, gdstudio.online, etc.), plus dev/preview. `ownedOrigins`
  // is derived from the i18n domain registry so auth + localization never drift.
  trustedOrigins: [
    ...ownedOrigins,
    // Vercel preview deployments (wildcard supported in Better Auth >= 1.x).
    'https://*.vercel.app',
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})
