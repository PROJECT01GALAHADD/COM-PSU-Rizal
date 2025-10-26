'use client'

import { AdminHeader } from '@/components/admin-header'
import { AppverseFooter } from '@/components/appverse-footer'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[100dvh] text-white relative">
      {/* Use the same landing background, rotated */}
      <div className="fixed inset-0 -z-10 w-full h-full bg-com-landing rotate-180" />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 -z-10 bg-black/40" />

      <AdminHeader />
      {children}
      <AppverseFooter />
    </div>
  )
}
