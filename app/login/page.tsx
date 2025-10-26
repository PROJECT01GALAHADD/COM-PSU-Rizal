'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react'
import { RegistrationModal } from '@/components/auth/registration-modal'
import { useProfileContext } from '@/components/profile-context'
import { useDemoMode } from '@/components/demo-mode-context'
import { demoLogin } from '@/utils/mock-data'

export default function LoginPage() {
  const router = useRouter()
  const { refresh } = useProfileContext()
  const { isDemo, refreshDemoState } = useDemoMode()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidEmail = (value: string) =>
    // Allow local/dev emails like admin@local in addition to standard formats
    /^[^\s@]+@[^\s@]+$/.test(value)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation to preserve UX and reduce failed requests
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      // Try demo login first
      const demoUser = await demoLogin(email, password)
      if (demoUser) {
        refreshDemoState()
        switch (demoUser.role) {
          case 'student':
            router.push('/student')
            break
          case 'faculty':
            router.push('/faculty')
            break
          case 'admin':
            router.push('/admin')
            break
          default:
            router.push('/')
        }
        return
      }

      // If demo mode is active, prevent calling real API to avoid console warnings
      if (isDemo) {
        setError('Demo mode is active — please use the demo credentials listed below.')
        setIsLoading(false)
        return
      }

      // Fall back to real auth if not in demo mode
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const body = await res.json()
      if (!res.ok) {
        setError(body?.error || 'Invalid email or password')
        setIsLoading(false)
        return
      }

      // Store user data in sessionStorage for dashboard pages
      const userType = body?.user?.userType || body?.user?.role || 'student'
      const userData = {
        id: body.user.id,
        email: body.user.email,
        name: body.user.firstName ? `${body.user.firstName} ${body.user.lastName || ''}`.trim() : body.user.email,
        role: userType,
        firstName: body.user.firstName,
        lastName: body.user.lastName
      }
      sessionStorage.setItem('user', JSON.stringify(userData))

      // Refresh profile context and redirect based on returned user type
      try {
        await refresh()
      } catch (e) {
        // ignore profile refresh error; proceed with redirect
      }
      
      if (userType === 'student') router.push('/student')
      else if (userType === 'faculty') router.push('/faculty')
      else if (userType === 'admin') router.push('/admin')
      else router.push('/')
    } catch (err) {
      // network or unexpected error
      // eslint-disable-next-line no-console
      console.error('Login request failed', err)
      setError('Login failed — try again')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 w-full h-full"
        style={{
          backgroundImage: 'url(/images/com-background-3.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'rotate(180deg)',
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/40" />

      <SiteHeader />

      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image
                src="/icons/PSU-logo.svg"
                alt="PSU logo"
                width={40}
                height={40}
              />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-neutral-300">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m.juandelacruz@psu.edu.ph"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 bg-neutral-900/80 border-neutral-700 text-white placeholder:text-neutral-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-200">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 bg-neutral-900/80 border-neutral-700 text-white placeholder:text-neutral-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Demo credentials helper */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-white/70 font-semibold mb-2">
                  Demo Credentials:
                </p>
                <div className="text-xs text-white/60 space-y-1">
                  <p>
                    <strong>Student:</strong> student@demo.psu.edu.ph / demo123
                  </p>
                  <p>
                    <strong>Faculty:</strong> faculty@demo.psu.edu.ph / demo123
                  </p>
                  <p>
                    <strong>Admin:</strong> admin@demo.psu.edu.ph / demo123
                  </p>
                </div>
              </div>

              <div className="text-center text-sm text-white/70">
                Don't have an account?{' '}
                <RegistrationModal
                  trigger={
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-500 font-semibold"
                    >
                      Sign up
                    </button>
                  }
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <AppverseFooter />
    </div>
  )
}
