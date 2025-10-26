'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface GuestFormProps {
  onJoinAsGuest: (name: string, email?: string) => void
  isLoading?: boolean
}

export function GuestForm({
  onJoinAsGuest,
  isLoading = false,
}: GuestFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [hasAccount, setHasAccount] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter your name to continue.',
        variant: 'destructive',
      })
      return
    }

    if (hasAccount && !email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      })
      return
    }

    onJoinAsGuest(name, hasAccount ? email : undefined)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Join as Guest
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details to join the meeting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={e => setName((e.target as any).value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="has-account"
              checked={hasAccount}
              onChange={e => setHasAccount((e.target as any).checked)}
              className="h-4 w-4 rounded border-gray-300 border text-primary focus:ring-primary"
              aria-label="Check if you have a PSU account"
            />
            <Label htmlFor="has-account" className="text-sm">
              I have a PSU account
            </Label>
          </div>

          {hasAccount && (
            <div className="space-y-2">
              <Label htmlFor="email">PSU Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@psu.palawan.edu.ph"
                value={email}
                onChange={e => setEmail((e.target as any).value)}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            variant="default"
          >
            {isLoading ? 'Joining...' : 'Join Meeting'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          By joining, you agree to our{' '}
          <a href="/acceptable-use" className="text-primary hover:underline">
            Acceptable Use Policy
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
