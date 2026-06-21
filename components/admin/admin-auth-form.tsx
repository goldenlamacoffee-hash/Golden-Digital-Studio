'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BrandLogo } from '@/components/brand-logo'

export function AdminAuthForm({ bootstrap }: { bootstrap: boolean }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (bootstrap) {
        const { error } = await authClient.signUp.email({ email, password, name })
        if (error) throw new Error(error.message || 'Could not create account')
      } else {
        const { error } = await authClient.signIn.email({ email, password })
        if (error) throw new Error(error.message || 'Invalid email or password')
      }
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <BrandLogo variant="emblem" className="h-12 w-12" />
        <div>
          <h1 className="font-heading text-2xl font-semibold text-sand">
            {bootstrap ? 'Create admin account' : 'Studio CMS'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {bootstrap
              ? 'Set up the first administrator to manage your site.'
              : 'Sign in to manage your content.'}
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-gold/15 bg-card/60 p-6"
      >
        {bootstrap ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete={bootstrap ? 'new-password' : 'current-password'}
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={loading} className="mt-2">
          {loading
            ? 'Please wait…'
            : bootstrap
              ? 'Create account'
              : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
