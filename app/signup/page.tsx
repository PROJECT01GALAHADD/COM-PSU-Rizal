'use client'

import type React from 'react'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import { RegistrationModal } from '@/components/auth/registration-modal'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black">
      <SiteHeader />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400">Sign up for a new account</p>
          </div>
          <div className="flex items-center justify-center">
            <RegistrationModal
              defaultOpen={true}
              trigger={
                <Button className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:from-orange-400 hover:to-orange-300 transition-all duration-300">
                  Open Registration
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <AppverseFooter />
    </div>
  )
}
