import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/use-auth'

interface FormErrors {
  email?: string
  password?: string
}

function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address'
    }
    if (!password) {
      errs.password = 'Password is required'
    }
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    setAuthError(null)
    try {
      await signIn(email, password)
      void navigate({ to: '/' })
    } catch {
      setAuthError('Invalid email or password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* Branding */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/assets/atlas-logo-light.png"
            alt="Atlas"
            className="h-10 w-auto dark:hidden"
          />
          <img
            src="/assets/atlas-logo-dark.png"
            alt="Atlas"
            className="h-10 w-auto hidden dark:block"
          />
          <p className="text-sm text-muted-foreground">Your shared financial picture</p>
        </div>

        {/* Form card */}
        <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-6 flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setErrors(prev => ({ ...prev, email: undefined }))
                }}
                aria-invalid={!!errors.email}
                disabled={submitting}
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setErrors(prev => ({ ...prev, password: undefined }))
                }}
                aria-invalid={!!errors.password}
                disabled={submitting}
              />
              {errors.password && (
                <p className="text-xs font-medium text-destructive">{errors.password}</p>
              )}
            </div>

            {authError && (
              <p className="text-sm font-medium text-destructive">{authError}</p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full mt-1"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>

          </form>
        </div>

        {/* Dev credentials hint */}
        {import.meta.env.DEV && (
          <p className="text-center text-xs text-muted-foreground/50 font-mono">
            jose@atlas.app · rose@atlas.app
          </p>
        )}

      </div>
    </div>
  )
}

export const Route = createFileRoute('/login')({
  component: LoginPage,
})
