'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function AdminSeed() {
  const router = useRouter()

  const seed = () => {
    const admin = {
      id: 'admin-1',
      name: 'Administrator',
      role: 'admin',
      email: 'admin@psu.edu',
    }
    sessionStorage.setItem('user', JSON.stringify(admin))
    router.push('/admin/manage')
  }

  useEffect(() => {
    // nothing
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-bold">Dev Admin Seed</h2>
        <p>
          Creates a temporary admin session in sessionStorage and opens the
          admin manage UI.
        </p>
        <Button onClick={seed}>Create Admin Session</Button>
      </div>
    </div>
  )
}
